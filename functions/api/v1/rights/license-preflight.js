import {json} from "../../../_lib/api-security.mjs";
import {authorizeRightsAdmin,rightsActorKey} from "../../../_lib/rights-admin.mjs";
import {evaluateLicensePreflight} from "../../../_lib/rights-evidence.mjs";

export async function onRequestPost(context){
  const access=await authorizeRightsAdmin(context,{readBody:true,maxBytes:32_000,requireRecentAuthentication:true});
  if(!access.ok) return json({error:access.reason},access.status);
  const body=access.body||{};
  const db=context.env.MODARYX_DB;
  const evidence=await db.prepare(
    `SELECT r.response_evidence_id,r.case_id,r.archived,r.source_verified,c.verified_at
     FROM modaryx_v2_rights_response_evidence r
     JOIN modaryx_v2_rights_contact_evidence c ON c.contact_evidence_id=r.contact_evidence_id
     WHERE r.response_evidence_id=? AND r.case_id=? LIMIT 1`
  ).bind(String(body.responseEvidenceId||""),String(body.caseId||"")).first();
  const evaluated=evaluateLicensePreflight(body,{
    responseArchived:Boolean(evidence?.archived),
    responseSourceVerified:Boolean(evidence?.source_verified),
    contactVerified:Boolean(evidence?.verified_at)
  });
  if(!evaluated.ok) return json({error:evaluated.reason},400);
  const v=evaluated.value;
  const preflightId="mx_rights_preflight_"+crypto.randomUUID().replaceAll("-","");
  const actorKey=await rightsActorKey(access.identity.sub);
  const now=new Date().toISOString();
  try{
    await db.prepare(
      `INSERT INTO modaryx_v2_rights_license_preflight (
        preflight_id,case_id,response_evidence_id,right_scope,product_surface,requested_status,
        evidence_refs_json,conditions_json,territories_json,platforms_json,valid_from,valid_until,
        asset_linked,conditions_satisfied,legal_review_ref,result,reason,reviewer_actor_key,created_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(
      preflightId,v.caseId,v.responseEvidenceId,v.rightScope,v.productSurface,v.status,
      JSON.stringify(v.evidenceRefs),JSON.stringify(v.conditions),JSON.stringify(v.territories),
      JSON.stringify(v.platforms),v.validFrom,v.validUntil,v.assetLinked?1:0,v.conditionsSatisfied?1:0,
      v.legalReviewRef,evaluated.result,evaluated.reason,actorKey,now
    ).run();
    return json({schemaVersion:1,preflightId,caseId:v.caseId,result:evaluated.result,reason:evaluated.reason,blockers:evaluated.blockers,authorizes:false,createdAt:now},201);
  }catch{
    return json({error:"license-preflight-write-failed"},409);
  }
}
