import {json} from "../../../../_lib/api-security.mjs";
import {getSessionIdentity} from "../../../../_lib/auth-session.mjs";
import {ADMIN_CONSOLE_PERMISSION,hasPermission} from "../../../../_lib/access-control.mjs";
import {buildCwvP75Report} from "../../../../_lib/cwv-rum-report.mjs";

const clampInt=(value,fallback,min,max)=>{
  const n=Number(value);
  if(!Number.isFinite(n)) return fallback;
  return Math.max(min,Math.min(max,Math.trunc(n)));
};

export async function onRequestGet(context){
  const db=context.env?.MODARYX_DB;
  if(!db||typeof db.prepare!=="function") return json({error:"d1-binding-missing"},503);

  const identity=await getSessionIdentity(context.request,db);
  if(!identity) return json({error:"authentication-required"},401);
  if(!hasPermission(identity,ADMIN_CONSOLE_PERMISSION)) return json({error:"administration-permission-required"},403);

  const url=new URL(context.request.url);
  const windowDays=clampInt(url.searchParams.get("days"),28,7,90);
  const candidateSampleTarget=clampInt(url.searchParams.get("target"),75,20,10000);
  const now=new Date();
  const from=new Date(now.getTime()-windowDays*24*60*60*1000).toISOString();

  try{
    const result=await db.prepare(
      `SELECT metric_name,metric_value,route_class,viewport_class,observed_at
       FROM modaryx_v2_cwv_samples
       WHERE observed_at >= ?
       ORDER BY observed_at ASC`
    ).bind(from).all();

    const report=buildCwvP75Report(result?.results||[],{candidateSampleTarget});
    return json({
      ...report,
      window:{days:windowDays,from,to:now.toISOString()},
      fieldEvidence:"OPEN_PRODUCTION_TRAFFIC_RETENTION_AND_ORIGIN_PROOF_REQUIRED",
      note:"Candidate aggregation only. This endpoint never closes the production CWV blocker by itself."
    });
  }catch{
    return json({error:"cwv-report-storage-unavailable"},503);
  }
}
