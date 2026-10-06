import {json} from '../../../../_lib/api-security.mjs';
import {authenticateRead,authorizeWrite} from '../../../../_lib/remote-write.mjs';
import {
  listNotificationDestinations,
  registerNotificationDestination,
  revokeNotificationDestination
} from '../../../../_lib/notification-destinations.mjs';

export async function onRequestGet(context){
  const auth=await authenticateRead(context);
  if(!auth.ok) return json({error:auth.reason},auth.status);
  const result=await listNotificationDestinations(context.env,{ownerIdentitySub:auth.identity.sub});
  return result.ok
    ? json({schemaVersion:1,destinations:result.destinations},result.status)
    : json({error:result.reason},result.status);
}

export async function onRequestPost(context){
  const access=await authorizeWrite(context,{action:"notification-destination-write",maxBytes:12_000});
  if(!access.ok) return json({error:access.reason},access.status);
  const result=await registerNotificationDestination(context.env,{
    ownerIdentitySub:access.identity.identity.sub,
    channel:access.body?.channel,
    destination:access.body?.destination
  });
  return result.ok
    ? json({schemaVersion:1,destination:result.destination},result.status)
    : json({error:result.reason},result.status);
}

export async function onRequestDelete(context){
  const access=await authorizeWrite(context,{action:"notification-destination-revoke",maxBytes:4_000});
  if(!access.ok) return json({error:access.reason},access.status);
  const result=await revokeNotificationDestination(context.env,{
    ownerIdentitySub:access.identity.identity.sub,
    destinationId:access.body?.destinationId
  });
  return result.ok
    ? json({schemaVersion:1,destination:result.destination},result.status)
    : json({error:result.reason},result.status);
}
