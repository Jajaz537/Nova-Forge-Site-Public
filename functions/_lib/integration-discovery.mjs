import {evaluateGuideConnection,evaluateNovaForgeBridge} from './integration-consent.mjs';

function uniqueCapabilities(values,max=16){
  if(!Array.isArray(values) || values.length>max) return null;
  const out=[];
  const seen=new Set();
  for(const value of values){
    if(typeof value!=='string') return null;
    const item=value.trim();
    if(!/^[a-z][a-z0-9.-]{2,63}$/.test(item) || seen.has(item)) return null;
    seen.add(item);
    out.push(item);
  }
  return out;
}

function safeEndpoint(value,{local=false}={}){
  if(typeof value!=='string' || !value.trim()) return null;
  try{
    const url=new URL(value.trim());
    if(url.username || url.password || url.hash) return null;
    if(local){
      const loopback=url.hostname==='localhost'||url.hostname==='127.0.0.1'||url.hostname==='[::1]';
      if(url.protocol!=='https:' && !(url.protocol==='http:'&&loopback)) return null;
    }else if(url.protocol!=='https:'){
      return null;
    }
    return url;
  }catch{
    return null;
  }
}

async function readJsonBounded(response,maxBytes){
  const header=response.headers?.get?.('content-length');
  if(header && /^\d+$/.test(header) && Number(header)>maxBytes) return {ok:false,reason:'discovery-response-too-large'};
  const contentType=response.headers?.get?.('content-type')||'';
  if(!contentType.toLowerCase().includes('application/json')) return {ok:false,reason:'discovery-content-type-invalid'};

  let bytes;
  if(response.body?.getReader){
    const reader=response.body.getReader();
    const chunks=[];
    let total=0;
    while(true){
      const {done,value}=await reader.read();
      if(done) break;
      total+=value.byteLength;
      if(total>maxBytes){
        try{await reader.cancel();}catch{}
        return {ok:false,reason:'discovery-response-too-large'};
      }
      chunks.push(value);
    }
    bytes=new Uint8Array(total);
    let offset=0;
    for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
  }else{
    bytes=new Uint8Array(await response.arrayBuffer());
    if(bytes.byteLength>maxBytes) return {ok:false,reason:'discovery-response-too-large'};
  }

  try{
    return {ok:true,value:JSON.parse(new TextDecoder().decode(bytes))};
  }catch{
    return {ok:false,reason:'discovery-json-invalid'};
  }
}

async function probe({endpointUri,local,fetchImpl,maxBytes=64*1024}){
  const endpoint=safeEndpoint(endpointUri,{local});
  if(!endpoint) return {ok:false,reason:'discovery-endpoint-invalid'};
  let response;
  try{
    response=await fetchImpl(endpoint,{
      method:'GET',
      redirect:'error',
      credentials:'omit',
      referrerPolicy:'no-referrer',
      headers:{accept:'application/json'}
    });
  }catch{
    return {ok:false,reason:'discovery-unavailable'};
  }
  if(!response?.ok) return {ok:false,reason:'discovery-http-'+String(response?.status||0)};
  const parsed=await readJsonBounded(response,maxBytes);
  return parsed.ok ? {ok:true,endpointUri:endpoint.href,value:parsed.value} : parsed;
}

export async function discoverGuideService({
  endpointUri,
  requestedScopes=[],
  fetchImpl=fetch,
  maxBytes=64*1024
}={}){
  const requested=uniqueCapabilities(requestedScopes);
  if(!requested) return {ok:false,reason:'guide-requested-scopes-invalid'};
  const response=await probe({endpointUri,local:false,fetchImpl,maxBytes});
  if(!response.ok) return response;
  const data=response.value;
  if(data?.schema!=='modaryx-guide-discovery/v1' || data?.product!=='modaryx-guide' || data?.state!=='available'){
    return {ok:false,reason:'guide-discovery-contract-invalid'};
  }
  const supported=uniqueCapabilities(data.supportedScopes);
  if(!supported) return {ok:false,reason:'guide-supported-scopes-invalid'};
  if(!requested.every(item=>supported.includes(item))) return {ok:false,reason:'guide-requested-scope-unsupported'};
  return {
    ok:true,
    reason:null,
    state:'available',
    endpointUri:response.endpointUri,
    supportedScopes:supported,
    requestedScopes:requested
  };
}

export function prepareGuideActivation({
  discovery,
  consentGranted=false,
  grantedScopes=[]
}={}){
  if(!discovery?.ok || discovery.state!=='available') return {ok:false,reason:'guide-discovery-required'};
  const granted=uniqueCapabilities(grantedScopes);
  if(!granted) return {ok:false,reason:'guide-granted-scopes-invalid'};
  if(!granted.every(item=>discovery.supportedScopes.includes(item))) return {ok:false,reason:'guide-granted-scope-unsupported'};
  return evaluateGuideConnection({
    state:'connected',
    consentGranted,
    requestedScopes:discovery.requestedScopes,
    grantedScopes:granted,
    endpointUri:discovery.endpointUri
  });
}

export async function discoverNovaForgeBridge({
  localEndpointUri,
  requestedPermissions=[],
  fetchImpl=fetch,
  maxBytes=64*1024
}={}){
  const requested=uniqueCapabilities(requestedPermissions);
  if(!requested) return {ok:false,reason:'os-bridge-requested-permissions-invalid'};
  const response=await probe({endpointUri:localEndpointUri,local:true,fetchImpl,maxBytes});
  if(!response.ok) return response;
  const data=response.value;
  if(
    data?.schema!=='nova-forge-os-bridge-discovery/v1' ||
    data?.sourceProduct!=='modaryx-web' ||
    data?.targetProduct!=='nova-forge-os' ||
    data?.state!=='available'
  ){
    return {ok:false,reason:'os-bridge-discovery-contract-invalid'};
  }
  if(typeof data.protocolVersion!=='string' || !/^v[0-9]+(?:\.[0-9]+){0,2}$/.test(data.protocolVersion)){
    return {ok:false,reason:'os-bridge-protocol-invalid'};
  }
  const supported=uniqueCapabilities(data.supportedPermissions);
  if(!supported) return {ok:false,reason:'os-bridge-supported-permissions-invalid'};
  if(!requested.every(item=>supported.includes(item))) return {ok:false,reason:'os-bridge-requested-permission-unsupported'};
  return {
    ok:true,
    reason:null,
    state:'available',
    localEndpointUri:response.endpointUri,
    protocolVersion:data.protocolVersion,
    supportedPermissions:supported,
    requestedPermissions:requested
  };
}

export function prepareNovaForgeBridgeActivation({
  discovery,
  consentGranted=false,
  grantedPermissions=[]
}={}){
  if(!discovery?.ok || discovery.state!=='available') return {ok:false,reason:'os-bridge-discovery-required'};
  const granted=uniqueCapabilities(grantedPermissions);
  if(!granted) return {ok:false,reason:'os-bridge-granted-permissions-invalid'};
  if(!granted.every(item=>discovery.supportedPermissions.includes(item))){
    return {ok:false,reason:'os-bridge-granted-permission-unsupported'};
  }
  return evaluateNovaForgeBridge({
    state:'connected',
    consentGranted,
    requestedPermissions:discovery.requestedPermissions,
    grantedPermissions:granted,
    localEndpointUri:discovery.localEndpointUri,
    protocolVersion:discovery.protocolVersion
  });
}
