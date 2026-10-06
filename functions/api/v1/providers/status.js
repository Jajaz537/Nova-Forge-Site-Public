import {providerRegistryState} from "../../../_lib/provider-registry.mjs";

const json=(value,status=200)=>new Response(JSON.stringify(value),{
  status,
  headers:{
    "content-type":"application/json; charset=utf-8",
    "cache-control":"no-store",
    "x-content-type-options":"nosniff"
  }
});

export async function onRequestGet(context){
  return json(providerRegistryState(context.env||{}));
}
