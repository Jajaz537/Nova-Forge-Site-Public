import {getSessionIdentity} from './auth-session.mjs';
import {FOUNDER_PERMISSION, hasPermission} from './access-control.mjs';
import {json, requireSameOrigin} from './api-security.mjs';

const ENCODER=new TextEncoder();
const DECODER=new TextDecoder();
const MAX_RESPONSE_BYTES=2*1024*1024;

function hex(bytes){return Array.from(bytes,v=>v.toString(16).padStart(2,'0')).join('');}
function keyBytes(raw){
  const value=String(raw||'');
  if(!/^[0-9a-f]+$/i.test(value)||value.length%2) return null;
  const out=new Uint8Array(value.length/2);
  for(let i=0;i<out.length;i++) out[i]=Number.parseInt(value.slice(i*2,i*2+2),16);
  return out.byteLength>=32?out:null;
}
function bridgeUrl(raw){
  try{
    const url=new URL(String(raw||''));
    if(url.username||url.password||url.search||url.hash) return null;
    const loopback=['127.0.0.1','localhost','::1','[::1]'].includes(url.hostname);
    if(url.protocol!=='https:'&&!(url.protocol==='http:'&&loopback)) return null;
    return url;
  }catch{return null;}
}
async function sha256Hex(bytes,cryptoImpl=globalThis.crypto){
  return hex(new Uint8Array(await cryptoImpl.subtle.digest('SHA-256',bytes)));
}
export async function signFounderAiRequest({keyHex,method,pathWithQuery,bodyBytes=new Uint8Array(),timestamp=Math.floor(Date.now()/1000),nonce=null,cryptoImpl=globalThis.crypto}){
  const key=keyBytes(keyHex);
  if(!key) throw new Error('invalid bridge key');
  if(!Number.isInteger(timestamp)) throw new Error('invalid timestamp');
  if(!nonce){
    const random=new Uint8Array(16);cryptoImpl.getRandomValues(random);nonce=hex(random);
  }
  if(!/^[0-9a-f]{32}$/i.test(nonce)) throw new Error('invalid nonce');
  const body=bodyBytes instanceof Uint8Array?bodyBytes:new Uint8Array(bodyBytes);
  const bodyHash=await sha256Hex(body,cryptoImpl);
  const canonical=`${String(method).toUpperCase()}\n${pathWithQuery}\n${timestamp}\n${nonce}\n${bodyHash}`;
  const imported=await cryptoImpl.subtle.importKey('raw',key,{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const signature=hex(new Uint8Array(await cryptoImpl.subtle.sign('HMAC',imported,ENCODER.encode(canonical))));
  return {timestamp,nonce,bodyHash,signature};
}
async function readBounded(response){
  const declared=Number(response.headers.get('content-length'));
  if(Number.isFinite(declared)&&declared>MAX_RESPONSE_BYTES) throw new Error('bridge response too large');
  if(!response.body) return new Uint8Array();
  const reader=response.body.getReader();const chunks=[];let total=0;
  try{
    while(true){
      const {done,value}=await reader.read();if(done) break;
      total+=value.byteLength;if(total>MAX_RESPONSE_BYTES){await reader.cancel();throw new Error('bridge response too large');}
      chunks.push(value);
    }
  }finally{reader.releaseLock();}
  const out=new Uint8Array(total);let offset=0;for(const chunk of chunks){out.set(chunk,offset);offset+=chunk.byteLength;}return out;
}
export async function authorizeFounderAi(context,{write=false}={}){
  const db=context.env?.MODARYX_DB;
  if(!db||typeof db.prepare!=='function') return {ok:false,response:json({error:'founder-ai-unavailable'},503)};
  const identity=await getSessionIdentity(context.request,db);
  if(!identity||!hasPermission(identity,FOUNDER_PERMISSION)) return {ok:false,response:json({error:'not-found'},404)};
  if(write){
    const origin=requireSameOrigin(context.request);
    if(!origin.ok) return {ok:false,response:json({error:origin.reason},origin.status)};
  }
  return {ok:true,identity};
}
export async function requestFounderBridge(context,method,pathWithQuery,payload){
  const base=bridgeUrl(context.env?.MODARYX_AI_BRIDGE_URL);
  const key=keyBytes(context.env?.MODARYX_AI_BRIDGE_KEY_HEX);
  if(!base||!key) return json({ok:false,error:'founder-ai-not-configured'},503);
  const target=new URL(pathWithQuery,base);
  if(target.origin!==base.origin) return json({ok:false,error:'bridge-target-rejected'},502);
  const body=payload===undefined?new Uint8Array():ENCODER.encode(JSON.stringify(payload));
  const signed=await signFounderAiRequest({keyHex:hex(key),method,pathWithQuery:`${target.pathname}${target.search}`,bodyBytes:body});
  const headers={
    'accept':'application/json',
    'x-modaryx-timestamp':String(signed.timestamp),
    'x-modaryx-nonce':signed.nonce,
    'x-modaryx-body-sha256':signed.bodyHash,
    'x-modaryx-signature':signed.signature
  };
  if(body.byteLength) headers['content-type']='application/json';
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),30000);
  try{
    const response=await fetch(target,{method:String(method).toUpperCase(),headers,body:body.byteLength?body:undefined,redirect:'error',cache:'no-store',signal:controller.signal});
    const bytes=await readBounded(response);
    let data=null;
    if(bytes.byteLength){try{data=JSON.parse(DECODER.decode(bytes));}catch{return json({ok:false,error:'bridge-invalid-response'},502);}}
    if(response.status<200||response.status>599) return json({ok:false,error:'bridge-invalid-status'},502);
    return json(data??{ok:response.ok},response.status);
  }catch(error){
    const out={ok:false,error:'bridge-unavailable'};
    if(context.env?.MODARYX_P6_EVIDENCE_MODE==='enabled'){
      out.diagnostic={
        name:String(error?.name||'Error').slice(0,80),
        message:String(error?.message||'').slice(0,240)
      };
    }
    return json(out,502);
  }
  finally{clearTimeout(timer);}
}
