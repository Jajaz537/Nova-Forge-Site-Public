const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../assets/profiles.js'), 'utf8');
async function run(methods) {
  const nodes = new Map();
  const get = id => { if (!nodes.has(id)) nodes.set(id, {textContent: ''}); return nodes.get(id); };
  const context = {document: {querySelector: get}};
  context.window = context;
  if (methods) context.PublicKeyCredential = Object.assign(function () {}, methods);
  vm.runInNewContext(source, context);
  await new Promise(resolve => setImmediate(resolve));
  return Object.fromEntries([...nodes].map(([id, node]) => [id, node.textContent]));
}
(async () => {
  const checks = [];
  const platform = 'isUserVerifyingPlatformAuthenticatorAvailable';
  const conditional = 'isConditionalMediationAvailable';
  let result = await run(null);
  assert.equal(result['#passkey-status'], 'WebAuthn indisponible');
  checks.push('Absent WebAuthn remains unavailable');
  for (const value of [true, false]) {
    result = await run({[platform]: async () => value, [conditional]: async () => value});
    assert.equal(result['#passkey-status'], 'Détection locale terminée');
    assert.match(result['#platform-authenticator'], value ? /^Disponible/ : /^Non détecté/);
    assert.match(result['#conditional-mediation'], value ? /^Disponible/ : /^Non disponible/);
    checks.push('Resolved capabilities ' + value + ' retain their real result');
  }
  for (const missing of [platform, conditional]) {
    result = await run({[missing === platform ? conditional : platform]: async () => true});
    assert.equal(result['#passkey-status'], 'Détection partielle — résultat inconnu');
    checks.push('Missing method remains partial: ' + missing);
    result = await run({[platform]: async () => true, [conditional]: async () => true, [missing]: async () => { throw Error('blocked'); }});
    assert.equal(result['#passkey-status'], 'Détection partielle — résultat inconnu');
    assert.match(result[missing === platform ? '#platform-authenticator' : '#conditional-mediation'], /^Inconnu/);
    checks.push('Rejected method remains unknown: ' + missing);
  }
  const report = {scope: 'Node VM simulated API outcomes, not native passkey verification', checks};
  fs.writeFileSync(path.join(__dirname, 'profile-detection-checks.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
