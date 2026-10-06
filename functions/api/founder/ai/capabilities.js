import {authorizeFounderAi, requestFounderBridge} from '../../../_lib/founder-ai-bridge.mjs';

export async function onRequestGet(context){
  const access=await authorizeFounderAi(context);
  if(!access.ok) return access.response;
  return requestFounderBridge(context,'GET','/v1/capabilities');
}
