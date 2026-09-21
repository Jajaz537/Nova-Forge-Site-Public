(() => {
  "use strict";

  const set = (node, text) => {
    if (node) node.textContent = text;
  };

  async function detectWebAuthn() {
    const status = document.querySelector("#passkey-status");
    const apiNode = document.querySelector("#webauthn-api");
    const platformNode = document.querySelector("#platform-authenticator");
    const conditionalNode = document.querySelector("#conditional-mediation");
    if (!status || !apiNode || !platformNode || !conditionalNode) return;

    const supported = typeof window.PublicKeyCredential === "function";
    set(apiNode, supported ? "Disponible dans ce navigateur." : "Indisponible dans ce navigateur.");
    if (!supported) {
      set(platformNode, "Non testable sans WebAuthn.");
      set(conditionalNode, "Non testable sans WebAuthn.");
      status.textContent = "WebAuthn indisponible";
      return;
    }

    let platform = "Inconnu";
    try {
      if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function") {
        platform = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable() ? "Disponible" : "Non détecté";
      }
    } catch {
      platform = "Inconnu";
    }
    set(platformNode, `${platform}. Ce résultat ne prouve l’existence d’aucune passkey.`);

    let conditional = "Inconnu";
    try {
      if (typeof PublicKeyCredential.isConditionalMediationAvailable === "function") {
        conditional = await PublicKeyCredential.isConditionalMediationAvailable() ? "Disponible" : "Non disponible";
      }
    } catch {
      conditional = "Inconnu";
    }
    set(conditionalNode, `${conditional}. Aucun flux de connexion n’est lancé par cette détection.`);
    status.textContent = platform === "Inconnu" || conditional === "Inconnu"
      ? "Détection partielle — résultat inconnu"
      : "Détection locale terminée";
  }

  const consoleNode = document.querySelector("#account-console");
  const accountStatus = document.querySelector("#account-status");
  const accountStatusCopy = document.querySelector("#account-status-copy");
  const sessionTitle = document.querySelector("#account-session-title");
  const sessionSummary = document.querySelector("#account-session-summary");
  const login = document.querySelector("#account-login");
  const logout = document.querySelector("#account-logout");
  const form = document.querySelector("#profile-editor");
  const fields = document.querySelector("#profile-editor-fields");
  const handleInput = document.querySelector("#profile-handle");
  const displayNameInput = document.querySelector("#profile-display-name");
  const bioInput = document.querySelector("#profile-bio");
  const visibilityInput = document.querySelector("#profile-visibility");
  const creatorInput = document.querySelector("#profile-creator");
  const formStatus = document.querySelector("#profile-form-status");
  const turnstileSlot = document.querySelector("#turnstile-slot");
  const publicProfileConsole = document.querySelector("#public-profile");
  const publicProfileState = document.querySelector("#public-profile-state");
  const publicProfileSearch = document.querySelector("#public-profile-search");
  const publicProfileHandleInput = document.querySelector("#public-profile-handle");
  const publicProfileSearchStatus = document.querySelector("#public-profile-search-status");
  const publicProfileCard = document.querySelector("#public-profile-card");
  const publicProfileHandleLabel = document.querySelector("#public-profile-handle-label");
  const publicProfileDisplayName = document.querySelector("#public-profile-display-name");
  const publicProfileCreator = document.querySelector("#public-profile-creator");
  const publicProfileBio = document.querySelector("#public-profile-bio");
  const publicProfileLinks = document.querySelector("#public-profile-links");
  const authorityCard = document.querySelector("#account-authority-card");
  const authorityRole = document.querySelector("#account-authority-role");
  const authoritySummary = document.querySelector("#account-authority-summary");
  const authorityAdmin = document.querySelector("#account-cap-admin");
  const authorityModeration = document.querySelector("#account-cap-moderation");
  const authorityAppeals = document.querySelector("#account-cap-appeals");

  let backendStatus = null;
  let turnstileToken = "";
  let turnstileWidgetId = null;
  let turnstileScriptPromise = null;

  function setAccountState(state, label, copy) {
    if (consoleNode) consoleNode.dataset.accountState = state;
    set(accountStatus, label);
    set(accountStatusCopy, copy);
  }

  function renderAuthority(authority) {
    if (!authorityCard) return;
    authorityCard.hidden = false;

    const role = authority?.role || "member";
    const labels = {
      founder: "Fondateur",
      administrator: "Administrateur",
      moderator: "Modérateur",
      "appeals-reviewer": "Reviewer recours",
      member: "Membre"
    };
    const caps = authority?.capabilities || {};

    set(authorityRole, labels[role] || "Membre");
    set(
      authoritySummary,
      role === "founder"
        ? "Autorité maximale MODARYX accordée côté serveur. Les secrets d’infrastructure restent séparés."
        : role === "administrator"
          ? "Administration courante MODARYX accordée côté serveur."
          : "Les capacités affichées reflètent uniquement les permissions confirmées par la session."
    );
    set(authorityAdmin, caps.administration ? "Accès accordé." : "Non accordé.");
    set(authorityModeration, caps.moderation ? "Publication, retrait et revue accordés." : "Non accordée.");
    set(authorityAppeals, caps.appealsReview ? "Revue des recours accordée." : "Non accordée.");
  }

  function setLoginEnabled(enabled) {
    if (!login) return;
    login.setAttribute("aria-disabled", enabled ? "false" : "true");
    if (enabled) {
      const returnTo = `${window.location.pathname || "/profiles"}#account-console`;
      login.href = `/api/v1/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
    } else {
      login.href = "./profiles.html#account-console";
    }
  }

  function lockEditor(message) {
    if (fields) fields.disabled = true;
    set(formStatus, message);
    if (turnstileSlot) turnstileSlot.hidden = true;
  }

  function jsonResponse(response) {
    const type = response.headers.get("content-type") || "";
    if (!type.includes("application/json")) throw new Error("response-not-json");
    return response.json();
  }

  async function fetchJson(url, options = {}) {
    const response = await fetch(url, {
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        accept: "application/json",
        ...(options.headers || {})
      },
      ...options
    });
    const data = await jsonResponse(response);
    return {response, data};
  }

  function loadTurnstileScript() {
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (turnstileScriptPromise) return turnstileScriptPromise;

    turnstileScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-modaryx-turnstile="true"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(window.turnstile), {once: true});
        existing.addEventListener("error", () => reject(new Error("turnstile-script-failed")), {once: true});
        return;
      }
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.modaryxTurnstile = "true";
      script.addEventListener("load", () => {
        if (window.turnstile) resolve(window.turnstile);
        else reject(new Error("turnstile-api-missing"));
      }, {once: true});
      script.addEventListener("error", () => reject(new Error("turnstile-script-failed")), {once: true});
      document.head.append(script);
    });
    return turnstileScriptPromise;
  }

  async function prepareTurnstile() {
    const siteKey = backendStatus?.turnstile?.publicSiteKey;
    const ready = backendStatus?.turnstile?.secretConfigured &&
      backendStatus?.turnstile?.siteKeyConfigured &&
      typeof siteKey === "string" &&
      siteKey.length > 0;

    if (!ready || !turnstileSlot) {
      lockEditor("Édition distante en préparation : vérification anti-abus non provisionnée.");
      return false;
    }

    try {
      const api = await loadTurnstileScript();
      turnstileSlot.hidden = false;
      turnstileSlot.replaceChildren();
      turnstileWidgetId = api.render(turnstileSlot, {
        sitekey: siteKey,
        action: "profile-write",
        theme: "dark",
        callback(token) {
          turnstileToken = token;
          set(formStatus, "Vérification anti-abus prête. Vous pouvez enregistrer.");
        },
        "expired-callback"() {
          turnstileToken = "";
          set(formStatus, "La vérification a expiré. Revalidez avant d’enregistrer.");
        },
        "error-callback"() {
          turnstileToken = "";
          set(formStatus, "La vérification anti-abus est temporairement indisponible.");
        }
      });
      if (fields) fields.disabled = false;
      set(formStatus, "Complétez votre profil puis validez la vérification anti-abus.");
      return true;
    } catch {
      lockEditor("Édition distante indisponible : le contrôle anti-abus n’a pas pu être chargé.");
      return false;
    }
  }

  async function loadProfile() {
    const {response, data} = await fetchJson("/api/v1/profile");
    if (response.status === 404) {
      set(formStatus, "Aucun profil public créé. Complétez les champs pour commencer.");
      return null;
    }
    if (!response.ok) throw new Error(data?.error || "profile-load-failed");

    if (handleInput) handleInput.value = data.handle || "";
    if (displayNameInput) displayNameInput.value = data.displayName || "";
    if (bioInput) bioInput.value = data.bio || "";
    if (visibilityInput) visibilityInput.value = data.visibility || "private";
    if (creatorInput) creatorInput.checked = Boolean(data.creator?.isCreator);
    return data;
  }

  async function initAccount() {
    if (!consoleNode || !accountStatus || !accountStatusCopy) return;

    setLoginEnabled(false);
    if (logout) logout.hidden = true;
    lockEditor("Connectez-vous pour éditer votre profil.");

    try {
      const {response, data} = await fetchJson("/api/v1/status");
      if (!response.ok || data?.service !== "modaryx-backend") throw new Error("backend-status-unavailable");
      backendStatus = data;
    } catch {
      setAccountState(
        "unavailable",
        "Service non provisionné",
        "Le backend de compte n’est pas disponible sur cette origine. La page reste en lecture seule et ne simule aucune session."
      );
      set(sessionTitle, "Compte non actif sur cette origine");
      set(sessionSummary, "Les contrats et l’interface sont présents, mais aucun service de connexion réel n’est déclaré ici.");
      return;
    }

    if (!backendStatus?.bindings?.d1 || !backendStatus?.auth0?.loginConfigured) {
      setAccountState(
        "unavailable",
        "Provisionnement requis",
        "La console est prête, mais D1 et le tenant d’identité ne sont pas encore entièrement configurés sur cette origine."
      );
      set(sessionTitle, "Connexion pas encore ouverte");
      set(sessionSummary, "MODARYX attend un backend DEV ou production réellement provisionné avant d’activer la connexion.");
      return;
    }

    setLoginEnabled(true);
    setAccountState("ready", "Connexion disponible", "Le service de compte répond. Vérification de votre session…");

    let session;
    try {
      const result = await fetchJson("/api/v1/auth/session");
      if (!result.response.ok) throw new Error(result.data?.error || "session-load-failed");
      session = result.data;
    } catch {
      setAccountState("error", "Session indisponible", "Le backend répond mais l’état de session n’a pas pu être vérifié.");
      set(sessionTitle, "Impossible de confirmer la session");
      set(sessionSummary, "Aucun état connecté n’est affiché tant que la vérification same-origin n’aboutit pas.");
      return;
    }

    if (!session?.authenticated) {
      if (authorityCard) authorityCard.hidden = true;
      setAccountState("ready", "Déconnecté", "Le service est disponible et aucune session active n’est associée à ce navigateur.");
      set(sessionTitle, "Prêt à vous connecter");
      set(sessionSummary, "La connexion s’ouvre via Universal Login puis revient vers MODARYX avec une session HttpOnly.");
      return;
    }

    setAccountState("authenticated", "Connecté", "Votre session MODARYX a été confirmée par le backend same-origin.");
    setLoginEnabled(false);
    if (login) login.hidden = true;
    if (logout) logout.hidden = false;
    renderAuthority(session.authority);

    const profile = session.profile;
    set(sessionTitle, profile?.displayName ? `Bonjour, ${profile.displayName}` : "Session active");
    set(
      sessionSummary,
      profile?.handle
        ? `Profil @${profile.handle} · visibilité ${profile.visibility || "privée"}.`
        : "Votre session est active. Aucun profil public n’est encore associé à ce compte."
    );

    try {
      await loadProfile();
    } catch {
      set(formStatus, "Session active, mais le profil n’a pas pu être chargé.");
    }
    await prepareTurnstile();
  }

  function normalizePublicHandle(value) {
    const normalized = String(value || "").trim().toLowerCase().replace(/^@/, "");
    return /^[a-z0-9][a-z0-9._-]{2,31}$/.test(normalized) ? normalized : "";
  }

  function setPublicProfileState(state, label, message) {
    if (publicProfileConsole) publicProfileConsole.dataset.publicProfileState = state;
    set(publicProfileState, label);
    set(publicProfileSearchStatus, message);
  }

  function renderPublicProfile(profile) {
    if (!publicProfileCard || !profile || profile.visibility !== "public") return false;

    set(publicProfileHandleLabel, `@${profile.handle || ""}`);
    set(publicProfileDisplayName, profile.displayName || profile.handle || "Profil public");
    set(publicProfileBio, profile.bio || "Ce profil n’a pas encore ajouté de présentation.");

    if (publicProfileCreator) {
      const isCreator = Boolean(profile.creator?.isCreator);
      publicProfileCreator.hidden = !isCreator;
      publicProfileCreator.textContent = profile.creator?.displayLabel || "Créateur";
    }

    if (publicProfileLinks) {
      publicProfileLinks.replaceChildren();
      for (const item of Array.isArray(profile.links) ? profile.links : []) {
        if (!item || typeof item.label !== "string" || typeof item.url !== "string") continue;
        let url;
        try {
          url = new URL(item.url);
        } catch {
          continue;
        }
        if (url.protocol !== "https:") continue;
        const link = document.createElement("a");
        link.className = "button public-profile-link";
        link.href = url.href;
        link.rel = "noopener noreferrer";
        link.textContent = item.label;
        publicProfileLinks.append(link);
      }
    }

    publicProfileCard.hidden = false;
    return true;
  }

  async function loadPublicProfile(rawHandle, {updateUrl = true} = {}) {
    const handle = normalizePublicHandle(rawHandle);
    if (!handle) {
      if (publicProfileCard) publicProfileCard.hidden = true;
      setPublicProfileState("invalid", "Pseudonyme invalide", "Utilisez 3 à 32 caractères : lettres, chiffres, point, tiret ou underscore.");
      return;
    }

    if (publicProfileHandleInput) publicProfileHandleInput.value = handle;
    if (publicProfileCard) publicProfileCard.hidden = true;
    setPublicProfileState("loading", "Recherche…", `Chargement du profil public @${handle}…`);

    try {
      const {response, data} = await fetchJson(`/api/v1/profiles/${encodeURIComponent(handle)}`);
      if (response.status === 404) {
        setPublicProfileState("empty", "Introuvable", "Aucun profil public n’est disponible pour ce pseudonyme.");
        return;
      }
      if (!response.ok) throw new Error(data?.error || "public-profile-load-failed");
      if (!renderPublicProfile(data)) throw new Error("public-profile-visibility-invalid");

      setPublicProfileState("found", "Profil public", `Profil @${handle} chargé depuis le backend same-origin.`);
      if (updateUrl && window.history?.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.set("profile", handle);
        url.hash = "public-profile";
        window.history.replaceState(null, "", url);
      }
    } catch {
      setPublicProfileState("error", "Indisponible", "Le profil public n’a pas pu être chargé. Aucun contenu privé n’est affiché en remplacement.");
    }
  }

  function initPublicProfileLookup() {
    if (!publicProfileSearch || !publicProfileHandleInput) return;

    publicProfileSearch.addEventListener("submit", (event) => {
      event.preventDefault();
      loadPublicProfile(publicProfileHandleInput.value);
    });

    const requested = new URLSearchParams(window.location.search).get("profile");
    if (requested) loadPublicProfile(requested, {updateUrl: false});
  }

  if (login) {
    login.addEventListener("click", (event) => {
      if (login.getAttribute("aria-disabled") === "true") event.preventDefault();
    });
  }

  if (logout) {
    logout.addEventListener("click", async () => {
      logout.disabled = true;
      try {
        const {response} = await fetchJson("/api/v1/auth/logout", {method: "POST"});
        if (!response.ok) throw new Error("logout-failed");
        window.location.assign(`${window.location.pathname || "/profiles"}#account-console`);
      } catch {
        setAccountState("error", "Déconnexion incomplète", "La session n’a pas pu être révoquée. Réessayez.");
        logout.disabled = false;
      }
    });
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!fields || fields.disabled) return;
      if (!turnstileToken) {
        set(formStatus, "Validez d’abord la vérification anti-abus.");
        return;
      }

      const body = {
        handle: handleInput?.value || "",
        displayName: displayNameInput?.value || "",
        bio: bioInput?.value || "",
        visibility: visibilityInput?.value || "private",
        creator: {isCreator: Boolean(creatorInput?.checked)},
        turnstileToken
      };

      const saveButton = document.querySelector("#profile-save");
      if (saveButton) saveButton.disabled = true;
      set(formStatus, "Enregistrement sécurisé du profil…");

      try {
        const {response, data} = await fetchJson("/api/v1/profile", {
          method: "PUT",
          headers: {"content-type": "application/json"},
          body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error(data?.error || "profile-save-failed");
        set(formStatus, "Profil enregistré.");
        set(sessionTitle, data.displayName ? `Bonjour, ${data.displayName}` : "Session active");
        set(sessionSummary, `Profil @${data.handle} · visibilité ${data.visibility}.`);
        turnstileToken = "";
        if (window.turnstile && turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
      } catch {
        set(formStatus, "Le profil n’a pas été enregistré. Vérifiez les champs puis réessayez.");
      } finally {
        if (saveButton) saveButton.disabled = false;
      }
    });
  }

  detectWebAuthn();
  initPublicProfileLookup();
  initAccount();
})();
