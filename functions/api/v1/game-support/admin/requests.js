import {json} from "../../../../_lib/api-security.mjs";
import {authorizeRightsAdmin} from "../../../../_lib/rights-admin.mjs";
import {publicGameSupportRequest} from "../../../../_lib/game-support.mjs";

export async function onRequestGet(context){
  const access=await authorizeRightsAdmin(context,{requireRecentAuthentication:false});
  if(!access.ok) return json({error:access.reason},access.status);
  try{
    const rows=await context.env.MODARYX_DB.prepare(
      `SELECT request_id,game_name,platforms_json,developer_name,publisher_name,reason,source_urls_json,
        state,decision_reason,game_id,rights_case_id,safe_baseline_allowed,created_at,updated_at,decided_at
       FROM modaryx_v2_game_support_requests
       ORDER BY updated_at DESC LIMIT 100`
    ).all();
    return json({schemaVersion:1,items:(rows?.results||[]).map(publicGameSupportRequest)});
  }catch{
    return json({error:"game-support-storage-unavailable"},503);
  }
}
