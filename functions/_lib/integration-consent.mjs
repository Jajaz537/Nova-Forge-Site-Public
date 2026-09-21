function uniqueStrings(values,max=16){
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
    return url.href;
  }catch{
    return null;
  }
}

function grantedSubset(requested,granted){
  const allowed=new Set(requested);
  return granted.every(item=>allowed.has(item));
}

export function evaluateGuideConnection({
  state='not-connected',
  consentGranted=false,
  requestedScopes=[],
  grantedScopes=[],
  endpointUri=null
}={}){
  const requested=uniqueStrings(requestedScopes);
  const granted=uniqueStrings(grantedScopes);
  if(!requested || !granted) return {ok:false,reason:'scope-set-invalid'};
  if(!grantedSubset(requested,granted)) return {ok:false,reason:'scope-escalation-forbidden'};

  if(state!=='connected'){
    return {
      ok:true,
      activatable:false,
      reason:'guide-not-connected',
      contract:{
        product:'modaryx-guide',
        consentRequired:true,
        consentGranted:Boolean(consentGranted),
        requestedScopes:requested,
        grantedScopes:granted,
        sessionSharing:false,
        credentialForwarding:false,
        remoteTelemetryRequired:false
      }
    };
  }

  if(!consentGranted) return {ok:false,reason:'consent-required'};
  const endpoint=safeEndpoint(endpointUri);
  if(!endpoint) return {ok:false,reason:'guide-endpoint-invalid'};

  return {
    ok:true,
    activatable:true,
    reason:null,
    endpointUri:endpoint,
    contract:{
      product:'modaryx-guide',
      consentRequired:true,
      consentGranted:true,
      requestedScopes:requested,
      grantedScopes:granted,
      sessionSharing:false,
      credentialForwarding:false,
      remoteTelemetryRequired:false
    }
  };
}

export function evaluateNovaForgeBridge({
  state='not-connected',
  consentGranted=false,
  requestedPermissions=[],
  grantedPermissions=[],
  localEndpointUri=null,
  protocolVersion=null
}={}){
  const requested=uniqueStrings(requestedPermissions);
  const granted=uniqueStrings(grantedPermissions);
  if(!requested || !granted) return {ok:false,reason:'permission-set-invalid'};
  if(!grantedSubset(requested,granted)) return {ok:false,reason:'permission-escalation-forbidden'};

  const contract={
    sourceProduct:'modaryx-web',
    targetProduct:'nova-forge-os',
    consentRequired:true,
    consentGranted:Boolean(consentGranted),
    requestedPermissions:requested,
    grantedPermissions:granted,
    implicitAccountLinking:false,
    sessionSharing:false,
    credentialForwarding:false
  };

  if(state!=='connected'){
    return {ok:true,activatable:false,reason:'os-bridge-not-connected',contract};
  }

  if(!consentGranted) return {ok:false,reason:'consent-required'};
  const endpoint=safeEndpoint(localEndpointUri,{local:true});
  if(!endpoint) return {ok:false,reason:'os-bridge-endpoint-invalid'};
  if(typeof protocolVersion!=='string'||!/^v[0-9]+(?:\.[0-9]+){0,2}$/.test(protocolVersion)){
    return {ok:false,reason:'os-bridge-protocol-invalid'};
  }

  return {
    ok:true,
    activatable:true,
    reason:null,
    localEndpointUri:endpoint,
    protocolVersion,
    contract:{...contract,consentGranted:true}
  };
}
