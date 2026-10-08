import {useEffect,useRef,useState} from "react";
import {authLoginUrl,createGameSupportRequest,getBackendStatus,getGameSupportRequests,resolveAccountRemoteState} from "../api/modaryx-api.js";

let turnstileScriptPromise=null;

function loadTurnstileClient(){
  if(typeof window==="undefined") return Promise.reject(new Error("window-unavailable"));
  if(window.turnstile) return Promise.resolve(window.turnstile);
  if(turnstileScriptPromise) return turnstileScriptPromise;
  turnstileScriptPromise=new Promise((resolve,reject)=>{
    const existing=document.querySelector('script[data-modaryx-turnstile="1"]');
    const finish=()=>{
      if(window.turnstile) resolve(window.turnstile);
      else reject(new Error("turnstile-client-unavailable"));
    };
    if(existing){
      existing.addEventListener("load",finish,{once:true});
      existing.addEventListener("error",()=>reject(new Error("turnstile-client-load-failed")),{once:true});
      setTimeout(()=>{if(window.turnstile) resolve(window.turnstile);},0);
      return;
    }
    const script=document.createElement("script");
    script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async=true;
    script.defer=true;
    script.dataset.modaryxTurnstile="1";
    script.addEventListener("load",finish,{once:true});
    script.addEventListener("error",()=>reject(new Error("turnstile-client-load-failed")),{once:true});
    document.head.appendChild(script);
  });
  return turnstileScriptPromise;
}

function TurnstileChallenge({siteKey,action,onToken,resetKey}){
  const hostRef=useRef(null);
  const widgetRef=useRef(null);
  const tokenCallback=useRef(onToken);
  const [state,setState]=useState(siteKey?"LOADING":"UNAVAILABLE");
  tokenCallback.current=onToken;

  useEffect(()=>{
    if(!siteKey||!hostRef.current){
      setState("UNAVAILABLE");
      tokenCallback.current("");
      return;
    }
    let cancelled=false;
    setState("LOADING");
    tokenCallback.current("");
    loadTurnstileClient().then(api=>{
      if(cancelled||!hostRef.current) return;
      widgetRef.current=api.render(hostRef.current,{
        sitekey:siteKey,
        action,
        theme:"dark",
        callback:(token)=>{setState("VERIFIED");tokenCallback.current(token);},
        "expired-callback":()=>{setState("EXPIRED");tokenCallback.current("");},
        "error-callback":()=>{setState("ERROR");tokenCallback.current("");return true;}
      });
    }).catch(()=>{
      if(cancelled) return;
      setState("ERROR");
      tokenCallback.current("");
    });
    return ()=>{
      cancelled=true;
      if(widgetRef.current!==null&&window.turnstile){
        try{window.turnstile.remove(widgetRef.current);}catch{}
      }
      widgetRef.current=null;
    };
  },[siteKey,action,resetKey]);

  return <div className="game-request-turnstile">
    <div ref={hostRef} aria-label="Vérification anti-abus Cloudflare Turnstile"/>
    <small>{state==="VERIFIED"?"Vérification anti-abus validée.":state==="LOADING"?"Chargement de la vérification anti-abus…":state==="EXPIRED"?"Vérification expirée — recommencez.":state==="ERROR"?"Vérification anti-abus indisponible.":"Vérification anti-abus non configurée."}</small>
  </div>;
}

export default function GameSupportRequestPanel(){
  const [requestOpen,setRequestOpen]=useState(false);
  const [requestName,setRequestName]=useState("");
  const [requestPlatform,setRequestPlatform]=useState("PC");
  const [requestError,setRequestError]=useState("");
  const [requestDraft,setRequestDraft]=useState(false);
  const [turnstileToken,setTurnstileToken]=useState("");
  const [challengeKey,setChallengeKey]=useState(0);
  const [submitState,setSubmitState]=useState({state:"IDLE",item:null,message:""});
  const [supportRemote,setSupportRemote]=useState({
    accountState:"LOADING",loginAvailable:false,remoteWritesReady:false,siteKey:null,
    historyState:"IDLE",items:[]
  });

  useEffect(()=>{
    let cancelled=false;
    Promise.all([resolveAccountRemoteState(),getBackendStatus()]).then(async([account,status])=>{
      if(cancelled) return;
      const next={
        accountState:account.state,
        loginAvailable:Boolean(account.loginAvailable),
        remoteWritesReady:Boolean(status.ok&&status.body?.remoteWritesReady===true),
        siteKey:status.ok&&typeof status.body?.turnstile?.publicSiteKey==="string"?status.body.turnstile.publicSiteKey:null,
        historyState:"IDLE",items:[]
      };
      setSupportRemote(next);
      if(account.state!=="AUTHENTICATED") return;
      setSupportRemote(current=>({...current,historyState:"LOADING"}));
      const history=await getGameSupportRequests({timeoutMs:5000});
      if(cancelled) return;
      if(!history.ok){
        setSupportRemote(current=>({...current,historyState:"UNAVAILABLE",items:[]}));
        return;
      }
      setSupportRemote(current=>({...current,historyState:"READY",items:Array.isArray(history.body?.items)?history.body.items:[]}));
    }).catch(()=>{
      if(!cancelled)setSupportRemote(current=>({...current,accountState:"BACKEND_UNAVAILABLE",historyState:"UNAVAILABLE"}));
    });
    return ()=>{cancelled=true;};
  },[]);

  const validateRequestName=()=>{
    if(requestName.trim()) return true;
    setRequestError("Saisissez un nom de jeu avant de préparer la demande.");
    setRequestDraft(false);
    requestAnimationFrame(()=>document.getElementById("game-support-name")?.focus());
    return false;
  };
  const prepareSupportRequest=()=>{
    if(!validateRequestName()) return;
    setRequestError("");
    setRequestDraft(true);
    setSubmitState({state:"IDLE",item:null,message:""});
  };
  const submitRealSupportRequest=async()=>{
    if(!validateRequestName()) return;
    if(supportRemote.accountState!=="AUTHENTICATED"){
      setSubmitState({state:"ERROR",item:null,message:"Connexion requise avant tout envoi réel."});
      return;
    }
    if(!supportRemote.remoteWritesReady||!supportRemote.siteKey){
      setSubmitState({state:"ERROR",item:null,message:"Canal d’écriture réel indisponible sur cet environnement."});
      return;
    }
    if(!turnstileToken){
      setSubmitState({state:"ERROR",item:null,message:"Validez d’abord la vérification anti-abus."});
      return;
    }
    setSubmitState({state:"SUBMITTING",item:null,message:"Envoi de la demande…"});
    const result=await createGameSupportRequest({
      gameName:requestName.trim(),platforms:[requestPlatform],reason:"",sourceUrls:[],turnstileToken
    },{timeoutMs:8000});
    if(!result.ok){
      const reason=result.body?.error;
      const message=result.status===409&&reason==="game-support-duplicate-active"
        ?"Une demande active existe déjà pour ce jeu."
        :result.status===503?"Le stockage V2 des demandes n’est pas encore disponible sur cet environnement."
        :result.status===401?"Votre session a expiré. Reconnectez-vous avant de renvoyer."
        :result.status===403?"La vérification anti-abus ou l’origine a été refusée. Recommencez la vérification."
        :"La demande réelle n’a pas été enregistrée. Aucun envoi n’est simulé.";
      setSubmitState({state:"ERROR",item:null,message});
      setTurnstileToken("");
      setChallengeKey(value=>value+1);
      return;
    }
    const item=result.body?.item||null;
    setSubmitState({state:"SUCCESS",item,message:"Demande enregistrée pour triage MODARYX."});
    setSupportRemote(current=>({...current,historyState:"READY",items:item?[item,...current.items.filter(x=>x.requestId!==item.requestId)]:current.items}));
    setRequestDraft(false);
    setTurnstileToken("");
    setChallengeKey(value=>value+1);
  };

  const canSubmitReal=supportRemote.accountState==="AUTHENTICATED"&&supportRemote.remoteWritesReady&&Boolean(supportRemote.siteKey);
  return <section className="game-support-request">
    <div><span className="kicker">Jeu absent ?</span><h2>Demander le support d’un jeu</h2><p>Une demande membre passe toujours par le triage MODARYX avant tout ajout. Aucune demande n’est envoyée automatiquement à un éditeur. Une acceptation crée seulement une baseline MODARYX sûre ; elle ne vaut jamais autorisation éditeur.</p></div>
    <button className="quiet" aria-expanded={requestOpen} onClick={()=>{setRequestOpen(v=>!v);setRequestError("");setSubmitState({state:"IDLE",item:null,message:""});}}>{requestOpen?"Fermer":"Demander le support d’un jeu"}</button>
    {requestOpen&&<div className="game-request-form">
      <label><span>Nom du jeu</span><input id="game-support-name" value={requestName} aria-invalid={requestError?"true":undefined} aria-describedby={requestError?"game-support-name-error":undefined} onChange={e=>{setRequestName(e.target.value);setRequestError("");setRequestDraft(false);setSubmitState({state:"IDLE",item:null,message:""});}} placeholder="Ex. Project Meridian" aria-label="Nom du jeu à demander"/></label>
      <label><span>Plateforme principale</span><select id="game-support-platform" value={requestPlatform} onChange={e=>setRequestPlatform(e.target.value)}><option>PC</option><option>PlayStation</option><option>Xbox</option><option>Nintendo</option><option>Autre</option></select></label>
      <button className="primary" onClick={prepareSupportRequest}>Préparer la demande locale</button>
      {requestError&&<div id="game-support-name-error" className="form-error" role="alert">{requestError}</div>}
      {requestDraft&&<div className="game-request-status" role="status"><strong>Brouillon de demande — non envoyé</strong><span>{requestName.trim()} · {requestPlatform}</span><small>Triage MODARYX requis. Aucun Rights Case réel n’est créé par ce brouillon local. Le brouillon reste local.</small></div>}
      {supportRemote.accountState==="LOADING"&&<p className="settings-note">Vérification du canal d’envoi réel…</p>}
      {supportRemote.accountState==="GUEST"&&<div className="game-request-status"><strong>Envoi réel disponible après connexion</strong><span>Le brouillon local reste privé dans cette page.</span><button className="primary" onClick={()=>window.location.assign(authLoginUrl("/games"))} disabled={!supportRemote.loginAvailable}>Se connecter pour envoyer</button></div>}
      {supportRemote.accountState==="BACKEND_UNAVAILABLE"&&<div className="unavailable-state"><strong>Envoi serveur indisponible</strong><span>Le formulaire reste en brouillon local ; aucune demande distante n’est inventée.</span></div>}
      {supportRemote.accountState==="AUTHENTICATED"&&!canSubmitReal&&<div className="unavailable-state"><strong>Écriture réelle indisponible</strong><span>D1/Auth/Turnstile doivent être réellement configurés avant l’envoi.</span></div>}
      {canSubmitReal&&<>
        <TurnstileChallenge key={challengeKey} resetKey={challengeKey} siteKey={supportRemote.siteKey} action="game-support-request" onToken={setTurnstileToken}/>
        <button className="primary" onClick={submitRealSupportRequest} disabled={!turnstileToken||submitState.state==="SUBMITTING"}>{submitState.state==="SUBMITTING"?"Envoi…":"Envoyer la demande pour triage"}</button>
      </>}
      {submitState.state==="ERROR"&&<div className="form-error" role="alert">{submitState.message}</div>}
      {submitState.state==="SUCCESS"&&<div className="game-request-status" role="status"><strong>Demande réelle enregistrée</strong><span>{submitState.item?.gameName||requestName} · {submitState.item?.state||"REQUESTED"}</span><small>Elle reste sans permission éditeur tant qu’aucun scope vérifié n’existe.</small></div>}
      {supportRemote.accountState==="AUTHENTICATED"&&supportRemote.historyState==="READY"&&supportRemote.items.length>0&&<div className="data-list" aria-label="Mes demandes de support réelles">{supportRemote.items.slice(0,5).map(item=><div key={item.requestId}><strong>{item.gameName}</strong><span>{item.state}</span></div>)}</div>}
      {supportRemote.accountState==="AUTHENTICATED"&&supportRemote.historyState==="UNAVAILABLE"&&<small>Historique des demandes indisponible sur cet environnement ; aucune ligne fictive n’est affichée.</small>}
    </div>}
  </section>;
}
