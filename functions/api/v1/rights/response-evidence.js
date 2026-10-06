import {json} from "../../../_lib/api-security.mjs";
import {authorizeRightsAdmin,rightsActorKey} from "../../../_lib/rights-admin.mjs";
import {interpretPublisherResponseEvidence} from "../../../_lib/rights-evidence.mjs";

export async function onRequestPost(context){
  const access=await authorizeRightsAdmin(context,{readBody:true,maxBytes:64_000,requireRecentAuthentication:true});
  if(!access.ok) return json({error:access.reason},access.status);
  const interpreted=interpretPublisherResponseEvidence(access.body);
  if(!interpreted.ok) return json({error:interpreted.reason},400);
  const v=interpreted.value;
  const db=context.env.MODARYX_DB;
  const contact=await db.prepare(
    `SELECT contact_evidence_id,case_id FROM modaryx_v2_rights_contact_evidence
     WHERE contact_evidence_id=? AND case_id=? LIMIT 1`
  ).bind(v.contactEvidenceId,v.caseId).first();
  if(!contact) return json({error:"verified-contact-evidence-not-found"},409);
  const responseEvidenceId="mx_rights_response_"+crypto.randomUUID().replaceAll("-","");
  const actorKey=await rightsActorKey(access.identity.sub);
  const now=new Date().toISOString();
  try{
    await db.prepare(
      `INSERT INTO modaryx_v2_rights_response_evidence (
        response_evidence_id,case_id,contact_evidence_id,logical_request_id,raw_message_sha256,
        raw_headers_sha256,received_at,review_state,extraction_json,source_verified,archived,
        created_by_actor_key,created_at
      ) VALUES (?,?,?,?,?,?,?,?,?,1,1,?,?)`
    ).bind(
      responseEvidenceId,v.caseId,v.contactEvidenceId,v.logicalRequestId,v.rawMessageSha256,
      v.rawHeadersSha256,v.receivedAt,v.reviewState,JSON.stringify(v.scopes),actorKey,now
    ).run();
    return json({schemaVersion:1,responseEvidenceId,caseId:v.caseId,reviewState:v.reviewState,scopes:v.scopes,archived:true,sourceVerified:true,authorizes:false,createdAt:now},201);
  }catch{
    return json({error:"response-evidence-write-failed"},409);
  }
}
