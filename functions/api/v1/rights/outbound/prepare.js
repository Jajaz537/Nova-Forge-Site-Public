import {json} from "../../../../_lib/api-security.mjs";
import {authorizeRightsAdmin,rightsActorKey} from "../../../../_lib/rights-admin.mjs";
import {evaluatePublisherOutboundReadiness,validatePublisherOutboundPreparation} from "../../../../_lib/publisher-outbound.mjs";

const parse=value=>{try{const x=JSON.parse(value||"[]");return Array.isArray(x)?x:[]}catch{return []}};

export async function onRequestPost(context){
  const access=await authorizeRightsAdmin(context,{readBody:true,maxBytes:20_000,requireRecentAuthentication:true});
  if(!access.ok) return json({error:access.reason},access.status);
  const validated=validatePublisherOutboundPreparation(access.body);
  if(!validated.ok) return json({error:validated.reason},400);
  const v=validated.value;
  const db=context.env.MODARYX_DB;

  try{
    const row=await db.prepare(
      `SELECT c.case_id,c.state,c.requested_scopes_json,c.product_surfaces_json,c.contact_state,
        e.contact_evidence_id,e.contact_channel,e.contact_ref_digest_sha256
       FROM modaryx_v2_rights_cases c
       JOIN modaryx_v2_rights_contact_evidence e ON e.case_id=c.case_id
       WHERE c.case_id=? AND e.contact_evidence_id=? LIMIT 1`
    ).bind(v.caseId,v.contactEvidenceId).first();
    if(!row) return json({error:"rights-contact-evidence-not-found"},404);
    const suppression=await db.prepare(
      `SELECT suppression_id FROM modaryx_v2_rights_contact_suppressions
       WHERE case_id=? AND contact_ref_digest_sha256=? AND active=1 LIMIT 1`
    ).bind(v.caseId,row.contact_ref_digest_sha256).first();

    const readiness=evaluatePublisherOutboundReadiness({
      caseState:row.state,contactState:row.contact_state,contactChannel:row.contact_channel,
      contactRefDigestSha256:row.contact_ref_digest_sha256,
      requestedScopes:v.requestedScopes,productSurfaces:v.productSurfaces,
      caseRequestedScopes:parse(row.requested_scopes_json),caseProductSurfaces:parse(row.product_surfaces_json),
      suppressionActive:Boolean(suppression),providerAvailable:false,
      templateCurrent:v.templateVersion==="publisher-rights-v1"
    });

    if(!readiness.readyForPreparation) return json({error:"publisher-outbound-not-ready",blockers:readiness.blockers},409);

    const outboundRequestId="mx_rights_outbound_"+crypto.randomUUID().replaceAll("-","");
    const actorKey=await rightsActorKey(access.identity.sub);
    const now=new Date().toISOString();
    await db.prepare(
      `INSERT INTO modaryx_v2_publisher_outbound_requests (
        outbound_request_id,case_id,contact_evidence_id,logical_request_id,request_version,
        template_version,requested_scopes_json,product_surfaces_json,contact_channel,
        contact_ref_digest_sha256,idempotency_key_sha256,state,provider_kind,
        provider_message_id_digest_sha256,prepared_by_actor_key,prepared_at,updated_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,'REQUEST_READY',NULL,NULL,?,?,?)`
    ).bind(
      outboundRequestId,v.caseId,v.contactEvidenceId,v.logicalRequestId,v.requestVersion,
      v.templateVersion,JSON.stringify(v.requestedScopes),JSON.stringify(v.productSurfaces),
      row.contact_channel,row.contact_ref_digest_sha256,v.idempotencyKeySha256,actorKey,now,now
    ).run();

    await db.prepare(
      `UPDATE modaryx_v2_rights_cases SET state='REQUEST_READY',updated_at=?
       WHERE case_id=? AND state='CONTACT_VERIFIED'`
    ).bind(now,v.caseId).run();

    return json({
      schemaVersion:1,outboundRequestId,logicalRequestId:v.logicalRequestId,state:"REQUEST_READY",
      queueAllowed:false,dispatchImplemented:false,blockers:["outbound-provider-not-implemented"],
      authorizes:false,preparedAt:now
    },201);
  }catch(error){
    const message=String(error?.message||"");
    if(message.includes("UNIQUE")) return json({error:"publisher-outbound-idempotency-conflict"},409);
    return json({error:"publisher-outbound-preparation-failed"},503);
  }
}
