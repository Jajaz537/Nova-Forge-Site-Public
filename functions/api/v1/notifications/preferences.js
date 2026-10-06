import {json,readJson,requireSameOrigin} from '../../../_lib/api-security.mjs';
import {authenticateRead} from '../../../_lib/remote-write.mjs';
import {defaultNotificationPreferences,validateNotificationPreferences} from '../../../_lib/notifications.mjs';

const shape=row=>row?{
  version:Number(row.version),persisted:true,
  preferences:{
    product:Boolean(row.product_enabled),community:Boolean(row.community_enabled),
    creator:Boolean(row.creator_enabled),profile:Boolean(row.profile_enabled),
    rights:Boolean(row.rights_enabled),marketing:Boolean(row.marketing_enabled)
  }
}:{version:0,persisted:false,preferences:defaultNotificationPreferences()};

async function current(db,sub){
  return db.prepare(
    `SELECT product_enabled,community_enabled,creator_enabled,profile_enabled,rights_enabled,
      marketing_enabled,version,updated_at
     FROM modaryx_v2_notification_preferences WHERE identity_sub=? LIMIT 1`
  ).bind(sub).first();
}

export async function onRequestGet(context){
  const auth=await authenticateRead(context);
  if(!auth.ok) return json({error:auth.reason},auth.status);
  try{
    return json({schemaVersion:1,...shape(await current(context.env.MODARYX_DB,auth.identity.sub)),email:{available:false},push:{available:false}});
  }catch{
    return json({error:"notification-preferences-storage-unavailable"},503);
  }
}

export async function onRequestPut(context){
  const origin=requireSameOrigin(context.request);
  if(!origin.ok) return json({error:origin.reason},origin.status);
  const auth=await authenticateRead(context);
  if(!auth.ok) return json({error:auth.reason},auth.status);
  const parsed=await readJson(context.request,8000);
  if(!parsed.ok) return json({error:parsed.reason},parsed.status);
  const validated=validateNotificationPreferences(parsed.value);
  if(!validated.ok) return json({error:validated.reason},400);
  const db=context.env.MODARYX_DB;
  try{
    const existing=await current(db,auth.identity.sub);
    const expected=Number(existing?.version||0);
    if(validated.value.version!==expected){
      return json({error:"preferences-version-conflict",current:shape(existing)},409);
    }
    const next=expected+1;
    const p=validated.value.preferences;
    const now=new Date().toISOString();
    await db.prepare(
      `INSERT INTO modaryx_v2_notification_preferences (
        identity_sub,product_enabled,community_enabled,creator_enabled,profile_enabled,
        rights_enabled,marketing_enabled,version,updated_at
      ) VALUES (?,?,?,?,?,?,?,?,?)
      ON CONFLICT(identity_sub) DO UPDATE SET
        product_enabled=excluded.product_enabled,community_enabled=excluded.community_enabled,
        creator_enabled=excluded.creator_enabled,profile_enabled=excluded.profile_enabled,
        rights_enabled=excluded.rights_enabled,marketing_enabled=excluded.marketing_enabled,
        version=excluded.version,updated_at=excluded.updated_at`
    ).bind(auth.identity.sub,p.product?1:0,p.community?1:0,p.creator?1:0,p.profile?1:0,p.rights?1:0,p.marketing?1:0,next,now).run();
    return json({schemaVersion:1,...shape(await current(db,auth.identity.sub)),email:{available:false},push:{available:false}});
  }catch{
    return json({error:"notification-preferences-storage-unavailable"},503);
  }
}
