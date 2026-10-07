import {useEffect, useRef} from "react";

const SCRIPT_ID="modaryx-turnstile-explicit";
const SCRIPT_SRC="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loaderPromise=null;

function waitForApi(){
  return new Promise((resolve,reject)=>{
    let attempts=0;
    const tick=()=>{
      if(globalThis.turnstile?.render){
        resolve(globalThis.turnstile);
        return;
      }
      attempts+=1;
      if(attempts>200){
        reject(new Error("turnstile-api-timeout"));
        return;
      }
      setTimeout(tick,25);
    };
    tick();
  });
}

function loadTurnstile(){
  if(globalThis.turnstile?.render) return Promise.resolve(globalThis.turnstile);
  if(loaderPromise) return loaderPromise;
  loaderPromise=new Promise((resolve,reject)=>{
    const existing=document.getElementById(SCRIPT_ID);
    if(existing){
      waitForApi().then(resolve,reject);
      return;
    }
    const script=document.createElement("script");
    script.id=SCRIPT_ID;
    script.src=SCRIPT_SRC;
    script.async=true;
    script.defer=true;
    script.addEventListener("load",()=>waitForApi().then(resolve,reject),{once:true});
    script.addEventListener("error",()=>reject(new Error("turnstile-script-failed")),{once:true});
    document.head.appendChild(script);
  }).catch(error=>{
    loaderPromise=null;
    throw error;
  });
  return loaderPromise;
}

export function TurnstileWidget({siteKey,action,onToken,resetKey=0}){
  const containerRef=useRef(null);
  const onTokenRef=useRef(onToken);
  onTokenRef.current=onToken;

  useEffect(()=>{
    let disposed=false;
    let api=null;
    let widgetId=null;
    onTokenRef.current?.("");

    if(!siteKey||!containerRef.current) return undefined;

    loadTurnstile().then(turnstile=>{
      if(disposed||!containerRef.current) return;
      api=turnstile;
      widgetId=turnstile.render(containerRef.current,{
        sitekey:siteKey,
        action,
        theme:"dark",
        language:"fr",
        size:"flexible",
        appearance:"interaction-only",
        callback(token){
          if(!disposed) onTokenRef.current?.(token||"");
        },
        "expired-callback"(){
          if(!disposed) onTokenRef.current?.("");
        },
        "timeout-callback"(){
          if(!disposed) onTokenRef.current?.("");
        },
        "error-callback"(){
          if(!disposed) onTokenRef.current?.("");
        }
      });
    }).catch(()=>{
      if(!disposed) onTokenRef.current?.("");
    });

    return ()=>{
      disposed=true;
      onTokenRef.current?.("");
      if(api&&widgetId!==null&&widgetId!==undefined){
        try{api.remove(widgetId);}catch{}
      }
    };
  },[siteKey,action,resetKey]);

  return <div className="turnstile-shell">
    <div ref={containerRef} className="turnstile-slot" aria-label="Vérification anti-abus Cloudflare Turnstile" />
  </div>;
}
