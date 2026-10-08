const activePaths = Object.freeze({
  "Découvrir": "/discover",
  "Jeux": "/games",
  "Mods & contenus": "/mods",
  "Recherche": "/search",
  "Collections": "/collections",
  "Créateurs": "/creators",
  "Communauté": "/community",
  "Créer": "/studio",
  "Bibliothèque": "/library",
  "Compte": "/account",
  "Notifications": "/notifications",
  "Droits jeux": "/rights",
  "MODARYX IA": "/ai",
  "Confiance & légal": "/trust",
  "Aide & documentation": "/help",
  "Modération": "/moderation",
});

export function pathForActive(active) {
  return activePaths[active] || "/discover";
}

export function contentPath(item) {
  return "/content/" + encodeURIComponent(item?.slug || "");
}

export function routeStateFromPath(pathname, contentItems) {
  const path=(pathname||"/").replace(/\/+$/,"")||"/";
  if(path==="/") return {active:"Jeux",detail:null,gameHubOpen:true};
  if(path==="/games/aetherlands") return {active:"Jeux",detail:null,gameHubOpen:true};
  if(path==="/games") return {active:"Jeux",detail:null,gameHubOpen:false};

  const contentMatch=path.match(/^\/content\/([^/]+)$/);
  if(contentMatch){
    const slug=decodeURIComponent(contentMatch[1]);
    const detail=(contentItems||[]).find(item=>item.slug===slug)||null;
    if(detail) return {active:"Mods & contenus",detail,gameHubOpen:false};
  }

  for(const [active,route] of Object.entries(activePaths)){
    if(path===route) return {active,detail:null,gameHubOpen:false};
  }
  return {active:"Découvrir",detail:null,gameHubOpen:false};
}

export const routePaths = Object.freeze([
  "/","/discover","/games","/games/aetherlands","/mods","/search","/collections","/creators","/community","/studio","/library","/account","/notifications","/rights","/ai","/trust","/help","/moderation",
  "/content/sentiers-de-laube","/content/vestiges-suspendus","/content/sommets-silencieux","/content/rivages-du-couchant","/content/brumes-des-hautes-terres","/content/le-pont-des-veilleurs"
]);
