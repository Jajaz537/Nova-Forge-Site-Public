import {json} from "../../../_lib/api-security.mjs";
import {authorizeRightsAdmin,rightsActorKey} from "../../../_lib/rights-admin.mjs";
import {evaluateAuthorizingDecisionCandidate} from "../../../_lib/rights-evidence.mjs";

const hex=buffer=>[...new Uint8Array(buffer)].map(v=>v.toString(16).padStart(2,"0")).join("");
const sha256Hex=async value=>hex(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value)));

export async function onRequestPost(context){
  const access=await authorizeRightsAdmin(context,{readBody:true,maxBytes:8_000,requireRecentAuthentication:true});
  if(!access.ok) return json({error:access.reason},access.status);
  const body=access.body||{};
  const preflightId=typeof body.preflightId==="string"?body.preflightId.trim():"";
  if(!/^mx_rights_preflight_[a-f0-9]{32}$/.test(preflightId)) return json({error:"preflight-id-invalid"},400);
  if(body.decisionConfirmation!=="AUTHORIZE_EXACT_PREFLIGHT_SCOPE") return json({error:"explicit-authorizing-confirmation-required"},409);
  const allowedKeys=new Set(["preflightId","decisionConfirmation"]);
  if(Object.keys(body).some(key=>!allowedKeys.has(key))) return json({error:"authorizing-input-field-forbidden"},400);

  const db=context.env.MODARYX_DB;
  const preflight=await db.prepare(
    `SELECT preflight_id,case_id,response_evidence_id,right_scope,product_surface,requested_status,
      evidence_refs_json,conditions_json,territories_json,platforms_json,valid_from,valid_until,
      asset_linked,conditions_satisfied,legal_review_ref,result,reviewer_actor_key,created_at
     FROM modaryx_v2_rights_license_preflight WHERE preflight_id=? LIMIT 1`
  ).bind(preflightId).first();
  if(!preflight) return json({error:"license-preflight-not-found"},404);
  const response=await db.prepare(
    `SELECT response_evidence_id,case_id,review_state,extraction_json,source_verified,archived
     FROM modaryx_v2_rights_response_evidence WHERE response_evidence_id=? LIMIT 1`
  ).bind(preflight.response_evidence_id).first();
  const evaluated=evaluateAuthorizingDecisionCandidate({preflight,response});
  if(!evaluated.ok||!evaluated.eligible) return json({error:"authorizing-decision-blocked",blockers:evaluated.blockers||[evaluated.reason]},409);

  const prior=await db.prepare(
    "SELECT authorizing_review_id,decision_id FROM modaryx_v2_rights_authorizing_reviews WHERE preflight_id=? LIMIT 1"
  ).bind(preflightId).first();
  if(prior) return json({error:"preflight-already-authorized",decisionId:prior.decision_id},409);

  const v=evaluated.decision;
  const decisionId="mx_rights_decision_"+crypto.randomUUID().replaceAll("-","");
  const reviewId="mx_rights_authorizing_review_"+crypto.randomUUID().replaceAll("-","");
  const actorKey=await rightsActorKey(access.identity.sub);
  const now=new Date().toISOString();
  const legalDigest=await sha256Hex(v.legalReviewRef);
  const sourceSnapshot=await sha256Hex(JSON.stringify({
    preflightId:v.preflightId,responseEvidenceId:v.responseEvidenceId,rightScope:v.rightScope,
    productSurface:v.productSurface,status:v.status,evidenceRefs:v.evidenceRefs,
    territories:v.territories,platforms:v.platforms,conditions:v.conditions,
    validFrom:v.validFrom,validUntil:v.validUntil,legalReviewRefDigestSha256:legalDigest
  }));

  try{
    await db.batch([
      db.prepare(
        `INSERT INTO modaryx_v2_rights_scope_decisions (
          decision_id,case_id,right_scope,product_surface,status,territories_json,platforms_json,
          allowed_uses_json,forbidden_uses_json,conditions_json,credits_required,valid_from,valid_until,
          evidence_refs_json,evidence_archived,source_verified,conditions_satisfied,asset_linked,
          reviewer_actor_key,verified_at,supersedes_decision_id,created_at
        ) VALUES (?,?,?,?,?,?,?,'[]','[]',?,0,?,?,?,1,1,1,1,?,?,NULL,?)`
      ).bind(
        decisionId,v.caseId,v.rightScope,v.productSurface,v.status,JSON.stringify(v.territories),
        JSON.stringify(v.platforms),JSON.stringify(v.conditions),v.validFrom,v.validUntil,
        JSON.stringify(v.evidenceRefs),actorKey,now,now
      ),
      db.prepare(
        `INSERT INTO modaryx_v2_rights_authorizing_reviews (
          authorizing_review_id,decision_id,case_id,preflight_id,response_evidence_id,right_scope,
          product_surface,status,legal_review_ref_digest_sha256,source_snapshot_sha256,
          reviewer_actor_key,confirmed_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
      ).bind(
        reviewId,decisionId,v.caseId,v.preflightId,v.responseEvidenceId,v.rightScope,
        v.productSurface,v.status,legalDigest,sourceSnapshot,actorKey,now
      )
    ]);
    return json({
      schemaVersion:1,decisionId,authorizingReviewId:reviewId,caseId:v.caseId,
      rightScope:v.rightScope,productSurface:v.productSurface,status:v.status,
      authorizes:true,source:"ELIGIBLE_PREFLIGHT_PLUS_EXPLICIT_ADMIN_CONFIRMATION",
      legalReviewRefStored:false,verifiedAt:now
    },201);
  }catch{
    return json({error:"authorizing-decision-write-failed"},409);
  }
}
