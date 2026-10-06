import {json} from '../../_lib/api-security.mjs';
import {authenticateRead} from '../../_lib/remote-write.mjs';
import {publicNotification} from '../../_lib/notifications.mjs';

export async function onRequestGet(context){
  const auth=await authenticateRead(context);
  if(!auth.ok) return json({error:auth.reason},auth.status);
  const url=new URL(context.request.url);
  const parsed=Number(url.searchParams.get("limit")||20);
  const limit=Number.isInteger(parsed)?Math.max(1,Math.min(50,parsed)):20;
  const unreadOnly=url.searchParams.get("unread")==="1";
  try{
    const where=unreadOnly?"recipient_identity_sub = ? AND read_at IS NULL":"recipient_identity_sub = ?";
    const rows=await context.env.MODARYX_DB.prepare(
      `SELECT event_id,event_type,priority,title,summary,href,state_label,affected_scopes_json,
        source_kind,source_id,occurred_at,read_at
       FROM modaryx_v2_notification_events
       WHERE ${where}
       ORDER BY occurred_at DESC
       LIMIT ?`
    ).bind(auth.identity.sub,limit).all();
    const count=await context.env.MODARYX_DB.prepare(
      "SELECT COUNT(*) AS count FROM modaryx_v2_notification_events WHERE recipient_identity_sub=? AND read_at IS NULL"
    ).bind(auth.identity.sub).first();
    return json({
      schemaVersion:1,channel:"IN_APP",items:(rows?.results||[]).map(publicNotification),
      unreadCount:Number(count?.count||0),
      email:{available:false,reason:"infrastructure-not-connected"},
      push:{available:false,reason:"infrastructure-not-connected"}
    });
  }catch{
    return json({error:"notifications-storage-unavailable"},503);
  }
}
