import {readJson,requireSameOrigin} from "./api-security.mjs";
import {getSessionIdentity} from "./auth-session.mjs";
import {ADMIN_CONSOLE_PERMISSION,hasPermission} from "./access-control.mjs";

export async function rightsActorKey(sub){
  const bytes=new TextEncoder().encode(String(sub||""));
  const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",bytes));
  return "rights-admin:"+[...digest].map(v=>v.toString(16).padStart(2,"0")).join("").slice(0,40);
}

function maxAgeSeconds(env={}){
  const value=Number(env.MODARYX_PRIVILEGED_AUTH_MAX_AGE_SECONDS);
  if(!Number.isFinite(value)) return 15*60;
  return Math.max(60,Math.min(60*60,Math.trunc(value)));
}

export async function authorizeRightsAdmin(context,{readBody=false,maxBytes=20_000,requireRecentAuthentication=true,nowMs=Date.now()}={}){
  const db=context.env?.MODARYX_DB;
  if(!db||typeof db.prepare!=="function") return {ok:false,status:503,reason:"d1-binding-missing"};

  if(readBody){
    const origin=requireSameOrigin(context.request);
    if(!origin.ok) return origin;
  }

  const identity=await getSessionIdentity(context.request,db,{nowMs});
  if(!identity) return {ok:false,status:401,reason:"authentication-required"};
  if(!hasPermission(identity,ADMIN_CONSOLE_PERMISSION)) return {ok:false,status:403,reason:"rights-admin-permission-required"};

  if(requireRecentAuthentication){
    const created=Date.parse(identity.createdAt||"");
    const age=nowMs-created;
    const max=maxAgeSeconds(context.env||{})*1000;
    if(!Number.isFinite(created)||age<0||age>max) return {ok:false,status:401,reason:"reauthentication-required"};
  }

  let body=null;
  if(readBody){
    const parsed=await readJson(context.request,maxBytes);
    if(!parsed.ok) return parsed;
    body=parsed.value;
  }
  return {ok:true,status:200,reason:null,identity,body};
}
