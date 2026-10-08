import {json} from "../../../_lib/api-security.mjs";
import {authorizeRightsAdmin,rightsActorKey} from "../../../_lib/rights-admin.mjs";
import {validateNonAuthorizingDecision} from "../../../_lib/rights-registry.mjs";

export async function onRequestPost(context){
  const access=await authorizeRightsAdmin(context,{readBody:true,maxBytes:16_000,requireRecentAuthentication:true});
  if(!access.ok) return json({error:access.reason},access.status);
  const validated=validateNonAuthorizingDecision(access.body);
  if(!validated.ok) return json({error:validated.reason},400);
  const v=validated.value;
  const db=context.env.MODARYX_DB;
  const rightsCase=await db.prepare("SELECT case_id,state FROM modaryx_v2_rights_cases WHERE case_id=? LIMIT 1").bind(v.caseId).first();
  if(!rightsCase) return json({error:"rights-case-not-found"},404);

  const decisionId="mx_rights_decision_"+crypto.randomUUID().replaceAll("-","");
  const auditId="mx_rights_audit_"+crypto.randomUUID().replaceAll("-","");
  const actorKey=await rightsActorKey(access.identity.sub);
  const now=new Date().toISOString();
  try{
    await db.batch([
      db.prepare(
        `INSERT INTO modaryx_v2_rights_scope_decisions (
          decision_id,case_id,right_scope,product_surface,status,territories_json,platforms_json,
          allowed_uses_json,forbidden_uses_json,conditions_json,credits_required,valid_from,valid_until,
          evidence_refs_json,evidence_archived,source_verified,conditions_satisfied,asset_linked,
          reviewer_actor_key,verified_at,supersedes_decision_id,created_at
        ) VALUES (?,?,?,?,?,?,?,'[]','[]',?,0,NULL,NULL,?,0,0,0,0,?,NULL,NULL,?)`
      ).bind(
        decisionId,v.caseId,v.rightScope,v.productSurface,v.status,JSON.stringify(v.territories),
        JSON.stringify(v.platforms),JSON.stringify(v.conditions),JSON.stringify(v.evidenceRefs),actorKey,now
      ),
      db.prepare(
        `INSERT INTO modaryx_v2_rights_audit (
          audit_id,case_id,event_type,actor_key,payload_json,created_at
        ) VALUES (?,?,'NON_AUTHORIZING_DECISION_RECORDED',?,?,?)`
      ).bind(auditId,v.caseId,actorKey,JSON.stringify({decisionId,rightScope:v.rightScope,productSurface:v.productSurface,status:v.status}),now)
    ]);
    return json({schemaVersion:1,decisionId,caseId:v.caseId,rightScope:v.rightScope,productSurface:v.productSurface,status:v.status,authorizes:false,recordedAt:now},201);
  }catch{
    return json({error:"rights-decision-write-failed"},409);
  }
}
