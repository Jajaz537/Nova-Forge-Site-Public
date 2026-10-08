import {json,requireSameOrigin} from '../../../../_lib/api-security.mjs';
import {authenticateRead} from '../../../../_lib/remote-write.mjs';

export async function onRequestPost(context){
  const origin=requireSameOrigin(context.request);
  if(!origin.ok) return json({error:origin.reason},origin.status);
  const auth=await authenticateRead(context);
  if(!auth.ok) return json({error:auth.reason},auth.status);
  const id=String(context.params?.id||"").trim().toLowerCase();
  if(!/^mx_notification_[a-f0-9]{32}$/.test(id)) return json({error:"notification-id-invalid"},400);
  try{
    const row=await context.env.MODARYX_DB.prepare(
      "SELECT event_id,read_at FROM modaryx_v2_notification_events WHERE event_id=? AND recipient_identity_sub=? LIMIT 1"
    ).bind(id,auth.identity.sub).first();
    if(!row) return json({error:"notification-not-found"},404);
    if(row.read_at) return json({schemaVersion:1,id,readAt:row.read_at,changed:false});
    const now=new Date().toISOString();
    await context.env.MODARYX_DB.prepare(
      "UPDATE modaryx_v2_notification_events SET read_at=? WHERE event_id=? AND recipient_identity_sub=? AND read_at IS NULL"
    ).bind(now,id,auth.identity.sub).run();
    return json({schemaVersion:1,id,readAt:now,changed:true});
  }catch{
    return json({error:"notifications-storage-unavailable"},503);
  }
}
