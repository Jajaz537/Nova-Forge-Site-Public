import {json} from "../../../../_lib/api-security.mjs";
import {authorizeRightsAdmin} from "../../../../_lib/rights-admin.mjs";
import {publisherOutboundNetworkDispatchImplemented} from "../../../../_lib/publisher-outbound.mjs";

export async function onRequestGet(context){
  const access=await authorizeRightsAdmin(context,{requireRecentAuthentication:false});
  if(!access.ok) return json({error:access.reason},access.status);
  return json({
    schemaVersion:1,
    requestPreparation:true,
    queue:false,
    providerAdapter:false,
    senderIdentity:false,
    transportWebhook:false,
    bounceHandling:false,
    replyCorrelation:false,
    networkDispatch:publisherOutboundNetworkDispatchImplemented(),
    productionApproval:"OPEN"
  });
}
