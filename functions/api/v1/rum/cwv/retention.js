import {json,requireSameOrigin} from "../../../../_lib/api-security.mjs";
import {getSessionIdentity} from "../../../../_lib/auth-session.mjs";
import {ADMIN_CONSOLE_PERMISSION,hasPermission} from "../../../../_lib/access-control.mjs";
import {cwvRetentionPolicy,purgeExpiredCwvSamples} from "../../../../_lib/cwv-retention.mjs";

export async function onRequestGet(context){
  const policy=cwvRetentionPolicy(context.env||{});
  return json({
    schemaVersion:1,
    enabled:policy.enabled,
    days:policy.days,
    state:policy.state,
    productionApproval:"OPEN",
    note:"Readiness only. No purge is performed by GET."
  });
}

export async function onRequestPost(context){
  const origin=requireSameOrigin(context.request);
  if(!origin.ok) return json({error:origin.reason},origin.status);
  const db=context.env?.MODARYX_DB;
  if(!db||typeof db.prepare!=="function") return json({error:"d1-binding-missing"},503);
  const identity=await getSessionIdentity(context.request,db);
  if(!identity) return json({error:"authentication-required"},401);
  if(!hasPermission(identity,ADMIN_CONSOLE_PERMISSION)) return json({error:"administration-permission-required"},403);

  const policy=cwvRetentionPolicy(context.env||{});
  if(!policy.enabled){
    return json({error:"cwv-retention-disabled",schemaVersion:1,...policy},409);
  }
  const result=await purgeExpiredCwvSamples(context.env||{});
  if(!result.ok) return json({error:result.reason},result.status);
  return json({
    schemaVersion:1,
    deleted:result.deleted,
    cutoff:result.cutoff,
    retentionDays:result.policy.days,
    productionApproval:"OPEN"
  });
}
