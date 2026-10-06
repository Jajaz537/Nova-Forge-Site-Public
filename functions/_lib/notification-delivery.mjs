const CHANNELS=new Set(["EMAIL","PUSH"]);
const APPROVED_PROVIDER_STATE="CONFIGURED_PRODUCTION_APPROVED";

function providerEntry(registry,channel){
  if(!registry?.connectors) return null;
  return channel==="EMAIL"?registry.connectors.email:registry.connectors.push;
}

export function evaluateExternalDeliveryReadiness(registry={}){
  const shape=(channel)=>{
    const entry=providerEntry(registry,channel);
    const state=entry?.state||"NOT_IMPLEMENTED";
    const provider=typeof entry?.provider==="string"&&entry.provider.trim()?entry.provider.trim():null;
    const available=Boolean(provider)&&state===APPROVED_PROVIDER_STATE;
    return {
      channel,
      available,
      provider:available?provider:null,
      state,
      reason:available?null
        : state==="NOT_IMPLEMENTED"?"provider-not-implemented"
        : state==="NOT_CONFIGURED"?"provider-not-configured"
        : state==="CONFIGURED_NOT_PRODUCTION_APPROVED"?"provider-not-production-approved"
        : "provider-unavailable"
    };
  };
  return {
    schemaVersion:1,
    productionApproval:"OPEN",
    email:shape("EMAIL"),
    push:shape("PUSH")
  };
}

export function planExternalDelivery({channel,registry,preferenceEnabled,destinationRefDigestSha256}={}){
  if(!CHANNELS.has(channel)) return {ok:false,state:"BLOCKED",reason:"channel-invalid"};
  if(preferenceEnabled!==true) return {ok:false,state:"BLOCKED",reason:"user-preference-disabled"};
  const digest=typeof destinationRefDigestSha256==="string"?destinationRefDigestSha256.trim().toLowerCase():"";
  if(!/^[a-f0-9]{64}$/.test(digest)) return {ok:false,state:"BLOCKED",reason:"destination-ref-missing"};
  const readiness=evaluateExternalDeliveryReadiness(registry);
  const channelState=channel==="EMAIL"?readiness.email:readiness.push;
  if(!channelState.available) return {ok:false,state:"BLOCKED",reason:channelState.reason};
  return {
    ok:true,
    state:"QUEUED",
    provider:channelState.provider,
    destinationRefDigestSha256:digest
  };
}

export async function enqueueExternalDelivery(env,{notificationEventId,ownerIdentitySub,channel,registry,preferenceEnabled,destinationRefDigestSha256}={}){
  if(!env?.MODARYX_DB) return {ok:false,status:503,reason:"d1-binding-missing"};
  if(typeof notificationEventId!=="string"||!/^mx_notification_[a-f0-9]{32}$/.test(notificationEventId)) return {ok:false,status:400,reason:"notification-id-invalid"};
  if(typeof ownerIdentitySub!=="string"||!ownerIdentitySub.trim()) return {ok:false,status:400,reason:"owner-invalid"};
  const plan=planExternalDelivery({channel,registry,preferenceEnabled,destinationRefDigestSha256});
  if(!plan.ok) return {ok:false,status:409,reason:plan.reason,state:"BLOCKED"};

  const deliveryId="mx_delivery_"+crypto.randomUUID().replaceAll("-","");
  const now=new Date().toISOString();
  try{
    await env.MODARYX_DB.prepare(
      `INSERT OR IGNORE INTO modaryx_v2_notification_delivery_outbox (
        delivery_id,notification_event_id,owner_identity_sub,channel,state,provider_kind,
        destination_ref_digest_sha256,attempt_count,next_attempt_at,last_error_code,created_at,updated_at
      ) VALUES (?,?,?,?, 'QUEUED', ?, ?, 0, ?, NULL, ?, ?)`
    ).bind(
      deliveryId,notificationEventId,ownerIdentitySub.trim(),channel,plan.provider,
      plan.destinationRefDigestSha256,now,now,now
    ).run();

    const row=await env.MODARYX_DB.prepare(
      `SELECT delivery_id,state FROM modaryx_v2_notification_delivery_outbox
       WHERE notification_event_id=? AND channel=? LIMIT 1`
    ).bind(notificationEventId,channel).first();

    if(!row?.delivery_id) return {ok:false,status:503,reason:"delivery-outbox-unavailable"};
    return {ok:true,status:201,deliveryId:row.delivery_id,state:row.state,created:row.delivery_id===deliveryId};
  }catch{
    return {ok:false,status:503,reason:"delivery-outbox-unavailable"};
  }
}

export const notificationDeliveryProviderApprovalState=()=>APPROVED_PROVIDER_STATE;
