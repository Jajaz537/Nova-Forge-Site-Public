(() => {
  "use strict";

  const CATALOG_URL = "./data/catalog.json";
  const COLLECTION_KEY = "nova-forge:community:collection:v1";
  const SUBMISSION_KEY = "nova-forge:community:submission:v1";
  const FAVORITES_KEY = "nova-forge:catalog:favorites:v1";
  const ID_RE = /^[a-z0-9][a-z0-9._-]{1,127}$/;

  const form = document.querySelector("#collection-form");
  const itemList = document.querySelector("#collection-items");
  const status = document.querySelector("#collection-status");
  const preview = document.querySelector("#collection-preview");
  const saveButton = document.querySelector("#collection-save");
  const favoritesButton = document.querySelector("#collection-from-favorites");
  const exportButton = document.querySelector("#collection-export");
  const importButton = document.querySelector("#collection-import");
  const importFile = document.querySelector("#collection-import-file");
  const clearButton = document.querySelector("#collection-clear");

  const submissionForm = document.querySelector("#submission-form");
  const submissionStatus = document.querySelector("#submission-status");
  const submissionPreview = document.querySelector("#submission-preview");
  const submissionValidate = document.querySelector("#submission-validate");
  const submissionSave = document.querySelector("#submission-save");
  const submissionExport = document.querySelector("#submission-export");
  const submissionImport = document.querySelector("#submission-import");
  const submissionImportFile = document.querySelector("#submission-import-file");
  const submissionClear = document.querySelector("#submission-clear");

  if (!form || !itemList || !status || !preview || !saveButton || !favoritesButton || !exportButton || !importButton || !importFile || !clearButton) return;
  if (!submissionForm || !submissionStatus || !submissionPreview || !submissionValidate || !submissionSave || !submissionExport || !submissionImport || !submissionImportFile || !submissionClear) return;

  const fields = {
    id: document.querySelector("#collection-id"),
    name: document.querySelector("#collection-name"),
    description: document.querySelector("#collection-description")
  };
  const submissionFields = {
    id: document.querySelector("#submission-id"),
    kind: document.querySelector("#submission-kind"),
    target: document.querySelector("#submission-target"),
    heading: document.querySelector("#submission-heading"),
    body: document.querySelector("#submission-body"),
    rating: document.querySelector("#submission-rating"),
    parent: document.querySelector("#submission-parent"),
    titleField: document.querySelector("#submission-title-field"),
    ratingField: document.querySelector("#submission-rating-field"),
    parentField: document.querySelector("#submission-parent-field")
  };

  let catalogItems = [];
  let catalogReady = false;
  let selectedIds = new Set();
  const revisions = new WeakMap();
  const revise = target => { const n = (revisions.get(target) || 0) + 1; revisions.set(target, n); return n; };

  const canonicalize = (value) => {
    if (Array.isArray(value)) return value.map(canonicalize);
    if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
    return value;
  };
  const canonicalText = (value) => `${JSON.stringify(canonicalize(value), null, 2)}\n`;

  function downloadJson(value, filename) {
    const blob = new Blob([canonicalText(value)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    let anchor;
    try {
      anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.rel = "noopener";
      document.body.append(anchor);
      anchor.click();
    } finally {
      anchor?.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  function buildCollection(focusInvalid = false) {
    if (focusInvalid) Object.values(fields).forEach(field => field.removeAttribute("aria-invalid"));
    if (!catalogReady) throw new Error("Catalogue indisponible ou en cours de chargement. Réessayez après son chargement.");
    const check = (valid, key, message) => {
      if (valid) return;
      if (focusInvalid) {
        fields[key].setAttribute("aria-invalid", "true");
        fields[key].focus();
      }
      throw new Error(message);
    };
    const id = String(fields.id?.value || "").trim().toLowerCase();
    const name = String(fields.name?.value || "").trim();
    const description = String(fields.description?.value || "").trim();
    check(ID_RE.test(id), "id", "Identifiant : 2 à 128 caractères minuscules, chiffres, point, tiret ou underscore.");
    check(name && name.length <= 160, "name", "Nom requis, 160 caractères maximum.");
    check(description.length <= 1200, "description", "Description : 1200 caractères maximum.");
    const known = new Set(catalogItems.map((item) => item.id));
    const itemIds = [...selectedIds].filter((idValue) => known.has(idValue)).sort();
    const collection = {schemaVersion: 1, id, name, itemIds, syncState: "local-only", visibility: "private-local", ownerProfileId: null};
    if (description) collection.description = description;
    return collection;
  }

  function renderPreview() {
    try {
      const collection = buildCollection();
      preview.textContent = canonicalText(collection);
      return collection;
    } catch {
      preview.textContent = "Brouillon local incomplet.";
      return null;
    }
  }

  function renderItems() {
    const legend = document.createElement("legend");
    legend.textContent = "Contenus du catalogue";
    itemList.replaceChildren(legend);
    if (!catalogItems.length) {
      const message = document.createElement("p");
      message.className = "muted";
      message.textContent = catalogReady
        ? "Aucun contenu disponible dans le catalogue. Vous pouvez préparer une collection vide."
        : "Le catalogue n’est pas disponible. Rechargez la page pour réessayer ; votre copie locale est conservée.";
      itemList.append(message);
    }
    for (const item of catalogItems) {
      const label = document.createElement("label");
      label.className = "collection-choice";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = item.id;
      input.checked = selectedIds.has(item.id);
      input.addEventListener("change", () => {
        if (input.checked) selectedIds.add(item.id); else selectedIds.delete(item.id);
        markEdited(status);
        renderPreview();
      });
      const text = document.createElement("span");
      text.textContent = `${item.name} · ${item.game?.name || "Jeu inconnu"}`;
      label.append(input, text);
      itemList.append(label);
    }
  }

  function applyCollection(value) {
    if (Object.keys(value || {}).some(k => !["schemaVersion","id","name","description","ownerProfileId","itemIds","visibility","syncState"].includes(k))) throw new Error("Champ de collection inconnu ; import refusé.");
    if (!catalogReady) throw new Error("Catalogue indisponible ou en cours de chargement.");
    if (!value || value.schemaVersion !== 1 || (typeof value.id !== "string" || !ID_RE.test(value.id)) || typeof value.name !== "string") throw new Error("Collection V1 invalide.");
    if (!value.name.trim() || value.name.length > 160 || (value.description !== undefined && (typeof value.description !== "string" || value.description.length > 1200))) throw new Error("Nom ou description de collection invalide ; brouillon précédent conservé.");
    if (value.syncState !== "local-only") throw new Error("Seules les collections local-only peuvent être importées sans service de synchronisation.");
    if (value.visibility !== "private-local") throw new Error("La visibilité distante n’est pas disponible sans service réel.");
    if (value.ownerProfileId !== null) throw new Error("Une identité de compte ne peut pas être affirmée dans ce mode local.");
    if (!Array.isArray(value.itemIds) || new Set(value.itemIds).size !== value.itemIds.length) throw new Error("itemIds doit être une liste unique.");
    const known = new Set(catalogItems.map((item) => item.id));
    const unknown = value.itemIds.filter((id) => !known.has(id));
    if (unknown.length) throw new Error(`IDs catalogue inconnus : ${unknown.join(", ")}`);
    fields.id.value = value.id;
    fields.name.value = value.name;
    fields.description.value = value.description || "";
    Object.values(fields).forEach(field => field.removeAttribute("aria-invalid"));
    selectedIds = new Set(value.itemIds);
    renderItems();
    renderPreview();
  }

  function loadSavedCollection() {
    try {
      const raw = localStorage.getItem(COLLECTION_KEY);
      if (!raw) return;
      applyCollection(JSON.parse(raw));
      status.textContent = "Collection locale restaurée depuis ce navigateur. Aucune synchronisation réseau n’a eu lieu.";
    } catch {
      status.textContent = "La collection locale existante est incompatible ; elle n’a pas été utilisée.";
    }
  }

  function updateSubmissionFields() {
    const kind = String(submissionFields.kind?.value || "discussion");
    const isComment = kind === "comment";
    const isReview = kind === "review";
    submissionFields.titleField.hidden = isComment;
    submissionFields.ratingField.hidden = !isReview;
    submissionFields.parentField.hidden = !isComment;
    submissionFields.heading.required = !isComment;
    submissionFields.rating.required = isReview;
    submissionFields.parent.required = isComment;
    for (const key of ["id", "kind", "target", "heading", "body", "rating", "parent"]) {
      submissionFields[key].removeAttribute("aria-invalid");
    }
  }

  function renderSubmissionTargets() {
    const previous = String(submissionFields.target?.value || "");
    submissionFields.target.replaceChildren();
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = !catalogReady ? "Catalogue indisponible" : catalogItems.length ? "Choisir un contenu" : "Aucun contenu disponible";
    submissionFields.target.append(empty);
    for (const item of catalogItems) {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.name} · ${item.game?.name || "Jeu inconnu"}`;
      submissionFields.target.append(option);
    }
    if (catalogItems.some((item) => item.id === previous)) submissionFields.target.value = previous;
  }

  function buildSubmission(focusInvalid = false) {
    const check = (valid, key, message) => {
      if (valid) return;
      if (focusInvalid) {
        submissionFields[key].setAttribute("aria-invalid", "true");
        submissionFields[key].focus();
      }
      throw new Error(message);
    };
    if (focusInvalid) {
      for (const key of ["id", "kind", "target", "heading", "body", "rating", "parent"]) {
        submissionFields[key].removeAttribute("aria-invalid");
      }
    }
    const id = String(submissionFields.id?.value || "").trim().toLowerCase();
    const kind = String(submissionFields.kind?.value || "");
    const targetId = String(submissionFields.target?.value || "");
    const heading = String(submissionFields.heading?.value || "").trim();
    const body = String(submissionFields.body?.value || "").trim();
    const parent = String(submissionFields.parent?.value || "").trim().toLowerCase();
    const ratingRaw = String(submissionFields.rating?.value || "").trim();
    const known = new Set(catalogItems.map((item) => item.id));

    check(ID_RE.test(id), "id", "Identifiant : 2 à 128 caractères, lettres minuscules, chiffres, point, tiret ou underscore.");
    check(new Set(["discussion", "review", "comment"]).has(kind), "kind", "Choisissez un type de contribution disponible.");
    check(known.has(targetId), "target", "Choisissez un contenu du catalogue public.");
    check(body && body.length <= 8000, "body", "Contenu requis, 8000 caractères maximum.");

    const submission = {
      schemaVersion: 1,
      id,
      kind,
      targetId,
      body,
      authorProfileId: null,
      syncState: "local-only",
      publicationState: "local-draft",
      moderationState: "not-submitted"
    };

    if (kind === "discussion" || kind === "review") {
      check(heading && heading.length <= 180, "heading", "Titre requis, 180 caractères maximum.");
      submission.title = heading;
    }
    if (kind === "review") {
      const rating = Number(ratingRaw);
      check(Number.isInteger(rating) && rating >= 1 && rating <= 5, "rating", "La note doit être un entier de 1 à 5.");
      submission.rating = rating;
    }
    if (kind === "comment") {
      check(ID_RE.test(parent), "parent", "Identifiant de la contribution parente : 2 à 128 caractères, lettres minuscules, chiffres, point, tiret ou underscore.");
      submission.parentSubmissionId = parent;
    }
    return submission;
  }

  function renderSubmissionPreview(showError = false) {
    try {
      const submission = buildSubmission(showError);
      submissionPreview.textContent = canonicalText(submission);
      return submission;
    } catch (error) {
      submissionPreview.textContent = "Brouillon local incomplet.";
      if (showError) submissionStatus.textContent = `Validation bloquée : ${error.message}`;
      return null;
    }
  }

  function applySubmission(value) {
    if (Object.keys(value || {}).some(k => !["schemaVersion","id","kind","targetId","body","title","rating","parentSubmissionId","authorProfileId","syncState","publicationState","moderationState"].includes(k))) throw new Error("Champ de contribution inconnu ; import refusé.");
    if (!value || value.schemaVersion !== 1 || (typeof value.id !== "string" || !ID_RE.test(value.id))) throw new Error("Contribution locale V1 invalide.");
    if (!new Set(["discussion", "review", "comment"]).has(value.kind)) throw new Error("Type de contribution inconnu.");
    if (value.authorProfileId !== null || value.syncState !== "local-only" || value.publicationState !== "local-draft" || value.moderationState !== "not-submitted") {
      throw new Error("Un brouillon local ne peut affirmer ni auteur distant, ni synchronisation, ni publication, ni modération.");
    }
    const known = new Set(catalogItems.map((item) => item.id));
    if (!known.has(value.targetId)) throw new Error("ID catalogue ciblé inconnu.");
    if (typeof value.body !== "string" || !value.body.trim() || value.body.length > 8000) throw new Error("Contenu de contribution invalide.");
    if (value.kind === "comment") {
      if ((typeof value.parentSubmissionId !== "string" || !ID_RE.test(value.parentSubmissionId)) || "title" in value || "rating" in value) throw new Error("Contrat commentaire invalide.");
    } else {
      if (typeof value.title !== "string" || !value.title.trim() || value.title.length > 180 || "parentSubmissionId" in value) throw new Error("Contrat titre/parent invalide.");
      if (value.kind === "review" && (!Number.isInteger(value.rating) || value.rating < 1 || value.rating > 5)) throw new Error("Note de review invalide.");
      if (value.kind === "discussion" && "rating" in value) throw new Error("Une discussion ne porte pas de note.");
    }
    submissionFields.id.value = value.id;
    submissionFields.kind.value = value.kind;
    submissionFields.target.value = value.targetId;
    submissionFields.heading.value = value.title || "";
    submissionFields.body.value = value.body;
    submissionFields.rating.value = value.rating || "";
    submissionFields.parent.value = value.parentSubmissionId || "";
    updateSubmissionFields();
    submissionPreview.textContent = canonicalText(value);
  }

  function loadSavedSubmission() {
    try {
      const raw = localStorage.getItem(SUBMISSION_KEY);
      if (!raw) return;
      applySubmission(JSON.parse(raw));
      submissionStatus.textContent = "Brouillon local restauré. Il reste NON PUBLIÉ et non synchronisé.";
    } catch {
      submissionStatus.textContent = "Le brouillon local existant est incompatible ; il n’a pas été utilisé.";
    }
  }

  async function loadCatalog() {
    try {
      const response = await fetch(CATALOG_URL, {headers: {Accept: "application/json"}});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data?.schemaVersion !== 1 || data?.dataClass !== "demonstration" || !Array.isArray(data.items)) throw new Error("catalog-contract-invalid");
      const publicItems = data.items.filter((item) => item?.public === true);
      const ids = new Set();
      for (const item of publicItems) {
        if (typeof item.id !== "string" || !ID_RE.test(item.id) || ids.has(item.id) ||
            typeof item.name !== "string" || !item.name.trim() ||
            typeof item.game?.name !== "string" || !item.game.name.trim()) {
          throw new Error("catalog-item-invalid");
        }
        ids.add(item.id);
      }
      catalogItems = publicItems;
      catalogReady = true;
      renderItems();
      renderSubmissionTargets();
      if (!revisions.has(status)) loadSavedCollection();
      if (!revisions.has(submissionStatus)) loadSavedSubmission();
      renderPreview();
      renderSubmissionPreview();
    } catch {
      catalogReady = false;
      catalogItems = [];
      renderItems();
      renderSubmissionTargets();
      status.textContent = "Catalogue indisponible. Rechargez la page pour réessayer. La copie locale de votre collection est conservée.";
      submissionStatus.textContent = "Catalogue indisponible : choisissez un contenu après son chargement pour valider une contribution. Votre copie locale est conservée.";
    }
  }

  function markEdited(target) {
    revise(target);
    const message = target === status ? "Modifications non sauvegardées · sauvegardez pour les conserver · NON SYNCHRONISÉ." : "Modifications non sauvegardées · validez ou sauvegardez à nouveau · NON PUBLIÉ.";
    if (target.textContent !== message) target.textContent = message;
  }

  form.addEventListener("input", (event) => {
    if (event.target.type !== "file") markEdited(status);
    event.target.removeAttribute("aria-invalid");
    renderPreview();
  });

  saveButton.addEventListener("click", () => {
    try {
      const collection = buildCollection(true);
      localStorage.setItem(COLLECTION_KEY, canonicalText(collection));
      status.textContent = "Collection sauvegardée uniquement dans ce navigateur · NON SYNCHRONISÉE.";
      preview.textContent = canonicalText(collection);
    } catch (error) {
      status.textContent = `Sauvegarde bloquée : ${error.message}`;
    }
  });

  favoritesButton.addEventListener("click", () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      const known = new Set(catalogItems.map((item) => item.id));
      revise(status);
      selectedIds = new Set(Array.isArray(parsed) ? parsed.filter((id) => known.has(id)) : []);
      renderItems();
      renderPreview();
      status.textContent = "Favoris locaux copiés dans le brouillon de collection. Rien n’est sauvegardé avant action explicite.";
    } catch {
      status.textContent = "Favoris locaux illisibles ; aucun élément importé.";
    }
  });

  exportButton.addEventListener("click", () => {
    try {
      const collection = buildCollection(true);
      downloadJson(collection, `${collection.id}.nova-collection.json`);
      status.textContent = "Export préparé. Vérifiez les téléchargements de votre navigateur. Aucun contenu n’a été envoyé.";
    } catch (error) {
      status.textContent = `Export bloqué : ${error.message}`;
    }
  });

  importFile.addEventListener("change", () => revise(status));
  importButton.addEventListener("click", async () => {
    const file = importFile.files?.[0];
    if (!file) {
      status.textContent = "Choisissez d’abord un fichier de collection JSON local.";
      importFile.focus();
      return;
    }
    const revision = revise(status);
    try {
      const value = JSON.parse(await file.text());
      if (revision !== revisions.get(status)) return;
      applyCollection(value);
      status.textContent = "Collection importée en mémoire seulement. Utilisez Sauvegarder pour la conserver localement.";
    } catch (error) {
      if (revision !== revisions.get(status)) return;
      status.textContent = `Import bloqué : ${error.message}`;
    }
  });

  clearButton.addEventListener("click", () => {
    try { localStorage.removeItem(COLLECTION_KEY); } catch {
      status.textContent = "Suppression locale impossible. La collection affichée est conservée et n’est pas déclarée effacée.";
      return;
    }
    revise(status);
    fields.id.value = "ma-collection";
    fields.name.value = "Ma collection MODARYX";
    fields.description.value = "";
    Object.values(fields).forEach(field => field.removeAttribute("aria-invalid"));
    selectedIds = new Set();
    renderItems();
    renderPreview();
    status.textContent = "Collection locale supprimée de ce navigateur.";
  });

  submissionFields.kind.addEventListener("change", () => {
    markEdited(submissionStatus);
    updateSubmissionFields();
    renderSubmissionPreview();
  });
  submissionForm.addEventListener("input", (event) => {
    if (event.target.type !== "file") markEdited(submissionStatus);
    event.target.removeAttribute("aria-invalid");
    renderSubmissionPreview();
  });

  submissionValidate.addEventListener("click", () => {
    const submission = renderSubmissionPreview(true);
    if (submission) submissionStatus.textContent = "Brouillon local valide · NON PUBLIÉ · aucune écriture réseau.";
  });

  submissionSave.addEventListener("click", () => {
    try {
      const submission = buildSubmission(true);
      localStorage.setItem(SUBMISSION_KEY, canonicalText(submission));
      submissionPreview.textContent = canonicalText(submission);
      submissionStatus.textContent = "Brouillon sauvegardé uniquement dans ce navigateur · NON PUBLIÉ.";
    } catch (error) {
      submissionStatus.textContent = `Sauvegarde bloquée : ${error.message}`;
    }
  });

  submissionExport.addEventListener("click", () => {
    try {
      const submission = buildSubmission(true);
      downloadJson(submission, `${submission.id}.nova-community-draft.json`);
      submissionStatus.textContent = "Export préparé. Vérifiez les téléchargements de votre navigateur · NON PUBLIÉ · aucun contenu envoyé.";
    } catch (error) {
      submissionStatus.textContent = `Export bloqué : ${error.message}`;
    }
  });

  submissionImportFile.addEventListener("change", () => revise(submissionStatus));
  submissionImport.addEventListener("click", async () => {
    const file = submissionImportFile.files?.[0];
    if (!file) {
      submissionStatus.textContent = "Choisissez d’abord un brouillon JSON local.";
      submissionImportFile.focus();
      return;
    }
    const revision = revise(submissionStatus);
    try {
      const value = JSON.parse(await file.text());
      if (revision !== revisions.get(submissionStatus)) return;
      applySubmission(value);
      submissionStatus.textContent = "Brouillon importé en mémoire seulement · NON PUBLIÉ.";
    } catch (error) {
      if (revision !== revisions.get(submissionStatus)) return;
      submissionStatus.textContent = `Import bloqué : ${error.message}`;
    }
  });

  submissionClear.addEventListener("click", () => {
    try { localStorage.removeItem(SUBMISSION_KEY); } catch {
      submissionStatus.textContent = "Suppression locale impossible. Le brouillon affiché est conservé et n’est pas déclaré effacé.";
      return;
    }
    revise(submissionStatus);
    submissionFields.id.value = "ma-contribution";
    submissionFields.kind.value = "discussion";
    submissionFields.target.value = "";
    submissionFields.heading.value = "";
    submissionFields.body.value = "";
    submissionFields.rating.value = "";
    submissionFields.parent.value = "";
    updateSubmissionFields();
    renderSubmissionPreview();
    submissionStatus.textContent = "Brouillon local supprimé de ce navigateur.";
  });

  const remotePanel = document.querySelector("#community-remote");
  const remoteStatusNode = document.querySelector("#community-remote-status");
  const remoteCopy = document.querySelector("#community-remote-copy");
  const remoteResult = document.querySelector("#community-remote-result");
  const remoteLogin = document.querySelector("#community-login");
  const remoteSubmit = document.querySelector("#community-submit-remote");
  const remoteTurnstile = document.querySelector("#community-turnstile");

  let remoteBackend = null;
  let remoteTurnstileToken = "";
  let remoteTurnstileWidget = null;
  let remoteTurnstileScript = null;

  function setRemoteState(state, label, copy) {
    if (remotePanel) remotePanel.dataset.remoteState = state;
    if (remoteStatusNode) remoteStatusNode.textContent = label;
    if (remoteCopy) remoteCopy.textContent = copy;
  }

  function setRemoteLoginEnabled(enabled) {
    if (!remoteLogin) return;
    remoteLogin.setAttribute("aria-disabled", enabled ? "false" : "true");
    if (enabled) {
      const returnTo = `${window.location.pathname || "/community"}#contributions`;
      remoteLogin.href = `/api/v1/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
    } else {
      remoteLogin.href = "./community.html#contributions";
    }
  }

  async function remoteJson(url, options = {}) {
    const response = await fetch(url, {
      cache: "no-store",
      credentials: "same-origin",
      headers: {accept: "application/json", ...(options.headers || {})},
      ...options
    });
    const type = response.headers.get("content-type") || "";
    if (!type.includes("application/json")) throw new Error("response-not-json");
    return {response, data: await response.json()};
  }

  function loadRemoteTurnstile() {
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (remoteTurnstileScript) return remoteTurnstileScript;
    remoteTurnstileScript = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.modaryxCommunityTurnstile = "true";
      script.addEventListener("load", () => window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile-api-missing")), {once: true});
      script.addEventListener("error", () => reject(new Error("turnstile-script-failed")), {once: true});
      document.head.append(script);
    });
    return remoteTurnstileScript;
  }

  async function prepareRemoteTurnstile() {
    const siteKey = remoteBackend?.turnstile?.publicSiteKey;
    const ready = remoteBackend?.turnstile?.secretConfigured &&
      remoteBackend?.turnstile?.siteKeyConfigured &&
      typeof siteKey === "string" &&
      siteKey.length > 0;
    if (!ready || !remoteTurnstile || !remoteSubmit) {
      if (remoteResult) remoteResult.textContent = "Envoi distant verrouillé : vérification anti-abus non provisionnée.";
      return false;
    }

    try {
      const api = await loadRemoteTurnstile();
      remoteTurnstile.hidden = false;
      remoteTurnstile.replaceChildren();
      remoteTurnstileWidget = api.render(remoteTurnstile, {
        sitekey: siteKey,
        action: "community-write",
        theme: "dark",
        callback(token) {
          remoteTurnstileToken = token;
          remoteSubmit.disabled = false;
          if (remoteResult) remoteResult.textContent = "Vérification prête. Le brouillon peut être envoyé pour modération.";
        },
        "expired-callback"() {
          remoteTurnstileToken = "";
          remoteSubmit.disabled = true;
          if (remoteResult) remoteResult.textContent = "Vérification expirée. Revalidez avant l’envoi.";
        },
        "error-callback"() {
          remoteTurnstileToken = "";
          remoteSubmit.disabled = true;
          if (remoteResult) remoteResult.textContent = "Vérification anti-abus temporairement indisponible.";
        }
      });
      return true;
    } catch {
      remoteSubmit.disabled = true;
      if (remoteResult) remoteResult.textContent = "Envoi distant indisponible : le contrôle anti-abus n’a pas pu être chargé.";
      return false;
    }
  }

  async function initRemoteCommunity() {
    if (!remotePanel || !remoteStatusNode || !remoteSubmit || !remoteLogin) return;
    remoteSubmit.disabled = true;
    setRemoteLoginEnabled(false);

    try {
      const {response, data} = await remoteJson("/api/v1/status");
      if (!response.ok || data?.service !== "modaryx-backend") throw new Error("backend-unavailable");
      remoteBackend = data;
    } catch {
      setRemoteState("unavailable", "Service non provisionné", "Le backend distant n’est pas disponible sur cette origine. Vos brouillons restent strictement locaux.");
      if (remoteResult) remoteResult.textContent = "Aucun contenu n’est envoyé en ligne.";
      return;
    }

    if (!remoteBackend?.bindings?.d1 || !remoteBackend?.auth0?.loginConfigured) {
      setRemoteState("unavailable", "Provisionnement requis", "La voie distante est prête en code mais le backend de compte n’est pas entièrement provisionné.");
      return;
    }

    setRemoteLoginEnabled(true);
    setRemoteState("ready", "Déconnecté", "Connectez-vous pour pouvoir envoyer un brouillon validé vers la file de modération.");

    let session;
    try {
      const result = await remoteJson("/api/v1/auth/session");
      if (!result.response.ok) throw new Error(result.data?.error || "session-load-failed");
      session = result.data;
    } catch {
      setRemoteState("error", "Session indisponible", "Le backend répond mais la session n’a pas pu être vérifiée. Aucun envoi n’est autorisé.");
      return;
    }

    if (!session?.authenticated) return;

    setRemoteState("authenticated", "Session confirmée", "Votre session est active. La contribution restera en attente de modération après l’envoi.");
    remoteLogin.hidden = true;
    await prepareRemoteTurnstile();
  }

  remoteLogin?.addEventListener("click", (event) => {
    if (remoteLogin.getAttribute("aria-disabled") === "true") event.preventDefault();
  });

  remoteSubmit?.addEventListener("click", async () => {
    if (remoteSubmit.disabled || !remoteTurnstileToken) return;
    let draft;
    try {
      draft = buildSubmission(true);
    } catch (error) {
      if (remoteResult) remoteResult.textContent = `Envoi bloqué : ${error.message}`;
      return;
    }

    const payload = {
      kind: draft.kind,
      targetId: draft.targetId,
      body: draft.body,
      turnstileToken: remoteTurnstileToken
    };
    if (draft.title) payload.title = draft.title;
    if (draft.rating !== undefined) payload.rating = draft.rating;
    if (draft.parentSubmissionId) payload.parentSubmissionId = draft.parentSubmissionId;

    remoteSubmit.disabled = true;
    if (remoteResult) remoteResult.textContent = "Envoi sécurisé vers la file de modération…";

    try {
      const {response, data} = await remoteJson("/api/v1/community/submissions", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(data?.error || "remote-submit-failed");
      if (data?.moderationState !== "pending" || data?.publicationState !== "received" || data?.distributable !== false) {
        throw new Error("remote-state-invalid");
      }
      if (remoteResult) remoteResult.textContent = `Contribution reçue pour modération · NON PUBLIÉE · référence ${data.id || "reçue"}.`;
      remoteTurnstileToken = "";
      if (window.turnstile && remoteTurnstileWidget !== null) window.turnstile.reset(remoteTurnstileWidget);
    } catch {
      if (remoteResult) remoteResult.textContent = "Envoi non confirmé. Le brouillon local est conservé et rien n’est déclaré publié.";
      if (window.turnstile && remoteTurnstileWidget !== null) window.turnstile.reset(remoteTurnstileWidget);
      remoteTurnstileToken = "";
    }
  });

  updateSubmissionFields();
  initRemoteCommunity();
  loadCatalog();
})();
