import {json} from "../../../../_lib/api-security.mjs";
import {providerRegistryState} from "../../../../_lib/provider-registry.mjs";
import {evaluateExternalDeliveryReadiness} from "../../../../_lib/notification-delivery.mjs";

export async function onRequestGet(context){
  const registry=providerRegistryState(context.env||{});
  return json(evaluateExternalDeliveryReadiness(registry));
}
