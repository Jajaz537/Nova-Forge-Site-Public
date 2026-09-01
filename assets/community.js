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
  let selectedIds = new Set();

  const canonicalize = (value) => {
    if (Array.isArray(value)) return value.map(canonicalize);
    if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
    return value;
  };
  const canonicalText = (value) => `${JSON.stringify(canonicalize(value), null, 2)}\n`;

  function downloadJson(value, filename) {
    const blob = new Blob([canonicalText(value)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function buildCollection() {
    const id = String(fields.id?.value || "").trim().toLowerCase();
    const name = String(fields.name?.value || "").trim();
    const description = String(fields.description?.value || "").trim();
    if (!ID_RE.test(id)) throw new Error("Identifiant : 2 à 128 caractères minuscules, chiffres, point, tiret ou underscore.");
    if (!name || name.length > 160) throw new Error("Nom requis, 160 caractères maximum.");
    if (description.length > 1200) throw new Error("Description : 1200 caractères maximum.");
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
    itemList.replaceChildren();
    for (const item of catalogItems) {
      const label = document.createElement("label");
      label.className = "collection-choice";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = item.id;
      input.checked = selectedIds.has(item.id);
      input.addEventListener("change", () => {
        if (input.checked) selectedIds.add(item.id); else selectedIds.delete(item.id);
        renderPreview();
      });
      const text = document.createElement("span");
      text.textContent = `${item.name} · ${item.game?.name || "Jeu inconnu"}`;
      label.append(input, text);
      itemList.append(label);
    }
  }

  function applyCollection(value) {
    if (!value || value.schemaVersion !== 1 || !ID_RE.test(String(value.id || "")) || typeof value.name !== "string") throw new Error("Collection V1 invalide.");
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
  }

  function renderSubmissionTargets() {
    const previous = String(submissionFields.target?.value || "");
    submissionFields.target.replaceChildren();
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "Choisir un contenu";
    submissionFields.target.append(empty);
    for (const item of catalogItems) {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.name} · ${item.game?.name || "Jeu inconnu"}`;
      submissionFields.target.append(option);
    }
    if (catalogItems.some((item) => item.id === previous)) submissionFields.target.value = previous;
  }

  function buildSubmission() {
    const id = String(submissionFields.id?.value || "").trim().toLowerCase();
    const kind = String(submissionFields.kind?.value || "");
    const targetId = String(submissionFields.target?.value || "");
    const heading = String(submissionFields.heading?.value || "").trim();
    const body = String(submissionFields.body?.value || "").trim();
    const parent = String(submissionFields.parent?.value || "").trim().toLowerCase();
    const ratingRaw = String(submissionFields.rating?.value || "").trim();
    const known = new Set(catalogItems.map((item) => item.id));

    if (!ID_RE.test(id)) throw new Error("Identifiant de contribution invalide.");
    if (!new Set(["discussion", "review", "comment"]).has(kind)) throw new Error("Type de contribution invalide.");
    if (!known.has(targetId)) throw new Error("La contribution doit cibler un ID du catalogue public.");
    if (!body || body.length > 8000) throw new Error("Contenu requis, 8000 caractères maximum.");

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
      if (!heading || heading.length > 180) throw new Error("Titre requis, 180 caractères maximum.");
      submission.title = heading;
    }
    if (kind === "review") {
      const rating = Number(ratingRaw);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error("La note doit être un entier de 1 à 5.");
      submission.rating = rating;
    }
    if (kind === "comment") {
      if (!ID_RE.test(parent)) throw new Error("Un commentaire exige un ID parent valide.");
      submission.parentSubmissionId = parent;
    }
    return submission;
  }

  function renderSubmissionPreview(showError = false) {
    try {
      const submission = buildSubmission();
      submissionPreview.textContent = canonicalText(submission);
      return submission;
    } catch (error) {
      submissionPreview.textContent = "Brouillon local incomplet.";
      if (showError) submissionStatus.textContent = `Validation bloquée : ${error.message}`;
      return null;
    }
  }

  function applySubmission(value) {
    if (!value || value.schemaVersion !== 1 || !ID_RE.test(String(value.id || ""))) throw new Error("Contribution locale V1 invalide.");
    if (!new Set(["discussion", "review", "comment"]).has(value.kind)) throw new Error("Type de contribution inconnu.");
    if (value.authorProfileId !== null || value.syncState !== "local-only" || value.publicationState !== "local-draft" || value.moderationState !== "not-submitted") {
      throw new Error("Un brouillon local ne peut affirmer ni auteur distant, ni synchronisation, ni publication, ni modération.");
    }
    const known = new Set(catalogItems.map((item) => item.id));
    if (!known.has(value.targetId)) throw new Error("ID catalogue ciblé inconnu.");
    if (typeof value.body !== "string" || !value.body.trim() || value.body.length > 8000) throw new Error("Contenu de contribution invalide.");
    if (value.kind === "comment") {
      if (!ID_RE.test(String(value.parentSubmissionId || "")) || "title" in value || "rating" in value) throw new Error("Contrat commentaire invalide.");
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
      catalogItems = data.items.filter((item) => item?.public === true && ID_RE.test(String(item.id || "")));
      renderItems();
      renderSubmissionTargets();
      loadSavedCollection();
      loadSavedSubmission();
      renderPreview();
      renderSubmissionPreview();
    } catch {
      catalogItems = [];
      renderItems();
      renderSubmissionTargets();
      status.textContent = "Catalogue public indisponible : collection locale bloquée en mode fail-closed.";
      submissionStatus.textContent = "Catalogue public indisponible : contribution locale bloquée en mode fail-closed.";
    }
  }

  form.addEventListener("input", renderPreview);

  saveButton.addEventListener("click", () => {
    try {
      const collection = buildCollection();
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
      const collection = buildCollection();
      downloadJson(collection, `${collection.id}.nova-collection.json`);
      status.textContent = "Export déterministe créé localement. Aucun contenu n’a été envoyé.";
    } catch (error) {
      status.textContent = `Export bloqué : ${error.message}`;
    }
  });

  importButton.addEventListener("click", async () => {
    const file = importFile.files?.[0];
    if (!file) {
      status.textContent = "Choisissez d’abord un fichier de collection JSON local.";
      importFile.focus();
      return;
    }
    try {
      const value = JSON.parse(await file.text());
      applyCollection(value);
      status.textContent = "Collection importée en mémoire seulement. Utilisez Sauvegarder pour la conserver localement.";
    } catch (error) {
      status.textContent = `Import bloqué : ${error.message}`;
    }
  });

  clearButton.addEventListener("click", () => {
    localStorage.removeItem(COLLECTION_KEY);
    fields.id.value = "ma-collection";
    fields.name.value = "Ma collection Nova";
    fields.description.value = "";
    selectedIds = new Set();
    renderItems();
    renderPreview();
    status.textContent = "Collection locale supprimée de ce navigateur.";
  });

  submissionFields.kind.addEventListener("change", () => {
    updateSubmissionFields();
    renderSubmissionPreview();
  });
  submissionForm.addEventListener("input", () => renderSubmissionPreview());

  submissionValidate.addEventListener("click", () => {
    const submission = renderSubmissionPreview(true);
    if (submission) submissionStatus.textContent = "Brouillon local valide · NON PUBLIÉ · aucune écriture réseau.";
  });

  submissionSave.addEventListener("click", () => {
    try {
      const submission = buildSubmission();
      localStorage.setItem(SUBMISSION_KEY, canonicalText(submission));
      submissionPreview.textContent = canonicalText(submission);
      submissionStatus.textContent = "Brouillon sauvegardé uniquement dans ce navigateur · NON PUBLIÉ.";
    } catch (error) {
      submissionStatus.textContent = `Sauvegarde bloquée : ${error.message}`;
    }
  });

  submissionExport.addEventListener("click", () => {
    try {
      const submission = buildSubmission();
      downloadJson(submission, `${submission.id}.nova-community-draft.json`);
      submissionStatus.textContent = "Export déterministe créé localement · NON PUBLIÉ · aucun contenu envoyé.";
    } catch (error) {
      submissionStatus.textContent = `Export bloqué : ${error.message}`;
    }
  });

  submissionImport.addEventListener("click", async () => {
    const file = submissionImportFile.files?.[0];
    if (!file) {
      submissionStatus.textContent = "Choisissez d’abord un brouillon JSON local.";
      submissionImportFile.focus();
      return;
    }
    try {
      const value = JSON.parse(await file.text());
      applySubmission(value);
      submissionStatus.textContent = "Brouillon importé en mémoire seulement · NON PUBLIÉ.";
    } catch (error) {
      submissionStatus.textContent = `Import bloqué : ${error.message}`;
    }
  });

  submissionClear.addEventListener("click", () => {
    localStorage.removeItem(SUBMISSION_KEY);
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

  updateSubmissionFields();
  loadCatalog();
})();
