(() => {
  'use strict';

  const fileInput = document.querySelector('#verify-file');
  const expectedInput = document.querySelector('#expected-sha256');
  const button = document.querySelector('[data-verify-file]');
  const result = document.querySelector('[data-verify-result]');

  let inputRevision = 0;
  let running = false;

  function invalidateResult() {
    inputRevision += 1;
    if (fileInput?.files?.[0]) fileInput.removeAttribute('aria-invalid');
    expectedInput?.removeAttribute('aria-invalid');
    renderState("Vérification à relancer", "Le fichier ou l’empreinte attendue a changé. Relancez le calcul pour vérifier cette sélection.");
  }

  const normalizeHash = (value) => value.trim().toLowerCase().replace(/^sha256:/, '').trim();
  const isSha256 = (value) => /^[0-9a-f]{64}$/.test(value);
  const toHex = (buffer) => [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

  function renderState(title, message, state = 'neutral') {
    if (!result) return;
    result.dataset.state = state;
    const heading = document.createElement('strong');
    heading.textContent = title;
    const copy = document.createElement('p');
    copy.className = 'muted';
    copy.textContent = message;
    result.replaceChildren(heading, copy);
  }

  function prefillExpectedFromFragment() {
    if (!expectedInput || !location.hash.startsWith('#sha256=')) return;
    let decoded;
    try {
      decoded = decodeURIComponent(location.hash.slice('#sha256='.length));
    } catch {
      decoded = location.hash.slice('#sha256='.length);
    }
    const candidate = normalizeHash(decoded);
    if (!isSha256(candidate)) {
      invalidateResult();
      expectedInput.value = candidate || '?';
      expectedInput.setAttribute('aria-invalid', 'true');
      renderState('Lien de vérification invalide', 'Corrigez ou effacez l’empreinte attendue avant le calcul.', 'warning');
      return;
    }
    expectedInput.value = candidate;
    expectedInput.removeAttribute('aria-invalid');
    inputRevision += 1;
    renderState('Empreinte attendue préremplie', 'Choisissez maintenant le fichier local à comparer. Le fragment d’URL n’est pas envoyé au serveur.', 'neutral');
  }

  async function verifySelectedFile() {
    if (running) return;
    const file = fileInput?.files?.[0];
    if (!file || !button) {
      fileInput?.setAttribute('aria-invalid', 'true');
      renderState('Aucun fichier sélectionné', 'Choisissez un fichier local avant de lancer le calcul.', 'warning');
      fileInput?.focus();
      return;
    }

    fileInput?.removeAttribute('aria-invalid');
    const expected = normalizeHash(expectedInput?.value ?? "");
    if (expected && !isSha256(expected)) {
      expectedInput?.setAttribute('aria-invalid', 'true');
      renderState('Empreinte attendue invalide', 'La valeur attendue doit contenir exactement 64 caractères hexadécimaux. Corrigez-la, ou effacez-la pour calculer uniquement l’empreinte du fichier. Aucun fichier n’a été lu.', 'warning');
      expectedInput?.focus();
      return;
    }
    expectedInput?.removeAttribute('aria-invalid');

    if (!globalThis.crypto?.subtle) {
      renderState('SHA-256 indisponible', 'Ce navigateur ne fournit pas l’API Web Crypto requise. Aucun résultat n’est supposé.', 'warning');
      return;
    }

    const revision = inputRevision;
    running = true;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    renderState('Calcul en cours', `Lecture locale de ${file.name}. Le fichier n’est ni exécuté ni envoyé par cet outil.`);

    try {
      const data = await file.arrayBuffer();
      if (revision !== inputRevision) return;
      const digest = toHex(await crypto.subtle.digest('SHA-256', data));
      if (revision !== inputRevision) return;

      if (!expected) {
        renderState('Empreinte calculée', `SHA-256 : ${digest}. Aucune empreinte attendue n’a été fournie, donc aucune correspondance n’est affirmée.`, 'neutral');
        return;
      }

      if (digest === expected) {
        renderState('Correspondance exacte', `Le SHA-256 calculé correspond exactement à l’empreinte attendue : ${digest}.`, 'match');
      } else {
        renderState('Empreinte différente', `Calculé : ${digest}. La valeur ne correspond pas à l’empreinte attendue. Le fichier ne doit pas être considéré comme identique sur cette seule vérification.`, 'mismatch');
      }
    } catch {
      if (revision !== inputRevision) return;
      renderState('Calcul impossible', 'Le navigateur n’a pas pu lire ou hacher ce fichier. Aucun résultat de confiance n’est produit.', 'warning');
    } finally {
      running = false;
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
  }

  fileInput?.addEventListener("change", invalidateResult);
  expectedInput?.addEventListener("input", invalidateResult);
  prefillExpectedFromFragment();
  window.addEventListener('hashchange', prefillExpectedFromFragment);
  button?.addEventListener('click', verifySelectedFile);
})();
