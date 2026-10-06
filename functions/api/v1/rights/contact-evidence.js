import {json} from "../../../_lib/api-security.mjs";
import {authorizeRightsAdmin,rightsActorKey} from "../../../_lib/rights-admin.mjs";
import {validateOfficialContactEvidence} from "../../../_lib/rights-evidence.mjs";

export async function onRequestPost(context){
  const access=await authorizeRightsAdmin(context,{readBody:true,maxBytes:20_000,requireRecentAuthentication:true});
  if(!access.ok) return json({error:access.reason},access.status);
  const validated=validateOfficialContactEvidence(access.body);
  if(!validated.ok) return json({error:validated.reason},400);
  const v=validated.value;
  const db=context.env.MODARYX_DB;
  const row=await db.prepare("SELECT case_id,state FROM modaryx_v2_rights_cases WHERE case_id=? LIMIT 1").bind(v.caseId).first();
  if(!row) return json({error:"rights-case-not-found"},404);
  const contactEvidenceId="mx_rights_contact_"+crypto.randomUUID().replaceAll("-","");
  const actorKey=await rightsActorKey(access.identity.sub);
  const now=new Date().toISOString();
  try{
    await db.batch([
      db.prepare(
        `INSERT INTO modaryx_v2_rights_contact_evidence (
          contact_evidence_id,case_id,source_kind,source_url,contact_channel,contact_ref_digest_sha256,
          authority_basis,source_observed_at,verified_by_actor_key,verified_at,created_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
      ).bind(contactEvidenceId,v.caseId,v.sourceKind,v.sourceUrl,v.contactChannel,v.contactRefDigestSha256,v.authorityBasis,v.observedAt,actorKey,now,now),
      db.prepare(
        `UPDATE modaryx_v2_rights_cases
         SET contact_state='CONTACT_VERIFIED',
             state=CASE WHEN state IN ('RIGHTS_CASE_CREATED','CONTACT_CANDIDATE') THEN 'CONTACT_VERIFIED' ELSE state END,
             updated_at=?
         WHERE case_id=?`
      ).bind(now,v.caseId)
    ]);
    return json({schemaVersion:1,contactEvidenceId,caseId:v.caseId,sourceKind:v.sourceKind,sourceUrl:v.sourceUrl,contactChannel:v.contactChannel,contactRefDigestSha256:v.contactRefDigestSha256,verifiedAt:now,contactState:"CONTACT_VERIFIED",authorizes:false},201);
  }catch{
    return json({error:"contact-evidence-write-failed"},409);
  }
}
