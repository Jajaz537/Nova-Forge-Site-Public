const API_ROOT="/api/v1";
const JSON_ACCEPT={accept:"application/json"};

function normalizeReturnTo(value){
  if(typeof value!=="string"||!value.startsWith("/")||value.startsWith("//")) return "/account";
  try{
    const url=new URL(value,"https://modaryx.invalid");
    return url.origin==="https://modaryx.invalid" ? url.pathname+url.search : "/account";
  }catch{
    return "/account";
  }
}

export function authLoginUrl(returnTo="/account"){
  return API_ROOT+"/auth/login?returnTo="+encodeURIComponent(normalizeReturnTo(returnTo));
}

async function readJson(path,{fetchImpl=globalThis.fetch,method="GET",timeoutMs=2500,body:requestBody}={}){
  if(typeof fetchImpl!=="function") return {ok:false,state:"FETCH_UNAVAILABLE",status:0};
  if(typeof path!=="string"||!path.startsWith(API_ROOT+"/")) return {ok:false,state:"PATH_REJECTED",status:0};
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{
    const response=await fetchImpl(path,{
      method,
      credentials:"same-origin",
      headers:method==="GET"?JSON_ACCEPT:{...JSON_ACCEPT,"content-type":"application/json"},
      body:method==="GET"?undefined:JSON.stringify(requestBody??{}),
      signal:controller.signal,
      cache:"no-store",
    });
    const type=response.headers?.get?.("content-type")||"";
    if(!/application\/json/i.test(type)) return {ok:false,state:"NON_JSON_RESPONSE",status:response.status};
    let body;
    try{body=await response.json();}catch{return {ok:false,state:"INVALID_JSON",status:response.status};}
    if(!response.ok) return {ok:false,state:"HTTP_ERROR",status:response.status,body};
    return {ok:true,state:"OK",status:response.status,body};
  }catch(error){
    return {ok:false,state:error?.name==="AbortError"?"TIMEOUT":"NETWORK_ERROR",status:0};
  }finally{
    clearTimeout(timer);
  }
}

export async function getBackendStatus(options={}){
  return readJson(API_ROOT+"/status",options);
}

export async function getAccountSession(options={}){
  return readJson(API_ROOT+"/auth/session",options);
}

export async function resolveAccountRemoteState(options={}){
  const status=await getBackendStatus(options);
  if(!status.ok) return {state:"BACKEND_UNAVAILABLE",loginAvailable:false,profile:null,authority:null,reason:status.state};

  const d1Ready=status.body?.bindings?.d1===true;
  const loginReady=status.body?.auth0?.loginConfigured===true;
  if(!d1Ready||!loginReady){
    return {state:"BACKEND_UNAVAILABLE",loginAvailable:false,profile:null,authority:null,reason:d1Ready?"AUTH_NOT_READY":"D1_NOT_READY"};
  }

  const session=await getAccountSession(options);
  if(!session.ok) return {state:"BACKEND_UNAVAILABLE",loginAvailable:true,profile:null,authority:null,reason:"SESSION_"+session.state};
  if(session.body?.authenticated!==true){
    return {state:"GUEST",loginAvailable:true,profile:null,authority:null,reason:null};
  }
  return {
    state:"AUTHENTICATED",
    loginAvailable:true,
    profile:session.body?.profile||null,
    authority:session.body?.authority||null,
    reason:null,
  };
}

export async function logoutAccountSession(options={}){
  return readJson(API_ROOT+"/auth/logout",{...options,method:"POST"});
}

export async function getNotifications(options={}){
  return readJson(API_ROOT+"/notifications",options);
}
export async function markNotificationRead(id,options={}){
  if(typeof id!=="string"||!/^mx_notification_[a-f0-9]{32}$/.test(id)) return {ok:false,state:"ID_REJECTED",status:0};
  return readJson(API_ROOT+"/notifications/"+id+"/read",{...options,method:"POST"});
}
export async function getNotificationPreferences(options={}){
  return readJson(API_ROOT+"/notifications/preferences",options);
}

export async function getProviderRegistry(options={}){
  return readJson(API_ROOT+"/providers/status",options);
}

export async function getDataHistory(options={}){
  return readJson(API_ROOT+"/history",options);
}

export async function getGameSupportRequests(options={}){
  return readJson(API_ROOT+"/game-support/requests",options);
}

export async function createGameSupportRequest(payload,options={}){
  if(!payload||typeof payload!=="object"||Array.isArray(payload)) return {ok:false,state:"PAYLOAD_REJECTED",status:0};
  return readJson(API_ROOT+"/game-support/requests",{...options,method:"POST",body:payload});
}
