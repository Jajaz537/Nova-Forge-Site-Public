const ROUTE_RULES=[
  [/^\/$/,"ROOT"],[/^\/discover$/,"DISCOVER"],[/^\/games$/,"GAMES"],[/^\/games\/aetherlands$/,"GAME_HUB"],
  [/^\/mods$/,"MODS"],[/^\/content\//,"CONTENT_DETAIL"],[/^\/search$/,"SEARCH"],[/^\/collections$/,"COLLECTIONS"],
  [/^\/creators$/,"CREATORS"],[/^\/community$/,"COMMUNITY"],[/^\/studio$/,"STUDIO"],[/^\/library$/,"LIBRARY"],
  [/^\/account$/,"ACCOUNT"],[/^\/notifications$/,"NOTIFICATIONS"],[/^\/rights$/,"RIGHTS"],[/^\/ai$/,"AI"],
  [/^\/trust$/,"TRUST"],[/^\/help$/,"HELP"],[/^\/moderation$/,"MODERATION"]
];

export function cwvRouteClass(pathname){
  const path=typeof pathname==="string"?pathname:"";
  return ROUTE_RULES.find(([pattern])=>pattern.test(path))?.[1]||"OTHER";
}

export function cwvViewportClass(width){
  if(!Number.isFinite(width)||width<=0) return "unknown";
  if(width<=640) return "mobile";
  if(width<=1024) return "tablet";
  return "desktop";
}

export function selectInpValue(interactions,interactionCount){
  const values=[...interactions.values()].filter(Number.isFinite).sort((a,b)=>b-a);
  if(values.length===0) return null;
  const count=Number.isFinite(interactionCount)&&interactionCount>0?interactionCount:values.length;
  const index=Math.min(values.length-1,Math.floor(count/50));
  return values[index];
}

function randomPageViewId(win){
  try{return win.crypto.randomUUID().replaceAll("-","").toLowerCase();}
  catch{
    const bytes=new Uint8Array(16);
    win.crypto.getRandomValues(bytes);
    return [...bytes].map(x=>x.toString(16).padStart(2,"0")).join("");
  }
}

function navigationType(win){
  const type=win.performance?.getEntriesByType?.("navigation")?.[0]?.type;
  return ["navigate","reload","back_forward","prerender"].includes(type)?type:"unknown";
}

export function startFieldCwvCollection({
  enabled=false,
  win=globalThis.window,
  doc=globalThis.document,
  endpoint="/api/v1/rum/cwv"
}={}){
  if(!enabled) return {state:"DISABLED",stop(){}};
  if(!win||!doc||typeof win.PerformanceObserver!=="function") return {state:"UNSUPPORTED",stop(){}};
  if(win.navigator?.doNotTrack==="1"||win.navigator?.globalPrivacyControl===true) return {state:"PRIVACY_OPT_OUT",stop(){}};

  const pageViewId=randomPageViewId(win);
  const interactions=new Map();
  let lcp=null,cls=0,sent=false;
  const observers=[];
  const supported=new Set(win.PerformanceObserver.supportedEntryTypes||[]);

  const observe=(type,callback,options={type,buffered:true})=>{
    if(!supported.has(type)) return;
    try{
      const observer=new win.PerformanceObserver(list=>callback(list.getEntries()));
      observer.observe(options);
      observers.push(observer);
    }catch{}
  };

  observe("largest-contentful-paint",entries=>{
    for(const entry of entries) lcp=Math.max(lcp??0,entry.startTime||0);
  });
  observe("layout-shift",entries=>{
    for(const entry of entries) if(!entry.hadRecentInput&&Number.isFinite(entry.value)) cls+=entry.value;
  });
  observe("event",entries=>{
    for(const entry of entries){
      const id=Number(entry.interactionId||0);
      const duration=Number(entry.duration||0);
      if(id>0&&Number.isFinite(duration)) interactions.set(id,Math.max(interactions.get(id)||0,duration));
    }
  },{type:"event",buffered:true,durationThreshold:40});

  const payload=()=>{
    const metrics=[];
    if(Number.isFinite(lcp)&&lcp!==null&&lcp>0) metrics.push({name:"LCP",value:lcp});
    const inp=selectInpValue(interactions,Number(win.performance?.interactionCount||0));
    if(Number.isFinite(inp)&&inp!==null) metrics.push({name:"INP",value:inp});
    if(Number.isFinite(cls)) metrics.push({name:"CLS",value:cls});
    return {
      schemaVersion:1,
      pageViewId,
      routeClass:cwvRouteClass(win.location?.pathname||"/"),
      viewportClass:cwvViewportClass(Number(win.innerWidth||0)),
      navigationType:navigationType(win),
      metrics
    };
  };

  const flush=()=>{
    if(sent) return;
    const body=payload();
    if(body.metrics.length===0) return;
    sent=true;
    const json=JSON.stringify(body);
    try{
      if(typeof win.navigator?.sendBeacon==="function"){
        const queued=win.navigator.sendBeacon(endpoint,new Blob([json],{type:"application/json"}));
        if(queued) return;
      }
    }catch{}
    try{
      void win.fetch(endpoint,{
        method:"POST",credentials:"omit",cache:"no-store",keepalive:true,
        headers:{"content-type":"application/json"},body:json
      }).catch(()=>{});
    }catch{}
  };

  const onVisibility=()=>{if(doc.visibilityState==="hidden") flush();};
  doc.addEventListener("visibilitychange",onVisibility,{passive:true});
  win.addEventListener("pagehide",flush,{passive:true,once:true});

  return {
    state:"ACTIVE_CANDIDATE",
    stop(){
      observers.forEach(observer=>{try{observer.disconnect()}catch{}});
      doc.removeEventListener("visibilitychange",onVisibility);
      win.removeEventListener("pagehide",flush);
    },
    flush
  };
}
