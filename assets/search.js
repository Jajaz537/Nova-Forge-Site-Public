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
  }

  async function hydrate() {
    try {
      const response = await fetch(INDEX_URL, {headers: {Accept: "application/json"}});
      if (!response.ok) throw new Error("search-index-unavailable");
      const payload = await response.json();
      if (payload?.schemaVersion !== 1 || payload?.indexMode !== "preindexed-local" || payload?.externalAdapterRequired !== false || !Array.isArray(payload.entries)) throw new Error("search-index-invalid");
      entries = payload.entries.filter((entry) => entry && typeof entry.id === "string" && typeof entry.href === "string" && entry.href.startsWith("./") && !entry.href.includes(".."));
      render();
    } catch {
      state.textContent = "Index enrichi indisponible ; le répertoire statique reste affiché sans substitution distante.";
    }
  }

  input.addEventListener("input", () => { if (entries.length) render(); });
  hydrate();
})();
