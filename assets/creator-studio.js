(() => {
  "use strict";

  const STORAGE_KEY = "nova-forge:creator:draft:v2";
  const LEGACY_STORAGE_KEY = "nova-forge:creator:draft:v1";
  const SCHEMA_URL = "./schemas/universal-mod-manifest.schema.json";
  const SHA256_RE = /^[a-f0-9]{64}$/;
  const RECEIPT_RE = /^receipt:[a-z0-9][a-z0-9._:-]{1,191}$/;

  const form = document.querySelector("#creator-form");
  const preview = document.querySelector("#manifest-preview");
  const status = document.querySelector("#studio-status");
  const schemaStatus = document.querySelector("#schema-status");
  const saveButton = document.querySelector("#save-draft");
  const downloadButton = document.querySelector("#download-draft");
  const clearButton = document.querySelector("#clear-draft");
  const importButton = document.querySelector("#import-draft");
  const importFile = document.querySelector("#import-draft-file");
  if (!form || !preview || !status || !schemaStatus || !saveButton || !downloadButton || !clearButton || !importButton || !importFile) return;

  const byId = (id) => document.getElementById(id);
  const fields = {
    contentId: byId("content-id"), version: byId("content-version"), name: byId("content-name"), kind: byId("content-kind"), summary: byId("content-summary"),
    gameId: byId("game-id"), gameName: byId("game-name"), gameVersions: byId("game-versions"), gameLoaders: byId("game-loaders"),
    evidence: byId("compatibility-evidence"), evidenceReceipt: byId("evidence-receipt"), compatibilityNotes: byId("compatibility-notes"), dependencies: byId("dependencies"), conflicts: byId("conflicts"),
    creatorId: byId("creator-id"), creatorName: byId("creator-name"), license: byId("license"), redistribution: byId("redistribution"), rightsNotice: byId("rights-notice"),
    provenanceState: byId("provenance-state"), provenanceReceipt: byId("provenance-receipt"), sourceUri: byId("source-uri"), provenanceNotes: byId("provenance-notes"),
    files: byId("files")
  };

  let schema = null;
  let lastManifest = null;

  const read = (key) => String(fields[key]?.value ?? "").trim();
  const uniqueSorted = (value) => [...new Set(String(value).split(",").map((part) => part.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, "en"));
  const boolToken = (value, label) => {
    const normalized = String(value).trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false" || normalized === "") return false;
    throw new Error(`${label}: booléen attendu (true/false).`);
  };

  function parseRelations(value, label) {
    const rows = String(value).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const parsed = rows.map((line, index) => {
      const parts = line.split("|").map((part) => part.trim());
      if (parts.length > 3 || !parts[0]) throw new Error(`${label} ligne ${index + 1}: format id | versionRange | optional attendu.`);
      const relation = {id: parts[0]};
      if (parts[1]) relation.versionRange = parts[1];
      relation.optional = boolToken(parts[2] || "false", `${label} ligne ${index + 1}`);
      return relation;
    });
    const keys = parsed.map((entry) => `${entry.id}\u0000${entry.versionRange || ""}\u0000${entry.optional}`);
    if (keys.length !== new Set(keys).size) throw new Error(`${label}: doublon exact détecté.`);
    return parsed.sort((a, b) => `${a.id}|${a.versionRange || ""}|${a.optional}`.localeCompare(`${b.id}|${b.versionRange || ""}|${b.optional}`, "en"));
  }

  function parseFiles(value) {
    const rows = String(value).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const paths = new Set();
    const parsed = rows.map((line, index) => {
      const parts = line.split("|").map((part) => part.trim());
      if (parts.length > 5 || parts.length < 3) throw new Error(`Fichiers ligne ${index + 1}: format path | size | sha256 | mediaType | executable attendu.`);
      const [path, sizeRaw, sha256, mediaType = "", executableRaw = "false"] = parts;
      if (!path) throw new Error(`Fichiers ligne ${index + 1}: chemin requis.`);
      if (paths.has(path)) throw new Error(`Fichiers: chemin dupliqué ${path}.`);
      paths.add(path);
      const size = Number(sizeRaw);
      if (!Number.isInteger(size) || size < 0) throw new Error(`Fichiers ligne ${index + 1}: taille entière positive ou nulle requise.`);
      if (!SHA256_RE.test(sha256)) throw new Error(`Fichiers ligne ${index + 1}: SHA-256 doit contenir 64 caractères hexadécimaux minuscules.`);
      const file = {path, size, hashes: {sha256}, executable: boolToken(executableRaw, `Fichiers ligne ${index + 1}`)};
      if (mediaType) file.mediaType = mediaType;
      return file;
    });
    return parsed.sort((a, b) => a.path.localeCompare(b.path, "en"));
  }

  function optional(target, key, value) {
    if (value !== "") target[key] = value;
  }

  function buildManifest() {
    const evidence = read("evidence") || "unknown";
    const provenanceState = read("provenanceState") || "unknown";
    const compatibility = {
      evidence,
      dependencies: parseRelations(read("dependencies"), "Dépendances"),
      conflicts: parseRelations(read("conflicts"), "Conflits")
    };
    optional(compatibility, "notes", read("compatibilityNotes"));
    if (evidence === "measured") optional(compatibility, "evidenceReceipt", read("evidenceReceipt"));
    else if (read("evidenceReceipt")) throw new Error("Receipt de mesure interdit tant que le niveau de preuve n’est pas Mesuré.");

    const rights = {license: read("license"), redistribution: read("redistribution") || "unknown"};
    optional(rights, "notice", read("rightsNotice"));

    const provenance = {state: provenanceState};
    optional(provenance, "sourceUri", read("sourceUri"));
    optional(provenance, "receiptId", read("provenanceReceipt"));
    optional(provenance, "notes", read("provenanceNotes"));

    const content = {id: read("contentId"), name: read("name"), version: read("version"), kind: read("kind")};
    optional(content, "summary", read("summary"));

    return {
      schemaVersion: 1,
      content,
      target: {gameId: read("gameId"), gameName: read("gameName"), versions: uniqueSorted(read("gameVersions")), loaders: uniqueSorted(read("gameLoaders"))},
      creator: {id: read("creatorId"), displayName: read("creatorName")},
      compatibility,
      rights,
      provenance,
      files: parseFiles(read("files")),
      distribution: {state: "locked", downloadable: false},
      releaseReceipt: null
    };
  }

  function canonicalize(value) {
    if (Array.isArray(value)) return value.map(canonicalize);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
    }
    return value;
  }

  const canonicalText = (manifest) => `${JSON.stringify(canonicalize(manifest), null, 2)}\n`;

  function schemaErrors(manifest) {
    if (!schema) return ["Schéma public indisponible : export bloqué en mode fail-closed."];
    if (!window.NovaJsonSchemaLite?.validate) return ["Validateur local du schéma indisponible."];
    const errors = window.NovaJsonSchemaLite.validate(schema, manifest);
    if (manifest.distribution?.state !== "locked" || manifest.distribution?.downloadable !== false) errors.push("$.distribution: un brouillon Studio doit rester locked/downloadable=false");
    if (manifest.releaseReceipt !== null) errors.push("$.releaseReceipt: un brouillon Studio doit rester null");
    if (manifest.compatibility?.evidence === "measured" && !RECEIPT_RE.test(manifest.compatibility?.evidenceReceipt || "")) errors.push("$.compatibility.evidenceReceipt: receipt requis pour Mesuré");
    if (manifest.provenance?.state === "verified" && !RECEIPT_RE.test(manifest.provenance?.receiptId || "")) errors.push("$.provenance.receiptId: receipt requis pour Vérifié");
    return errors;
  }

  function render() {
    try {
      const manifest = buildManifest();
      lastManifest = manifest;
      preview.textContent = canonicalText(manifest);
      const errors = schemaErrors(manifest);
      schemaStatus.textContent = errors.length ? `Validation locale : ${errors.length} erreur(s). ${errors.slice(0, 3).join(" · ")}` : "Validation locale : brouillon conforme au schéma UMM chargé. Cela ne constitue pas une preuve de provenance, signature ou mesure.";
      return {manifest, errors};
    } catch (error) {
      schemaStatus.textContent = `Brouillon non valide : ${error.message}`;
      return {manifest: null, errors: [error.message]};
    }
  }

  function requireValidDraft() {
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = "Complétez les champs requis avant sauvegarde ou export.";
      return null;
    }
    const result = render();
    if (!result.manifest || result.errors.length) {
      status.textContent = "Brouillon bloqué : corrigez la validation locale avant sauvegarde ou export.";
      return null;
    }
    return result.manifest;
  }

  const relationLines = (items) => (Array.isArray(items) ? items : []).map((entry) => `${entry.id || ""} | ${entry.versionRange || ""} | ${entry.optional === true ? "true" : "false"}`).join("\n");
  const fileLines = (items) => (Array.isArray(items) ? items : []).map((entry) => `${entry.path || ""} | ${Number.isInteger(entry.size) ? entry.size : ""} | ${entry.hashes?.sha256 || ""} | ${entry.mediaType || ""} | ${entry.executable === true ? "true" : "false"}`).join("\n");

  function applyManifest(manifest) {
    if (!manifest || manifest.schemaVersion !== 1 || manifest.distribution?.state !== "locked" || manifest.distribution?.downloadable !== false || manifest.releaseReceipt !== null) {
      throw new Error("Seuls les brouillons UMM v1 verrouillés, non téléchargeables et sans releaseReceipt peuvent être importés.");
    }
    const mapping = {
      contentId: manifest.content?.id, version: manifest.content?.version, name: manifest.content?.name, kind: manifest.content?.kind, summary: manifest.content?.summary,
      gameId: manifest.target?.gameId, gameName: manifest.target?.gameName, gameVersions: (manifest.target?.versions || []).join(", "), gameLoaders: (manifest.target?.loaders || []).join(", "),
      evidence: manifest.compatibility?.evidence, evidenceReceipt: manifest.compatibility?.evidenceReceipt, compatibilityNotes: manifest.compatibility?.notes,
      dependencies: relationLines(manifest.compatibility?.dependencies), conflicts: relationLines(manifest.compatibility?.conflicts),
      creatorId: manifest.creator?.id, creatorName: manifest.creator?.displayName, license: manifest.rights?.license, redistribution: manifest.rights?.redistribution, rightsNotice: manifest.rights?.notice,
      provenanceState: manifest.provenance?.state, provenanceReceipt: manifest.provenance?.receiptId, sourceUri: manifest.provenance?.sourceUri, provenanceNotes: manifest.provenance?.notes,
      files: fileLines(manifest.files)
    };
    for (const [key, node] of Object.entries(fields)) if (node) node.value = mapping[key] ?? "";
    const result = render();
    if (result.errors.length) throw new Error(`Brouillon importé mais non conforme : ${result.errors.slice(0, 3).join(" · ")}`);
  }

  async function loadSchema() {
    try {
      const response = await fetch(SCHEMA_URL, {headers: {Accept: "application/schema+json, application/json"}});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const loaded = await response.json();
      if (loaded?.$schema !== "https://json-schema.org/draft/2020-12/schema" || loaded?.$id !== "urn:nova-forge:schemas:universal-mod-manifest:v1") throw new Error("schema-contract-invalid");
      schema = loaded;
      render();
    } catch {
      schema = null;
      schemaStatus.textContent = "Schéma public indisponible : sauvegarde/export bloqués en mode fail-closed.";
    }
  }

  function loadSavedDraft() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.draftSchema === 2) {
          applyManifest(saved.manifest);
          status.textContent = "Brouillon V2 restauré depuis ce navigateur uniquement. Aucune donnée n’a été envoyée.";
          return;
        }
      }
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!legacyRaw) return;
      const legacy = JSON.parse(legacyRaw);
      if (legacy?.schemaVersion !== 1 || !legacy.fields) return;
      const legacyMap = legacy.fields;
      for (const key of ["contentId", "version", "name", "kind", "summary", "gameId", "gameName", "gameVersions", "evidence", "compatibilityNotes", "creatorId", "creatorName", "license", "redistribution"]) {
        if (fields[key] && typeof legacyMap[key] === "string") fields[key].value = legacyMap[key];
      }
      render();
      status.textContent = "Ancien brouillon V1 chargé en mémoire. Il ne sera migré vers V2 qu’après une sauvegarde explicite.";
    } catch {
      status.textContent = "Le brouillon local existant est illisible ou incompatible ; il n’a pas été utilisé.";
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const manifest = requireValidDraft();
    if (!manifest) return;
    status.textContent = "Brouillon validé localement. Rien n’a été sauvegardé ni publié automatiquement.";
  });

  saveButton.addEventListener("click", () => {
    const manifest = requireValidDraft();
    if (!manifest) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({draftSchema: 2, manifest: canonicalize(manifest)}));
      status.textContent = "Brouillon NON PUBLIÉ sauvegardé uniquement dans ce navigateur.";
    } catch {
      status.textContent = "Sauvegarde locale indisponible. Le brouillon reste visible dans cette page seulement.";
    }
  });

  importButton.addEventListener("click", async () => {
    const file = importFile.files?.[0];
    if (!file) {
      status.textContent = "Choisissez d’abord un fichier JSON local à importer.";
      importFile.focus();
      return;
    }
    try {
      const imported = JSON.parse(await file.text());
      applyManifest(imported);
      status.textContent = "Brouillon importé localement et validé. Il n’est ni sauvegardé ni publié tant que vous ne le demandez pas explicitement.";
    } catch (error) {
      status.textContent = `Import refusé : ${error.message}`;
    }
  });

  clearButton.addEventListener("click", () => {
    try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(LEGACY_STORAGE_KEY); } catch {}
    form.reset();
    importFile.value = "";
    lastManifest = null;
    preview.textContent = "{}";
    render();
    status.textContent = "Brouillons locaux effacés. Aucune suppression distante n’était nécessaire.";
    fields.contentId?.focus();
  });

  downloadButton.addEventListener("click", () => {
    const manifest = requireValidDraft();
    if (!manifest) return;
    const blob = new Blob([canonicalText(manifest)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const safeId = read("contentId").replace(/[^a-z0-9._-]/gi, "-").toLowerCase() || "nova-forge-draft";
    anchor.href = url;
    anchor.download = `${safeId}.nova-manifest.json`;
    anchor.rel = "noopener";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    status.textContent = "Export JSON déterministe généré localement. Le manifest reste NON PUBLIÉ et distribution=locked.";
  });

  form.addEventListener("input", () => render());
  form.addEventListener("change", () => render());

  render();
  loadSavedDraft();
  loadSchema();
})();
