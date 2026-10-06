import {json,readJson,requireSameOrigin} from "../../../_lib/api-security.mjs";
import {cwvRumReadiness,storeCwvBatch} from "../../../_lib/cwv-rum.mjs";

export async function onRequestGet(context){
  return json(cwvRumReadiness(context.env||{}));
}

export async function onRequestPost(context){
  const origin=requireSameOrigin(context.request);
  if(!origin.ok) return json({error:origin.reason},origin.status);
  const readiness=cwvRumReadiness(context.env||{});
  if(!readiness.enabled) return json({error:"cwv-rum-disabled",...readiness},503);
  const parsed=await readJson(context.request,5000);
  if(!parsed.ok) return json({error:parsed.reason},parsed.status);
  const result=await storeCwvBatch(context.env,parsed.value);
  if(!result.ok) return json({error:result.reason},result.status);
  return json({schemaVersion:1,accepted:result.accepted,fieldEvidence:"OPEN_TRAFFIC_AND_P75_REQUIRED"},202);
}
