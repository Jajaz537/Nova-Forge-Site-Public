import {useCallback, useEffect, useState} from "react";
import {getBackendStatus,getProfile,saveProfile} from "../api/modaryx-api.js";
import {TurnstileWidget} from "./TurnstileWidget.jsx";
import "../profile-editor.css";

const blankProfile=()=>({
  handle:"",
  displayName:"",
  bio:"",
  visibility:"private",
  creator:{isCreator:false},
  links:[]
});

function profileForm(profile,sessionProfile){
  if(profile) return {
    handle:profile.handle||"",
    displayName:profile.displayName||"",
    bio:profile.bio||"",
    visibility:profile.visibility||"private",
    creator:{
      isCreator:Boolean(profile.creator?.isCreator),
      ...(profile.creator?.displayLabel?{displayLabel:profile.creator.displayLabel}:{})
    },
    links:Array.isArray(profile.links)?profile.links:[]
  };
  const empty=blankProfile();
  if(sessionProfile?.handle) empty.handle=sessionProfile.handle;
  if(sessionProfile?.displayName) empty.displayName=sessionProfile.displayName;
  return empty;
}

function validate(form){
  if(!/^[a-z0-9][a-z0-9._-]{2,31}$/.test(form.handle)) return "Le handle doit contenir 3 à 32 caractères : lettres minuscules, chiffres, point, tiret ou underscore.";
  if(!form.displayName.trim()||form.displayName.trim().length>80) return "Le nom affiché doit contenir entre 1 et 80 caractères.";
  if(form.bio.length>500) return "La bio est limitée à 500 caractères.";
  if(!["public","unlisted","private"].includes(form.visibility)) return "Visibilité invalide.";
  return null;
}

export function RemoteProfileEditor({sessionProfile,onSaved}){
  const [state,setState]=useState("LOADING");
  const [siteKey,setSiteKey]=useState("");
  const [form,setForm]=useState(blankProfile);
  const [turnstileToken,setTurnstileToken]=useState("");
  const [turnstileResetKey,setTurnstileResetKey]=useState(0);
  const [message,setMessage]=useState("");

  const handleToken=useCallback(token=>setTurnstileToken(token||""),[]);

  const load=useCallback(async()=>{
    setState("LOADING");
    setMessage("");
    const [status,profile]=await Promise.all([getBackendStatus({timeoutMs:5000}),getProfile({timeoutMs:5000})]);
    const key=status.ok&&typeof status.body?.turnstile?.publicSiteKey==="string"
      ? status.body.turnstile.publicSiteKey.trim()
      : "";
    if(!status.ok||!key){
      setState("UNAVAILABLE");
      setMessage("Turnstile ou le backend distant n’est pas disponible.");
      return;
    }
    setSiteKey(key);
    if(profile.ok){
      setForm(profileForm(profile.body,sessionProfile));
      setState("READY");
      return;
    }
    if(profile.status===404){
      setForm(profileForm(null,sessionProfile));
      setState("READY");
      return;
    }
    setState("UNAVAILABLE");
    setMessage("Le profil distant n’a pas pu être chargé.");
  },[sessionProfile]);

  useEffect(()=>{void load();},[load]);

  const update=(field,value)=>setForm(current=>({...current,[field]:value}));

  const submit=async event=>{
    event.preventDefault();
    const problem=validate(form);
    if(problem){
      setMessage(problem);
      return;
    }
    if(!turnstileToken){
      setMessage("Terminez la vérification Turnstile avant l’enregistrement.");
      return;
    }
    setState("SAVING");
    setMessage("Enregistrement distant…");
    const payload={
      handle:form.handle.trim().toLowerCase(),
      displayName:form.displayName.trim(),
      bio:form.bio,
      visibility:form.visibility,
      creator:form.creator,
      links:form.links,
      turnstileToken
    };
    const result=await saveProfile(payload,{timeoutMs:12000});
    setTurnstileToken("");
    setTurnstileResetKey(value=>value+1);
    if(!result.ok){
      setState("READY");
      const reason=result.body?.error||result.state||"profile-write-failed";
      setMessage("Enregistrement refusé : "+reason+".");
      return;
    }
    setForm(profileForm(result.body,sessionProfile));
    setState("READY");
    setMessage("Profil enregistré. La trace owner-history peut maintenant être vérifiée dans « Données locales ».");
    await onSaved?.(result.body);
  };

  if(state==="LOADING") return <div className="remote-profile-state" role="status">Chargement du profil distant…</div>;
  if(state==="UNAVAILABLE") return <div className="remote-profile-state error" role="status">{message||"Édition distante indisponible."}</div>;

  return <form className="remote-profile-editor" onSubmit={submit}>
    <div className="remote-profile-grid">
      <label>
        <span>Handle</span>
        <input
          value={form.handle}
          onChange={event=>update("handle",event.target.value.toLowerCase())}
          autoComplete="username"
          maxLength={32}
          pattern="[a-z0-9][a-z0-9._-]{2,31}"
          required
        />
      </label>
      <label>
        <span>Nom affiché</span>
        <input
          value={form.displayName}
          onChange={event=>update("displayName",event.target.value)}
          autoComplete="name"
          maxLength={80}
          required
        />
      </label>
      <label className="remote-profile-wide">
        <span>Bio</span>
        <textarea
          value={form.bio}
          onChange={event=>update("bio",event.target.value)}
          maxLength={500}
          rows={4}
        />
        <small>{form.bio.length}/500</small>
      </label>
      <label>
        <span>Visibilité</span>
        <select value={form.visibility} onChange={event=>update("visibility",event.target.value)}>
          <option value="private">Privé</option>
          <option value="unlisted">Non listé</option>
          <option value="public">Public</option>
        </select>
      </label>
    </div>
    <div className="remote-profile-security">
      <div>
        <strong>Vérification anti-abus</strong>
        <span>Le jeton Turnstile est à usage unique et n’est jamais stocké par MODARYX.</span>
      </div>
      <TurnstileWidget
        key={turnstileResetKey}
        siteKey={siteKey}
        action="profile-write"
        onToken={handleToken}
        resetKey={turnstileResetKey}
      />
    </div>
    <div className="remote-profile-actions">
      <button className="primary" type="submit" disabled={state==="SAVING"||!turnstileToken}>
        {state==="SAVING"?"Enregistrement…":"Enregistrer le profil"}
      </button>
      <button className="quiet" type="button" disabled={state==="SAVING"} onClick={()=>void load()}>
        Recharger
      </button>
    </div>
    {message&&<p className="remote-profile-message" role="status">{message}</p>}
  </form>;
}
