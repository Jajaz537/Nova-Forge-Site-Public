import {cwvRating} from "./cwv-rum.mjs";

const METRICS=["LCP","INP","CLS"];

export function nearestRankPercentile(values, percentile=0.75){
  const clean=(Array.isArray(values)?values:[])
    .filter(value=>typeof value==="number"&&Number.isFinite(value)&&value>=0)
    .sort((a,b)=>a-b);
  if(clean.length===0) return null;
  const p=Math.max(0,Math.min(1,Number(percentile)));
  const rank=Math.max(1,Math.ceil(p*clean.length));
  return clean[rank-1];
}

export function buildCwvP75Report(rows,{candidateSampleTarget=75}={}){
  const target=Math.max(1,Math.trunc(Number(candidateSampleTarget)||75));
  const metrics={};
  for(const name of METRICS){
    const values=(Array.isArray(rows)?rows:[])
      .filter(row=>row?.metric_name===name)
      .map(row=>Number(row.metric_value))
      .filter(value=>Number.isFinite(value)&&value>=0);
    const p75=nearestRankPercentile(values,0.75);
    metrics[name]={
      sampleCount:values.length,
      candidateSampleTarget:target,
      candidateSampleTargetMet:values.length>=target,
      p75,
      rating:p75===null?null:cwvRating(name,p75)
    };
  }

  const routeClasses=[...new Set((rows||[]).map(row=>row?.route_class).filter(value=>typeof value==="string"&&value))].sort();
  const viewportClasses=[...new Set((rows||[]).map(row=>row?.viewport_class).filter(value=>typeof value==="string"&&value))].sort();
  const allTargetsMet=METRICS.every(name=>metrics[name].candidateSampleTargetMet);

  return {
    schemaVersion:1,
    method:"NEAREST_RANK_P75",
    metrics,
    dimensions:{
      routeClassCount:routeClasses.length,
      viewportClassCount:viewportClasses.length
    },
    candidateSampleTargetsMet:allTargetsMet,
    fieldEvidenceState:allTargetsMet
      ?"SAMPLE_TARGET_MET_EXTERNAL_PRODUCTION_PROOF_STILL_REQUIRED"
      :"INSUFFICIENT_SAMPLES",
    blockerClosed:false
  };
}
