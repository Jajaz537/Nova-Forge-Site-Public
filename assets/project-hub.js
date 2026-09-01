(() => {
  "use strict";

  const CATALOG_URL = "./data/catalog.json";
  const GRAPH_URL = "./data/compatibility-graph.json";
  const FAVORITES_KEY = "nova-forge:catalog:favorites:v1";
  const root = document.querySelector("[data-project-id]");
  if (!root) return;

  const node = (id) => document.getElementById(id);
  const relationsRoot = node("project-relations");
  const relationsEmpty = node("project-relations-empty");
  const state = node("project-state");
  const favoriteButton = node("project-favorite");

  const labels = {
    measured: "Mesurée",
    estimated: "Estimée",
    unknown: "Inconnue",
    allowed: "Autorisée",
    restricted: "Restreinte",
    "not-authorized": "Non autorisée"
  };

  function requestedId() {
    return root.dataset.projectId;
  }

  function loadFavorites() {
    try {
      const parsed = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      return new Set(Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : []);
    } catch { return new Set(); }
  }

  function renderFavorite(id) {
    if (!favoriteButton) return;
    const active = loadFavorites().has(id);
    favoriteButton.setAttribute("aria-pressed", active ? "true" : "false");
    favoriteButton.textContent = active ? "★ Favori local" : "☆ Favori local";
    favoriteButton.classList.toggle("favorite-active", active);
  }

  function toggleFavorite() {
    const id = root.dataset.projectId;
    const favorites = loadFavorites();
    if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites].sort())); } catch {}
    renderFavorite(id);
    state.textContent = favorites.has(id) ? "Ajouté aux favoris de ce navigateur uniquement." : "Retiré des favoris de ce navigateur uniquement.";
  }

  function relationCard(edge, peer) {
    const card = document.createElement("div");
    card.className = "relation-card";
    const head = document.createElement("div");
    head.className = "relation-head";
    const title = document.createElement("strong");
    title.textContent = peer?.label || peer?.id || "Relation inconnue";
    const evidence = document.createElement("span");
    evidence.className = `project-evidence ${edge.evidence}`;
    evidence.textContent = labels[edge.evidence] || "Inconnue";
    head.append(title, evidence);
    const type = document.createElement("span");
    type.className = "relation-type";
    type.textContent = edge.relation;
    const notes = document.createElement("p");
    notes.textContent = edge.notes || "Aucune note publique.";
    card.append(head, type, notes);
    return card;
  }

  function renderProject(item, graph) {
    if (item.id !== root.dataset.projectId) {
      state.textContent = "Identité enrichie incohérente ; le fallback statique est conservé.";
      return;
    }
    node("project-kind").textContent = `${item.kind} · aperçu public`;
    node("project-title").textContent = item.name;
    node("project-summary").textContent = item.summary;
    node("project-game").textContent = item.game?.name || "Inconnu";
    node("project-version").textContent = item.version || "Inconnue";
    node("project-creator").textContent = item.creator?.displayName || "Inconnu";
    node("project-evidence").textContent = labels[item.compatibility?.evidence] || "Inconnue";
    node("project-distribution").textContent = item.distribution?.label || "Verrouillée";
    node("project-provenance").textContent = item.provenance?.label || "Inconnue";
    node("project-license").textContent = item.rights?.license || "Inconnue";
    node("project-redistribution").textContent = labels[item.rights?.redistribution] || "Inconnue";

    const graphNodeId = `content:${item.id}`;
    const nodeMap = new Map((graph.nodes || []).map((entry) => [entry.id, entry]));
    const edges = (graph.edges || []).filter((edge) => edge.from === graphNodeId || edge.to === graphNodeId);
    relationsRoot.replaceChildren();
    edges.forEach((edge) => {
      const peerId = edge.from === graphNodeId ? edge.to : edge.from;
      relationsRoot.append(relationCard(edge, nodeMap.get(peerId)));
    });
    relationsEmpty.hidden = edges.length !== 0;
    renderFavorite(item.id);
    state.textContent = "Mini-hub hydraté depuis le catalogue et le Compatibility Graph publics du même site.";
    document.title = `${item.name} — Nova Forge`;
  }

  async function hydrate() {
    const id = requestedId();
    try {
      const [catalogResponse, graphResponse] = await Promise.all([
        fetch(CATALOG_URL, {headers: {Accept: "application/json"}}),
        fetch(GRAPH_URL, {headers: {Accept: "application/json"}})
      ]);
      if (!catalogResponse.ok || !graphResponse.ok) throw new Error("public-data-unavailable");
      const [catalog, graph] = await Promise.all([catalogResponse.json(), graphResponse.json()]);
      if (catalog?.schemaVersion !== 1 || graph?.schemaVersion !== 1) throw new Error("public-data-contract-invalid");
      const item = (catalog.items || []).find((entry) => entry?.public === true && entry.id === id);
      if (!item) {
        state.textContent = "Projet public introuvable. Le fallback statique reste affiché et aucune donnée alternative n’est substituée.";
        renderFavorite(root.dataset.projectId);
        return;
      }
      renderProject(item, graph);
    } catch {
      state.textContent = navigator.onLine ? "Données enrichies indisponibles ; le fallback statique reste affiché." : "Hors ligne : le fallback statique et les données déjà mises en cache restent prioritaires.";
      renderFavorite(root.dataset.projectId);
    }
  }

  favoriteButton?.addEventListener("click", toggleFavorite);
  renderFavorite(root.dataset.projectId);
  hydrate();
})();
