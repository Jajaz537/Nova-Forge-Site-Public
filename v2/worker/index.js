const ROUTE_META = new Map([
  ["/", ["Aetherlands — MODARYX", "Game Hub MODARYX : contenus, profils et compatibilité pour Aetherlands."]],
  ["/discover", ["Découvrir — MODARYX", "Découvrez jeux, contenus, collections et créations sur MODARYX."]],
  ["/games", ["Jeux — MODARYX", "Parcourez les jeux disponibles dans MODARYX."]],
  ["/games/aetherlands", ["Aetherlands — MODARYX", "Game Hub MODARYX : contenus, profils et compatibilité pour Aetherlands."]],
  ["/mods", ["Mods & contenus — MODARYX", "Parcourez les mods et contenus disponibles dans MODARYX."]],
  ["/search", ["Recherche — MODARYX", "Recherchez jeux, contenus, créateurs et collections MODARYX."]],
  ["/collections", ["Collections — MODARYX", "Explorez les collections MODARYX."]],
  ["/creators", ["Créateurs — MODARYX", "Découvrez les créateurs et équipes présents sur MODARYX."]],
  ["/community", ["Communauté — MODARYX", "Support, questions et échanges liés au modding sur MODARYX."]],
  ["/studio", ["Studio — MODARYX", "Espace de création et publication MODARYX."]],
  ["/library", ["Bibliothèque — MODARYX", "Retrouvez vos favoris, profils et collections MODARYX."]],
  ["/account", ["Compte — MODARYX", "Paramètres et préférences de votre compte MODARYX."]],
  ["/notifications", ["Notifications — MODARYX", "Centre de notifications MODARYX."]],
  ["/rights", ["Droits jeux — MODARYX", "Surface de préparation et de suivi des droits jeux MODARYX."]],
  ["/ai", ["MODARYX IA — MODARYX", "Aperçu des capacités assistées par IA dans MODARYX."]],
  ["/trust", ["Confiance & légal — MODARYX", "État de préparation confiance, sécurité et mentions légales MODARYX."]],
  ["/help", ["Aide & documentation — MODARYX", "Aide et documentation produit MODARYX."]],
  ["/moderation", ["Modération — MODARYX", "Surface de modération et d'appels MODARYX."]],
]);
const CONTENT_META = new Map([
  ["sentiers-de-laube","Sentiers de l’aube"],
  ["vestiges-suspendus","Vestiges suspendus"],
  ["sommets-silencieux","Sommets silencieux"],
  ["rivages-du-couchant","Rivages du couchant"],
  ["brumes-des-hautes-terres","Brumes des hautes terres"],
  ["le-pont-des-veilleurs","Le pont des veilleurs"],
]);

function metaForPath(pathname){
  if(ROUTE_META.has(pathname)) return ROUTE_META.get(pathname);
  const match=pathname.match(/^\/content\/([^/]+)$/);
  const title=match&&CONTENT_META.get(decodeURIComponent(match[1]));
  return title ? [title+" — MODARYX", "Fiche contenu MODARYX : compatibilité, fichiers, dépendances et provenance."] : null;
}
function withRouteMeta(html,pathname,title,description){
  return html
    .replace(/<title>[^<]*<\/title>/,'<title>'+title+'</title>')
    .replace(/<meta name="description" content="[^"]*" \/>/,'<meta name="description" content="'+description.replaceAll('"','&quot;')+'" />')
    .replace('<div id="root"></div>','<div id="root" data-modaryx-route="'+pathname.replaceAll('"','&quot;')+'"></div>');
}

export default {
  async fetch(request, env) {
    const url=new URL(request.url);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");
    const eligible = acceptsHtml && ["GET","HEAD"].includes(request.method);
    const meta=metaForPath(url.pathname);

    const response = await env.ASSETS.fetch(request);
    if (!eligible) return response;
    if (!meta) return response;

    let htmlResponse=response;
    if(response.status===404){
      const indexUrl = new URL(request.url);
      indexUrl.pathname = "/index.html";
      indexUrl.search = "";
      htmlResponse=await env.ASSETS.fetch(new Request(indexUrl, request));
    }
    if(htmlResponse.status!==200) return htmlResponse;
    if(request.method==="HEAD") return new Response(null,{status:200,headers:htmlResponse.headers});

    const html=await htmlResponse.text();
    const headers=new Headers(htmlResponse.headers);
    headers.set("content-type","text/html; charset=utf-8");
    headers.set("x-robots-tag","noindex, nofollow, noarchive");
    return new Response(withRouteMeta(html,url.pathname,meta[0],meta[1]),{status:200,headers});
  },
};
