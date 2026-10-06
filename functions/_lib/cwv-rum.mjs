const METRICS=new Set(["LCP","INP","CLS"]);
const ROUTES=new Set([
  "ROOT","DISCOVER","GAMES","GAME_HUB","MODS","CONTENT_DETAIL","SEARCH","COLLECTIONS","CREATORS",
  "COMMUNITY","STUDIO","LIBRARY","ACCOUNT","NOTIFICATIONS","RIGHTS","AI","TRUST","HELP","MODERATION","OTHER"
]);
const VIEWPORTS=new Set(["mobile","tablet","desktop","unknown"]);
const NAV_TYPES=new Set(["navigate","reload","back_forward","prerender","unknown"]);

export function cwvRating(name,value){
  if(name==="LCP") return value<=2500?"good":value<=4000?"needs-improvement":"poor";
  if(name==="INP") return value<=200?"good":value<=500?"needs-improvement":"poor";
  if(name==="CLS") return value<=0.1?"good":value<=0.25?"needs-improvement":"poor";
  return null;
}

export function validateCwvBatch(input){
  if(!input||typeof input!=="object"||Array.isArray(input)) return {ok:false,reason:"cwv-payload-invalid"};
  const allowed=new Set(["schemaVersion","pageViewId","routeClass","viewportClass","navigationType","metrics"]);
  if(Object.keys(input).some(key=>!allowed.has(key))) return {ok:false,reason:"cwv-field-forbidden"};
  if(input.schemaVersion!==1) return {ok:false,reason:"cwv-schema-invalid"};
  if(typeof input.pageViewId!=="string"||!/^[a-f0-9]{32}$/.test(input.pageViewId)) return {ok:false,reason:"cwv-page-view-invalid"};
  if(!ROUTES.has(input.routeClass)) return {ok:false,reason:"cwv-route-invalid"};
  if(!VIEWPORTS.has(input.viewportClass)) return {ok:false,reason:"cwv-viewport-invalid"};
  if(!NAV_TYPES.has(input.navigationType)) return {ok:false,reason:"cwv-navigation-invalid"};
  if(!Array.isArray(input.metrics)||input.metrics.length<1||input.metrics.length>3) return {ok:false,reason:"cwv-metrics-invalid"};
  const names=new Set();
  const metrics=[];
  for(const item of input.metrics){
    if(!item||typeof item!=="object"||Array.isArray(item)) return {ok:false,reason:"cwv-metric-invalid"};
    if(Object.keys(item).some(key=>!["name","value"].includes(key))) return {ok:false,reason:"cwv-metric-field-forbidden"};
    if(!METRICS.has(item.name)||names.has(item.name)) return {ok:false,reason:"cwv-metric-name-invalid"};
    if(typeof item.value!=="number"||!Number.isFinite(item.value)||item.value<0) return {ok:false,reason:"cwv-metric-value-invalid"};
    const max=item.name==="CLS"?10:60000;
    if(item.value>max) return {ok:false,reason:"cwv-metric-value-invalid"};
    names.add(item.name);
    metrics.push({name:item.name,value:item.value,rating:cwvRating(item.name,item.value)});
  }
  return {ok:true,value:{
    pageViewId:input.pageViewId,
    routeClass:input.routeClass,
    viewportClass:input.viewportClass,
    navigationType:input.navigationType,
    metrics
  }};
}

export function cwvRumReadiness(env={}){
  const d1=Boolean(env.MODARYX_DB&&typeof env.MODARYX_DB.prepare==="function");
  const explicitlyEnabled=String(env.MODARYX_CWV_RUM_ENABLED||"")==="1";
  return {
    schemaVersion:1,
    enabled:explicitlyEnabled&&d1,
    explicitlyEnabled,
    storageReady:d1,
    state:explicitlyEnabled?(d1?"READY_FOR_FIELD_TRAFFIC":"STORAGE_MISSING"):"DISABLED",
    fieldEvidence:"OPEN_TRAFFIC_AND_P75_REQUIRED",
    privacy:{
      accountIdentityStored:false,
      ipStored:false,
      userAgentStored:false,
      rawUrlStored:false,
      queryStored:false,
      referrerStored:false
    }
  };
}

export async function storeCwvBatch(env,input,{now=new Date()}={}){
  const readiness=cwvRumReadiness(env);
  if(!readiness.enabled) return {ok:false,status:503,reason:"cwv-rum-disabled",readiness};
  const validated=validateCwvBatch(input);
  if(!validated.ok) return {ok:false,status:400,reason:validated.reason,readiness};
  const v=validated.value;
  const observedAt=now.toISOString();
  try{
    for(const metric of v.metrics){
      const sampleId="mx_cwv_"+crypto.randomUUID().replaceAll("-","");
      await env.MODARYX_DB.prepare(
        `INSERT OR IGNORE INTO modaryx_v2_cwv_samples (
          sample_id,page_view_id,metric_name,metric_value,rating,route_class,viewport_class,navigation_type,observed_at,created_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?)`
      ).bind(
        sampleId,v.pageViewId,metric.name,metric.value,metric.rating,v.routeClass,v.viewportClass,v.navigationType,observedAt,observedAt
      ).run();
    }
    return {ok:true,status:202,accepted:v.metrics.length,readiness};
  }catch{
    return {ok:false,status:503,reason:"cwv-storage-unavailable",readiness};
  }
}
