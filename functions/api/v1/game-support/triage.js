import {json} from "../../../_lib/api-security.mjs";
import {authorizeRightsAdmin,rightsActorKey} from "../../../_lib/rights-admin.mjs";
import {publicGameSupportRequest,validateGameSupportTriage} from "../../../_lib/game-support.mjs";
import {recordInAppNotification} from "../../../_lib/notifications.mjs";

const select=`SELECT request_id,requester_identity_sub,game_name,platforms_json,developer_name,publisher_name,
  reason,source_urls_json,state,decision_reason,game_id,rights_case_id,safe_baseline_allowed,
  created_at,updated_at,decided_at
  FROM modaryx_v2_game_support_requests`;

function notificationFor(row,decision,now){
  const accepted=decision==="ACCEPTED_SAFE_BASELINE";
  return {
    recipientIdentitySub:row.requester_identity_sub,
    eventType:"SUPPORT_UPDATE",
    priority:accepted?"IMPORTANT":"NORMAL",
    title:accepted?"Support du jeu accepté en baseline sûre":"Mise à jour de votre demande de support",
    summary:accepted
      ? row.game_name+" peut avancer avec une identité MODARYX originale. Aucun asset officiel ni partenariat n’est implied."
      : row.game_name+" : "+decision,
    href:"/account",
    stateLabel:decision,
    affectedScopes:["game-support"],
    sourceKind:"rights",
    sourceId:row.request_id,
    occurredAt:now
  };
}

export async function onRequestPost(context){
  const access=await authorizeRightsAdmin(context,{readBody:true,maxBytes:20_000,requireRecentAuthentication:true});
  if(!access.ok) return json({error:access.reason},access.status);
  const validated=validateGameSupportTriage(access.body);
  if(!validated.ok) return json({error:validated.reason},400);
  const v=validated.value;
  const db=context.env.MODARYX_DB;

  const row=await db.prepare(select+" WHERE request_id=? LIMIT 1").bind(v.requestId).first();
  if(!row) return json({error:"game-support-request-not-found"},404);
  if(!["REQUESTED","TRIAGE"].includes(row.state)) return json({error:"game-support-request-already-decided",state:row.state},409);

  const actorKey=await rightsActorKey(access.identity.sub);
  const now=new Date().toISOString();
  const statements=[];
  let rightsCaseId=null;

  if(v.decision==="ACCEPTED_SAFE_BASELINE"){
    const existingSupport=await db.prepare(
      "SELECT support_id,request_id FROM modaryx_v2_game_support_records WHERE game_id=? LIMIT 1"
    ).bind(v.gameId).first();
    if(existingSupport) return json({error:"game-support-duplicate-game",requestId:existingSupport.request_id},409);

    const existingCase=await db.prepare(
      "SELECT case_id FROM modaryx_v2_rights_cases WHERE game_id=? AND publisher_name=? LIMIT 1"
    ).bind(v.gameId,v.publisherName).first();
    rightsCaseId=existingCase?.case_id||("mx_rights_case_"+crypto.randomUUID().replaceAll("-",""));

    if(!existingCase){
      const auditId="mx_rights_audit_"+crypto.randomUUID().replaceAll("-","");
      statements.push(
        db.prepare(
          `INSERT INTO modaryx_v2_rights_cases (
            case_id,game_id,game_name,publisher_name,state,requested_scopes_json,product_surfaces_json,
            contact_state,created_by_actor_key,created_at,updated_at
          ) VALUES (?,?,?,?, 'RIGHTS_CASE_CREATED', ?, ?, 'CONTACT_NOT_FOUND', ?, ?, ?)`
        ).bind(rightsCaseId,v.gameId,row.game_name,v.publisherName,JSON.stringify(v.requestedScopes),JSON.stringify(v.productSurfaces),actorKey,now,now),
        db.prepare(
          `INSERT INTO modaryx_v2_rights_audit (
            audit_id,case_id,event_type,actor_key,payload_json,created_at
          ) VALUES (?,?,'CASE_CREATED',?,?,?)`
        ).bind(auditId,rightsCaseId,actorKey,JSON.stringify({source:"game-support-triage",requestId:v.requestId}),now)
      );
    }

    const supportId="mx_game_support_"+crypto.randomUUID().replaceAll("-","");
    statements.push(
      db.prepare(
        `INSERT INTO modaryx_v2_game_support_records (
          support_id,request_id,game_id,game_name,rights_case_id,safe_baseline_allowed,
          official_assets_allowed,partnership_claim_allowed,forge_permission_inferred,created_at,updated_at
        ) VALUES (?,?,?,?,?,1,0,0,0,?,?)`
      ).bind(supportId,v.requestId,v.gameId,row.game_name,rightsCaseId,now,now)
    );
  }

  statements.push(
    db.prepare(
      `UPDATE modaryx_v2_game_support_requests
       SET state=?,triage_json=?,decision_reason=?,game_id=?,rights_case_id=?,
         safe_baseline_allowed=?,publisher_name=COALESCE(?,publisher_name),updated_at=?,decided_at=?
       WHERE request_id=? AND state IN ('REQUESTED','TRIAGE')`
    ).bind(
      v.decision,JSON.stringify(v.triageChecks),v.decisionReason,v.gameId,rightsCaseId,
      v.decision==="ACCEPTED_SAFE_BASELINE"?1:0,v.publisherName,now,now,v.requestId
    )
  );

  try{
    await db.batch(statements);
  }catch{
    return json({error:"game-support-triage-write-failed"},409);
  }

  const updated=await db.prepare(select+" WHERE request_id=? LIMIT 1").bind(v.requestId).first();
  const note=notificationFor(updated,v.decision,now);
  await recordInAppNotification(context.env,note);
  return json({schemaVersion:1,item:publicGameSupportRequest(updated),notificationChannel:"IN_APP_FAIL_SOFT"});
}
