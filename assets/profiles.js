(() => {
  "use strict";

  const status = document.querySelector("#passkey-status");
  const apiNode = document.querySelector("#webauthn-api");
  const platformNode = document.querySelector("#platform-authenticator");
  const conditionalNode = document.querySelector("#conditional-mediation");
  if (!status || !apiNode || !platformNode || !conditionalNode) return;

  const set = (node, text) => { node.textContent = text; };

  async function detect() {
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
    set(conditionalNode, `${conditional}. Aucun flux de connexion n’est lancé.`);
    status.textContent = "Capacités locales vérifiées";
  }

  detect();
})();
