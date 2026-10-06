import {json} from "../../../../_lib/api-security.mjs";
import {authorizeRightsAdmin} from "../../../../_lib/rights-admin.mjs";
import {publisherInboundArchiveReadiness,publisherInboundNetworkReceiverImplemented} from "../../../../_lib/publisher-inbound.mjs";

export async function onRequestGet(context){
  const access=await authorizeRightsAdmin(context,{requireRecentAuthentication:false});
  if(!access.ok) return json({error:access.reason},access.status);
  const ready=publisherInboundArchiveReadiness(context.env||{});
  return json({
    ...ready,
    networkReceiver:publisherInboundNetworkReceiverImplemented(),
    rawMessageExecution:false,
    attachmentExecution:false
  });
}
