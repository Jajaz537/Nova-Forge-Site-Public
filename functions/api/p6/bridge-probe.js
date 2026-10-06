import {requestFounderBridge} from '../../_lib/founder-ai-bridge.mjs';

export async function onRequestGet(context){
  if(context.env?.MODARYX_P6_EVIDENCE_MODE!=='enabled') return new Response('not found',{status:404});
  try{
    const response=await requestFounderBridge(context,'GET','/v1/status');
    let data=null;
    try{data=await response.clone().json();}catch{}
    const ok=response.ok&&data?.protocol==='modaryx-founder-bridge-v1';
    return new Response(JSON.stringify({
      schema:'modaryx-p6-bridge-probe-v1',
      ok,
      http:response.status,
      protocol:data?.protocol||null,
      secret_values_exposed:false,
      founder_bypass:false
    }),{
      status:ok?200:503,
      headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer'}
    });
  }catch{
    return new Response(JSON.stringify({
      schema:'modaryx-p6-bridge-probe-v1',
      ok:false,
      http:503,
      protocol:null,
      secret_values_exposed:false,
      founder_bypass:false
    }),{
      status:503,
      headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer'}
    });
  }
}
