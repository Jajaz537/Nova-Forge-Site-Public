(() => {
  "use strict";
  const INDEX_URL = "./data/search-index.json";
  const input = document.querySelector("#site-search");
  const results = document.querySelector("#search-results");
  const count = document.querySelector("#search-count");
  const state = document.querySelector("#search-state");
  const empty = document.querySelector("#search-empty");
  if (!input || !results || !count || !state || !empty) return;

  let entries = [];
  let hydrated = false;
  let staleIndex = false;
  let loading = false;
  const validEntry = (entry) => entry &&
    typeof entry.id === "string" && entry.id.trim().length > 0 &&
    typeof entry.title === "string" && entry.title.trim().length > 0 &&
    typeof entry.summary === "string" &&
    typeof entry.href === "string" && entry.href.startsWith("./") && !entry.href.includes("..") &&
    (entry.terms === undefined || (Array.isArray(entry.terms) && entry.terms.every((term) => typeof term === "string")));
  const normalize = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const makeResult = (entry) => {
    const link = document.createElement("a");
    link.className = "search-result";
    link.href = entry.href;
    const title = document.createElement("strong");
    title.textContent = entry.title;
    const summary = document.createElement("span");
    summary.textContent = entry.summary;
    link.append(title, summary);
    return link;
  };

  function render() {
    const query = normalize(input.value);
    const filtered = entries.filter((entry) => {
      const haystack = normalize([entry.title, entry.summary, ...(entry.terms || [])].join(" "));
      return !query || haystack.includes(query);
    });
    results.replaceChildren(...filtered.map(makeResult));
    count.textContent = `${filtered.length} ${filtered.length === 1 ? "résultat" : "résultats"}`;
    empty.hidden = filtered.length !== 0;
    state.textContent = "Recherche exécutée localement dans l’index public pré-calculé. Aucun service distant interrogé.";
    if (staleIndex) state.textContent += " Copie en cache : les pages et descriptions peuvent avoir changé depuis son enregistrement.";
  }

  async function hydrate(retry = false) {
    if (loading) return;
    loading = true;
    state.textContent = "Chargement de l’index…";
    try {
      const response = await fetch(INDEX_URL, {headers: {Accept: "application/json"}});
      if (!response.ok) throw new Error("search-index-unavailable");
      staleIndex = response.headers?.get('X-Modaryx-Cache') === 'offline-stale';
      const payload = await response.json();
      if (payload?.schemaVersion !== 1 || payload?.indexMode !== "preindexed-local" || payload?.externalAdapterRequired !== false || !Array.isArray(payload.entries)) throw new Error("search-index-invalid");
      if (!payload.entries.every(validEntry) || new Set(payload.entries.map((entry) => entry.id)).size !== payload.entries.length) throw new Error("search-entry-invalid");
      entries = payload.entries;
      render();
      hydrated = true;
      input.disabled = false;
      if (retry) input.focus();
    } catch {
      hydrated = false;
      input.disabled = true;
      state.textContent = "Index indisponible ; le répertoire statique reste accessible. ";
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button small";
      button.textContent = "Réessayer";
      button.addEventListener("click", () => hydrate(true));
      state.append(button);
      if (retry) button.focus();
    } finally {
      loading = false;
    }
  }

  input.addEventListener("input", () => { if (hydrated) render(); });
  hydrate();
})();
