export function cwvRetentionPolicy(env={}){
  const enabled=String(env.MODARYX_CWV_RETENTION_ENABLED||"")==="1";
  const rawDays=Number(env.MODARYX_CWV_RETENTION_DAYS);
  const days=Number.isFinite(rawDays)?Math.max(7,Math.min(90,Math.trunc(rawDays))):28;
  return {
    schemaVersion:1,
    enabled,
    days,
    state:enabled?"ENABLED_EXPLICIT":"DISABLED",
    productionApproval:"OPEN"
  };
}

export async function purgeExpiredCwvSamples(env,{now=new Date()}={}){
  const policy=cwvRetentionPolicy(env);
  if(!policy.enabled) return {ok:false,status:409,reason:"cwv-retention-disabled",policy};
  if(!env?.MODARYX_DB||typeof env.MODARYX_DB.prepare!=="function"){
    return {ok:false,status:503,reason:"d1-binding-missing",policy};
  }
  const cutoff=new Date(now.getTime()-policy.days*24*60*60*1000).toISOString();
  try{
    const before=await env.MODARYX_DB.prepare(
      "SELECT COUNT(*) AS count FROM modaryx_v2_cwv_samples WHERE observed_at < ?"
    ).bind(cutoff).first();
    await env.MODARYX_DB.prepare(
      "DELETE FROM modaryx_v2_cwv_samples WHERE observed_at < ?"
    ).bind(cutoff).run();
    return {
      ok:true,status:200,deleted:Number(before?.count||0),cutoff,policy
    };
  }catch{
    return {ok:false,status:503,reason:"cwv-retention-storage-unavailable",policy};
  }
}
