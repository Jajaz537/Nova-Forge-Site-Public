import {json} from "../../../_lib/api-security.mjs";
import {authenticateRead} from "../../../_lib/remote-write.mjs";
import {publicDataHistory} from "../../../_lib/data-history.mjs";

export async function onRequestGet(context){
  const auth=await authenticateRead(context);
  if(!auth.ok) return json({error:auth.reason},auth.status);
  const url=new URL(context.request.url);
  const parsed=Number(url.searchParams.get("limit")||30);
  const limit=Number.isInteger(parsed)?Math.max(1,Math.min(100,parsed)):30;
  try{
    const rows=await context.env.MODARYX_DB.prepare(
      `SELECT history_id,entity_kind,entity_id,action,revision,changed_fields_json,
        previous_history_id,source_receipt_id,snapshot_digest_sha256,occurred_at
       FROM modaryx_v2_data_history
       WHERE owner_identity_sub=?
       ORDER BY occurred_at DESC, revision DESC
       LIMIT ?`
    ).bind(auth.identity.sub,limit).all();
    return json({schemaVersion:1,items:(rows?.results||[]).map(publicDataHistory)});
  }catch{
    return json({error:"history-storage-unavailable"},503);
  }
}
