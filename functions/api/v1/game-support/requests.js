import {json} from "../../../_lib/api-security.mjs";
import {authenticateRead,authorizeWrite} from "../../../_lib/remote-write.mjs";
import {gameSupportActorKey,publicGameSupportRequest,validateGameSupportRequest} from "../../../_lib/game-support.mjs";

const select=`SELECT request_id,game_name,platforms_json,developer_name,publisher_name,reason,source_urls_json,
  state,decision_reason,game_id,rights_case_id,safe_baseline_allowed,created_at,updated_at,decided_at
  FROM modaryx_v2_game_support_requests`;

export async function onRequestGet(context){
  const auth=await authenticateRead(context);
  if(!auth.ok) return json({error:auth.reason},auth.status);
  try{
    const rows=await context.env.MODARYX_DB.prepare(
      select+" WHERE requester_identity_sub=? ORDER BY created_at DESC LIMIT 50"
    ).bind(auth.identity.sub).all();
    return json({schemaVersion:1,items:(rows?.results||[]).map(publicGameSupportRequest)});
  }catch{
    return json({error:"game-support-storage-unavailable"},503);
  }
}

export async function onRequestPost(context){
  const access=await authorizeWrite(context,{action:"game-support-request",maxBytes:16_000});
  if(!access.ok) return json({error:access.reason},access.status);
  const validated=validateGameSupportRequest(access.body);
  if(!validated.ok) return json({error:validated.reason},400);
  const v=validated.value;
  const db=context.env.MODARYX_DB;
  try{
    const existing=await db.prepare(
      `SELECT request_id,state FROM modaryx_v2_game_support_requests
       WHERE normalized_game_key=? AND state IN ('REQUESTED','TRIAGE','ACCEPTED_SAFE_BASELINE')
       ORDER BY created_at DESC LIMIT 1`
    ).bind(v.normalizedGameKey).first();
    if(existing) return json({error:"game-support-duplicate-active",requestId:existing.request_id,state:existing.state},409);

    const requestId="mx_game_support_request_"+crypto.randomUUID().replaceAll("-","");
    const actorKey=await gameSupportActorKey(access.identity.identity.sub);
    const now=new Date().toISOString();
    await db.prepare(
      `INSERT INTO modaryx_v2_game_support_requests (
        request_id,requester_identity_sub,requester_actor_key,game_name,normalized_game_key,platforms_json,
        developer_name,publisher_name,reason,source_urls_json,state,triage_json,decision_reason,game_id,
        rights_case_id,safe_baseline_allowed,created_at,updated_at,decided_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,'REQUESTED','{}',NULL,NULL,NULL,0,?,?,NULL)`
    ).bind(
      requestId,access.identity.identity.sub,actorKey,v.gameName,v.normalizedGameKey,JSON.stringify(v.platforms),
      v.developerName,v.publisherName,v.reason,JSON.stringify(v.sourceUrls),now,now
    ).run();
    const row=await db.prepare(select+" WHERE request_id=? LIMIT 1").bind(requestId).first();
    return json({schemaVersion:1,item:publicGameSupportRequest(row)},201);
  }catch{
    return json({error:"game-support-create-failed"},409);
  }
}
