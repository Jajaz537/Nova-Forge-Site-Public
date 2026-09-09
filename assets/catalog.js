(() => {
  "use strict";
  const DATA_URL = "./data/catalog.json";
  const FAVORITES_KEY = "nova-forge:catalog:favorites:v1";
  const SAVED_VIEWS_KEY = "nova-forge:catalog:saved-views:v1";
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
  const viewNameInput = document.querySelector("#catalog-view-name");
  const viewSelect = document.querySelector("#catalog-saved-view");
  const saveViewButton = document.querySelector("#catalog-save-view");
  const applyViewButton = document.querySelector("#catalog-apply-view");
  const deleteViewButton = document.querySelector("#catalog-delete-view");
  const viewsStateNode = document.querySelector("#catalog-views-state");

  let items = [];
  let favorites = loadFavorites();
  let savedViews = loadSavedViews();

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

  function loadSavedViews() {
    try {
      const raw = localStorage.getItem(SAVED_VIEWS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((view) => view && typeof view.id === "string" && typeof view.name === "string" && view.filters && typeof view.filters === "object").slice(0, 12);
    } catch { return []; }
  }

  function persistSavedViews() {
    try {
      localStorage.setItem(SAVED_VIEWS_KEY, JSON.stringify(savedViews.slice(0, 12)));
      return true;
    } catch { return false; }
  }

  function currentFilters() {
    return {
      q: queryInput.value.trim(),
      kind: kindSelect.value,
      game: gameSelect.value,
      evidence: evidenceSelect.value,
      sort: sortSelect.value,
      favoritesOnly: favoritesOnly.checked
    };
  }

  function refreshSavedViews() {
    if (!viewSelect) return;
    const selected = viewSelect.value;
    viewSelect.replaceChildren(new Option("Choisir une vue…", ""));
    savedViews.forEach((view) => viewSelect.add(new Option(view.name, view.id)));
    if (savedViews.some((view) => view.id === selected)) viewSelect.value = selected;
    const hasSelection = Boolean(viewSelect.value);
    if (applyViewButton) applyViewButton.disabled = !hasSelection;
    if (deleteViewButton) deleteViewButton.disabled = !hasSelection;
  }

  function applySavedView(view) {
    if (!view?.filters) return;
    const filters = view.filters;
    queryInput.value = typeof filters.q === "string" ? filters.q : "";
    kindSelect.value = typeof filters.kind === "string" ? filters.kind : "";
    if (typeof filters.game === "string" && [...gameSelect.options].some((option) => option.value === filters.game)) gameSelect.value = filters.game;
    else gameSelect.value = "";
    evidenceSelect.value = typeof filters.evidence === "string" ? filters.evidence : "";
    sortSelect.value = typeof filters.sort === "string" ? filters.sort : "featured";
    favoritesOnly.checked = filters.favoritesOnly === true;
    if (items.length) render();
    if (viewsStateNode) viewsStateNode.textContent = `Vue « ${view.name} » appliquée localement.`;
  }

  function saveCurrentView() {
    if (!viewNameInput || !viewSelect) return;
    const name = viewNameInput.value.trim().replace(/\s+/g, " ").slice(0, 48);
    if (!name) {
      if (viewsStateNode) viewsStateNode.textContent = "Donnez un nom à la vue avant de l’enregistrer.";
      viewNameInput.focus();
      return;
    }
    const now = Date.now();
    const id = `view-${now.toString(36)}`;
    savedViews = [{id, name, filters: currentFilters()}, ...savedViews.filter((view) => view.name.toLocaleLowerCase("fr") !== name.toLocaleLowerCase("fr"))].slice(0, 12);
    if (!persistSavedViews()) {
      if (viewsStateNode) viewsStateNode.textContent = "Le navigateur a refusé l’enregistrement local de cette vue.";
      return;
    }
    refreshSavedViews();
    viewSelect.value = id;
    viewNameInput.value = "";
    if (applyViewButton) applyViewButton.disabled = false;
    if (deleteViewButton) deleteViewButton.disabled = false;
    if (viewsStateNode) viewsStateNode.textContent = `Vue « ${name} » enregistrée uniquement dans ce navigateur.`;
  }

  function deleteSelectedView() {
    if (!viewSelect?.value) return;
    const target = savedViews.find((view) => view.id === viewSelect.value);
    savedViews = savedViews.filter((view) => view.id !== viewSelect.value);
    persistSavedViews();
    refreshSavedViews();
    if (viewsStateNode) viewsStateNode.textContent = target ? `Vue « ${target.name} » supprimée de ce navigateur.` : "Vue locale supprimée.";
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
      refreshSavedViews();
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
  saveViewButton?.addEventListener("click", saveCurrentView);
  applyViewButton?.addEventListener("click", () => {
    const view = savedViews.find((item) => item.id === viewSelect?.value);
    if (view) applySavedView(view);
  });
  deleteViewButton?.addEventListener("click", deleteSelectedView);
  viewSelect?.addEventListener("change", () => {
    const hasSelection = Boolean(viewSelect.value);
    if (applyViewButton) applyViewButton.disabled = !hasSelection;
    if (deleteViewButton) deleteViewButton.disabled = !hasSelection;
    if (viewsStateNode) viewsStateNode.textContent = hasSelection ? "Vue locale prête à être appliquée." : "Les vues enregistrées restent uniquement dans ce navigateur.";
  });

  refreshSavedViews();
  bindStaticFavorites();
  hydrate();
})();
