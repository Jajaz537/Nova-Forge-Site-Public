import { useMemo, useState } from "react";
import {
  ArrowRight, Bell, BookOpen, Check, FunnelSimple, GameController, GridFour,
  List, MagnifyingGlass, Plus, SlidersHorizontal, Stack, UsersThree, X
} from "@phosphor-icons/react";

const navItems = ["Découvrir", "Jeux", "Mods & contenus", "Collections", "Créateurs", "Communauté"];
const contentItems = [
  { title: "Sentiers de l’aube", kind: "Exploration", pos: "0% 0%", tone: "cyan" },
  { title: "Vestiges suspendus", kind: "Environnements", pos: "50% 0%", tone: "violet" },
  { title: "Sommets silencieux", kind: "Graphismes", pos: "100% 0%", tone: "cyan" },
  { title: "Rivages du couchant", kind: "Immersion", pos: "0% 100%", tone: "violet" },
  { title: "Brumes des hautes terres", kind: "Gameplay", pos: "50% 100%", tone: "cyan" },
  { title: "Le pont des veilleurs", kind: "Quêtes", pos: "100% 100%", tone: "violet" },
];

function Logo() {
  return <a className="logo" href="#top" aria-label="MODARYX — accueil">MODARY<span>X</span></a>;
}

function Topbar({ active, onNavigate }) {
  const [open, setOpen] = useState(false);
  return <header className="topbar" id="top">
    <Logo />
    <button className="mobile-menu" aria-label="Ouvrir le menu" aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? <X /> : <List />}</button>
    <nav className={open ? "global-nav open" : "global-nav"} aria-label="Navigation principale">
      {navItems.map(item => <button key={item} className={active === item ? "active" : ""} onClick={() => { onNavigate(item); setOpen(false); }}>{item}</button>)}
    </nav>
    <div className="top-actions"><button aria-label="Notifications"><Bell /></button><button className="avatar" aria-label="Compte">M</button></div>
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

function GameHub({ onOpen }) {
  const [tab, setTab] = useState("Pour votre version");
  const [query, setQuery] = useState("");
  const [version, setVersion] = useState("1.4.2");
  const visible = useMemo(() => contentItems.filter(x => x.title.toLowerCase().includes(query.toLowerCase())), [query]);
  return <>
    <section className="game-hero">
      <div className="hero-shade" />
      <div className="game-identity"><span className="demo-label">Démonstration</span><h1>Aetherlands</h1><label>Version<select value={version} onChange={e => setVersion(e.target.value)}><option>1.4.2</option><option>1.4.1</option></select></label></div>
      <form className="hero-search" onSubmit={e => e.preventDefault()}><MagnifyingGlass /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher dans ce jeu" aria-label="Rechercher dans ce jeu"/><button type="button" aria-label="Filtres"><SlidersHorizontal /></button></form>
      <button className="primary">Explorer les contenus <ArrowRight /></button>
    </section>
    <nav className="local-nav" aria-label="Navigation du jeu">{["Aperçu","Pour votre version","Mods & contenus","Collections","Créateurs","Communauté"].map(x => <button key={x} className={tab===x?'active':''} onClick={() => setTab(x)}>{x}</button>)}</nav>
    <main className="hub-layout">
      <section className="hub-content"><div className="section-heading"><div><span className="kicker">Sélection adaptative</span><h2>{tab}</h2><p>Contenus compatibles avec Aetherlands {version}.</p></div><button className="quiet"><FunnelSimple />Affiner</button></div>
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
  return <main className="page-section catalog"><div className="catalog-title"><span className="kicker">Catalogue global</span><h1>Mods & contenus</h1><p>Trouvez un contenu, puis confirmez sa compatibilité avant de l’ajouter à un profil.</p></div><div className="catalog-tools"><div className="catalog-search"><MagnifyingGlass/><input placeholder="Rechercher dans tous les contenus"/></div><button><FunnelSimple/>Filtres</button><div className="view-toggle"><button className={grid?'active':''} onClick={()=>setGrid(true)} aria-label="Vue grille"><GridFour/></button><button className={!grid?'active':''} onClick={()=>setGrid(false)} aria-label="Vue liste"><List/></button></div></div><div className={grid?'content-grid catalog-grid':'content-list'}>{contentItems.map(item => <ContentCard dense={!grid} key={item.title} item={item} onOpen={onOpen}/>)}</div></main>;
}

function Detail({ item, onBack }) {
  const selected=item||contentItems[0];
  const [added,setAdded]=useState(false);
  return <main className="detail"><button className="back" onClick={onBack}>← Retour aux contenus</button><div className="detail-grid"><Media pos={selected.pos} className="detail-media"/><section className="detail-copy"><span className="kicker">{selected.kind}</span><h1>{selected.title}</h1><div className="detail-states"><Compatibility/><span className="version-pill">Aetherlands 1.4.2</span></div><p className="lede">Une proposition visuelle et narrative qui enrichit le monde sans rompre son équilibre. Contenu de démonstration non contractuel.</p><div className="trust-panel"><h2>Avant d’ajouter</h2><dl><div><dt>Version</dt><dd>1.4.2</dd></div><div><dt>Dépendances</dt><dd>Aucune</dd></div><div><dt>Source</dt><dd>Créateur de démonstration</dd></div></dl></div><button className={added?'primary success':'primary'} onClick={()=>setAdded(v=>!v)}>{added?<><Check/>Ajouté au profil Exploration</>:<><Plus/>Ajouter à un profil</>}</button></section></div></main>;
}

function Library() { return <main className="page-section library"><span className="kicker">Votre espace</span><h1>Bibliothèque</h1><p className="page-intro">Retrouvez vos jeux, profils et contenus enregistrés.</p><div className="library-grid"><section className="library-focus"><Media pos="50% 100%"/><div><span className="demo-label">Jeu actif</span><h2>Aetherlands</h2><p>3 profils · version 1.4.2</p><button className="primary">Ouvrir le Game Hub <ArrowRight/></button></div></section><ProfilesRail/></div></main>; }

function Community() { return <main className="page-section community"><span className="kicker">Communauté</span><h1>Des idées qui font vivre les mondes.</h1><p className="page-intro">Suivez des créateurs, découvrez leurs collections publiques et partagez vos trouvailles.</p><div className="community-grid">{['Atelier Boréal','Lueur Collective','Les Cartographes'].map((name,i)=><article key={name}><Media pos={contentItems[i+1].pos}/><div><div className="creator-avatar"><UsersThree/></div><h2>{name}</h2><p>Curations et créations autour de l’exploration.</p><button>Voir le profil <ArrowRight/></button></div></article>)}</div></main>; }

export function App() {
  const [active, setActive] = useState("Jeux");
  const [detail, setDetail] = useState(null);
  const navigate = item => { setDetail(null); setActive(item); window.scrollTo({top:0,behavior:'smooth'}); };
  let screen;
  if (detail) screen=<Detail item={detail} onBack={()=>setDetail(null)}/>;
  else if(active==='Découvrir') screen=<Discover onOpen={setDetail}/>;
  else if(active==='Mods & contenus' || active==='Collections' || active==='Créateurs') screen=<Catalog onOpen={setDetail}/>;
  else if(active==='Communauté') screen=<Community/>;
  else if(active==='Bibliothèque') screen=<Library/>;
  else screen=<GameHub onOpen={setDetail}/>;
  return <div className="app-shell"><Topbar active={active} onNavigate={navigate}/>{screen}<footer><Logo/><p>Prototype exploratoire MODARYX V2 · Direction Living Threshold hybride 2+3</p><button onClick={()=>navigate('Jeux')}><GameController/>Game Hub</button><button onClick={()=>setActive('Bibliothèque')}><BookOpen/>Bibliothèque</button></footer></div>;
}
