import {json} from "../../../../_lib/api-security.mjs";
import {authorizeRightsAdmin,rightsActorKey} from "../../../../_lib/rights-admin.mjs";
import {classifyRightsLifecycle,expiryLockDecision,lifecycleIdempotencyKey} from "../../../../_lib/rights-lifecycle.mjs";

export async function onRequestPost(context){
  const access=await authorizeRightsAdmin(context,{readBody:true,maxBytes:8_000,requireRecentAuthentication:true});
  if(!access.ok) return json({error:access.reason},access.status);
  const body=access.body||{};
  const caseId=typeof body.caseId==="string"?body.caseId.trim():"";
  if(!/^mx_rights_case_[a-f0-9]{32}$/.test(caseId)) return json({error:"rights-case-id-invalid"},400);
  if(Object.keys(body).some(key=>key!=="caseId")) return json({error:"rights-lifecycle-field-forbidden"},400);

  const db=context.env.MODARYX_DB;
  const rows=await db.prepare(
    `SELECT decision_id,case_id,right_scope,product_surface,status,territories_json,platforms_json,
      conditions_json,evidence_refs_json,valid_from,valid_until,created_at
     FROM modaryx_v2_rights_scope_decisions
     WHERE case_id=? ORDER BY created_at DESC`
  ).bind(caseId).all();

  const decisions=rows?.results||[];
  const superseded=new Set(decisions.map(x=>x.supersedes_decision_id).filter(Boolean));
  const current=decisions.filter(x=>!superseded.has(x.decision_id));
  const now=new Date().toISOString();
  const actorKey=await rightsActorKey(access.identity.sub);
  const results=[];

  for(const source of current){
    const state=classifyRightsLifecycle(source,{now});
    if(state.state!=="EXPIRED"){
      results.push({decisionId:source.decision_id,state:state.state,changed:false,reason:state.reason});
      continue;
    }
    const eventKey=await lifecycleIdempotencyKey({
      caseId,decisionId:source.decision_id,eventType:"EXPIRED_LOCKED",effectiveAt:state.effectiveAt||now
    });
    const existing=await db.prepare(
      "SELECT lifecycle_event_id,decision_id FROM modaryx_v2_rights_lifecycle_events WHERE idempotency_key_sha256=? LIMIT 1"
    ).bind(eventKey).first();
    if(existing){
      results.push({decisionId:source.decision_id,state:"EXPIRED",changed:false,reason:"already-locked"});
      continue;
    }

    const derivedId="mx_rights_decision_"+crypto.randomUUID().replaceAll("-","");
    const shaped=expiryLockDecision(source,{decisionId:derivedId,createdAt:now});
    if(!shaped.ok){
      results.push({decisionId:source.decision_id,state:"REVALIDATION_REQUIRED",changed:false,reason:shaped.reason});
      continue;
    }
    const v=shaped.value;
    const lifecycleEventId="mx_rights_lifecycle_"+crypto.randomUUID().replaceAll("-","");

    try{
      await db.batch([
        db.prepare(
          `INSERT INTO modaryx_v2_rights_scope_decisions (
            decision_id,case_id,right_scope,product_surface,status,territories_json,platforms_json,
            allowed_uses_json,forbidden_uses_json,conditions_json,credits_required,valid_from,valid_until,
            evidence_refs_json,evidence_archived,source_verified,conditions_satisfied,asset_linked,
            reviewer_actor_key,verified_at,supersedes_decision_id,created_at
          ) VALUES (?,?,?,?,?,?,?,'[]','[]',?,0,?,?,?,1,1,1,1,?,NULL,?,?)`
        ).bind(
          v.decisionId,v.caseId,v.rightScope,v.productSurface,v.status,JSON.stringify(v.territories),
          JSON.stringify(v.platforms),JSON.stringify(v.conditions),v.validFrom,v.validUntil,
          JSON.stringify(v.evidenceRefs),actorKey,v.supersedesDecisionId,v.createdAt
        ),
        db.prepare(
          `INSERT INTO modaryx_v2_rights_lifecycle_events (
            lifecycle_event_id,case_id,decision_id,event_type,derived_from_decision_id,
            idempotency_key_sha256,effective_at,payload_json,actor_key,created_at
          ) VALUES (?,?,?,?,?,?,?,?,?,?)`
        ).bind(
          lifecycleEventId,caseId,v.decisionId,"EXPIRED_LOCKED",v.supersedesDecisionId,eventKey,
          state.effectiveAt||now,JSON.stringify({rightScope:v.rightScope,productSurface:v.productSurface}),
          actorKey,now
        )
      ]);
      results.push({decisionId:source.decision_id,lockDecisionId:v.decisionId,state:"EXPIRED",changed:true});
    }catch{
      results.push({decisionId:source.decision_id,state:"REVALIDATION_REQUIRED",changed:false,reason:"expiry-lock-write-failed"});
    }
  }

  return json({
    schemaVersion:1,caseId,evaluatedAt:now,results,
    scheduler:false,automaticRevocationInbound:false,silentReactivation:false
  });
}
