(() => {
  'use strict';

  const fileInput = document.querySelector('#verify-file');
  const expectedInput = document.querySelector('#expected-sha256');
  const button = document.querySelector('[data-verify-file]');
  const result = document.querySelector('[data-verify-result]');

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
      return;
    }
    const candidate = normalizeHash(decoded);
    if (!isSha256(candidate)) return;
    expectedInput.value = candidate;
    renderState('Empreinte attendue préremplie', 'Choisissez maintenant le fichier local à comparer. Le fragment d’URL n’est pas envoyé au serveur.', 'neutral');
  }

  async function verifySelectedFile() {
    const file = fileInput?.files?.[0];
    if (!file || !button) {
      renderState('Aucun fichier sélectionné', 'Choisissez un fichier local avant de lancer le calcul.', 'warning');
      return;
    }

    if (!globalThis.crypto?.subtle) {
      renderState('SHA-256 indisponible', 'Ce navigateur ne fournit pas l’API Web Crypto requise. Aucun résultat n’est supposé.', 'warning');
      return;
    }

    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    renderState('Calcul en cours', `Lecture locale de ${file.name}. Le fichier n’est ni exécuté ni envoyé par cet outil.`);

    try {
      const data = await file.arrayBuffer();
      const digest = toHex(await crypto.subtle.digest('SHA-256', data));
      const expected = normalizeHash(expectedInput?.value ?? '');

      if (!expected) {
        renderState('Empreinte calculée', `SHA-256 : ${digest}. Aucune empreinte attendue n’a été fournie, donc aucune correspondance n’est affirmée.`, 'neutral');
        return;
      }

      if (!isSha256(expected)) {
        renderState('Empreinte attendue invalide', `SHA-256 calculé : ${digest}. La valeur attendue doit contenir exactement 64 caractères hexadécimaux.`, 'warning');
        return;
      }

      if (digest === expected) {
        renderState('Correspondance exacte', `Le SHA-256 calculé correspond exactement à l’empreinte attendue : ${digest}.`, 'match');
      } else {
        renderState('Empreinte différente', `Calculé : ${digest}. La valeur ne correspond pas à l’empreinte attendue. Le fichier ne doit pas être considéré comme identique sur cette seule vérification.`, 'mismatch');
      }
    } catch {
      renderState('Calcul impossible', 'Le navigateur n’a pas pu lire ou hacher ce fichier. Aucun résultat de confiance n’est produit.', 'warning');
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
  }

  prefillExpectedFromFragment();
  window.addEventListener('hashchange', prefillExpectedFromFragment);
  button?.addEventListener('click', verifySelectedFile);
})();
