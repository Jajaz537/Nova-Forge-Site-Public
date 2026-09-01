(() => {
  "use strict";
  const DATA_URL = "./data/catalog.json";
  const FAVORITES_KEY = "nova-forge:catalog:favorites:v1";
  const grid = document.querySelector("#catalog-grid");
  const form = document.querySelector("#catalog-filter-form");
  if (!grid || !form) return;

  const queryInput = document.querySelector("#catalog-query");
  const kindSelect = document.querySelector("#catalog-kind");
  const gameSelect = document.querySelector("#catalog-game");
  const evidenceSelect = document.querySelector("#catalog-evidence");
  const sortSelect = document.querySelector("#catalog-sort");
  const favoritesOnly = document.querySelector("#catalog-favorites-only");
  const resetButton = document.querySelector("#catalog-reset");
  const countNode = document.querySelector("#catalog-count");
  const stateNode = document.querySelector("#catalog-state");
  const emptyNode = document.querySelector("#catalog-empty");

  let items = [];
  let favorites = loadFavorites();

  function loadFavorites() {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : []);
    } catch { return new Set(); }
  }

  function saveFavorites() {
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites].sort())); } catch {}
  }

  const normalize = (value) => String(value ?? "").trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const evidenceLabel = (value) => value === "measured" ? "Mesurée" : value === "estimated" ? "Estimée" : "Inconnue";
  const kindLabel = (value) => value === "experience" ? "Expérience" : value === "pack" ? "Pack" : "Mod";
  const projectHref = (id) => `./project-${encodeURIComponent(id)}.html`;

  function make(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function detailRow(label, value, className) {
    const row = document.createElement("div");
    row.append(make("dt", "", label));
    const dd = make("dd", className || "", value);
    row.append(dd);
    return row;
  }

  function buildCard(item) {
    const article = make("article", "catalog-card");
    article.dataset.catalogId = item.id;
    article.dataset.kind = item.kind;
    article.dataset.game = item.game.name;
    article.dataset.evidence = item.compatibility.evidence;
    article.dataset.hydrated = "true";

    const top = make("div", "catalog-card-top");
    top.append(make("span", "badge", kindLabel(item.kind)), make("span", `evidence-chip ${item.compatibility.evidence}`, evidenceLabel(item.compatibility.evidence)));
    const title = make("h3", "", item.name);
    const summary = make("p", "catalog-summary", item.summary);
    const details = document.createElement("dl");
    details.append(
      detailRow("Jeu", item.game.name, "catalog-game"),
      detailRow("Version", item.version, "catalog-version"),
      detailRow("Provenance", item.provenance.label, "catalog-provenance"),
      detailRow("Distribution", item.distribution.label, "catalog-distribution")
    );

    const actions = make("div", "catalog-card-actions");
    const favorite = favorites.has(item.id);
    const favoriteButton = make("button", `text-button${favorite ? " favorite-active" : ""}`, favorite ? "★ Favori" : "☆ Favori");
    favoriteButton.type = "button";
    favoriteButton.dataset.favoriteId = item.id;
    favoriteButton.setAttribute("aria-pressed", favorite ? "true" : "false");
    const projectLink = make("a", "text-link", "Voir le mini-hub");
    projectLink.href = projectHref(item.id);
    actions.append(favoriteButton, projectLink);
    article.append(top, title, summary, details, actions);
    return article;
  }

  function refreshGames() {
    const current = gameSelect.value;
    const games = [...new Set(items.map((item) => item.game.name))].sort((a, b) => a.localeCompare(b, "fr"));
    gameSelect.replaceChildren(new Option("Tous", ""));
    games.forEach((game) => gameSelect.add(new Option(game, game)));
    if (games.includes(current)) gameSelect.value = current;
  }

  function render() {
    const q = normalize(queryInput.value);
    const kind = kindSelect.value;
    const game = gameSelect.value;
    const evidence = evidenceSelect.value;
    const onlyFavorites = favoritesOnly.checked;
    let filtered = items.filter((item) => {
      const haystack = normalize([item.name, item.game.name, item.creator.displayName, item.summary, ...(item.tags || [])].join(" "));
      return (!q || haystack.includes(q)) && (!kind || item.kind === kind) && (!game || item.game.name === game) && (!evidence || item.compatibility.evidence === evidence) && (!onlyFavorites || favorites.has(item.id));
    });
    if (sortSelect.value === "name") filtered.sort((a, b) => a.name.localeCompare(b.name, "fr"));
    else if (sortSelect.value === "updated") filtered.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
    else filtered.sort((a, b) => (a.featuredRank ?? 999) - (b.featuredRank ?? 999));
    grid.replaceChildren(...filtered.map(buildCard));
    countNode.textContent = `${filtered.length} ${filtered.length === 1 ? "entrée" : "entrées"}`;
    emptyNode.hidden = filtered.length !== 0;
    stateNode.textContent = onlyFavorites ? "Filtrage local des favoris activé. Aucune synchronisation distante." : "Catalogue hydraté depuis les données publiques du même site. Recherche et tri exécutés localement.";
  }

  async function hydrate() {
    try {
      const response = await fetch(DATA_URL, {headers: {Accept: "application/json"}});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      if (!payload || payload.schemaVersion !== 1 || !Array.isArray(payload.items)) throw new Error("catalog-contract-invalid");
      items = payload.items.filter((item) => item && item.public === true && typeof item.id === "string");
      refreshGames();
      render();
    } catch {
      stateNode.textContent = navigator.onLine ? "Le catalogue enrichi n’a pas pu être chargé. Le contenu HTML statique initial reste disponible." : "Hors ligne : le contenu HTML statique initial reste disponible ; les données enrichies ne sont pas dans le cache courant.";
      countNode.textContent = `${grid.querySelectorAll(".catalog-card").length} entrées statiques`;
      bindStaticFavorites();
    }
  }

  function toggleFavorite(id, button) {
    if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
    saveFavorites();
    const active = favorites.has(id);
    button.setAttribute("aria-pressed", active ? "true" : "false");
    button.textContent = active ? "★ Favori" : "☆ Favori";
    button.classList.toggle("favorite-active", active);
    if (items.length && favoritesOnly.checked) render();
  }

  function bindStaticFavorites() {
    grid.querySelectorAll("[data-favorite-id]").forEach((button) => {
      const active = favorites.has(button.dataset.favoriteId);
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.textContent = active ? "★ Favori" : "☆ Favori";
      button.classList.toggle("favorite-active", active);
    });
  }

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-favorite-id]");
    if (button) toggleFavorite(button.dataset.favoriteId, button);
  });
  form.addEventListener("input", () => { if (items.length) render(); });
  form.addEventListener("change", () => { if (items.length) render(); });
  form.addEventListener("submit", (event) => event.preventDefault());
  resetButton?.addEventListener("click", () => { form.reset(); if (items.length) render(); queryInput.focus(); });

  bindStaticFavorites();
  hydrate();
})();
