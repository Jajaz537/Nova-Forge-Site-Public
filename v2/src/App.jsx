import { useEffect, useMemo, useRef, useState } from "react";
import "./canon-topbar.css";
import { contentPath, pathForActive, routeStateFromPath } from "./routes.js";
import { authLoginUrl, getDataHistory, getNotifications, getProviderRegistry, logoutAccountSession, markNotificationRead, resolveAccountRemoteState } from "./api/modaryx-api.js";
import { resolveAmbientContext } from "./api/local-context.js";
import {
  ArrowRight, Bell, BookOpen, Check, FunnelSimple, GameController, GridFour,
  List, MagnifyingGlass, Plus, SlidersHorizontal, Stack, UsersThree, X
} from "@phosphor-icons/react";

const navItems = ["Découvrir", "Jeux", "Mods & contenus", "Collections", "Créateurs", "Communauté"];
const contentItems = [
  { slug: "sentiers-de-laube", title: "Sentiers de l’aube", kind: "Exploration", creator: "Atelier Boréal", pos: "0% 0%", tone: "cyan" },
  { slug: "vestiges-suspendus", title: "Vestiges suspendus", kind: "Environnements", creator: "Lueur Collective", pos: "50% 0%", tone: "violet" },
  { slug: "sommets-silencieux", title: "Sommets silencieux", kind: "Graphismes", creator: "Les Cartographes", pos: "100% 0%", tone: "cyan" },
  { slug: "rivages-du-couchant", title: "Rivages du couchant", kind: "Immersion", creator: "Atelier Boréal", pos: "0% 100%", tone: "violet" },
  { slug: "brumes-des-hautes-terres", title: "Brumes des hautes terres", kind: "Gameplay", creator: "Lueur Collective", pos: "50% 100%", tone: "cyan" },
  { slug: "le-pont-des-veilleurs", title: "Le pont des veilleurs", kind: "Quêtes", creator: "Les Cartographes", pos: "100% 100%", tone: "violet" },
];

const gameItems = [
  { title: "Aetherlands", status: "Catalogue consultable", detail: "Démonstration · version 1.4.2", pos: "0% 0%", atmosphere: "aetherlands", mood: "froid minéral · cyan / cobalt" },
  { title: "Rivenfall", status: "Aperçu disponible", detail: "Démonstration · contenu à venir", pos: "50% 0%", atmosphere: "rivenfall", mood: "forêt humide · teal / violet" },
  { title: "Solstice Frontier", status: "Catalogue vide", detail: "Démonstration · aucun contenu publié", pos: "100% 0%", atmosphere: "solstice", mood: "frontière solaire · ambre contrôlé / bleu nuit" },
];

const creatorItems = ["Atelier Boréal", "Lueur Collective", "Les Cartographes"];
const collectionItems = ["Exploration sereine", "Graphismes essentiels", "Immersion légère"];
const collectionDetails = [
  { title:"Exploration sereine", curator:"Atelier Boréal", game:"Aetherlands", version:"1.4.2", items:4, category:"Exploration", note:"Parcours, ambiance et confort visuel.", pos:"0% 0%" },
  { title:"Graphismes essentiels", curator:"Les Cartographes", game:"Aetherlands", version:"1.4.2", items:3, category:"Graphismes", note:"Sélection visuelle sobre pour cette version.", pos:"100% 0%" },
  { title:"Immersion légère", curator:"Lueur Collective", game:"Aetherlands", version:"1.4.x", items:3, category:"Immersion", note:"Petits ajouts d’ambiance sans pack installable.", pos:"0% 100%" },
];
const creatorDetails = [
  { name:"Atelier Boréal", role:"Créateur indépendant", focus:"Exploration & immersion", creations:["Sentiers de l’aube","Rivages du couchant"], pos:"0% 0%" },
  { name:"Lueur Collective", role:"Studio de démonstration", focus:"Environnements & gameplay", creations:["Vestiges suspendus","Brumes des hautes terres"], pos:"50% 0%" },
  { name:"Les Cartographes", role:"Équipe de démonstration", focus:"Graphismes & quêtes", creations:["Sommets silencieux","Le pont des veilleurs"], pos:"100% 0%" },
];


const rightsDemoCases = [
  {
    id:"aetherlands",
    game:"Aetherlands",
    publisher:"Éditeur fictif · démonstration",
    status:"APPROVED_WITH_LIMITS",
    summary:"Autorisation fictive partielle pour tester la lecture scope par scope.",
    response:"Réponse fictive archivée · aucune communication réelle",
    interpretation:{state:"SAFE_AUTOMATION",detail:"Réponse fictive explicite et partielle : seuls les scopes écrits peuvent être appliqués.",notification:"Notification admin fictive préparée · aucune notification réelle envoyée."},
    scopes:[
      ["Nom référentiel","Autorisé dans cette démonstration"],
      ["Logo officiel","Autorisé — exemple fictif"],
      ["Key art","Refusé — reste bloqué"],
      ["Hébergement de mods","Non demandé"],
      ["MODARYX Forge","En attente — droit séparé"],
    ],
  },
  {
    id:"rivenfall",
    game:"Rivenfall",
    publisher:"Studio fictif · démonstration",
    status:"AWAITING_RESPONSE",
    summary:"Demande fictive envoyée dans le scénario de test ; aucun droit supplémentaire activé.",
    response:"En attente — absence de réponse ≠ autorisation",
    scopes:[
      ["Nom référentiel","Baseline sûre uniquement"],
      ["Logo officiel","Bloqué"],
      ["Key art","Bloqué"],
      ["Hébergement de mods","Bloqué"],
      ["MODARYX Forge","Bloqué"],
    ],
  },
  {
    id:"solstice",
    game:"Solstice Frontier",
    publisher:"Éditeur fictif · démonstration",
    status:"NO_RESPONSE",
    summary:"Scénario de non-réponse : MODARYX conserve uniquement sa baseline originale.",
    response:"NO_RESPONSE ≠ autorisation",
    scopes:[
      ["Nom référentiel","Baseline sûre uniquement"],
      ["Logo officiel","Bloqué"],
      ["Key art","Bloqué"],
      ["Hébergement de mods","Bloqué"],
      ["MODARYX Forge","Bloqué"],
    ],
  },
];

function Logo({ onNavigate }) {
  return <a className="logo" href="/discover" aria-label="MODARYX — accueil" onClick={onNavigate?(event)=>{event.preventDefault();onNavigate("Découvrir");}:undefined}>MODARY<span>X</span></a>;
}

function Topbar({ active, onNavigate }) {
  const [open, setOpen] = useState(false);
  return <header className="topbar" id="top">
    <Logo onNavigate={onNavigate} />
    <button className="mobile-search" aria-label="Recherche globale" onClick={() => onNavigate("Recherche")}><MagnifyingGlass /></button>
    <button className="mobile-menu" aria-label="Ouvrir le menu" aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? <X /> : <List />}</button>
    <nav className={open ? "global-nav open" : "global-nav"} aria-label="Navigation principale">
      {navItems.map(item => <button key={item} aria-current={active===item?"page":undefined} className={active === item ? "active" : ""} onClick={() => { onNavigate(item); setOpen(false); }}>{item}</button>)}
      <button className={active==="Bibliothèque"?"mobile-nav-utility active":"mobile-nav-utility"} aria-current={active==="Bibliothèque"?"page":undefined} onClick={() => { onNavigate("Bibliothèque"); setOpen(false); }}><BookOpen />Bibliothèque</button>
      <button className={active==="Notifications"?"mobile-nav-utility active":"mobile-nav-utility"} aria-current={active==="Notifications"?"page":undefined} onClick={() => { onNavigate("Notifications"); setOpen(false); }}><Bell />Notifications</button>
      <button className={active==="Compte"?"mobile-nav-utility active":"mobile-nav-utility"} aria-current={active==="Compte"?"page":undefined} onClick={() => { onNavigate("Compte"); setOpen(false); }}><UsersThree />Compte</button>
      <button className={active==="MODARYX IA"?"mobile-nav-utility active":"mobile-nav-utility"} aria-current={active==="MODARYX IA"?"page":undefined} onClick={() => { onNavigate("MODARYX IA"); setOpen(false); }}><Stack />MODARYX IA</button>
    </nav>
    <div className="top-actions"><button aria-label="Recherche globale" aria-current={active==="Recherche"?"page":undefined} onClick={() => onNavigate("Recherche")}><MagnifyingGlass /></button><button className="demo-cta" type="button" onClick={() => onNavigate("Jeux")}>Démonstration</button><button className="desktop-utility" aria-label="Bibliothèque" aria-current={active==="Bibliothèque"?"page":undefined} onClick={() => onNavigate("Bibliothèque")}><BookOpen /></button><button className="desktop-utility" aria-label="Notifications" aria-current={active==="Notifications"?"page":undefined} onClick={() => onNavigate("Notifications")}><Bell /></button><button className="desktop-utility" aria-label="MODARYX IA" aria-current={active==="MODARYX IA"?"page":undefined} onClick={() => onNavigate("MODARYX IA")}><Stack /></button><button className="avatar" aria-label="Compte" aria-current={active==="Compte"?"page":undefined} onClick={() => onNavigate("Compte")}>M</button></div>
  </header>;
}

function Compatibility({ compact=false }) {
  return <span className={compact ? "compat compact" : "compat"}><Check weight="bold" />Compatible</span>;
}

function mediaPositionClass(pos){
  return ({
    "0% 0%":"media-pos-0-0",
    "50% 0%":"media-pos-50-0",
    "100% 0%":"media-pos-100-0",
    "0% 100%":"media-pos-0-100",
    "50% 100%":"media-pos-50-100",
    "100% 100%":"media-pos-100-100",
  })[pos] || "media-pos-0-0";
}

function Media({ pos, className="" }) {
  return <div className={`media ${mediaPositionClass(pos)} ${className}`} role="img" aria-label="Paysage de démonstration non contractuel" />;
}

function ContentCard({ item, dense=false, onOpen, headingLevel=3 }) {
  const Heading=headingLevel===2?"h2":"h3";
  return <article className={dense ? "content-card dense" : "content-card"}>
    <button className="card-hit" aria-label={`Ouvrir ${item.title}`} onClick={() => onOpen(item)} />
    <Media pos={item.pos} />
    <div className="card-copy">
      <div className="eyebrow">{item.kind}</div>
      <Heading>{item.title}</Heading>
      <p>Une extension de démonstration conçue pour cette version du jeu.</p>
      <div className="card-meta"><Compatibility compact/><span>Version 1.4.2</span></div>
    </div>
  </article>;
}

function HubContentRow({ item, onOpen }) {
  return <article className="hub-content-row">
    <button className="hub-row-main" type="button" onClick={()=>onOpen(item)} aria-label={`Ouvrir ${item.title}`}>
      <Media pos={item.pos}/>
      <div className="hub-row-copy">
        <h3>{item.title}</h3>
        <div className="hub-row-meta"><Compatibility compact/><span>Version 1.4.2</span><span>◈ Dépendances</span></div>
        <div className="hub-row-lines" aria-hidden="true"><span/><span/></div>
      </div>
      <div className="hub-row-source">
        <div className="source-title">◉ <span>Source</span> ↗</div>
        <div className="source-bars" aria-hidden="true"><span/><span/><span/></div>
      </div>
    </button>
    <div className="hub-row-actions">
      <button type="button" aria-label="Téléchargement indisponible" disabled>↓</button>
      <button type="button" aria-label={`Plus d’options pour ${item.title}`}>•••</button>
    </div>
  </article>;
}

function HubFilters() {
  return <div className="hub-filterbar" aria-label="Filtres du catalogue du jeu">
    <select aria-label="Type de contenu" defaultValue=""><option value="">Type de contenu</option><option>Mod</option><option>Collection</option></select>
    <select aria-label="Thème" defaultValue=""><option value="">Thème</option><option>Exploration</option><option>Graphismes</option></select>
    <select aria-label="Dépendances" defaultValue=""><option value="">Dépendances</option><option>Avec dépendances</option><option>Sans dépendance</option></select>
    <select aria-label="Source" defaultValue=""><option value="">Source</option><option>MODARYX</option><option>Créateurs</option></select>
    <div className="hub-view-toggle" role="group" aria-label="Affichage"><button type="button" aria-label="Vue grille">▦</button><button type="button" className="active" aria-label="Vue liste">☰</button></div>
  </div>;
}

function ProfilesRail() {
  return <aside className="profiles-rail">
    <div className="rail-icon"><Stack /></div>
    <h2>Mes profils pour ce jeu</h2>
    <p>Configurations enregistrées de mods, versions et réglages.</p>
    <button className="profile-add"><Plus />Nouveau profil</button>
    <div className="profile-list">
      {[['Exploration','4 contenus'],['Graphismes','7 contenus'],['Gameplay','5 contenus'],['Immersion','3 contenus']].map(([name,count],i) =>
        <button className="profile-row" key={name}><Media pos={contentItems[i].pos}/><span><strong>{name}</strong><small>{count}</small></span><ArrowRight /></button>)}
    </div>
  </aside>;
}

function GamesIndex({ onOpenGame }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Nom");
  const [requestOpen,setRequestOpen]=useState(false);
  const [requestName,setRequestName]=useState("");
  const [requestPlatform,setRequestPlatform]=useState("PC");
  const [requestError,setRequestError]=useState("");
  const [requestDraft,setRequestDraft]=useState(false);
  const games = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("fr");
    const filtered = gameItems.filter(game => game.title.toLocaleLowerCase("fr").includes(normalized));
    return [...filtered].sort((a,b) => sort === "Nom" ? a.title.localeCompare(b.title, "fr") : a.status.localeCompare(b.status, "fr"));
  }, [query, sort]);
  const prepareSupportRequest=()=>{
    if(!requestName.trim()){
      setRequestError("Saisissez un nom de jeu avant de préparer la demande.");
      setRequestDraft(false);
      requestAnimationFrame(()=>document.getElementById("game-support-name")?.focus());
      return;
    }
    setRequestError("");
    setRequestDraft(true);
  };

  return <main id="main-content" tabIndex="-1" className="page-section games-index">
    <span className="kicker">Jeux</span>
    <h1>Trouvez votre prochain terrain de jeu.</h1>
    <p className="page-intro">Recherchez un jeu et voyez immédiatement si son catalogue est réellement disponible.</p>
    <section className="game-support-request">
      <div><span className="kicker">Jeu absent ?</span><h2>Demander le support d’un jeu</h2><p>Une demande membre passe toujours par le triage MODARYX avant tout ajout. Aucune demande éditeur n’est envoyée depuis ce prototype.</p></div>
      <button className="quiet" aria-expanded={requestOpen} onClick={()=>{setRequestOpen(v=>!v);setRequestError("");}}> {requestOpen?"Fermer":"Demander le support d’un jeu"} </button>
      {requestOpen&&<div className="game-request-form">
        <label><span>Nom du jeu</span><input id="game-support-name" value={requestName} aria-invalid={requestError?"true":undefined} aria-describedby={requestError?"game-support-name-error":undefined} onChange={e=>{setRequestName(e.target.value);setRequestError("");setRequestDraft(false);}} placeholder="Ex. Project Meridian" aria-label="Nom du jeu à demander"/></label>
        <label><span>Plateforme principale</span><select id="game-support-platform" value={requestPlatform} onChange={e=>setRequestPlatform(e.target.value)}><option>PC</option><option>PlayStation</option><option>Xbox</option><option>Nintendo</option><option>Autre</option></select></label>
        <button className="primary" onClick={prepareSupportRequest}>Préparer la demande locale</button>
        {requestError&&<div id="game-support-name-error" className="form-error" role="alert">{requestError}</div>}
        {requestDraft&&<div className="game-request-status" role="status"><strong>Brouillon de demande — non envoyé</strong><span>{requestName.trim()} · {requestPlatform}</span><small>Triage MODARYX requis. Aucun Rights Case réel n’est créé dans ce prototype.</small></div>}
      </div>}
    </section>
    <div className="index-tools">
      <label className="catalog-search"><MagnifyingGlass/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un jeu" aria-label="Rechercher un jeu"/></label>
      <label className="sort-control"><span>Trier</span><select value={sort} onChange={e=>setSort(e.target.value)}><option>Nom</option><option>État</option></select></label>
    </div>
    <div className="game-grid">
      {games.map((game,i)=><article className={`game-card atmosphere-card atmosphere-${game.atmosphere}`} key={game.title}>
        <Media pos={game.pos}/>
        <div><span className="demo-label">Démonstration</span><h2>{game.title}</h2><p>{game.detail}</p><span className="support-state">{game.status}</span>
        {game.title==="Aetherlands" ? <button className="primary" onClick={onOpenGame}>Ouvrir le Game Hub <ArrowRight/></button> : <button className="quiet" disabled>Indisponible dans cette démo</button>}</div>
      </article>)}
    </div>
    {games.length===0 && <div className="empty"><MagnifyingGlass/><h3>Aucun jeu trouvé</h3><p>Essayez un autre terme.</p><button onClick={()=>setQuery("")}>Effacer la recherche</button></div>}
  </main>;
}

function GlobalSearch({ onOpenContent, onOpenGame, onOpenCreators, onOpenCollections }) {
  const [query,setQuery]=useState("");
  const normalized=query.trim().toLocaleLowerCase("fr");
  const games=gameItems.filter(x=>x.title.toLocaleLowerCase("fr").includes(normalized));
  const contents=contentItems.filter(x=>(x.title+" "+x.kind+" "+x.creator).toLocaleLowerCase("fr").includes(normalized));
  const creators=creatorItems.filter(x=>x.toLocaleLowerCase("fr").includes(normalized));
  const collections=collectionItems.filter(x=>x.toLocaleLowerCase("fr").includes(normalized));
  const hasQuery=query.trim().length>0;
  const total=(hasQuery?games.length+contents.length+creators.length+collections.length:0);

  return <main id="main-content" tabIndex="-1" className="page-section global-search-page">
    <span className="kicker">Recherche globale</span>
    <h1>Rechercher dans MODARYX</h1>
    <p className="page-intro">Jeux, mods & contenus, collections et créateurs restent identifiables par type.</p>
    <label className="global-search-field"><MagnifyingGlass/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un jeu, un contenu, une collection ou un créateur" aria-label="Recherche globale"/></label>
    {!hasQuery && <div className="search-hint"><strong>Commencez par un nom ou un type.</strong><span>La recherche de démonstration reste locale : aucune dépendance externe.</span></div>}
    {hasQuery && total===0 && <div className="empty"><MagnifyingGlass/><h3>Aucun résultat</h3><p>Aucun élément de démonstration ne correspond à « {query} ».</p><button onClick={()=>setQuery("")}>Effacer la recherche</button></div>}
    {hasQuery && total>0 && <div className="search-groups" aria-live="polite">
      <section><div className="search-group-title"><h2>Jeux</h2><span>{games.length}</span></div>{games.map(game=><button className="search-result-row" key={game.title} onClick={game.title==="Aetherlands"?onOpenGame:undefined} disabled={game.title!=="Aetherlands"}><GameController/><span><strong>{game.title}</strong><small>{game.status}</small></span><ArrowRight/></button>)}</section>
      <section><div className="search-group-title"><h2>Mods & contenus</h2><span>{contents.length}</span></div>{contents.map(item=><button className="search-result-row" key={item.title} onClick={()=>onOpenContent(item)}><MagnifyingGlass/><span><strong>{item.title}</strong><small>{item.kind} · {item.creator}</small></span><ArrowRight/></button>)}</section>
      <section><div className="search-group-title"><h2>Créateurs</h2><span>{creators.length}</span></div>{creators.map(name=><button className="search-result-row" key={name} onClick={onOpenCreators}><UsersThree/><span><strong>{name}</strong><small>Créateur de démonstration</small></span><ArrowRight/></button>)}</section>
      <section><div className="search-group-title"><h2>Collections</h2><span>{collections.length}</span></div>{collections.map(name=><button className="search-result-row" key={name} onClick={onOpenCollections}><Stack/><span><strong>{name}</strong><small>Collection de démonstration</small></span><ArrowRight/></button>)}</section>
    </div>}
  </main>;
}

function GameHub({ onOpen }) {
  const [tab, setTab] = useState("Mods & contenus");
  const [query, setQuery] = useState("");
  const [version, setVersion] = useState("1.4.2");
  const [atmosphereKey,setAtmosphereKey]=useState("aetherlands");
  const atmosphere=gameItems.find(game=>game.atmosphere===atmosphereKey)||gameItems[0];
  const normalized=query.trim().toLocaleLowerCase("fr");
  const visibleContent = useMemo(() => contentItems.filter(x => (x.title+" "+x.kind+" "+x.creator).toLocaleLowerCase("fr").includes(normalized)), [normalized]);
  const visibleCollections = useMemo(() => collectionDetails.filter(x => (x.title+" "+x.curator+" "+x.category).toLocaleLowerCase("fr").includes(normalized)), [normalized]);
  const visibleCreators = useMemo(() => creatorDetails.filter(x => (x.name+" "+x.role+" "+x.focus).toLocaleLowerCase("fr").includes(normalized)), [normalized]);
  const meta={
    "Aperçu":["Sélection adaptative","Pour votre version",`Contenus de démonstration contextualisés pour Aetherlands ${version}.`],
    "Mods & contenus":["Pour votre version","Pour votre version",`Contenus compatibles avec Aetherlands ${version}.`],
    "Collections":["Sélections organisées","Collections",`Collections de démonstration liées à Aetherlands ${version}.`],
    "Créateurs":["Écosystème créateur","Créateurs",`Créateurs et équipes de démonstration actifs autour d’Aetherlands.`],
    "Guides":["Guides","Guides",`Guides contextualisés pour Aetherlands ${version}.`],
    "Activité":["Activité","Activité",`Événements utiles liés à Aetherlands, sans fil social générique.`],
  };
  const [kicker,title,description]=meta[tab];

  let body;
  if(tab==="Aperçu") body=<><HubFilters/><div className="hub-content-list">{visibleContent.slice(0,5).map(item=><HubContentRow key={item.title} item={item} onOpen={onOpen}/>)}</div></>;
  else if(tab==="Mods & contenus") body=visibleContent.length?<><HubFilters/><div className="hub-content-list">{visibleContent.map(item=><HubContentRow key={item.title} item={item} onOpen={onOpen}/>)}</div></>:<div className="empty"><MagnifyingGlass/><h3>Aucun contenu trouvé</h3><p>Essayez un autre terme.</p><button onClick={()=>setQuery("")}>Effacer la recherche</button></div>;
  else if(tab==="Collections") body=visibleCollections.length?<div className="hub-collection-grid">{visibleCollections.map(item=><article key={item.title}><strong>{item.title}</strong><span>{item.curator} · {item.category}</span><small>{item.items} éléments de démonstration</small><div className="hub-capability">Sélection organisée · installation non disponible</div></article>)}</div>:<div className="empty"><Stack/><h3>Aucune collection trouvée</h3><button onClick={()=>setQuery("")}>Effacer la recherche</button></div>;
  else if(tab==="Créateurs") body=visibleCreators.length?<div className="hub-creator-grid">{visibleCreators.map(item=><article key={item.name}><div className="creator-avatar static"><UsersThree/></div><div><strong>{item.name}</strong><span>{item.role}</span><small>{item.focus}</small></div></article>)}</div>:<div className="empty"><UsersThree/><h3>Aucun créateur trouvé</h3><button onClick={()=>setQuery("")}>Effacer la recherche</button></div>;
  else if(tab==="Guides") body=<div className="hub-info-state"><BookOpen/><div><strong>Guides de démonstration indisponibles</strong><span>Aucun guide éditorial réel n’est connecté à ce prototype. La navigation existe sans inventer de contenu.</span></div></div>;
  else body=<div className="hub-activity"><article><span className="activity-dot"/><div><strong>Activité de démonstration</strong><small>Exemple : une release compatible avec Aetherlands 1.4.2 serait affichée ici.</small></div></article><article><span className="activity-dot"/><div><strong>Aucun événement serveur réel</strong><small>Les notifications et changements distants ne sont pas simulés.</small></div></article></div>;

  return <main id="main-content" tabIndex="-1" className="game-hub-page">
    <section className={`game-hero game-atmosphere atmosphere-${atmosphereKey}`} data-atmosphere={atmosphereKey}>
      <div className="hero-shade" />
      <div className="game-identity"><span className="demo-label">Jeu sélectionné</span><span className="atmosphere-note">Ambiance originale MODARYX · {atmosphere.title}</span><h1>Aetherlands</h1><div className="game-support">Catalogue consultable — téléchargement non garanti</div><label>Version<select value={version} onChange={e => setVersion(e.target.value)}><option>1.4.2</option><option>1.4.1</option></select></label><div className="atmosphere-preview"><span>Prévisualiser l’ambiance</span><div role="group" aria-label="Ambiances de démonstration originales MODARYX">{gameItems.map(game=><button key={game.atmosphere} type="button" aria-pressed={atmosphereKey===game.atmosphere} className={atmosphereKey===game.atmosphere?"active":""} onClick={()=>setAtmosphereKey(game.atmosphere)}>{game.title}</button>)}</div><small>{atmosphere.mood} · aucun asset éditeur utilisé</small></div></div>
      <form className="hero-search" onSubmit={e => e.preventDefault()}><MagnifyingGlass /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher dans ce jeu" aria-label="Rechercher dans ce jeu"/><button type="button" aria-label="Filtres"><SlidersHorizontal /></button></form>
      <button className="primary" onClick={()=>setTab("Mods & contenus")}>Explorer les contenus <ArrowRight /></button>
    </section>
    <nav className="local-nav" aria-label="Navigation du jeu">{["Aperçu","Mods & contenus","Collections","Créateurs","Guides","Activité"].map(x => <button key={x} aria-pressed={tab===x} className={tab===x?'active':''} onClick={() => setTab(x)}>{x}</button>)}</nav>
    <div className="hub-layout">
      <section className="hub-content"><div className="section-heading"><div><span className="kicker">{kicker}</span><h2>{title}</h2><p>{description}</p></div></div>{body}</section>
      <ProfilesRail />
    </div>
  </main>;
}

function Discover({ onOpen }) {
  return <main id="main-content" tabIndex="-1"><section className="editorial-hero canon-reconciled-hero"><div className="editorial-hero-copy"><span className="kicker">Votre monde évolue</span><h1>Redécouvrez vos jeux,<br/>une possibilité à la fois.</h1><p>Explorez des contenus, vérifiez leur compatibilité et composez des expériences qui vous ressemblent, au cœur d’un royaume vivant.</p><button className="primary">Découvrir maintenant <ArrowRight/></button></div></section><section className="page-section"><div className="section-heading"><div><span className="kicker">En ce moment</span><h2>Des mondes à réinventer</h2></div></div><div className="content-grid editorial">{contentItems.slice(0,3).map(item => <ContentCard key={item.title} item={item} onOpen={onOpen}/>)}</div></section></main>;
}

function CollectionsPage() {
  const [mode,setMode]=useState("Collections");
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState("Toutes");
  const [showDelta,setShowDelta]=useState(false);
  const [applyMode,setApplyMode]=useState("Ajouter");
  const categories=["Toutes",...new Set(collectionDetails.map(x=>x.category))];
  const visible=useMemo(()=>{
    const q=query.trim().toLocaleLowerCase("fr");
    return collectionDetails.filter(x=>(category==="Toutes"||x.category===category) && (x.title+" "+x.curator+" "+x.note).toLocaleLowerCase("fr").includes(q));
  },[query,category]);
  return <main id="main-content" tabIndex="-1" className="page-section collections-page">
    <span className="kicker">Collections & Modpacks</span><h1>Organiser n’est pas installer.</h1>
    <p className="page-intro">Une Collection est une sélection éditoriale. Un Modpack est un ensemble versionné qui ne devient installable qu’avec manifeste, droits et runtime réels. Un Profil de jeu reste une configuration personnelle distincte.</p>
    <nav className="collection-mode-tabs" aria-label="Collections et Modpacks"><button aria-pressed={mode==="Collections"} className={mode==="Collections"?"active":""} onClick={()=>setMode("Collections")}>Collections</button><button aria-pressed={mode==="Modpacks"} className={mode==="Modpacks"?"active":""} onClick={()=>setMode("Modpacks")}>Modpacks</button></nav>
    {mode==="Collections"?<>
      <div className="collection-tools"><label className="catalog-search"><MagnifyingGlass/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher une collection" aria-label="Rechercher une collection"/></label><div className="filter-chips">{categories.map(value=><button key={value} className={category===value?"selected":""} onClick={()=>setCategory(value)}>{value}</button>)}</div></div>
      <div className="collection-grid">{visible.map(item=><article className="collection-card" key={item.title}><Media pos={item.pos}/><div><span className="demo-label">Collection de démonstration</span><h2>{item.title}</h2><p>{item.note}</p><dl><div><dt>Curateur</dt><dd>{item.curator}</dd></div><div><dt>Jeu</dt><dd>{item.game} {item.version}</dd></div><div><dt>Contenus</dt><dd>{item.items} éléments de démonstration</dd></div><div><dt>Capacité</dt><dd>Sélection organisée</dd></div></dl><div className="collection-capability"><strong>Installation non disponible</strong><span>Aucun manifeste installable ni runtime MODARYX Forge n’est simulé.</span></div><button className="quiet">Voir la sélection <ArrowRight/></button></div></article>)}</div>
      {visible.length===0&&<div className="empty"><Stack/><h3>Aucune collection trouvée</h3><p>Essayez un autre terme ou une autre catégorie.</p><button onClick={()=>{setQuery("");setCategory("Toutes")}}>Réinitialiser</button></div>}
    </>:<section className="modpack-surface">
      <div className="modpack-header"><div><span className="demo-label">Modpack de démonstration</span><h2>Aetherlands — Essentiel</h2><p>Exemple de structure versionnée pour montrer la différence avec une Collection. Aucun fichier n’est distribué.</p></div><span className="version-pill">0.3.0-démo</span></div>
      <div className="modpack-grid">
        <article><span className="kicker">Cible</span><strong>Aetherlands 1.4.2</strong><small>Plateforme et environnement de démonstration.</small></article>
        <article><span className="kicker">Dépendances</span><strong>Aether Core 1.x</strong><small><b>Requis par</b> Sentiers de l’aube · dépendance fictive.</small></article>
        <article><span className="kicker">Versioning</span><strong>1 élément épinglé</strong><small>Sentiers de l’aube 1.4.2 · politique : Épinglé.</small></article>
        <article><span className="kicker">Configuration</span><strong>Aucune configuration redistribuée</strong><small>Les droits de partage doivent être prouvés avant inclusion.</small></article>
      </div>
      <div className="dependency-origin-list" aria-label="Origine des composants du modpack">
        <div><strong>Sentiers de l’aube</strong><span>Choisi par le curateur</span><em>Épinglé</em></div>
        <div><strong>Rivages du couchant</strong><span>Inclus par le curateur</span><em>Proposer</em></div>
        <div><strong>Aether Core</strong><span>Requis transitivement</span><em>Auto sûr</em></div>
      </div>
      <div className="modpack-manifest"><strong>Manifeste installable</strong><span>PREUVE MANQUANTE — aucun manifeste réel ni résolution runtime ne sont connectés.</span></div>
      <button className="quiet delta-trigger" onClick={()=>setShowDelta(v=>!v)}>{showDelta?"Masquer l’aperçu du delta":"Prévisualiser le delta"}</button>
      {showDelta&&<section className="delta-preview" aria-live="polite">
        <div className="delta-header"><div><span className="kicker">Aperçu local</span><h3>Avant toute mutation</h3><p>Aucune modification n’est appliquée. Cet écran démontre seulement la décision.</p></div><span className="support-state">0 mutation réelle</span></div>
        <div className="apply-mode" role="group" aria-label="Mode d’application de démonstration"><button className={applyMode==="Ajouter"?"active":""} onClick={()=>setApplyMode("Ajouter")}>Ajouter</button><button className={applyMode==="Remplacer"?"active":""} onClick={()=>setApplyMode("Remplacer")}>Remplacer</button><button onClick={()=>setShowDelta(false)}>Annuler</button></div>
        <div className="delta-grid">
          <article><span>Ajout</span><strong>+2 contenus</strong><small>Démonstration uniquement</small></article>
          <article><span>Conservé</span><strong>1 élément épinglé</strong><small>Ne sera pas mis à jour automatiquement</small></article>
          <article><span>Dépendance</span><strong>+1 transitive</strong><small>Origine affichée avant décision</small></article>
          <article><span>Mode</span><strong>{applyMode}</strong><small>{applyMode==="Ajouter"?"Conserverait les éléments non concernés.":"Remplacerait la composition cible après confirmation réelle."}</small></article>
        </div>
        <div className="manager-state"><strong>MODARYX Forge requis pour appliquer</strong><span>Le site ne simule ni fichiers, ni installation, ni rollback.</span></div>
      </section>}
      <button className="primary" disabled>Installer — runtime MODARYX Forge non connecté</button>
    </section>}
  </main>;
}


function CreatorsPage({ onNavigate }) {
  const [query,setQuery]=useState("");
  const visible=creatorDetails.filter(x=>(x.name+" "+x.role+" "+x.focus).toLocaleLowerCase("fr").includes(query.trim().toLocaleLowerCase("fr")));
  return <main id="main-content" tabIndex="-1" className="page-section creators-page">
    <span className="kicker">Créateurs</span><h1>Créateurs, équipes et studios.</h1>
    <p className="page-intro">Identités publiques et créations restent distinctes des rôles d’administration MODARYX. Aucun badge de vérification n’est simulé.</p><button className="quiet creator-studio-entry" onClick={()=>onNavigate("Créer")}>Ouvrir Creator Studio <ArrowRight/></button>
    <label className="catalog-search creators-search"><MagnifyingGlass/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un créateur ou un studio" aria-label="Rechercher un créateur ou un studio"/></label>
    <div className="creator-index-grid">{visible.map(item=><article className="creator-index-card" key={item.name}><Media pos={item.pos}/><div><div className="creator-avatar"><UsersThree/></div><span className="demo-label">Identité de démonstration</span><h2>{item.name}</h2><p>{item.role} · {item.focus}</p><div className="creator-trust-note"><strong>Vérification</strong><span>Aucune vérification réelle associée à ce prototype.</span></div><h3>Créations présentées</h3><ul>{item.creations.map(name=><li key={name}>{name}</li>)}</ul><button className="quiet">Voir les créations <ArrowRight/></button></div></article>)}</div>
    {visible.length===0&&<div className="empty"><UsersThree/><h3>Aucun créateur trouvé</h3><p>Essayez un autre nom ou domaine.</p><button onClick={()=>setQuery("")}>Effacer la recherche</button></div>}
  </main>;
}

function Catalog({ onOpen }) {
  const [grid,setGrid]=useState(true);
  const [query,setQuery]=useState("");
  const [kind,setKind]=useState("Tous");
  const [sort,setSort]=useState("Pertinence");
  const [filtersOpen,setFiltersOpen]=useState(false);
  const kinds=["Tous",...new Set(contentItems.map(item=>item.kind))];
  const visible=useMemo(()=>{
    const normalized=query.trim().toLocaleLowerCase("fr");
    const filtered=contentItems.filter(item => (kind==="Tous"||item.kind===kind) && (item.title+" "+item.kind+" "+item.creator).toLocaleLowerCase("fr").includes(normalized));
    if(sort==="Nom") return [...filtered].sort((a,b)=>a.title.localeCompare(b.title,"fr"));
    if(sort==="Type") return [...filtered].sort((a,b)=>a.kind.localeCompare(b.kind,"fr"));
    return filtered;
  },[query,kind,sort]);
  const reset=()=>{setQuery("");setKind("Tous");setSort("Pertinence");};
  const activeFilters=(kind!=="Tous"?1:0)+(query.trim()?1:0)+(sort!=="Pertinence"?1:0);
  return <main id="main-content" tabIndex="-1" className="page-section catalog">
    <div className="catalog-title"><span className="kicker">Catalogue global</span><h1>Mods & contenus</h1><p>Trouvez un contenu, puis confirmez sa compatibilité avant de l’ajouter à un profil.</p></div>
    <div className="catalog-tools">
      <label className="catalog-search"><MagnifyingGlass/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher dans tous les contenus" aria-label="Rechercher dans tous les contenus"/></label>
      <button aria-expanded={filtersOpen} onClick={()=>setFiltersOpen(v=>!v)}><FunnelSimple/>Filtres{activeFilters>0&&<span className="filter-count">{activeFilters}</span>}</button>
      <div className="view-toggle"><button aria-pressed={grid} className={grid?'active':''} onClick={()=>setGrid(true)} aria-label="Vue grille"><GridFour/></button><button aria-pressed={!grid} className={!grid?'active':''} onClick={()=>setGrid(false)} aria-label="Vue liste"><List/></button></div>
    </div>
    {filtersOpen&&<section className="filter-panel" aria-label="Filtres du catalogue">
      <div><span className="filter-label">Type</span><div className="filter-chips">{kinds.map(value=><button key={value} className={kind===value?"selected":""} onClick={()=>setKind(value)}>{value}</button>)}</div></div>
      <label className="sort-control"><span>Trier</span><select value={sort} onChange={e=>setSort(e.target.value)}><option>Pertinence</option><option>Nom</option><option>Type</option></select></label>
      <button className="reset-filters" onClick={reset} disabled={activeFilters===0}>Réinitialiser</button>
    </section>}
    <div className="catalog-summary" aria-live="polite"><strong>{visible.length} résultat{visible.length>1?"s":""}</strong><span>Données de démonstration</span>{activeFilters>0&&<button onClick={reset}>Tout réinitialiser</button>}</div>
    {visible.length>0 ? <div className={grid?'content-grid catalog-grid':'content-list'}>{visible.map(item => <ContentCard dense={!grid} headingLevel={2} key={item.title} item={item} onOpen={onOpen}/>)}</div> : <div className="empty"><MagnifyingGlass/><h3>Aucun contenu trouvé</h3><p>Modifiez les filtres ou recommencez avec une autre recherche.</p><button onClick={reset}>Réinitialiser les filtres</button></div>}
  </main>;
}

function Detail({ item, onBack }) {
  const selected=item||contentItems[0];
  const [added,setAdded]=useState(false);
  const [tab,setTab]=useState("Aperçu");
  const [reportReason,setReportReason]=useState("");
  const [reportDetail,setReportDetail]=useState("");
  const [reportDraft,setReportDraft]=useState(false);
  const [reportError,setReportError]=useState("");
  const tabs=["Aperçu","Fichiers","Versions","Compatibilité et prérequis","Plan avancé","Changelog","Support","Signalement","Permissions"];

  const tabContent = {
    "Aperçu": <section className="detail-section"><h2>À propos</h2><p>Cette fiche matérialise la décision avant ajout à un profil. Le contenu présenté ici est une démonstration : aucune donnée de popularité, aucun téléchargement et aucun scan réel ne sont simulés.</p><div className="detail-feature-grid"><article><strong>But</strong><span>Enrichir l’exploration sans modifier les règles de base.</span></article><article><strong>Installation</strong><span>Ajout à un profil uniquement dans ce prototype.</span></article><article><strong>Limitation</strong><span>Aucun runtime MODARYX Forge connecté à cette démo.</span></article></div></section>,
    "Fichiers": <section className="detail-section"><h2>Fichiers de cette version</h2><article className="file-row"><div><strong>Package de démonstration</strong><span>Version du mod 1.4.2 · canal stable de démonstration</span></div><dl><div><dt>Auteur</dt><dd>{selected.creator}</dd></div><div><dt>Source / provider</dt><dd>Import manuel de démonstration</dd></div><div><dt>Origine artefact</dt><dd>Fichier local — non attesté</dd></div><div><dt>Source alternative</dt><dd>Aucun provider réel connecté</dd></div><div><dt>SHA-256</dt><dd>Non calculé — démonstration</dd></div><div><dt>Distribution</dt><dd>Indisponible au téléchargement</dd></div><div><dt>Scan</dt><dd>Aucun scan réel associé</dd></div></dl></article><div className="release-variant-grid"><article><span className="kicker">Variante pédagogique A</span><strong>Édition standard · PC</strong><small>Loader : aucun · artefact réel absent</small></article><article><span className="kicker">Variante pédagogique B</span><strong>Édition alternative · PC</strong><small>Loader spécifique · non sélectionnable sans artefact réel</small></article></div><div className="source-identity-note"><strong>Source ≠ auteur ≠ variante</strong><span>MODARYX doit conserver séparément identité créateur, provider, URL/source, édition, loader et artefact exact. Aucun provider externe n’est simulé ici.</span></div></section>,
    "Versions": <section className="detail-section"><h2>Versions</h2><div className="version-history"><article><strong>1.4.2</strong><span>Version actuelle de démonstration · compatible avec Aetherlands 1.4.2</span></article><article><strong>1.4.1</strong><span>Historique de démonstration · distribution non exposée</span></article></div></section>,
    "Compatibilité et prérequis": <section className="detail-section"><h2>Compatibilité et prérequis</h2><p>Versions, dimensions de compatibilité, relations et niveau de preuve restent séparés.</p><div className="compatibility-evidence-grid"><article><span>Jeu / version</span><strong>Aetherlands 1.4.2</strong><small>Fixture locale</small></article><article><span>Édition</span><strong>Standard — démonstration</strong><small>Aucune édition réelle attestée</small></article><article><span>Plateforme</span><strong>PC — démonstration</strong><small>Crossplay non évalué</small></article><article><span>Loader / framework</span><strong>Aucun déclaré</strong><small>Preuve runtime absente</small></article><article><span>Résultat réel</span><strong>Unknown</strong><small>Ne pas déduire « Compatible » de la maquette</small></article><article><span>Fraîcheur preuve</span><strong>Unknown</strong><small>Source : fixture locale · aucune date d’attestation</small></article><article><span>Workaround</span><strong>Non attesté</strong><small>Un workaround doit citer sa source et sa portée</small></article><article><span>Channel</span><strong>Stable — démonstration</strong><small>Distinct de la maturité projet</small></article></div><div className="relationship-list" aria-label="Relations de dépendance de démonstration"><div><strong>Required</strong><span>Aether Core 1.x</span><small>Nécessaire dans l’exemple pédagogique</small></div><div><strong>Recommended</strong><span>Photo Mode Extension</span><small>Conseillé mais non obligatoire — fixture</small></div><div><strong>Suggested</strong><span>Soundscape Pack</span><small>Suggestion faible — jamais installée par défaut sans politique</small></div><div><strong>Supported</strong><span>Ambient API 2.x</span><small>Relation de support déclarée, sans obligation d’installation</small></div><div><strong>Alternative / AnyOf</strong><span>Lighting API A ou Lighting API B</span><small>Un choix utilisateur serait requis avant résolution réelle</small></div><div><strong>Conflict</strong><span>Legacy Lighting Pack</span><small>Exemple pédagogique de relation incompatible</small></div><div><strong>ReplacedBy</strong><span>Old Paths → {selected.title}</span><small>Exemple d’obsolescence/renommage explicite</small></div></div><div className="freshness-legend" aria-label="États de fraîcheur des preuves"><span><strong>Current</strong><small>preuve récente dans sa portée</small></span><span><strong>Aging</strong><small>preuve à revalider bientôt</small></span><span><strong>Stale</strong><small>preuve trop ancienne pour rassurer</small></span><span><strong>Unknown</strong><small>fraîcheur non connue</small></span></div><div className="compatibility-proof-note"><strong>Compatibilité réelle : PREUVE MANQUANTE</strong><span>Ces relations démontrent le modèle d’information, pas l’état réel d’un mod.</span></div></section>,
    "Plan avancé": <section className="detail-section advanced-plan"><div className="advanced-plan-head"><div><span className="kicker">Vue expert</span><h2>Plan avancé — démonstration</h2><p>Une lecture plate et déterministe des décisions, sans graphe de conflits opaque.</p></div><span className="support-state">0 mutation réelle</span></div><div className="advanced-plan-grid"><article><span>01 · Source</span><strong>Import manuel de démonstration</strong><small>Auteur : {selected.creator} · provider réel absent</small></article><article><span>02 · Artefact</span><strong>Package 1.4.2</strong><small>SHA-256 non calculé · distribution indisponible</small></article><article><span>03 · Dépendance</span><strong>Aether Core 1.x</strong><small>Requis par {selected.title} · origine explicitée</small></article><article><span>04 · Conflits</span><strong>Aucun déclaré dans la démo</strong><small>Ce n’est pas une vérification runtime réelle</small></article><article><span>05 · Politique version</span><strong>Proposer</strong><small>Aucune mise à jour automatique silencieuse</small></article><article><span>06 · Action</span><strong>Ajouter au profil seulement</strong><small>Aucun fichier, load order ou installation locale appliqué</small></article></div><div className="advanced-plan-footer"><strong>Receipt futur</strong><span>Le runtime réel devra enregistrer plan prévu, décisions, artefacts, hashes et actions effectivement appliquées.</span></div></section>,
    "Changelog": <section className="detail-section"><h2>Changelog</h2><article className="changelog-row"><strong>1.4.2</strong><span>Démonstration : amélioration des sentiers, correction de transitions visuelles, aucune migration réelle requise.</span></article></section>,
    "Support": <section className="detail-section"><h2>Support</h2><p>Utilisez le support pour une question, un bug ou un problème d’utilisation. Les abus, droits ou contenus suspects relèvent du Signalement.</p><button className="quiet" disabled>Support indisponible dans cette démo</button></section>,
    "Signalement": <section className="detail-section report-section"><h2>Signaler ce contenu</h2><p>Un signalement concerne un abus, un problème de droits, un contenu suspect ou une autre violation. Il reste séparé du support.</p><div className="report-context"><strong>Objet concerné</strong><span>{selected.title} · version 1.4.2 · Aetherlands</span></div><label className="report-field"><span>Raison</span><select id="report-reason" aria-invalid={reportError?"true":undefined} aria-describedby={reportError?"report-reason-error":undefined} value={reportReason} onChange={e=>{setReportReason(e.target.value);setReportDraft(false);setReportError("")}}><option value="">Choisir une raison</option><option>Droits / licence</option><option>Malware suspect</option><option>Usurpation</option><option>Contenu interdit</option><option>Autre violation</option></select>{reportError&&<small id="report-reason-error" className="field-error" role="alert">{reportError}</small>}</label><label className="report-field"><span>Détail facultatif</span><textarea id="report-detail" value={reportDetail} onChange={e=>{setReportDetail(e.target.value);setReportDraft(false)}} rows="4" placeholder="Décrivez brièvement le problème sans inclure de données sensibles."/></label><button className="primary" onClick={()=>{if(!reportReason){setReportError("Choisissez une raison avant de préparer le signalement.");setReportDraft(false);requestAnimationFrame(()=>document.getElementById("report-reason")?.focus());return;}setReportError("");setReportDraft(true)}}>Préparer le signalement local</button>{reportDraft&&<div className="local-draft report-draft" role="status"><strong>Brouillon de signalement — non envoyé</strong><span>Raison : {reportReason}. Aucun backend de modération n’est connecté à ce prototype.</span></div>}</section>,
    "Permissions": <section className="detail-section"><h2>Permissions</h2><dl className="permissions-list"><div><dt>Licence</dt><dd>Démonstration — aucune licence de distribution réelle</dd></div><div><dt>Redistribution</dt><dd>Non définie</dd></div><div><dt>Modification</dt><dd>Non définie</dd></div><div><dt>Provenance</dt><dd>Asset de démonstration MODARYX V2</dd></div></dl></section>,
  };

  return <main id="main-content" tabIndex="-1" className="detail">
    <button className="back" onClick={onBack}>← Retour aux contenus</button>
    <div className="detail-grid">
      <aside className="detail-copy">
        <span className="kicker">{selected.kind}</span>
        <h1>{selected.title}</h1>
        <p className="creator-line">par <strong>{selected.creator}</strong> · Aetherlands</p>
        <div className="detail-states"><Compatibility/><span className="version-pill">Version du jeu 1.4.2</span><span className="version-pill">Version du mod 1.4.2</span></div>
        <p className="lede">Une proposition visuelle et narrative qui enrichit le monde sans rompre son équilibre. Contenu de démonstration non contractuel.</p>
        <div className="decision-panel">
          <h2>Avant d’ajouter</h2>
          <div className="decision-alert"><Check weight="bold"/><span><strong>Compatible avec votre configuration de démonstration</strong><small>Aetherlands 1.4.2</small></span></div>
          <dl>
            <div><dt>Prérequis obligatoire</dt><dd>Aether Core 1.x</dd></div>
            <div><dt>Conflit majeur connu</dt><dd>Aucun déclaré</dd></div>
            <div><dt>Distribution</dt><dd>Démonstration uniquement</dd></div>
            <div><dt>Provenance</dt><dd>Démo locale — non attestée</dd></div>
            <div><dt>Scan de sécurité</dt><dd>Aucun scan réel</dd></div>
          </dl>
        </div>
        <button className={added?'primary success':'primary'} onClick={()=>setAdded(v=>!v)}>{added?<><Check/>Ajouté au profil Exploration</>:<><Plus/>Ajouter à un profil</>}</button>
        <div className="manager-capability-panel"><strong>Installation avec MODARYX Forge</strong><span>Capability handshake indisponible : aucun runtime, protocole, adapter ou artefact réel n’est connecté.</span><button className="quiet" disabled>Ouvrir avec MODARYX Forge — indisponible</button><small>Le CTA ne sera activé que si jeu + adapter + source + runtime sont réellement supportés.</small></div>
        <p className="action-note">Aucune installation locale n’est déclenchée par ce prototype.</p>
      </aside>
      <div className="detail-main">
        <Media pos={selected.pos} className="detail-media"/>
        <nav className="detail-tabs" aria-label="Sections de la fiche contenu">{tabs.map(value=><button key={value} aria-pressed={tab===value} className={tab===value?"active":""} onClick={()=>setTab(value)}>{value}</button>)}</nav>
        {tabContent[tab]}
      </div>
    </div>
  </main>;
}

function Library() {
  const [tab,setTab]=useState("Profils de jeu");
  const [openProfile,setOpenProfile]=useState(null);
  const [showProfileDelta,setShowProfileDelta]=useState(false);
  const [showInteropReport,setShowInteropReport]=useState(false);
  const [showReverseImpact,setShowReverseImpact]=useState(false);
  const tabs=["Favoris","Suivis","Collections","Profils de jeu","Historique","Recherches enregistrées"];
  const profileComponents={
    "Exploration":[
      {name:"Sentiers de l’aube",version:"1.4.2",origin:"Choisi par vous",policy:"Épinglé"},
      {name:"Vestiges suspendus",version:"1.4.2",origin:"Choisi par vous",policy:"Proposer"},
      {name:"Rivages du couchant",version:"1.4.2",origin:"Inclus par le profil",policy:"Auto sûr"},
      {name:"Aether Core",version:"1.x",origin:"Requis par Sentiers de l’aube",policy:"Minimum accepté"},
    ],
    "Graphismes":[
      {name:"Sommets silencieux",version:"1.4.2",origin:"Choisi par vous",policy:"Épinglé"},
      {name:"Aether Core",version:"1.x",origin:"Requis par Sommets silencieux",policy:"Auto sûr"},
    ],
    "Immersion":[
      {name:"Rivages du couchant",version:"1.4.2",origin:"Choisi par vous",policy:"Proposer"},
      {name:"Brumes des hautes terres",version:"1.4.2",origin:"Inclus par le profil",policy:"Auto sûr"},
      {name:"Aether Core",version:"1.x",origin:"Requis transitivement",policy:"Auto sûr"},
    ],
  };
  if(openProfile){
    const components=profileComponents[openProfile]||[];
    return <main id="main-content" tabIndex="-1" className="page-section profile-detail">
      <button className="back" onClick={()=>{setOpenProfile(null);setShowProfileDelta(false);setShowInteropReport(false);setShowReverseImpact(false);window.scrollTo({top:0,behavior:"auto"})}}>← Retour à la Bibliothèque</button>
      <span className="kicker">Profil de jeu</span><h1>{openProfile}</h1><p className="page-intro">Configuration personnelle de démonstration pour Aetherlands 1.4.2. Privée et locale par défaut.</p>
      <div className="profile-status-row"><span className="support-state">Local uniquement</span><span className="support-state">Non synchronisé</span><span className="support-state">Manager non connecté</span></div>
      <div className="profile-detail-grid"><section className="profile-components"><h2>Composants, origine et politique</h2>{components.map((component,index)=><article key={component.name}><span className="profile-order">{index+1}</span><div><strong>{component.name}</strong><small>Version {component.version} · {component.origin}</small></div><span className={"version-policy "+(component.policy==="Épinglé"?"pinned":"")}>{component.policy}</span></article>)}</section><aside className="profile-decision"><h2>État de la configuration</h2><dl><div><dt>Jeu</dt><dd>Aetherlands 1.4.2</dd></div><div><dt>Conflits déclarés</dt><dd>Aucun dans la démo</dd></div><div><dt>Ordre</dt><dd>Affiché, non appliqué au jeu</dd></div><div><dt>Éléments épinglés</dt><dd>{components.filter(x=>x.policy==="Épinglé").length}</dd></div><div><dt>Synchronisation</dt><dd>Indisponible</dd></div></dl><div className="profile-preview-actions"><button className="quiet" onClick={()=>setShowProfileDelta(v=>!v)}>{showProfileDelta?"Masquer le delta":"Prévisualiser une mise à jour"}</button><button className="quiet" onClick={()=>setShowInteropReport(v=>!v)}>{showInteropReport?"Masquer le rapport":"Prévisualiser import / export"}</button><button className="quiet" onClick={()=>setShowReverseImpact(v=>!v)}>{showReverseImpact?"Masquer l’impact":"Prévisualiser impact d’une désactivation"}</button></div><div className="manager-state"><strong>MODARYX Forge</strong><span>Aucun état d’installation réel n’est connu tant que le runtime desktop n’est pas connecté.</span><button className="quiet" disabled>Diagnostic propre / Safe Profile — runtime indisponible</button></div></aside></div>
      {showProfileDelta&&<section className="profile-delta" aria-live="polite"><div><span className="kicker">Branche de mise à jour</span><h2>Copie avant promotion</h2><p>Aperçu de démonstration : le profil actuel reste intact.</p></div><div className="delta-grid"><article><span>Mettre à jour</span><strong>Vestiges suspendus</strong><small>1.4.2 → 1.5.0-démo · politique Proposer</small></article><article><span>Conserver</span><strong>Sentiers de l’aube 1.4.2</strong><small>Épinglé · aucune mise à jour automatique</small></article><article><span>Dépendance</span><strong>Aether Core 1.x</strong><small>Requis · vérification à refaire avant promotion</small></article><article><span>Résultat</span><strong>Nouvelle branche</strong><small>Aucune mutation réelle dans ce prototype</small></article></div></section>}
      {showInteropReport&&<section className="interop-report" aria-live="polite"><div className="interop-head"><div><span className="kicker">Interopérabilité</span><h2>Rapport d’import / export — démonstration</h2><p>Aucun parser réel n’est exécuté. Le futur import devra préserver les faits inconnus ou signaler explicitement les pertes.</p></div><span className="support-state">0 fichier importé</span></div><div className="interop-grid"><article><span>Reconnu</span><strong>3 champs</strong><small>jeu, versions, composants</small></article><article><span>Préservé</span><strong>1 champ inconnu</strong><small>conservé comme extension opaque</small></article><article><span>Perte silencieuse</span><strong>0 autorisée</strong><small>toute perte doit être signalée</small></article><article><span>Runtime</span><strong>Non connecté</strong><small>aucun import/export réel</small></article></div><div className="interop-details"><strong>Compatibilité estimée de démonstration</strong><span>Structure lisible · source/provider non résolu · artefacts réels absents · action requise avant tout import futur.</span></div></section>}
      {showReverseImpact&&<section className="reverse-impact" aria-live="polite"><div className="interop-head"><div><span className="kicker">Dépendants inverses</span><h2>Impact avant désactivation — démonstration</h2><p>Aucun composant n’est désactivé. Le futur runtime devra calculer cet impact depuis la configuration réelle.</p></div><span className="support-state">0 mutation réelle</span></div><div className="reverse-impact-list"><article><strong>Aether Core 1.x</strong><span>Composant ciblé</span></article><article><strong>Sentiers de l’aube</strong><span>Dépendant direct</span></article><article><strong>Sommets silencieux</strong><span>Dépendant direct — exemple</span></article><article><strong>Profil Graphismes</strong><span>Impact transitif de démonstration</span></article></div><div className="compatibility-proof-note"><strong>Désactivation bloquée dans cette démo</strong><span>Une action réelle devrait proposer annulation, résolution ou branche de test avant mutation.</span></div></section>}
    </main>;
  }
  const panels={
    "Favoris": <section className="library-panel"><div className="section-heading"><div><span className="kicker">Favoris</span><h2>Contenus enregistrés</h2><p>Vos favoris personnels restent distincts des Collections et des profils.</p></div></div><div className="content-grid">{contentItems.slice(0,3).map(item=><ContentCard key={item.title} item={item} onOpen={()=>{}}/>)}</div></section>,
    "Suivis": <section className="library-panel"><span className="kicker">Suivis</span><h2>Créateurs et projets suivis</h2><div className="library-state"><strong>Atelier Boréal</strong><span>Suivi de démonstration · aucune notification distante connectée.</span></div></section>,
    "Collections": <section className="library-panel"><span className="kicker">Collections</span><h2>Sélections organisées</h2><div className="library-cards"><article><strong>Exploration nocturne</strong><span>Collection de démonstration · 4 contenus</span><small>Sélection éditoriale, pas un profil installable.</small></article><article><strong>Visuels sobres</strong><span>Collection de démonstration · 3 contenus</span><small>Aucune installation automatique dans ce prototype.</small></article></div></section>,
    "Profils de jeu": <section className="library-panel"><span className="kicker">Profils de jeu</span><h2>Configurations enregistrées</h2><p className="page-intro">Configurations enregistrées de mods, versions et réglages.</p><div className="profile-library">{[['Exploration','4 contenus','Local uniquement'],['Graphismes','2 contenus','Local uniquement'],['Immersion','3 contenus','Local uniquement']].map(([name,count,state],i)=><article key={name}><Media pos={contentItems[i].pos}/><div><strong>{name}</strong><span>{count}</span><small>{state}</small></div><button className="quiet" onClick={()=>{setOpenProfile(name);setShowProfileDelta(false);setShowInteropReport(false);setShowReverseImpact(false);window.scrollTo({top:0,behavior:"auto"})}}>Ouvrir</button></article>)}</div><div className="manager-state"><strong>Connexion MODARYX Forge</strong><span>Indisponible dans ce prototype — aucune synchronisation ni installation n’est simulée.</span></div></section>,
    "Historique": <section className="library-panel"><span className="kicker">Historique</span><h2>Activité réelle, privée par défaut</h2><div className="empty history-empty"><BookOpen/><h3>Aucun historique réel disponible</h3><p>Le futur historique pourra regrouper téléchargements et actions réellement attestés, filtrables par jeu, source et date. Ce prototype n’invente aucune entrée.</p></div><div className="privacy-note"><strong>Confidentialité</strong><span>L’historique personnel devra être privé par défaut et dissocié des métriques publiques.</span></div></section>,
    "Recherches enregistrées": <section className="library-panel"><span className="kicker">Recherches enregistrées</span><h2>Veilles personnelles</h2><div className="library-state"><strong>Shaders compatibles Aetherlands 1.4.x</strong><span>Recherche de démonstration enregistrée localement.</span></div></section>,
  };
  return <main id="main-content" tabIndex="-1" className="page-section library">
    <span className="kicker">Votre espace</span><h1>Bibliothèque</h1><p className="page-intro">Retrouvez favoris, suivis, collections, profils et historique sans les confondre.</p>
    <section className="library-overview"><div className="library-focus"><Media pos="50% 100%"/><div><span className="demo-label">Jeu actif</span><h2>Aetherlands</h2><p>3 profils de démonstration · version 1.4.2</p><button className="primary">Ouvrir le Game Hub <ArrowRight/></button></div></div><div className="library-summary"><strong>État de la bibliothèque</strong><span>Données locales de démonstration</span><span>Aucun cloud connecté</span><span>Aucun manager connecté</span></div></section>
    <nav className="library-tabs" aria-label="Sections de la bibliothèque">{tabs.map(value=><button key={value} aria-pressed={tab===value} className={tab===value?"active":""} onClick={()=>setTab(value)}>{value}</button>)}</nav>
    {panels[tab]}
  </main>;
}


function CreatorStudio() {
  const [tab,setTab]=useState("Dashboard");
  const [draftStarted,setDraftStarted]=useState(false);
  const [maturity,setMaturity]=useState("Concept");
  const tabs=["Dashboard","Projects","Releases","Upload","Analytics","Support","Reports","Team","Settings"];
  const panel={
    "Dashboard": <><div className="studio-cards"><article><span className="kicker">Brouillons</span><strong>{draftStarted?"1 brouillon local":"Aucun brouillon actif"}</strong><small>État local uniquement — aucune donnée distante.</small></article><article><span className="kicker">Maturité projet</span><strong>{draftStarted?maturity:"Aucun projet actif"}</strong><small>Concept / WiP / Released / Archived restent distincts du canal de release.</small></article><article><span className="kicker">Publication</span><strong>Aucune soumission</strong><small>Aucun backend de publication connecté.</small></article></div><section className="studio-workflow"><div><span className="kicker">Démarrer</span><h2>Créer un projet</h2><p>Identité → jeu → type de contenu → auteurs/crédits → droits → maturité → release.</p><button className="primary" onClick={()=>setDraftStarted(true)}><Plus/>{draftStarted?"Brouillon local créé":"Créer un projet local"}</button></div><ol><li><strong>Projet</strong><span>Identité, maturité et droits</span></li><li><strong>Auteurs</strong><span>Créateur, co-auteurs, studio, assets tiers</span></li><li><strong>Release</strong><span>Version, compatibilité, dépendances</span></li><li><strong>Validation</strong><span>Preview puis soumission explicite</span></li></ol></section></>,
    "Projects": <section className="studio-panel"><span className="kicker">Projects</span><h2>Projets</h2>{draftStarted?<><div className="studio-row project-row"><div><strong>Projet sans titre</strong><span>Brouillon local · Aetherlands · type à choisir</span></div><span className="support-state">{maturity}</span></div><section className="project-maturity"><div><span className="kicker">Maturité</span><h3>État du projet</h3><p>La maturité décrit le projet ; elle ne remplace pas Stable/Beta/Alpha d’une release.</p></div><div className="filter-chips" role="group" aria-label="Maturité du projet">{["Concept","WiP","Released","Archived"].map(value=><button key={value} className={maturity===value?"selected":""} onClick={()=>setMaturity(value)}>{value}</button>)}</div></section><section className="credits-panel"><span className="kicker">Crédits structurés</span><h3>Auteurs & droits</h3><div className="credits-list"><div><strong>Vous</strong><span>Auteur principal</span><em>Original</em></div><div><strong>Atelier Boréal</strong><span>Studio / équipe de démonstration</span><em>Rôle à confirmer</em></div><div><strong>Assets tiers</strong><span>Aucun déclaré</span><em>Preuve requise si ajouté</em></div></div><p>Aucune publication réelle n’est possible tant que auteurs, licences et permissions ne sont pas complets.</p></section></>:<div className="empty"><Stack/><h3>Aucun projet de démonstration</h3><p>Créez un brouillon local depuis le Dashboard.</p></div>}</section>,
    "Releases": <section className="studio-panel"><span className="kicker">Releases</span><h2>Préparer une release</h2><div className="release-context"><strong>Maturité projet : {draftStarted?maturity:"non définie"}</strong><span>Le canal de release restera une décision séparée.</span></div><div className="release-steps">{["Version","Canal","Version du jeu","Édition / plateforme","Loader / framework","Dépendances","Conflits","Fichiers","Changelog","Provenance","Crédits & droits","Validation","Submit"].map((value,i)=><div key={value}><span>{String(i+1).padStart(2,"0")}</span><strong>{value}</strong><small>{i<2?"À définir":"Non renseigné"}</small></div>)}</div><section className="platform-validation"><span className="kicker">Pipeline de validation — démonstration</span><h3>Validation par plateforme</h3><div><article><strong>PC</strong><span>Non testé</span><small>Aucune QA réelle exécutée</small></article><article><strong>Console</strong><span>Non évalué</span><small>Aucune soumission plateforme</small></article><article><strong>Crossplay</strong><span>PREUVE MANQUANTE</span><small>Ne jamais déduire du statut PC</small></article></div><p>Qualité, sécurité, droits, compatibilité et validation plateforme restent des dimensions distinctes.</p></section><p className="studio-note">Créer un projet ne crée jamais automatiquement une release.</p></section>,
    "Upload": <section className="studio-panel"><span className="kicker">Upload</span><h2>Fichiers de release</h2><div className="upload-zone"><strong>Zone d’upload de démonstration</strong><span>Clavier accessible · aucun fichier n’est envoyé dans ce prototype.</span><button className="quiet" disabled>Sélectionner un fichier — backend indisponible</button></div><p className="studio-note">Une erreur d’upload réelle devra préserver le brouillon local.</p></section>,
    "Analytics": <section className="studio-panel"><span className="kicker">Analytics</span><h2>Mesures</h2><div className="unavailable-state"><strong>Données indisponibles</strong><span>Aucune vue, téléchargement, installation ou favori n’est simulé sans source réelle.</span></div></section>,
    "Support": <section className="studio-panel"><span className="kicker">Support</span><h2>Support du projet</h2><div className="unavailable-state"><strong>Service non connecté</strong><span>Questions, bugs et discussions resteront séparés de la modération. Pour une composition, le support de composition relève de son curateur/auteur, pas automatiquement des auteurs de chaque composant.</span></div></section>,
    "Reports": <section className="studio-panel"><span className="kicker">Reports</span><h2>Signalements</h2><div className="unavailable-state"><strong>Aucun signalement réel</strong><span>Les outils de modération n’apparaissent qu’avec permissions serveur réelles.</span></div></section>,
    "Team": <section className="studio-panel"><span className="kicker">Team</span><h2>Équipe / studio</h2><div className="studio-row"><div><strong>Atelier de démonstration</strong><span>Rôles et permissions non connectés à un backend.</span></div><span className="support-state">Local uniquement</span></div></section>,
    "Settings": <section className="studio-panel"><span className="kicker">Settings</span><h2>Paramètres du Studio</h2><div className="permissions-list"><div><dt>Sauvegarde locale</dt><dd>Prévue</dd></div><div><dt>Sauvegarde distante</dt><dd>Indisponible</dd></div><div><dt>Publication</dt><dd>Action explicite requise</dd></div><div><dt>Réauthentification</dt><dd>Backend requis</dd></div></div></section>,
  };
  return <main id="main-content" tabIndex="-1" className="page-section creator-studio">
    <span className="kicker">Créer</span><h1>Creator Studio</h1><p className="page-intro">Créez un projet, structurez auteurs et droits, préparez une release et contrôlez provenance et validation sans simuler les services absents.</p>
    <div className="studio-shell"><nav className="studio-nav" aria-label="Navigation Creator Studio">{tabs.map(value=><button key={value} aria-pressed={tab===value} className={tab===value?"active":""} onClick={()=>setTab(value)}>{value}</button>)}</nav><div className="studio-content">{panel[tab]}</div></div>
  </main>;
}


function AccountCenter({ initialTab="Compte" }) {
  const [tab,setTab]=useState(initialTab);
  const [onboarding,setOnboarding]=useState(false);
  const [step,setStep]=useState(0);
  const [prefs,setPrefs]=useState({ambience:true,reduced:false,compact:false});
  const [remoteAccount,setRemoteAccount]=useState({state:"LOADING",loginAvailable:false,profile:null,authority:null});
  const [accountMessage,setAccountMessage]=useState("");
  const [remoteNotifications,setRemoteNotifications]=useState({state:"IDLE",items:[],unreadCount:0});
  const [remoteHistory,setRemoteHistory]=useState({state:"IDLE",items:[]});
  const tabs=["Compte","Profil","Confidentialité","Notifications","Apparence","Accessibilité","Données locales"];
  const onboardingSteps=[
    ["Jeux","Choisissez quelques jeux pour contextualiser la découverte. Aucun choix n’est envoyé."],
    ["Types de contenus","Indiquez vos préférences de découverte, sans bloquer le reste du catalogue."],
    ["Collections et Profils de jeu","Une Collection organise et partage ; un Profil de jeu décrit une configuration personnelle."],
    ["Bibliothèque","Favoris, suivis, Collections, Profils de jeu et recherches restent séparés et privés par défaut."],
  ];
  const setPref=(key)=>setPrefs(current=>({...current,[key]:!current[key]}));

  const refreshRemoteAccount=async()=>{
    const next=await resolveAccountRemoteState();
    setRemoteAccount(next);
    return next;
  };

  useEffect(()=>{
    let cancelled=false;
    resolveAccountRemoteState().then(next=>{if(!cancelled)setRemoteAccount(next);});
    return ()=>{cancelled=true;};
  },[]);
  useEffect(()=>{
    if(tab!=="Données locales"||remoteAccount.state!=="AUTHENTICATED") return;
    let cancelled=false;
    setRemoteHistory(current=>({...current,state:"LOADING"}));
    getDataHistory().then(result=>{
      if(cancelled) return;
      if(!result.ok){
        setRemoteHistory({state:"UNAVAILABLE",items:[]});
        return;
      }
      setRemoteHistory({state:"READY",items:Array.isArray(result.body?.items)?result.body.items:[]});
    });
    return ()=>{cancelled=true;};
  },[tab,remoteAccount.state]);

  useEffect(()=>{
    if(tab!=="Notifications"||remoteAccount.state!=="AUTHENTICATED") return;
    let cancelled=false;
    setRemoteNotifications(current=>({...current,state:"LOADING"}));
    getNotifications().then(result=>{
      if(cancelled) return;
      if(!result.ok){
        setRemoteNotifications({state:"UNAVAILABLE",items:[],unreadCount:0});
        return;
      }
      setRemoteNotifications({
        state:"READY",
        items:Array.isArray(result.body?.items)?result.body.items:[],
        unreadCount:Number(result.body?.unreadCount||0)
      });
    });
    return ()=>{cancelled=true;};
  },[tab,remoteAccount.state]);

  const signIn=()=>{
    window.location.assign(authLoginUrl("/account"));
  };
  const signOut=async()=>{
    setAccountMessage("Déconnexion…");
    const result=await logoutAccountSession();
    if(!result.ok){
      setAccountMessage("Déconnexion indisponible — aucune session n’a été simulée.");
      return;
    }
    setAccountMessage("Session fermée.");
    await refreshRemoteAccount();
  };

  const authenticated=remoteAccount.state==="AUTHENTICATED";
  const profile=remoteAccount.profile;
  const accountHeading=authenticated
    ? `Bonjour ${profile?.displayName || profile?.handle || "membre"}.`
    : "Vous explorez MODARYX en mode invité.";
  const sessionLabel=remoteAccount.state==="LOADING"
    ? "Vérification same-origin…"
    : authenticated
      ? `Authentifiée${remoteAccount.authority?.role ? " · "+remoteAccount.authority.role : ""}`
      : remoteAccount.state==="GUEST"
        ? "Anonyme · connexion réelle disponible"
        : "Anonyme · backend réel indisponible";

  const accountPanel=<section className="account-panel">
    <span className="kicker">Compte</span>
    <h2>{accountHeading}</h2>
    <p>{authenticated
      ? "La session affichée provient du backend MODARYX same-origin. Aucun token fournisseur n’est exposé au navigateur."
      : "Recherche, jeux, contenus, Collections publiques et profils créateurs restent accessibles sans compte."}</p>
    <div className="session-state"><strong>Session</strong><span>{sessionLabel}</span></div>
    <div className="account-actions">
      {!authenticated&&<button className="primary" onClick={()=>{setOnboarding(true);setStep(0)}}>Découvrir l’onboarding joueur <ArrowRight/></button>}
      {!authenticated&&<button className="quiet" disabled={!remoteAccount.loginAvailable} onClick={signIn}>{remoteAccount.loginAvailable?"Se connecter avec MODARYX":"Se connecter — backend indisponible"}</button>}
      {authenticated&&<button className="quiet" onClick={signOut}>Se déconnecter</button>}
    </div>
    {accountMessage&&<p className="settings-note" role="status">{accountMessage}</p>}
    {onboarding&&!authenticated&&<div className="onboarding-card" aria-live="polite"><div><span className="kicker">Onboarding joueur · {step+1}/{onboardingSteps.length}</span><h3>{onboardingSteps[step][0]}</h3><p>{onboardingSteps[step][1]}</p></div><div className="onboarding-actions"><button className="quiet" onClick={()=>setOnboarding(false)}>Passer l’onboarding</button><button className="primary" onClick={()=>step<onboardingSteps.length-1?setStep(step+1):setOnboarding(false)}>{step<onboardingSteps.length-1?"Suivant":"Terminer"}</button></div></div>}
  </section>;

  const profilePanel=<section className="account-panel">
    <span className="kicker">Profil public</span>
    <h2>{profile?.displayName || profile?.handle || "Aucun profil public actif"}</h2>
    <p>{profile
      ? `Profil réel chargé depuis la session same-origin · visibilité ${profile.visibility || "non renseignée"}.`
      : "Compte, profil public et capacité créateur restent trois concepts distincts. Une session réelle sera requise pour publier un profil."}</p>
    {!profile&&<div className="unavailable-state"><strong>Édition distante indisponible</strong><span>Les changements non sauvegardés ne doivent jamais être perdus lorsque le backend sera connecté.</span></div>}
    {profile&&<div className="session-state"><strong>@{profile.handle || "profil"}</strong><span>{profile.isCreator?"Créateur":"Profil membre"}</span></div>}
  </section>;

  const panel={
    "Compte": accountPanel,
    "Profil": profilePanel,
    "Confidentialité": <section className="account-panel"><span className="kicker">Confidentialité</span><h2>Privé par défaut</h2><div className="privacy-grid">{["Bibliothèque","Favoris","Profils de jeu","Brouillons","Recherches enregistrées"].map(value=><article key={value}><strong>{value}</strong><span>Privé / local par défaut</span></article>)}</div><p className="settings-note">Tout partage devra demander une action explicite.</p></section>,
    "Notifications": <section className="account-panel notifications-center"><span className="kicker">Notifications</span><h2>Centre de notifications</h2>
      {remoteAccount.state==="AUTHENTICATED"&&remoteNotifications.state==="LOADING"&&<div className="empty notification-empty"><Bell/><h3>Chargement des notifications…</h3><p>Lecture same-origin du compte actif.</p></div>}
      {remoteAccount.state==="AUTHENTICATED"&&remoteNotifications.state==="READY"&&remoteNotifications.items.length===0&&<div className="empty notification-empty"><Bell/><h3>Aucune notification réelle</h3><p>Le compteur reste à zéro tant qu’aucun événement serveur réel n’existe.</p></div>}
      {remoteAccount.state==="AUTHENTICATED"&&remoteNotifications.state==="READY"&&remoteNotifications.items.length>0&&<div className="notification-demo-list" aria-label="Notifications in-app réelles">{remoteNotifications.items.map(item=><article key={item.id}><div><span className="demo-label">{item.readAt?"Lue":"Non lue"} · {item.priority}</span><strong>{item.title}</strong><p>{item.summary}</p></div>{item.stateLabel&&<span className="rights-state neutral">{item.stateLabel}</span>}<small>{new Date(item.occurredAt).toLocaleString()}</small>{!item.readAt&&<button className="quiet" onClick={async()=>{const result=await markNotificationRead(item.id);if(result.ok)setRemoteNotifications(current=>({...current,items:current.items.map(n=>n.id===item.id?{...n,readAt:result.body?.readAt||new Date().toISOString()}:n),unreadCount:Math.max(0,current.unreadCount-1)}));}}>Marquer comme lue</button>}</article>)}</div>}
      {remoteAccount.state==="AUTHENTICATED"&&remoteNotifications.state==="UNAVAILABLE"&&<div className="unavailable-state"><strong>Notifications in-app indisponibles</strong><span>Aucun événement n’est inventé si le stockage V2 n’est pas disponible.</span></div>}
      {remoteAccount.state!=="AUTHENTICATED"&&<><div className="empty notification-empty"><Bell/><h3>Aucune notification réelle</h3><p>Connectez-vous pour lire les événements in-app réels. Le candidat n’invente ni compteur, ni événement distant.</p></div><div className="notification-demo-list" aria-label="Aperçu fictif des notifications droits éditeurs"><article><div><span className="demo-label">Démonstration · non reçue</span><strong>Réponse éditeur reçue — Aetherlands</strong><p>Autorisation fictive avec limites : seuls les scopes écrits sont applicables.</p></div><span className="rights-state approved">APPROVED_WITH_LIMITS</span><small>Le futur système ouvrira le Rights Case associé. Aucun événement réel dans ce candidat.</small></article><article><div><span className="demo-label">Démonstration · non reçue</span><strong>Revue juridique requise — Project Meridian</strong><p>Une clause ambiguë a été détectée dans le scénario : aucun scope n’est automatiquement débloqué.</p></div><span className="rights-state pending">LEGAL_REVIEW_REQUIRED</span><small>Le dossier reste bloqué jusqu’à validation appropriée.</small></article></div></>}
      <div className="channel-grid"><article><strong>In-app</strong><span>{remoteAccount.state==="AUTHENTICATED"?"Lecture serveur candidate":"Disponible après connexion et événement réel"}</span></article><article><strong>Email</strong><span>Indisponible — infrastructure non connectée</span></article><article><strong>Push</strong><span>Indisponible — infrastructure non connectée</span></article></div>
    </section>,
    "Apparence": <section className="account-panel"><span className="kicker">Apparence</span><h2>Préférences locales</h2><div className="settings-list"><button role="switch" aria-checked={prefs.ambience} onClick={()=>setPref("ambience")}><span><strong>Ambiance vivante</strong><small>Préférence locale de démonstration</small></span><em>{prefs.ambience?"Activée":"Désactivée"}</em></button><button role="switch" aria-checked={prefs.compact} onClick={()=>setPref("compact")}><span><strong>Densité compacte</strong><small>Préférence locale de démonstration</small></span><em>{prefs.compact?"Activée":"Désactivée"}</em></button></div></section>,
    "Accessibilité": <section className="account-panel"><span className="kicker">Accessibilité</span><h2>Accessible sans réglage spécial</h2><p>Les préférences complètent le produit mais ne remplacent jamais un design accessible par défaut.</p><div className="settings-list"><button role="switch" aria-checked={prefs.reduced} onClick={()=>setPref("reduced")}><span><strong>Effets réduits</strong><small>Préférence locale de démonstration</small></span><em>{prefs.reduced?"Activés":"Désactivés"}</em></button></div><div className="accessibility-proof"><strong>Candidat actuel</strong><span>Focus visible 3 px · cibles tactiles ≥44 px · règle prefers-reduced-motion présente.</span></div></section>,
    "Données locales": <section className="account-panel"><span className="kicker">Données & historique</span><h2>Local + historique serveur</h2><div className="data-list"><div><strong>Favoris de démonstration</strong><span>Local</span></div><div><strong>Profils de jeu de démonstration</strong><span>Local</span></div><div><strong>Brouillons de démonstration</strong><span>Local</span></div><div><strong>Migration legacy</strong><span>Préservée / contrôlée</span></div></div>
      {remoteAccount.state!=="AUTHENTICATED"&&<div className="unavailable-state"><strong>Historique serveur non chargé</strong><span>Une session réelle est requise ; aucune entrée n’est simulée.</span></div>}
      {remoteAccount.state==="AUTHENTICATED"&&remoteHistory.state==="LOADING"&&<p className="settings-note">Chargement de l’historique propriétaire…</p>}
      {remoteAccount.state==="AUTHENTICATED"&&remoteHistory.state==="UNAVAILABLE"&&<div className="unavailable-state"><strong>Historique serveur indisponible</strong><span>La migration distante V2 n’est pas considérée active tant qu’elle n’est pas prouvée.</span></div>}
      {remoteAccount.state==="AUTHENTICATED"&&remoteHistory.state==="READY"&&remoteHistory.items.length===0&&<div className="empty"><h3>Aucun événement historique réel</h3><p>Aucune entrée fictive n’est ajoutée.</p></div>}
      {remoteAccount.state==="AUTHENTICATED"&&remoteHistory.state==="READY"&&remoteHistory.items.length>0&&<div className="data-list">{remoteHistory.items.map(item=><div key={item.id}><strong>{item.entityKind} · {item.action}</strong><span>r{item.revision} · {new Date(item.occurredAt).toLocaleString()}</span></div>)}</div>}
      <button className="quiet" disabled>Exporter — fonction réelle non connectée</button></section>,
  };
  return <main id="main-content" tabIndex="-1" className="page-section account-center"><span className="kicker">Paramètres</span><h1>Compte & préférences</h1><p className="page-intro">Contrôlez session, confidentialité, notifications et données locales sans transformer une capacité absente en promesse.</p><div className="account-shell"><nav className="account-nav" aria-label="Sections du compte">{tabs.map(value=><button key={value} aria-pressed={tab===value} className={tab===value?"active":""} onClick={()=>setTab(value)}>{value}</button>)}</nav>{panel[tab]}</div></main>;
}

function RightsDashboard() {
  const [selected,setSelected]=useState("aetherlands");
  const [triageDecision,setTriageDecision]=useState("TRIAGE");
  const [contactState,setContactState]=useState("CONTACT_CANDIDATE");
  const [requestState,setRequestState]=useState("REQUEST_NOT_READY");
  const [outboundState,setOutboundState]=useState("NOT_QUEUED");
  const [inboundState,setInboundState]=useState("NO_INBOUND");
  const [lifecycleState,setLifecycleState]=useState("ACTIVE_WITH_LIMITS");
  const [ipCaseState,setIpCaseState]=useState("RECEIVED");
  const [ipAssetLocated,setIpAssetLocated]=useState(false);
  const [ipRestricted,setIpRestricted]=useState(false);
  const current=rightsDemoCases.find(item=>item.id===selected) || rightsDemoCases[0];
  const lifecycleLocked=lifecycleState==="EXPIRED"||lifecycleState==="REVOKED";
  const statusClass=current.status==="APPROVED_WITH_LIMITS"?"approved":current.status==="AWAITING_RESPONSE"?"pending":"neutral";
  return <main id="main-content" tabIndex="-1" className="page-section rights-dashboard">
    <span className="kicker">Administration · démonstration</span>
    <h1>Droits des jeux</h1>
    <p className="page-intro">Suivez les demandes éditeurs scope par scope sans transformer une absence de réponse ou une formulation ambiguë en autorisation.</p>
    <div className="rights-safety-note"><strong>Aucune demande réelle n’est envoyée dans ce prototype.</strong><span>Les jeux, éditeurs, réponses et permissions ci-dessous servent uniquement à valider le workflow et l’interface.</span></div>
    <section className="support-triage" aria-label="Triage des demandes de support de démonstration">
      <div className="support-triage-head"><div><span className="kicker">Demandes membres · démonstration</span><h2>Triage avant tout contact éditeur</h2><p>Une demande membre ne crée ni permission, ni partenariat, ni Rights Case réel. MODARYX doit d’abord décider si le support produit est accepté.</p></div><span className={`rights-state ${triageDecision==="ACCEPTED_SAFE_BASELINE"?"approved":triageDecision==="DECLINED_PRODUCT"?"neutral":"pending"}`}>{triageDecision}</span></div>
      <article className="support-triage-card">
        <div><strong>Project Meridian</strong><span>PC · demande membre fictive</span><small>Motif : souhaiter un Game Hub et des contenus compatibles.</small></div>
        <div className="support-triage-checks">
          <span><strong>Existence du jeu</strong><em>À vérifier</em></span>
          <span><strong>Doublon</strong><em>Aucun détecté dans la démo</em></span>
          <span><strong>Pertinence modding</strong><em>À confirmer</em></span>
          <span><strong>Restrictions / risque légal</strong><em>Revue requise</em></span>
        </div>
      </article>
      <div className="support-triage-actions">
        <button className="primary" onClick={()=>setTriageDecision("ACCEPTED_SAFE_BASELINE")}>Accepter la baseline sûre</button>
        <button className="quiet" onClick={()=>setTriageDecision("DECLINED_PRODUCT")}>Refuser la demande</button>
        {triageDecision!=="TRIAGE"&&<button className="quiet" onClick={()=>setTriageDecision("TRIAGE")}>Réinitialiser le scénario</button>}
      </div>
      {triageDecision==="ACCEPTED_SAFE_BASELINE"&&<div className="support-triage-result accepted" role="status"><strong>Baseline sûre de démonstration acceptée</strong><span>Rights Case de démonstration préparé — non créé réellement.</span><small>Aucun contact éditeur, aucun outbound et aucun asset officiel n’est activé par cette action locale.</small></div>}
      {triageDecision==="DECLINED_PRODUCT"&&<div className="support-triage-result declined" role="status"><strong>Demande locale refusée</strong><span>Aucun Rights Case et aucun contact éditeur.</span></div>}
    </section>
    {triageDecision==="ACCEPTED_SAFE_BASELINE"&&<section className="publisher-contact-demo" aria-label="Vérification du contact éditeur de démonstration">
      <div className="publisher-contact-head"><div><span className="kicker">Contact éditeur · démonstration</span><h2>Vérifier le canal avant toute demande</h2><p>Le scénario reste fictif : aucun domaine, formulaire ou email réel n’est contacté. Une adresse devinée ne peut jamais être utilisée.</p></div><span className={`rights-state ${contactState==="CONTACT_VERIFIED"?"approved":"pending"}`}>{contactState}</span></div>
      <div className="publisher-contact-grid">
        <article><span>Canal candidat</span><strong>Portail juridique fictif de l’éditeur</strong><small>Source officielle simulée uniquement pour tester le workflow.</small></article>
        <article><span>Preuve de contact</span><strong>{contactState==="CONTACT_VERIFIED"?"Domaine officiel fictif + page licensing vérifiés":"À vérifier avant tout outbound"}</strong><small>Aucun contact personnel ou forum n’est accepté comme preuve suffisante.</small></article>
        <article><span>Scopes préparés</span><strong>Logo · key art · listing · Forge séparé</strong><small>Chaque scope reste indépendant et doit être explicitement demandé.</small></article>
      </div>
      <div className="publisher-contact-actions">
        <button className="quiet" onClick={()=>{setContactState("CONTACT_VERIFIED");setRequestState("REQUEST_NOT_READY");setOutboundState("NOT_QUEUED");setInboundState("NO_INBOUND");}}>Vérifier le canal de démonstration</button>
        <button className="primary" disabled={contactState!=="CONTACT_VERIFIED"} onClick={()=>{setRequestState("REQUEST_READY");setOutboundState("NOT_QUEUED");setInboundState("NO_INBOUND");}}>Préparer la demande structurée</button>
      </div>
      <div className="publisher-request-state" role="status"><strong>{requestState}</strong><span>{requestState==="REQUEST_READY"?"Demande fictive prête : scopes explicites, canal vérifié, aucun envoi réel.":"Vérification du contact requise avant préparation."}</span><small>Outbound réel indisponible · aucune adresse réelle utilisée.</small></div>
      <section className="publisher-outbound-demo" aria-label="Transport outbound éditeur de démonstration">
        <div className="publisher-outbound-head"><div><span className="kicker">Transport outbound · démonstration</span><h3>Automatiser l’envoi sans confondre livraison et autorisation</h3><p>Cette simulation locale teste la queue, l’idempotence et les états de transport. Aucun email, formulaire ou API externe n’est appelé.</p></div><span className={`rights-state ${outboundState==="DELIVERED"?"approved":outboundState==="BOUNCED"?"neutral":"pending"}`}>{outboundState}</span></div>
        <div className="publisher-outbound-grid">
          <article><span>Logical request id</span><strong>PUB-DEMO-MERIDIAN-V1</strong><small>Conservé lors d’un retry technique.</small></article>
          <article><span>Idempotence</span><strong>Une seule demande logique</strong><small>Un replay ne doit jamais créer un double envoi.</small></article>
          <article><span>Effet sur les droits</span><strong>Aucun</strong><small>DELIVERED ne signifie jamais APPROVED.</small></article>
        </div>
        <div className="publisher-outbound-actions">
          <button className="quiet" disabled={requestState!=="REQUEST_READY"||contactState!=="CONTACT_VERIFIED"||outboundState!=="NOT_QUEUED"} onClick={()=>setOutboundState("OUTBOUND_QUEUED")}>Simuler mise en file locale</button>
          <button className="quiet" disabled={outboundState!=="OUTBOUND_QUEUED"} onClick={()=>setOutboundState("PROVIDER_ACCEPTED")}>Simuler provider accepted</button>
          <button className="quiet" disabled={outboundState!=="PROVIDER_ACCEPTED"} onClick={()=>setOutboundState("DELIVERED")}>Simuler livraison</button>
          <button className="quiet" disabled={!["OUTBOUND_QUEUED","PROVIDER_ACCEPTED"].includes(outboundState)} onClick={()=>{setOutboundState("BOUNCED");setInboundState("NO_INBOUND");}}>Simuler bounce</button>
          <button className="quiet" disabled={outboundState==="NOT_QUEUED"} onClick={()=>{setOutboundState("NOT_QUEUED");setInboundState("NO_INBOUND");}}>Réinitialiser le transport</button>
        </div>
        <div className={`publisher-outbound-result ${outboundState.toLowerCase()}`} role="status">
          <strong>{outboundState==="DELIVERED"?"DELIVERED ≠ autorisation éditeur":outboundState==="BOUNCED"?"Bounce : arrêt sûr, aucun contact deviné":outboundState==="PROVIDER_ACCEPTED"?"Provider accepté — droits inchangés":outboundState==="OUTBOUND_QUEUED"?"Queue locale simulée — aucun envoi réel":"Transport non démarré"}</strong>
          <span>{outboundState==="DELIVERED"?"La livraison du message n’accorde aucun scope. Une réponse éditeur explicite reste nécessaire.":outboundState==="BOUNCED"?"Le scénario s’arrête sans chercher ni fabriquer une autre adresse.":outboundState==="PROVIDER_ACCEPTED"?"Le provider fictif a accepté le transport, pas la demande de droits.":outboundState==="OUTBOUND_QUEUED"?"La demande logique est seulement mise en file dans la démonstration.":"REQUEST_READY doit être atteint avant toute mise en file."}</span>
          <small>Prototype local uniquement · queue/provider/webhook réels NON IMPLÉMENTÉS.</small>
        </div>
      </section>

      <section className="publisher-inbound-demo" aria-label="Réception et corrélation éditeur de démonstration">
        <div className="publisher-inbound-head"><div><span className="kicker">Inbound éditeur · démonstration</span><h3>Recevoir une réponse sans lui accorder de droits par défaut</h3><p>La réception, la corrélation et la provenance sont des étapes distinctes. Aucun message, header ou fichier réel n’est reçu dans cette simulation.</p></div><span className={`rights-state ${["PROVENANCE_VERIFIED","READY_FOR_INTERPRETATION"].includes(inboundState)?"approved":inboundState==="REJECTED_UNTRUSTED"?"neutral":"pending"}`}>{inboundState}</span></div>
        <div className="publisher-inbound-grid">
          <article><span>Corrélation</span><strong>{["CORRELATED","PROVENANCE_VERIFIED","READY_FOR_INTERPRETATION"].includes(inboundState)?"PUB-DEMO-MERIDIAN-V1 ↔ Rights Case fictif":"À établir"}</strong><small>Message-ID, In-Reply-To, References et token de thread sont des indices de corrélation.</small></article>
          <article><span>Provenance</span><strong>{["PROVENANCE_VERIFIED","READY_FOR_INTERPRETATION"].includes(inboundState)?"Signaux techniques cohérents · démo":"Non vérifiée"}</strong><small>SPF/DKIM/DMARC simulés ne prouvent jamais à eux seuls l’autorité juridique.</small></article>
          <article><span>Pièces jointes</span><strong>Quarantaine obligatoire</strong><small>Hash + scan avant usage. Aucun macro, script ou contenu actif n’est exécuté.</small></article>
          <article><span>Effet sur les droits</span><strong>Aucun</strong><small>Même une réponse corrélée doit encore passer par le contrat d’interprétation scope par scope.</small></article>
        </div>
        <div className="publisher-inbound-actions">
          <button className="quiet" disabled={outboundState!=="DELIVERED"||inboundState!=="NO_INBOUND"} onClick={()=>setInboundState("INBOUND_RECEIVED")}>Simuler réponse reçue</button>
          <button className="quiet" disabled={inboundState!=="INBOUND_RECEIVED"} onClick={()=>setInboundState("CORRELATED")}>Corréler au Rights Case</button>
          <button className="quiet" disabled={inboundState!=="CORRELATED"} onClick={()=>setInboundState("PROVENANCE_VERIFIED")}>Vérifier la provenance</button>
          <button className="quiet" disabled={inboundState!=="PROVENANCE_VERIFIED"} onClick={()=>setInboundState("READY_FOR_INTERPRETATION")}>Préparer l’interprétation</button>
          <button className="quiet" disabled={inboundState==="NO_INBOUND"} onClick={()=>setInboundState("REJECTED_UNTRUSTED")}>Simuler provenance non fiable</button>
          <button className="quiet" disabled={inboundState==="NO_INBOUND"} onClick={()=>setInboundState("NO_INBOUND")}>Réinitialiser l’inbound</button>
        </div>
        <div className={`publisher-inbound-result ${inboundState.toLowerCase()}`} role="status">
          <strong>{inboundState==="READY_FOR_INTERPRETATION"?"READY_FOR_INTERPRETATION ≠ autorisation":inboundState==="PROVENANCE_VERIFIED"?"Provenance technique vérifiée · droits inchangés":inboundState==="CORRELATED"?"Réponse corrélée · provenance encore à vérifier":inboundState==="INBOUND_RECEIVED"?"Réponse fictive reçue · corrélation requise":inboundState==="REJECTED_UNTRUSTED"?"Inbound non fiable : fail closed":"Aucune réponse réelle reçue"}</strong>
          <span>{inboundState==="READY_FOR_INTERPRETATION"?"Le message fictif peut seulement entrer dans l’étape d’interprétation structurée.":inboundState==="PROVENANCE_VERIFIED"?"Les signaux simulés sont cohérents, mais aucun scope n’est encore accordé.":inboundState==="CORRELATED"?"Le message correspond à la demande logique fictive ; l’identité et l’autorité restent distinctes.":inboundState==="INBOUND_RECEIVED"?"Le contenu brut et les headers seraient conservés avant tout parsing.":inboundState==="REJECTED_UNTRUSTED"?"Aucun droit n’est débloqué et aucune adresse de confiance n’est créée par supposition.":"La démo attend une livraison fictive avant de simuler une réponse."}</span>
          <small>Prototype local uniquement · mailbox, webhook, parser, scanner et provenance réels NON IMPLÉMENTÉS.</small>
        </div>
      </section>
    </section>}
    <section className="rights-summary" aria-label="Résumé des dossiers de démonstration">
      <article><span className="kicker">Avec limites</span><strong>1</strong><small>Scopes séparés</small></article>
      <article><span className="kicker">En attente</span><strong>1</strong><small>Aucun droit supplémentaire</small></article>
      <article><span className="kicker">Sans réponse</span><strong>1</strong><small>Baseline MODARYX uniquement</small></article>
    </section>
    <div className="rights-layout">
      <nav className="rights-case-list" aria-label="Dossiers droits de démonstration">
        {rightsDemoCases.map(item=><button key={item.id} className={selected===item.id?"active":""} onClick={()=>setSelected(item.id)}>
          <span><strong>{item.game}</strong><small>{item.publisher}</small></span><em>{item.status}</em>
        </button>)}
      </nav>
      <section className="rights-detail" aria-live="polite">
        <div className="rights-detail-head"><div><span className="kicker">Rights Case fictif</span><h2>{current.game}</h2><p>{current.summary}</p></div><span className={`rights-state ${statusClass}`}>{current.status}</span></div>
        <div className="rights-response"><strong>Dernier état</strong><span>{current.response}</span></div>
        <div className="rights-scope-grid">
          {current.scopes.map(([scope,value])=><article key={scope}><strong>{scope}</strong><span>{value}</span></article>)}
        </div>

        <section className="rights-lifecycle-demo" aria-label="Cycle de vie des autorisations de démonstration">
          <div className="rights-lifecycle-head"><div><span className="kicker">Cycle de vie · démonstration</span><h3>Expiration et révocation</h3><p>Une autorisation ne reste jamais active indéfiniment par défaut. Le système doit rebloquer automatiquement les usages dépendants lorsqu’elle expire ou est révoquée.</p></div><span className={`rights-state ${lifecycleLocked?"neutral":lifecycleState==="EXPIRING_SOON"?"pending":"approved"}`}>{lifecycleState}</span></div>
          <div className="rights-lifecycle-grid">
            <article><span>Assets officiels dépendants</span><strong>{lifecycleLocked?"BLOQUÉS":"Scopes écrits uniquement"}</strong><small>{lifecycleLocked?"Fallback vers la baseline originale MODARYX.":"Aucune extension implicite des droits."}</small></article>
            <article><span>MODARYX Forge</span><strong>BLOQUÉ</strong><small>Droit séparé, jamais déduit d’une permission Web.</small></article>
            <article><span>Réactivation</span><strong>{lifecycleLocked?"Nouvelle preuve requise":"Surveillance active"}</strong><small>Aucune réactivation silencieuse après expiration ou révocation.</small></article>
          </div>
          <div className="rights-lifecycle-actions">
            <button className="quiet" onClick={()=>setLifecycleState("EXPIRING_SOON")}>Simuler expiration proche</button>
            <button className="quiet" onClick={()=>setLifecycleState("EXPIRED")}>Simuler expiration</button>
            <button className="quiet" onClick={()=>setLifecycleState("REVOKED")}>Simuler révocation</button>
            <button className="quiet" onClick={()=>setLifecycleState("ACTIVE_WITH_LIMITS")}>Réinitialiser le scénario</button>
          </div>
          <div className={`rights-lifecycle-result ${lifecycleLocked?"locked":"active"}`} role="status"><strong>{lifecycleLocked?"Usages dépendants rebloqués":"Surveillance de l’autorisation"}</strong><span>{lifecycleLocked?"Aucun asset ou avantage dépendant ne reste actif dans ce scénario.":"La démonstration conserve uniquement les scopes explicitement accordés."}</span><small>Prototype local uniquement · aucune licence réelle n’est modifiée.</small></div>
        </section>

        <section className="ip-takedown-demo" aria-label="Signalement IP et takedown de démonstration">
          <div className="ip-takedown-head"><div><span className="kicker">IP / takedown · démonstration</span><h3>Contenir un asset contesté sans perdre les preuves</h3><p>Ce scénario reste local et fictif. Un signalement ne devient pas automatiquement une décision juridique, mais MODARYX doit pouvoir isoler précisément l’asset, préserver sa provenance et basculer vers un fallback sûr.</p></div><span className={`rights-state ${ipCaseState==="LEGAL_REVIEW_REQUIRED"?"pending":ipRestricted?"neutral":"approved"}`}>{ipCaseState}</span></div>
          <div className="ip-case-grid">
            <article><span>Cas fictif</span><strong>IP-DEMO-014</strong><small>Asset ambiance original de démonstration · aucune personne réelle.</small></article>
            <article><span>Autorité déclarée</span><strong>AUTHORITY_UNVERIFIED</strong><small>Aucune autorité juridique complète n’est inférée.</small></article>
            <article><span>Preuves</span><strong>Conservées</strong><small>Provenance et historique ne sont jamais supprimés par une restriction.</small></article>
          </div>
          <div className="ip-case-actions">
            <button className="quiet" onClick={()=>{setIpAssetLocated(true);setIpCaseState("CONTENT_LOCATED");}}>Localiser l’asset de démonstration</button>
            <button className="quiet" disabled={!ipAssetLocated} onClick={()=>{setIpRestricted(true);setIpCaseState("TEMP_RESTRICTED");}}>Appliquer fallback temporaire</button>
            <button className="quiet" disabled={!ipRestricted} onClick={()=>setIpCaseState("LEGAL_REVIEW_REQUIRED")}>Escalader en revue juridique</button>
            <button className="quiet" onClick={()=>{setIpCaseState("RECEIVED");setIpAssetLocated(false);setIpRestricted(false);}}>Réinitialiser le cas IP</button>
          </div>
          <div className={`ip-case-result ${ipRestricted?"restricted":"open"}`} role="status"><strong>{ipRestricted?"Asset contesté retiré du scénario public":"Aucune restriction technique appliquée"}</strong><span>{ipRestricted?"Fallback original MODARYX actif dans la démonstration. Réupload automatique bloqué conceptuellement.":"Localisation et revue requises avant toute action."}</span><small>{ipCaseState==="LEGAL_REVIEW_REQUIRED"?"LEGAL_REVIEW_REQUIRED — aucune restauration automatique.":"Prototype local uniquement · aucun contenu réel modifié."}</small></div>
        </section>
        <section className="rights-interpretation-demo">
          <div className="rights-interpretation-head"><div><span className="kicker">Interprétation automatique · démonstration</span><h3>Lecture structurée de la réponse</h3></div><span className={`rights-state ${current.interpretation?"approved":"neutral"}`}>{current.interpretation?.state || "AUCUNE RÉPONSE INTERPRÉTABLE"}</span></div>
          {current.interpretation?<><p>{current.interpretation.detail}</p><small>{current.interpretation.notification}</small></>:<p>Aucune réponse exploitable ne permet d’accorder un scope supplémentaire.</p>}
          <div className="rights-legal-fallback"><strong>Garde-fou juridique</strong><span>Clause ambiguë, conflit de documents ou portée incertaine → <b>LEGAL_REVIEW_REQUIRED</b>. Aucun déblocage automatique.</span></div>
        </section>
        <div className="rights-guards">
          <strong>Garde-fous actifs</strong>
          <ul><li>Contact officiel vérifié requis avant envoi.</li><li>NO_RESPONSE et refus ne débloquent aucun scope.</li><li>Droits Web et MODARYX Forge restent séparés.</li><li>Expiration ou révocation rebloquent les usages dépendants.</li></ul>
        </div>
        <button className="quiet" disabled>Envoyer une demande — backend indisponible</button>
      </section>
    </div>
  </main>;
}


function ModaryxAI() {
  const capabilities=[
    ["Recherche & découverte","Comprendre un besoin, retrouver jeux et contenus pertinents et expliquer pourquoi un résultat est proposé."],
    ["Compatibilité","Raisonner sur jeu, version, plateforme, loader, dépendances et fraîcheur des preuves avant toute recommandation."],
    ["Profils de jeu","Expliquer un profil, ses dépendances, ses conflits et préparer un plan réversible avant toute action locale."],
    ["Creator Copilot","Préparer projets, releases, crédits et contrôles sans publier silencieusement."],
    ["Droits & éditeurs","Aider à structurer Rights Cases, scopes et réponses sans transformer une ambiguïté juridique en autorisation."],
    ["MODARYX Forge","Préparer de futurs diagnostics locaux uniquement après capability handshake réel et permissions explicites."],
  ];
  return <main id="main-content" tabIndex="-1" className="page-section modaryx-ai">
    <span className="kicker">MODARYX IA · fondation</span>
    <h1>Une IA native du produit, pas un chatbot greffé.</h1>
    <p className="page-intro">Cette surface prépare l’intégration future de MODARYX IA. Aucun modèle, provider, outil distant ou mémoire IA réelle n’est connecté dans ce prototype.</p>
    <div className="ai-safety-note"><strong>MODARYX IA n’est pas active dans cette démo.</strong><span>Aucune réponse générée, aucun historique IA et aucune action automatique ne sont simulés.</span></div>
    <section className="ai-hero-grid">
      <article className="ai-command-preview">
        <span className="kicker">Assistant contextuel</span>
        <h2>Demandez, vérifiez, puis agissez.</h2>
        <p>Le futur assistant devra afficher ses sources, distinguer preuve et incertitude, et utiliser des outils permissionnés plutôt que prétendre avoir exécuté une action.</p>
        <label><span>Message</span><div className="ai-input-shell"><input disabled aria-label="Message à MODARYX IA" placeholder="MODARYX IA sera connectée dans une phase dédiée"/><button className="primary" disabled>Envoyer</button></div></label>
      </article>
      <aside className="ai-trust-panel">
        <span className="kicker">Confiance</span>
        <h2>Safe by default</h2>
        <div><strong>Sources</strong><span>Provenance et fraîcheur pour les réponses importantes.</span></div>
        <div><strong>Permissions</strong><span>READ → PLAN → EXECUTE_SAFE → EXECUTE_SENSITIVE → BLOCKED.</span></div>
        <div><strong>Évaluations</strong><span>Hallucination, outils, fuite de données, prompt injection et cohérence multi-tour.</span></div>
        <div><strong>Incertain</strong><span>Le système doit dire “preuve insuffisante” plutôt qu’inventer.</span></div>
      </aside>
    </section>
    <section className="ai-capabilities">
      <div className="section-head"><div><span className="kicker">Agents spécialisés</span><h2>Un cerveau commun, des responsabilités séparées.</h2></div></div>
      <div className="ai-capability-grid">{capabilities.map(([title,detail])=><article key={title}><strong>{title}</strong><span>{detail}</span></article>)}</div>
    </section>
    <section className="ai-boundaries">
      <div><span className="kicker">Non négociable</span><h2>Ce que l’IA ne doit jamais inventer.</h2></div>
      <ul><li>Une compatibilité non prouvée.</li><li>Une permission éditeur ou une licence.</li><li>Une installation locale non exécutée par MODARYX Forge.</li><li>Un résultat backend absent.</li><li>Une certitude lorsqu’une revue humaine ou juridique est nécessaire.</li></ul>
    </section>
    <div className="ai-roadmap-note"><strong>Architecture conceptuelle retenue</strong><span>AI Gateway · routing multi-modèles · RAG / Knowledge Layer · Tool Layer · Permission Engine · agents spécialisés · evals · observabilité.</span></div>
  </main>;
}


function PublicLegalTrust() {
  const [providers,setProviders]=useState({state:"LOADING",connectors:null});
  useEffect(()=>{
    let cancelled=false;
    getProviderRegistry().then(result=>{
      if(cancelled) return;
      if(!result.ok){
        setProviders({state:"UNAVAILABLE",connectors:null});
        return;
      }
      setProviders({state:"READY",connectors:result.body?.connectors||{}});
    });
    return ()=>{cancelled=true;};
  },[]);

  const sections=[
    ["Informations légales / opérateur","PREUVE MANQUANTE","Identité opérateur réelle requise avant publication."],
    ["Confidentialité","LEGAL_DRAFT_REQUIRED","Doit refléter les données, providers, durées et transferts réellement déployés."],
    ["Conditions d’utilisation","LEGAL_DRAFT_REQUIRED","Aucun texte final n’est simulé dans ce prototype."],
    ["Règles communauté / UGC","LEGAL_DRAFT_REQUIRED","Doivent couvrir publication, provenance, modération, recours, fraude et contenus interdits."],
    ["Cookies & stockage","PRODUCT_FACTS_MISSING","Dépend de la stack, des services tiers et de l’analytics réellement retenus."],
    ["Propriété intellectuelle","PRODUCT_FACTS_MISSING","Le futur canal IP doit être réel avant publication."],
    ["Sécurité","PREUVE MANQUANTE","Aucun contact sécurité public ne doit être inventé."],
    ["Support & contact","PRODUCT_FACTS_MISSING","Les canaux affichés devront correspondre à des services réellement opérés."],
  ];
  const providerRows=providers.connectors?[
    ["Identité",providers.connectors.auth],
    ["Anti-abus",providers.connectors.antiAbuse],
    ["Stockage artefacts",providers.connectors.artifactStorage],
    ["Météo",providers.connectors.weather],
    ["Email",providers.connectors.email],
    ["Push",providers.connectors.push],
  ]:[];

  return <main id="main-content" tabIndex="-1" className="page-section public-trust">
    <span className="kicker">Confiance publique · prototype</span>
    <h1>Confiance, informations légales et transparence.</h1>
    <p className="page-intro">Cette surface prépare les informations publiques de MODARYX sans inventer de mentions légales, de politiques ou de canaux qui n’existent pas encore.</p>
    <div className="public-trust-warning"><strong>Prototype noindex — aucun texte juridique final n’est simulé.</strong><span>Une page ne pourra être publiée comme finale qu’après validation des faits produit réels et revue juridique adaptée.</span></div>
    <section className="public-trust-grid" aria-label="Readiness des informations publiques">
      {sections.map(([title,status,detail])=><article key={title}>
        <div className="public-trust-card-head"><h2>{title}</h2><span className="public-trust-state">{status}</span></div>
        <p>{detail}</p>
      </article>)}
    </section>

    <section className="public-trust-facts" aria-label="État technique des providers">
      <div><span className="kicker">Providers & connecteurs</span><h2>Afficher uniquement ce que l’environnement déclare réellement.</h2></div>
      {providers.state==="LOADING"&&<p>Lecture same-origin de l’état technique…</p>}
      {providers.state==="UNAVAILABLE"&&<div className="unavailable-state"><strong>État providers indisponible</strong><span>Aucun provider n’est déclaré actif par défaut.</span></div>}
      {providers.state==="READY"&&<div className="public-trust-grid">{providerRows.map(([label,item])=><article key={label}>
        <div className="public-trust-card-head"><h3>{label}</h3><span className="public-trust-state">{item?.state||"UNKNOWN"}</span></div>
        <p>{item?.provider||"Aucun provider sélectionné"}</p>
        {label==="Météo"&&<small>{item?.configured?"Configuré côté serveur · activation production toujours soumise au gate légal/attribution.":"Saison + heure locale restent disponibles sans météo fournisseur."}</small>}
      </article>)}</div>}
    </section>

    <section className="public-trust-facts">
      <div><span className="kicker">Règle de publication</span><h2>Les faits d’abord, le texte juridique ensuite.</h2></div>
      <ul>
        <li>Ne jamais inventer l’identité d’un opérateur, une adresse, un DPO, une durée de conservation ou un sous-traitant.</li>
        <li>La confidentialité doit être dérivée de l’architecture réellement déployée.</li>
        <li>Les canaux support, IP et sécurité doivent être réels et vérifiés avant publication.</li>
        <li>MODARYX IA devra déclarer les providers, données transmises, mémoire et rétention réellement utilisés.</li>
      </ul>
    </section>
    <div className="public-trust-gate"><strong>Gate VF publique</strong><span>Identité opérateur · politiques adaptées au service réel · canaux vérifiés · revue juridique · liens footer fonctionnels.</span><small>État actuel : PREUVE MANQUANTE / non prêt pour publication juridique finale.</small></div>
  </main>;
}

function HelpDocs({ onNavigate }) {
  const topics=[
    ["Bien démarrer","Comprendre Jeux, Mods & contenus, Collections, Profils de jeu et Bibliothèque."],
    ["Compatibilité","Lire versions, loaders, dépendances, conflits, fraîcheur et provenance avant toute décision."],
    ["Profils de jeu","Préparer des configurations enregistrées de mods, versions et réglages sans confondre profil et collection."],
    ["Créateurs","Comprendre Creator Studio, projets, releases, crédits et états de publication."],
    ["Confiance & droits","Comprendre provenance, permissions, signalements et les limites des démonstrations actuelles."],
    ["Installation","Comprendre fichiers, prérequis, profils et futur handoff MODARYX Forge avant toute action locale."],
    ["MODARYX Forge","Préparer le futur handoff desktop sans simuler une installation locale absente."],
  ];
  return <main id="main-content" tabIndex="-1" className="page-section help-docs">
    <span className="kicker">Aide & documentation · prototype</span>
    <h1>Comprendre MODARYX sans deviner.</h1>
    <p className="page-intro">Cette surface organise l’aide produit avant la documentation finale. Les fonctions absentes restent signalées comme telles et aucun workflow serveur n’est simulé.</p>
    <section className="help-docs-grid" aria-label="Rubriques d’aide">
      {topics.map(([title,detail])=><article key={title}><h2>{title}</h2><p>{detail}</p></article>)}
    </section>
    <section className="help-docs-actions">
      <div><span className="kicker">Raccourcis</span><h2>Revenir directement à la tâche.</h2><p>L’aide ne doit pas devenir un cul-de-sac séparé du produit.</p></div>
      <div className="help-action-list">
        <button className="quiet" onClick={()=>onNavigate("Jeux")}>Voir les jeux</button>
        <button className="quiet" onClick={()=>onNavigate("Mods & contenus")}>Explorer les contenus</button>
        <button className="quiet" onClick={()=>onNavigate("Bibliothèque")}>Ouvrir la Bibliothèque</button>
        <button className="quiet" onClick={()=>onNavigate("Confiance & légal")}>Confiance & légal</button>
      </div>
    </section>
    <div className="help-docs-status"><strong>Documentation finale : PREUVE MANQUANTE</strong><span>Le contenu final dépendra des fonctionnalités, routes, providers, backend et capacités MODARYX Forge réellement livrés.</span></div>
  </main>;
}


function ModerationCenter() {
  const cases=[
    {
      id:"report-abuse",
      target:"Discussion · Composer une ambiance nocturne cohérente",
      reason:"Abus / harcèlement",
      state:"RECEIVED",
      publicState:"Signalement reçu",
      detail:"Cas fictif en attente de triage. Aucun auteur, commentaire ou compte réel n’est concerné.",
      history:["RECEIVED · signalement fictif enregistré dans la démo"],
      appeal:"Aucun appel : aucune décision de modération n’a été prise.",
    },
    {
      id:"report-malware",
      target:"Fichier · sentiers-aube-demo.zip",
      reason:"Malware suspect",
      state:"UNDER_REVIEW",
      publicState:"Examen en cours",
      detail:"Scénario fictif de risque distribution. La quarantaine réelle nécessite une autorité serveur et n’est pas exécutée ici.",
      history:["RECEIVED · signalement fictif","TRIAGED · priorité sécurité","UNDER_REVIEW · aucune action serveur simulée"],
      appeal:"L’appel n’est possible qu’après une décision réelle appelable.",
    },
    {
      id:"appeal-demo",
      target:"Collection · Exploration sereine",
      reason:"Décision de visibilité contestée",
      state:"APPEALED",
      publicState:"Appel fictif en attente",
      detail:"L’appel reste rattaché à la décision précédente ; il ne l’efface pas et ne restaure rien automatiquement.",
      history:["ACTIONED · décision fictive antérieure","APPEALED · recours fictif séparé"],
      appeal:"Aucun reviewer réel, aucun SLA et aucune restauration ne sont simulés.",
    },
  ];
  const [selected,setSelected]=useState(cases[0].id);
  const current=cases.find(item=>item.id===selected) || cases[0];
  return <main id="main-content" tabIndex="-1" className="page-section moderation-center">
    <span className="kicker">Administration · modération · prototype</span>
    <h1>Modération, signalements et appels.</h1>
    <p className="page-intro">Séparer support, signalement, décision et appel sans simuler une autorité serveur absente.</p>
    <div className="moderation-warning"><strong>Aucune action de modération réelle n’est exécutée dans cette démo.</strong><span>Les cas, historiques et décisions sont fictifs. Les rôles moderator / appeals-reviewer / administrator devront venir du serveur.</span></div>
    <section className="moderation-summary" aria-label="Résumé de modération fictif">
      <article><span className="kicker">Reçu</span><strong>1</strong><small>Triage à faire</small></article>
      <article><span className="kicker">Examen</span><strong>1</strong><small>Aucune quarantine réelle</small></article>
      <article><span className="kicker">Appel</span><strong>1</strong><small>Décision précédente conservée</small></article>
    </section>
    <div className="moderation-layout">
      <nav className="moderation-case-list" aria-label="Cas de modération fictifs">
        {cases.map(item=><button key={item.id} className={selected===item.id?"active":""} aria-pressed={selected===item.id} onClick={()=>setSelected(item.id)}>
          <span><strong>{item.reason}</strong><small>{item.target}</small></span><em>{item.state}</em>
        </button>)}
      </nav>
      <section className="moderation-detail" aria-live="polite">
        <div className="moderation-detail-head"><div><span className="kicker">Cas fictif</span><h2>{current.reason}</h2><p>{current.target}</p></div><span className="moderation-state">{current.state}</span></div>
        <div className="moderation-public-state"><strong>État partageable</strong><span>{current.publicState}</span></div>
        <p className="moderation-detail-copy">{current.detail}</p>
        <section className="moderation-history" aria-label="Historique fictif"><h3>Historique</h3>{current.history.map(item=><div key={item}>{item}</div>)}</section>
        <section className="moderation-appeal"><h3>Appel</h3><p>{current.appeal}</p></section>
        <div className="moderation-boundaries"><strong>Garde-fous</strong><ul><li>Support ≠ signalement.</li><li>Action destructive = autorité serveur obligatoire.</li><li>Un appel n’efface jamais la décision précédente.</li><li>Audit trail requis pour chaque transition réelle.</li></ul></div>
        <div className="moderation-actions"><button className="quiet" disabled>Masquer — serveur indisponible</button><button className="quiet" disabled>Quarantaine — serveur indisponible</button><button className="quiet" disabled>Restaurer — serveur indisponible</button></div>
      </section>
    </div>
  </main>;
}

function Community() {
  const [tab,setTab]=useState("Support");
  const [draft,setDraft]=useState(false);
  const tabs=["Support","Questions","Discussions","Studios / équipes","Activité"];
  const panel={
    "Support": <section className="community-board"><span className="kicker">Support</span><h2>Aide liée aux créations</h2><p>Le support reste rattaché à un jeu, un contenu, une collection ou une équipe — jamais à un fil social générique.</p><div className="community-list"><article><strong>Sentiers de l’aube</strong><span>Aetherlands · contenu de démonstration</span><small>Service de support distant non connecté.</small></article><article><strong>Exploration sereine</strong><span>Aetherlands · collection de démonstration</span><small>Le curateur reste identifiable pour les problèmes de composition.</small></article></div></section>,
    "Questions": <section className="community-board"><span className="kicker">Questions</span><h2>Préparer une question</h2><p>Un brouillon peut être préparé localement. Aucun envoi n’est simulé sans session et backend réels.</p><button className="primary" onClick={()=>setDraft(true)}><Plus/>{draft?"Brouillon local créé":"Créer un brouillon local"}</button>{draft&&<div className="local-draft" role="status"><strong>Brouillon local — non envoyé</strong><span>Contexte : Aetherlands · à compléter avant tout envoi réel.</span></div>}</section>,
    "Discussions": <section className="community-board"><span className="kicker">Discussions</span><h2>Discussions liées au modding</h2><div className="community-list"><article><strong>Composer une ambiance nocturne cohérente</strong><span>Aetherlands · discussion de démonstration</span><small>Aucune réaction ou métrique sociale n’est inventée.</small></article><article><strong>Choisir entre Collection et Profil de jeu</strong><span>MODARYX · discussion de démonstration</span><small>Les informations critiques restent dans les fiches produit.</small></article></div></section>,
    "Studios / équipes": <section className="community-board"><span className="kicker">Studios / équipes</span><h2>Équipes de création</h2><div className="community-teams">{creatorDetails.map(item=><article key={item.name}><div className="creator-avatar static"><UsersThree/></div><div><strong>{item.name}</strong><span>{item.role}</span><small>{item.focus}</small></div></article>)}</div></section>,
    "Activité": <section className="community-board"><span className="kicker">Activité</span><h2>Contexte utile, pas un réseau social</h2><div className="activity-list"><article><span className="activity-dot"/><div><strong>Exemple de nouvelle release</strong><small>Sentiers de l’aube · démonstration uniquement</small></div></article><article><span className="activity-dot"/><div><strong>Exemple de mise à jour de Collection</strong><small>Exploration sereine · démonstration uniquement</small></div></article></div><div className="moderation-note"><strong>Modération</strong><span>Les actions avancées restent masquées sans permissions serveur réelles.</span></div></section>,
  };
  return <main id="main-content" tabIndex="-1" className="page-section community"><span className="kicker">Communauté</span><h1>Des échanges utiles autour des créations.</h1><p className="page-intro">Support, questions, discussions, équipes et activité restent contextualisés par le modding.</p><nav className="community-tabs" aria-label="Sections Communauté">{tabs.map(value=><button key={value} aria-pressed={tab===value} className={tab===value?"active":""} onClick={()=>setTab(value)}>{value}</button>)}</nav>{panel[tab]}</main>;
}

export function App() {
  const initialRoute=()=>routeStateFromPath(typeof window==="undefined"?"/":window.location.pathname,contentItems);
  const initial=initialRoute();
  const [active, setActive] = useState(initial.active);
  const [detail, setDetail] = useState(initial.detail);
  const [gameHubOpen,setGameHubOpen]=useState(initial.gameHubOpen);
  const [online,setOnline]=useState(()=>typeof navigator==="undefined"?true:navigator.onLine);
  const [ambientContext,setAmbientContext]=useState({
    state:"OFF",
    season:"neutral",
    dayPhase:"neutral",
    weatherCondition:"off",
    weatherStatus:"not-connected"
  });
  const firstRouteRender=useRef(true);

  const applyResolvedRoute=route=>{
    setActive(route.active);
    setDetail(route.detail);
    setGameHubOpen(route.gameHubOpen);
  };
  const pushPath=path=>{
    if(typeof window!=="undefined" && window.location.pathname!==path) window.history.pushState({modaryxV2:true},"",path);
  };

  useEffect(()=>{
    const syncConnectivity=()=>setOnline(navigator.onLine);
    window.addEventListener("online",syncConnectivity);
    window.addEventListener("offline",syncConnectivity);
    return ()=>{window.removeEventListener("online",syncConnectivity);window.removeEventListener("offline",syncConnectivity);};
  },[]);
  useEffect(()=>{
    let cancelled=false;
    resolveAmbientContext().then(next=>{if(!cancelled)setAmbientContext(next);});
    return ()=>{cancelled=true;};
  },[]);
  useEffect(()=>{
    const onPopState=()=>applyResolvedRoute(routeStateFromPath(window.location.pathname,contentItems));
    window.addEventListener("popstate",onPopState);
    return ()=>window.removeEventListener("popstate",onPopState);
  },[]);
  useEffect(()=>{
    if(firstRouteRender.current){firstRouteRender.current=false;return;}
    const frame=requestAnimationFrame(()=>document.getElementById("main-content")?.focus({preventScroll:true}));
    return ()=>cancelAnimationFrame(frame);
  },[active,detail,gameHubOpen]);
  useEffect(()=>{
    const routeTitle=detail&&detail.title
      ? detail.title+" — MODARYX"
      : active==="Jeux"&&gameHubOpen
        ? "Aetherlands — MODARYX"
        : active+" — MODARYX";
    document.title=routeTitle;
  },[active,detail,gameHubOpen]);

  const scrollRouteTop=()=>window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  const navigate=item=>{
    const route=routeStateFromPath(pathForActive(item),contentItems);
    applyResolvedRoute(route);
    pushPath(pathForActive(item));
    scrollRouteTop();
  };
  const openGameHub=()=>{
    const route=routeStateFromPath("/games/aetherlands",contentItems);
    applyResolvedRoute(route);
    pushPath("/games/aetherlands");
    scrollRouteTop();
  };
  const openContent=item=>{
    setDetail(item);
    pushPath(contentPath(item));
    scrollRouteTop();
  };
  const closeDetail=()=>{
    const route=routeStateFromPath("/mods",contentItems);
    applyResolvedRoute(route);
    pushPath("/mods");
    scrollRouteTop();
  };

  let screen;
  if (detail) screen=<Detail item={detail} onBack={closeDetail}/>;
  else if(active==='Découvrir') screen=<Discover onOpen={openContent}/>;
  else if(active==='Recherche') screen=<GlobalSearch onOpenContent={openContent} onOpenGame={openGameHub} onOpenCreators={()=>navigate('Créateurs')} onOpenCollections={()=>navigate('Collections')}/>;
  else if(active==='Jeux' && !gameHubOpen) screen=<GamesIndex onOpenGame={openGameHub}/>;
  else if(active==='Mods & contenus') screen=<Catalog onOpen={openContent}/>;
  else if(active==='Collections') screen=<CollectionsPage/>;
  else if(active==='Créateurs') screen=<CreatorsPage onNavigate={navigate}/>;
  else if(active==='Communauté') screen=<Community/>;
  else if(active==='Notifications') screen=<AccountCenter key="notifications" initialTab="Notifications"/>;
  else if(active==='Compte') screen=<AccountCenter key="account" initialTab="Compte"/>;
  else if(active==='Créer') screen=<CreatorStudio/>;
  else if(active==='Bibliothèque') screen=<Library/>;
  else if(active==='Droits jeux') screen=<RightsDashboard/>;
  else if(active==='MODARYX IA') screen=<ModaryxAI/>;
  else if(active==='Confiance & légal') screen=<PublicLegalTrust/>;
  else if(active==='Aide & documentation') screen=<HelpDocs onNavigate={navigate}/>;
  else if(active==='Modération') screen=<ModerationCenter/>;
  else screen=<GameHub onOpen={openContent}/>;

  return <div
    className="app-shell"
    data-ambient-state={ambientContext.state}
    data-season={ambientContext.season}
    data-day-phase={ambientContext.dayPhase}
    data-weather={ambientContext.weatherCondition}
    data-weather-status={ambientContext.weatherStatus}
  >
    <a className="skip-link" href="#main-content">Aller au contenu principal</a>
    {!online&&<div className="connectivity-banner" role="status"><strong>Hors ligne</strong><span>Les données locales restent consultables ; les informations distantes peuvent être indisponibles ou obsolètes.</span></div>}
    <Topbar active={active} onNavigate={navigate}/>
    {screen}
    <footer><Logo onNavigate={navigate}/><p>MODARYX V2 · Candidat produit isolé</p><button onClick={openGameHub}><GameController/>Game Hub</button><button onClick={()=>navigate('Bibliothèque')}><BookOpen/>Bibliothèque</button><button onClick={()=>navigate('Droits jeux')}><Check/>Droits jeux · démo admin</button><button onClick={()=>navigate('Modération')}>Modération · démo admin</button><button onClick={()=>navigate('Confiance & légal')}>Confiance & légal</button><button onClick={()=>navigate('Aide & documentation')}>Aide & documentation</button></footer>
  </div>;
}
