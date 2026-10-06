import {json} from "../../../_lib/api-security.mjs";
import {authorizeRightsAdmin,rightsActorKey} from "../../../_lib/rights-admin.mjs";
import {evaluateEffectiveRights} from "../../../_lib/rights-registry.mjs";

export async function onRequestGet(context){
  const access=await authorizeRightsAdmin(context,{requireRecentAuthentication:false});
  if(!access.ok) return json({error:access.reason},access.status);
  const url=new URL(context.request.url);
  const caseId=String(url.searchParams.get("caseId")||"").trim();
  const rightScope=String(url.searchParams.get("scope")||"").trim();
  const productSurface=String(url.searchParams.get("surface")||"").trim();
  const territory=url.searchParams.get("territory");
  const platform=url.searchParams.get("platform");
  if(!/^mx_rights_case_[a-f0-9]{32}$/.test(caseId)) return json({error:"rights-case-id-invalid"},400);
  const db=context.env.MODARYX_DB;
  try{
    const row=await db.prepare("SELECT case_id,state FROM modaryx_v2_rights_cases WHERE case_id=? LIMIT 1").bind(caseId).first();
    if(!row) return json({error:"rights-case-not-found"},404);
    const result=await db.prepare(
      `SELECT decision_id,right_scope,product_surface,status,territories_json,platforms_json,
        valid_from,valid_until,evidence_refs_json,evidence_archived,source_verified,
        conditions_satisfied,asset_linked,reviewer_actor_key,verified_at,supersedes_decision_id,created_at
       FROM modaryx_v2_rights_scope_decisions
       WHERE case_id=? AND right_scope=? AND product_surface=?
       ORDER BY created_at DESC`
    ).bind(caseId,rightScope,productSurface).all();
    const decision=evaluateEffectiveRights({
      caseState:row.state,decisions:result?.results||[],rightScope,productSurface,
      territory:territory||null,platform:platform||null
    });
    const actorKey=await rightsActorKey(access.identity.sub);
    const auditId="mx_rights_audit_"+crypto.randomUUID().replaceAll("-","");
    try{
      await db.prepare(
        `INSERT INTO modaryx_v2_rights_audit (
          audit_id,case_id,event_type,actor_key,payload_json,created_at
        ) VALUES (?,?,'EFFECTIVE_SCOPE_CHECKED',?,?,?)`
      ).bind(auditId,caseId,actorKey,JSON.stringify({rightScope,productSurface,allowed:decision.allowed,reason:decision.reason||null}),new Date().toISOString()).run();
    }catch{}
    return json({schemaVersion:1,caseId,rightScope,productSurface,...decision});
  }catch{
    return json({error:"rights-registry-storage-unavailable"},503);
  }
}
