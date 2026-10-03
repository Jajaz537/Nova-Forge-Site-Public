import { useMemo, useState } from "react";
import {
  ArrowRight, Bell, BookOpen, Check, FunnelSimple, GameController, GridFour,
  List, MagnifyingGlass, Plus, SlidersHorizontal, Stack, UsersThree, X
} from "@phosphor-icons/react";

const navItems = ["Découvrir", "Jeux", "Mods & contenus", "Collections", "Créateurs", "Communauté", "Créer"];
const contentItems = [
  { title: "Sentiers de l’aube", kind: "Exploration", creator: "Atelier Boréal", pos: "0% 0%", tone: "cyan" },
  { title: "Vestiges suspendus", kind: "Environnements", creator: "Lueur Collective", pos: "50% 0%", tone: "violet" },
  { title: "Sommets silencieux", kind: "Graphismes", creator: "Les Cartographes", pos: "100% 0%", tone: "cyan" },
  { title: "Rivages du couchant", kind: "Immersion", creator: "Atelier Boréal", pos: "0% 100%", tone: "violet" },
  { title: "Brumes des hautes terres", kind: "Gameplay", creator: "Lueur Collective", pos: "50% 100%", tone: "cyan" },
  { title: "Le pont des veilleurs", kind: "Quêtes", creator: "Les Cartographes", pos: "100% 100%", tone: "violet" },
];

const gameItems = [
  { title: "Aetherlands", status: "Catalogue consultable", detail: "Démonstration · version 1.4.2", pos: "0% 0%" },
  { title: "Rivenfall", status: "Aperçu disponible", detail: "Démonstration · contenu à venir", pos: "50% 0%" },
  { title: "Solstice Frontier", status: "Catalogue vide", detail: "Démonstration · aucun contenu publié", pos: "100% 0%" },
];

const creatorItems = ["Atelier Boréal", "Lueur Collective", "Les Cartographes"];
const collectionItems = ["Exploration sereine", "Graphismes essentiels", "Immersion légère"];

function Logo() {
  return <a className="logo" href="#top" aria-label="MODARYX — accueil">MODARY<span>X</span></a>;
}

function Topbar({ active, onNavigate }) {
  const [open, setOpen] = useState(false);
  return <header className="topbar" id="top">
    <Logo />
    <button className="mobile-search" aria-label="Recherche globale" onClick={() => onNavigate("Recherche")}><MagnifyingGlass /></button>
    <button className="mobile-menu" aria-label="Ouvrir le menu" aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? <X /> : <List />}</button>
    <nav className={open ? "global-nav open" : "global-nav"} aria-label="Navigation principale">
      {navItems.map(item => <button key={item} className={active === item ? "active" : ""} onClick={() => { onNavigate(item); setOpen(false); }}>{item}</button>)}
      <button className="mobile-nav-utility" onClick={() => { onNavigate("Bibliothèque"); setOpen(false); }}><BookOpen />Bibliothèque</button>
    </nav>
    <div className="top-actions"><button aria-label="Recherche globale" onClick={() => onNavigate("Recherche")}><MagnifyingGlass /></button><button aria-label="Bibliothèque" onClick={() => onNavigate("Bibliothèque")}><BookOpen /></button><button aria-label="Notifications"><Bell /></button><button className="avatar" aria-label="Compte">M</button></div>
  </header>;
}

function Compatibility({ compact=false }) {
  return <span className={compact ? "compat compact" : "compat"}><Check weight="bold" />Compatible</span>;
}

function Media({ pos, className="" }) {
  return <div className={`media ${className}`} style={{ backgroundPosition: pos }} role="img" aria-label="Paysage de démonstration non contractuel" />;
}

function ContentCard({ item, dense=false, onOpen }) {
  return <article className={dense ? "content-card dense" : "content-card"}>
    <button className="card-hit" aria-label={`Ouvrir ${item.title}`} onClick={() => onOpen(item)} />
    <Media pos={item.pos} />
    <div className="card-copy">
      <div className="eyebrow">{item.kind}</div>
      <h3>{item.title}</h3>
      <p>Une extension de démonstration conçue pour cette version du jeu.</p>
      <div className="card-meta"><Compatibility compact/><span>Version 1.4.2</span></div>
    </div>
  </article>;
}

function ProfilesRail() {
  return <aside className="profiles-rail">
    <div className="rail-icon"><Stack /></div>
    <h2>Mes profils pour ce jeu</h2>
    <p>Configurations enregistrées de mods, versions et réglages.</p>
    <button className="profile-add"><Plus />Nouveau profil</button>
    <div className="profile-list">
      {[['Exploration','4 contenus'],['Graphismes','7 contenus'],['Immersion','3 contenus']].map(([name,count],i) =>
        <button className="profile-row" key={name}><Media pos={contentItems[i].pos}/><span><strong>{name}</strong><small>{count}</small></span><ArrowRight /></button>)}
    </div>
  </aside>;
}

function GamesIndex({ onOpenGame }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Nom");
  const games = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("fr");
    const filtered = gameItems.filter(game => game.title.toLocaleLowerCase("fr").includes(normalized));
    return [...filtered].sort((a,b) => sort === "Nom" ? a.title.localeCompare(b.title, "fr") : a.status.localeCompare(b.status, "fr"));
  }, [query, sort]);

  return <main className="page-section games-index">
    <span className="kicker">Jeux</span>
    <h1>Trouvez votre prochain terrain de jeu.</h1>
    <p className="page-intro">Recherchez un jeu et voyez immédiatement si son catalogue est réellement disponible.</p>
    <div className="index-tools">
      <label className="catalog-search"><MagnifyingGlass/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un jeu" aria-label="Rechercher un jeu"/></label>
      <label className="sort-control"><span>Trier</span><select value={sort} onChange={e=>setSort(e.target.value)}><option>Nom</option><option>État</option></select></label>
    </div>
    <div className="game-grid">
      {games.map((game,i)=><article className="game-card" key={game.title}>
        <Media pos={game.pos}/>
        <div><span className="demo-label">Démonstration</span><h2>{game.title}</h2><p>{game.detail}</p><span className="support-state">{game.status}</span>
        {game.title==="Aetherlands" ? <button className="primary" onClick={onOpenGame}>Ouvrir le Game Hub <ArrowRight/></button> : <button className="quiet" disabled>Indisponible dans cette démo</button>}</div>
      </article>)}
    </div>
    {games.length===0 && <div className="empty"><MagnifyingGlass/><h3>Aucun jeu trouvé</h3><p>Essayez un autre terme.</p><button onClick={()=>setQuery("")}>Effacer la recherche</button></div>}
  </main>;
}

function GlobalSearch({ onOpenContent, onOpenGame }) {
  const [query,setQuery]=useState("");
  const normalized=query.trim().toLocaleLowerCase("fr");
  const games=gameItems.filter(x=>x.title.toLocaleLowerCase("fr").includes(normalized));
  const contents=contentItems.filter(x=>(x.title+" "+x.kind+" "+x.creator).toLocaleLowerCase("fr").includes(normalized));
  const creators=creatorItems.filter(x=>x.toLocaleLowerCase("fr").includes(normalized));
  const collections=collectionItems.filter(x=>x.toLocaleLowerCase("fr").includes(normalized));
  const hasQuery=query.trim().length>0;
  const total=(hasQuery?games.length+contents.length+creators.length+collections.length:0);

  return <main className="page-section global-search-page">
    <span className="kicker">Recherche globale</span>
    <h1>Rechercher dans MODARYX</h1>
    <p className="page-intro">Jeux, mods & contenus, collections et créateurs restent identifiables par type.</p>
    <label className="global-search-field"><MagnifyingGlass/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un jeu, un contenu, une collection ou un créateur" aria-label="Recherche globale"/></label>
    {!hasQuery && <div className="search-hint"><strong>Commencez par un nom ou un type.</strong><span>La recherche de démonstration reste locale : aucune dépendance externe.</span></div>}
    {hasQuery && total===0 && <div className="empty"><MagnifyingGlass/><h3>Aucun résultat</h3><p>Aucun élément de démonstration ne correspond à « {query} ».</p><button onClick={()=>setQuery("")}>Effacer la recherche</button></div>}
    {hasQuery && total>0 && <div className="search-groups" aria-live="polite">
      <section><div className="search-group-title"><h2>Jeux</h2><span>{games.length}</span></div>{games.map(game=><button className="search-result-row" key={game.title} onClick={game.title==="Aetherlands"?onOpenGame:undefined} disabled={game.title!=="Aetherlands"}><GameController/><span><strong>{game.title}</strong><small>{game.status}</small></span><ArrowRight/></button>)}</section>
      <section><div className="search-group-title"><h2>Mods & contenus</h2><span>{contents.length}</span></div>{contents.map(item=><button className="search-result-row" key={item.title} onClick={()=>onOpenContent(item)}><MagnifyingGlass/><span><strong>{item.title}</strong><small>{item.kind} · {item.creator}</small></span><ArrowRight/></button>)}</section>
      <section><div className="search-group-title"><h2>Créateurs</h2><span>{creators.length}</span></div>{creators.map(name=><div className="search-result-static" key={name}><UsersThree/><span><strong>{name}</strong><small>Créateur de démonstration</small></span></div>)}</section>
      <section><div className="search-group-title"><h2>Collections</h2><span>{collections.length}</span></div>{collections.map(name=><div className="search-result-static" key={name}><Stack/><span><strong>{name}</strong><small>Collection de démonstration</small></span></div>)}</section>
    </div>}
  </main>;
}

function GameHub({ onOpen }) {
  const [tab, setTab] = useState("Aperçu");
  const [query, setQuery] = useState("");
  const [version, setVersion] = useState("1.4.2");
  const visible = useMemo(() => contentItems.filter(x => x.title.toLowerCase().includes(query.toLowerCase())), [query]);
  const sectionTitle = tab === "Aperçu" ? "Pour votre version" : tab;
  return <>
    <section className="game-hero">
      <div className="hero-shade" />
      <div className="game-identity"><span className="demo-label">Démonstration</span><h1>Aetherlands</h1><label>Version<select value={version} onChange={e => setVersion(e.target.value)}><option>1.4.2</option><option>1.4.1</option></select></label></div>
      <form className="hero-search" onSubmit={e => e.preventDefault()}><MagnifyingGlass /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher dans ce jeu" aria-label="Rechercher dans ce jeu"/><button type="button" aria-label="Filtres"><SlidersHorizontal /></button></form>
      <button className="primary">Explorer les contenus <ArrowRight /></button>
    </section>
    <nav className="local-nav" aria-label="Navigation du jeu">{["Aperçu","Mods & contenus","Collections","Créateurs","Guides","Activité"].map(x => <button key={x} className={tab===x?'active':''} onClick={() => setTab(x)}>{x}</button>)}</nav>
    <main className="hub-layout">
      <section className="hub-content"><div className="section-heading"><div><span className="kicker">Sélection adaptative</span><h2>{sectionTitle}</h2><p>Contenus compatibles avec Aetherlands {version}.</p></div><button className="quiet"><FunnelSimple />Affiner</button></div>
      <div className="content-grid">{visible.map(item => <ContentCard key={item.title} item={item} onOpen={onOpen}/>)}</div>
      {visible.length===0 && <div className="empty"><MagnifyingGlass/><h3>Aucun contenu trouvé</h3><p>Essayez un autre terme ou effacez la recherche.</p><button onClick={() => setQuery('')}>Effacer la recherche</button></div>}</section>
      <ProfilesRail /></main>
  </>;
}

function Discover({ onOpen }) {
  return <main><section className="editorial-hero"><div><span className="kicker">Votre monde évolue</span><h1>Redécouvrez vos jeux,<br/>une possibilité à la fois.</h1><p>Explorez des contenus, vérifiez leur compatibilité et composez des expériences qui vous ressemblent.</p><button className="primary">Découvrir maintenant <ArrowRight/></button></div></section><section className="page-section"><div className="section-heading"><div><span className="kicker">En ce moment</span><h2>Des mondes à réinventer</h2></div></div><div className="content-grid editorial">{contentItems.slice(0,3).map(item => <ContentCard key={item.title} item={item} onOpen={onOpen}/>)}</div></section></main>;
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
  return <main className="page-section catalog">
    <div className="catalog-title"><span className="kicker">Catalogue global</span><h1>Mods & contenus</h1><p>Trouvez un contenu, puis confirmez sa compatibilité avant de l’ajouter à un profil.</p></div>
    <div className="catalog-tools">
      <label className="catalog-search"><MagnifyingGlass/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher dans tous les contenus" aria-label="Rechercher dans tous les contenus"/></label>
      <button aria-expanded={filtersOpen} onClick={()=>setFiltersOpen(v=>!v)}><FunnelSimple/>Filtres{activeFilters>0&&<span className="filter-count">{activeFilters}</span>}</button>
      <div className="view-toggle"><button className={grid?'active':''} onClick={()=>setGrid(true)} aria-label="Vue grille"><GridFour/></button><button className={!grid?'active':''} onClick={()=>setGrid(false)} aria-label="Vue liste"><List/></button></div>
    </div>
    {filtersOpen&&<section className="filter-panel" aria-label="Filtres du catalogue">
      <div><span className="filter-label">Type</span><div className="filter-chips">{kinds.map(value=><button key={value} className={kind===value?"selected":""} onClick={()=>setKind(value)}>{value}</button>)}</div></div>
      <label className="sort-control"><span>Trier</span><select value={sort} onChange={e=>setSort(e.target.value)}><option>Pertinence</option><option>Nom</option><option>Type</option></select></label>
      <button className="reset-filters" onClick={reset} disabled={activeFilters===0}>Réinitialiser</button>
    </section>}
    <div className="catalog-summary" aria-live="polite"><strong>{visible.length} résultat{visible.length>1?"s":""}</strong><span>Données de démonstration</span>{activeFilters>0&&<button onClick={reset}>Tout réinitialiser</button>}</div>
    {visible.length>0 ? <div className={grid?'content-grid catalog-grid':'content-list'}>{visible.map(item => <ContentCard dense={!grid} key={item.title} item={item} onOpen={onOpen}/>)}</div> : <div className="empty"><MagnifyingGlass/><h3>Aucun contenu trouvé</h3><p>Modifiez les filtres ou recommencez avec une autre recherche.</p><button onClick={reset}>Réinitialiser les filtres</button></div>}
  </main>;
}

function Detail({ item, onBack }) {
  const selected=item||contentItems[0];
  const [added,setAdded]=useState(false);
  const [tab,setTab]=useState("Aperçu");
  const tabs=["Aperçu","Fichiers","Versions","Compatibilité et prérequis","Changelog","Support","Permissions"];

  const tabContent = {
    "Aperçu": <section className="detail-section"><h2>À propos</h2><p>Cette fiche matérialise la décision avant ajout à un profil. Le contenu présenté ici est une démonstration : aucune donnée de popularité, aucun téléchargement et aucun scan réel ne sont simulés.</p><div className="detail-feature-grid"><article><strong>But</strong><span>Enrichir l’exploration sans modifier les règles de base.</span></article><article><strong>Installation</strong><span>Ajout à un profil uniquement dans ce prototype.</span></article><article><strong>Limitation</strong><span>Aucun runtime MODARYX Forge connecté à cette démo.</span></article></div></section>,
    "Fichiers": <section className="detail-section"><h2>Fichiers de cette version</h2><article className="file-row"><div><strong>Package de démonstration</strong><span>Version du mod 1.4.2 · canal stable de démonstration</span></div><dl><div><dt>SHA-256</dt><dd>Non calculé — démonstration</dd></div><div><dt>Distribution</dt><dd>Indisponible au téléchargement</dd></div><div><dt>Scan</dt><dd>Aucun scan réel associé</dd></div></dl></article></section>,
    "Versions": <section className="detail-section"><h2>Versions</h2><div className="version-history"><article><strong>1.4.2</strong><span>Version actuelle de démonstration · compatible avec Aetherlands 1.4.2</span></article><article><strong>1.4.1</strong><span>Historique de démonstration · distribution non exposée</span></article></div></section>,
    "Compatibilité et prérequis": <section className="detail-section"><h2>Compatibilité et prérequis</h2><p>Versions compatibles et éléments nécessaires avant installation.</p><div className="requirements-grid"><article><span className="requirement-kind">Compatibilité</span><strong>Aetherlands 1.4.2</strong><p>Compatible dans le contexte de démonstration.</p></article><article><span className="requirement-kind">Requis</span><strong>Aether Core</strong><p>Dépendance fictive de démonstration · version 1.x.</p></article><article><span className="requirement-kind">Conflits connus</span><strong>Aucun conflit déclaré</strong><p>Cela ne constitue pas une vérification réelle.</p></article></div></section>,
    "Changelog": <section className="detail-section"><h2>Changelog</h2><article className="changelog-row"><strong>1.4.2</strong><span>Démonstration : amélioration des sentiers, correction de transitions visuelles, aucune migration réelle requise.</span></article></section>,
    "Support": <section className="detail-section"><h2>Support</h2><p>Les questions, bugs et discussions de cette démo ne sont pas connectés à un service réel.</p><button className="quiet" disabled>Support indisponible dans cette démo</button></section>,
    "Permissions": <section className="detail-section"><h2>Permissions</h2><dl className="permissions-list"><div><dt>Licence</dt><dd>Démonstration — aucune licence de distribution réelle</dd></div><div><dt>Redistribution</dt><dd>Non définie</dd></div><div><dt>Modification</dt><dd>Non définie</dd></div><div><dt>Provenance</dt><dd>Asset de démonstration MODARYX V2</dd></div></dl></section>,
  };

  return <main className="detail">
    <button className="back" onClick={onBack}>← Retour aux contenus</button>
    <div className="detail-grid">
      <div className="detail-main">
        <Media pos={selected.pos} className="detail-media"/>
        <nav className="detail-tabs" aria-label="Sections de la fiche contenu">{tabs.map(value=><button key={value} className={tab===value?"active":""} onClick={()=>setTab(value)}>{value}</button>)}</nav>
        {tabContent[tab]}
      </div>
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
        <p className="action-note">Aucune installation locale n’est déclenchée par ce prototype.</p>
      </aside>
    </div>
  </main>;
}

function Library() {
  const [tab,setTab]=useState("Profils de jeu");
  const tabs=["Favoris","Suivis","Collections","Profils de jeu","Recherches enregistrées"];
  const panels={
    "Favoris": <section className="library-panel"><div className="section-heading"><div><span className="kicker">Favoris</span><h2>Contenus enregistrés</h2><p>Vos favoris personnels restent distincts des Collections et des profils.</p></div></div><div className="content-grid">{contentItems.slice(0,3).map(item=><ContentCard key={item.title} item={item} onOpen={()=>{}}/>)}</div></section>,
    "Suivis": <section className="library-panel"><span className="kicker">Suivis</span><h2>Créateurs et projets suivis</h2><div className="library-state"><strong>Atelier Boréal</strong><span>Suivi de démonstration · aucune notification distante connectée.</span></div></section>,
    "Collections": <section className="library-panel"><span className="kicker">Collections</span><h2>Sélections organisées</h2><div className="library-cards"><article><strong>Exploration nocturne</strong><span>Collection de démonstration · 4 contenus</span><small>Sélection éditoriale, pas un profil installable.</small></article><article><strong>Visuels sobres</strong><span>Collection de démonstration · 3 contenus</span><small>Aucune installation automatique dans ce prototype.</small></article></div></section>,
    "Profils de jeu": <section className="library-panel"><span className="kicker">Profils de jeu</span><h2>Configurations enregistrées</h2><p className="page-intro">Configurations enregistrées de mods, versions et réglages.</p><div className="profile-library">{[['Exploration','4 contenus','Local uniquement'],['Graphismes','7 contenus','Local uniquement'],['Immersion','3 contenus','Local uniquement']].map(([name,count,state],i)=><article key={name}><Media pos={contentItems[i].pos}/><div><strong>{name}</strong><span>{count}</span><small>{state}</small></div><button className="quiet">Ouvrir</button></article>)}</div><div className="manager-state"><strong>Connexion MODARYX Forge</strong><span>Indisponible dans ce prototype — aucune synchronisation ni installation n’est simulée.</span></div></section>,
    "Recherches enregistrées": <section className="library-panel"><span className="kicker">Recherches enregistrées</span><h2>Veilles personnelles</h2><div className="library-state"><strong>Shaders compatibles Aetherlands 1.4.x</strong><span>Recherche de démonstration enregistrée localement.</span></div></section>,
  };
  return <main className="page-section library">
    <span className="kicker">Votre espace</span><h1>Bibliothèque</h1><p className="page-intro">Retrouvez favoris, suivis, collections et profils sans les confondre.</p>
    <section className="library-overview"><div className="library-focus"><Media pos="50% 100%"/><div><span className="demo-label">Jeu actif</span><h2>Aetherlands</h2><p>3 profils de démonstration · version 1.4.2</p><button className="primary">Ouvrir le Game Hub <ArrowRight/></button></div></div><div className="library-summary"><strong>État de la bibliothèque</strong><span>Données locales de démonstration</span><span>Aucun cloud connecté</span><span>Aucun manager connecté</span></div></section>
    <nav className="library-tabs" aria-label="Sections de la bibliothèque">{tabs.map(value=><button key={value} className={tab===value?"active":""} onClick={()=>setTab(value)}>{value}</button>)}</nav>
    {panels[tab]}
  </main>;
}

function CreatorStudio() {
  const [tab,setTab]=useState("Dashboard");
  const [draftStarted,setDraftStarted]=useState(false);
  const tabs=["Dashboard","Projects","Releases","Upload","Analytics","Support","Reports","Team","Settings"];
  const panel={
    "Dashboard": <><div className="studio-cards"><article><span className="kicker">Brouillons</span><strong>{draftStarted?"1 brouillon local":"Aucun brouillon actif"}</strong><small>État local uniquement — aucune donnée distante.</small></article><article><span className="kicker">Publication</span><strong>Aucune soumission</strong><small>Aucun backend de publication connecté.</small></article><article><span className="kicker">Alertes</span><strong>Aucune alerte réelle</strong><small>Les métriques et alertes ne sont jamais inventées.</small></article></div><section className="studio-workflow"><div><span className="kicker">Démarrer</span><h2>Créer un projet</h2><p>Identité → jeu → type de contenu → description → catégories → créateur/équipe → droits/licence.</p><button className="primary" onClick={()=>setDraftStarted(true)}><Plus/>{draftStarted?"Brouillon local créé":"Créer un projet local"}</button></div><ol><li><strong>Projet</strong><span>Identité et droits</span></li><li><strong>Release</strong><span>Version, compatibilité, dépendances</span></li><li><strong>Fichiers</strong><span>Hash, provenance, distribution</span></li><li><strong>Validation</strong><span>Preview puis soumission explicite</span></li></ol></section></>,
    "Projects": <section className="studio-panel"><span className="kicker">Projects</span><h2>Projets</h2>{draftStarted?<div className="studio-row"><div><strong>Projet sans titre</strong><span>Brouillon local · Aetherlands · type à choisir</span></div><button className="quiet">Continuer</button></div>:<div className="empty"><Stack/><h3>Aucun projet de démonstration</h3><p>Créez un brouillon local depuis le Dashboard.</p></div>}</section>,
    "Releases": <section className="studio-panel"><span className="kicker">Releases</span><h2>Préparer une release</h2><div className="release-steps">{["Version","Canal","Version du jeu","Loader / framework","Dépendances","Conflits","Fichiers","Changelog","Provenance","Validation","Preview","Submit"].map((value,i)=><div key={value}><span>{String(i+1).padStart(2,"0")}</span><strong>{value}</strong><small>{i<2?"À définir":"Non renseigné"}</small></div>)}</div><p className="studio-note">Créer un projet ne crée jamais automatiquement une release.</p></section>,
    "Upload": <section className="studio-panel"><span className="kicker">Upload</span><h2>Fichiers de release</h2><div className="upload-zone"><strong>Zone d’upload de démonstration</strong><span>Clavier accessible · aucun fichier n’est envoyé dans ce prototype.</span><button className="quiet" disabled>Sélectionner un fichier — backend indisponible</button></div><p className="studio-note">Une erreur d’upload réelle devra préserver le brouillon local.</p></section>,
    "Analytics": <section className="studio-panel"><span className="kicker">Analytics</span><h2>Mesures</h2><div className="unavailable-state"><strong>Données indisponibles</strong><span>Aucune vue, téléchargement, installation ou favori n’est simulé sans source réelle.</span></div></section>,
    "Support": <section className="studio-panel"><span className="kicker">Support</span><h2>Support du projet</h2><div className="unavailable-state"><strong>Service non connecté</strong><span>Questions, bugs et discussions resteront séparés de la modération.</span></div></section>,
    "Reports": <section className="studio-panel"><span className="kicker">Reports</span><h2>Signalements</h2><div className="unavailable-state"><strong>Aucun signalement réel</strong><span>Les outils de modération n’apparaissent qu’avec permissions serveur réelles.</span></div></section>,
    "Team": <section className="studio-panel"><span className="kicker">Team</span><h2>Équipe / studio</h2><div className="studio-row"><div><strong>Atelier de démonstration</strong><span>Rôles et permissions non connectés à un backend.</span></div><span className="support-state">Local uniquement</span></div></section>,
    "Settings": <section className="studio-panel"><span className="kicker">Settings</span><h2>Paramètres du Studio</h2><div className="permissions-list"><div><dt>Sauvegarde locale</dt><dd>Prévue</dd></div><div><dt>Sauvegarde distante</dt><dd>Indisponible</dd></div><div><dt>Publication</dt><dd>Action explicite requise</dd></div><div><dt>Réauthentification</dt><dd>Backend requis</dd></div></div></section>,
  };
  return <main className="page-section creator-studio">
    <span className="kicker">Créer</span><h1>Creator Studio</h1><p className="page-intro">Créez un projet, préparez une release et contrôlez droits, provenance et validation sans simuler les services absents.</p>
    <div className="studio-shell"><nav className="studio-nav" aria-label="Navigation Creator Studio">{tabs.map(value=><button key={value} className={tab===value?"active":""} onClick={()=>setTab(value)}>{value}</button>)}</nav><div className="studio-content">{panel[tab]}</div></div>
  </main>;
}

function Community() { return <main className="page-section community"><span className="kicker">Communauté</span><h1>Des idées qui font vivre les mondes.</h1><p className="page-intro">Suivez des créateurs, découvrez leurs collections publiques et partagez vos trouvailles.</p><div className="community-grid">{['Atelier Boréal','Lueur Collective','Les Cartographes'].map((name,i)=><article key={name}><Media pos={contentItems[i+1].pos}/><div><div className="creator-avatar"><UsersThree/></div><h2>{name}</h2><p>Curations et créations autour de l’exploration.</p><button>Voir le profil <ArrowRight/></button></div></article>)}</div></main>; }

export function App() {
  const [active, setActive] = useState("Jeux");
  const [detail, setDetail] = useState(null);
  const [gameHubOpen,setGameHubOpen]=useState(true);
  const navigate = item => { setDetail(null); setGameHubOpen(false); setActive(item); window.scrollTo({top:0,behavior:'smooth'}); };
  const openGameHub=()=>{setDetail(null);setActive("Jeux");setGameHubOpen(true);window.scrollTo({top:0,behavior:'smooth'});};
  const openContent=item=>{setDetail(item);window.scrollTo({top:0,behavior:'smooth'});};
  let screen;
  if (detail) screen=<Detail item={detail} onBack={()=>setDetail(null)}/>;
  else if(active==='Découvrir') screen=<Discover onOpen={openContent}/>;
  else if(active==='Recherche') screen=<GlobalSearch onOpenContent={openContent} onOpenGame={openGameHub}/>;
  else if(active==='Jeux' && !gameHubOpen) screen=<GamesIndex onOpenGame={openGameHub}/>;
  else if(active==='Mods & contenus' || active==='Collections' || active==='Créateurs') screen=<Catalog onOpen={openContent}/>;
  else if(active==='Communauté') screen=<Community/>;
  else if(active==='Créer') screen=<CreatorStudio/>;
  else if(active==='Bibliothèque') screen=<Library/>;
  else screen=<GameHub onOpen={openContent}/>;
  return <div className="app-shell"><Topbar active={active} onNavigate={navigate}/>{screen}<footer><Logo/><p>Prototype exploratoire MODARYX V2 · Direction Living Threshold hybride 2+3</p><button onClick={openGameHub}><GameController/>Game Hub</button><button onClick={()=>navigate('Bibliothèque')}><BookOpen/>Bibliothèque</button></footer></div>;
}
