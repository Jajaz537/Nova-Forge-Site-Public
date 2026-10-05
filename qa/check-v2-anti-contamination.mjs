import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const policyPath = path.join(root, 'qa', 'modaryx-v2-anti-contamination-policy.json');
const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function inspectRoot(candidateRoot) {
  const findings = [];
  const regexes = (policy.forbiddenRegex || []).map((source) => new RegExp(source, 'im'));
  const extensions = new Set(policy.textExtensions || []);
  const files = walk(candidateRoot);

  for (const file of files) {
    const rel = path.relative(root, file).split(path.sep).join('/');
    const ext = path.extname(file).toLowerCase();
    if (!extensions.has(ext)) continue;

    const source = fs.readFileSync(file, 'utf8');

    for (const token of policy.forbiddenContentTokens || []) {
      if (source.includes(token)) findings.push({file:rel, kind:'forbidden-token', value:token});
    }
    for (const prefix of policy.forbiddenAssetPrefixes || []) {
      if (source.includes(prefix)) findings.push({file:rel, kind:'forbidden-asset-prefix', value:prefix});
    }
    for (const regex of regexes) {
      if (regex.test(source)) findings.push({file:rel, kind:'forbidden-regex', value:regex.source});
    }
  }
  return findings;
}

function runScan() {
  const roots = (policy.candidateRoots || [])
    .map((name) => path.join(root, name))
    .filter((dir) => fs.existsSync(dir) && fs.statSync(dir).isDirectory());

  if (!roots.length) {
    console.log(JSON.stringify({
      marker:'READY_V2_ANTI_CONTAMINATION_NO_ROOT',
      result:'PREPARED',
      scannedRoots:[],
      findings:[],
      note:'No V2 candidate root exists yet; guard logic is installed but this is not a frontend PASS.'
    }, null, 2));
    return 0;
  }

  const findings = roots.flatMap(inspectRoot);
  const report = {
    marker: findings.length ? 'FAIL_V2_ANTI_CONTAMINATION' : 'PASS_V2_ANTI_CONTAMINATION',
    result: findings.length ? 'FAIL' : 'PASS',
    scannedRoots: roots.map((dir) => path.relative(root, dir).split(path.sep).join('/')),
    findings
  };
  console.log(JSON.stringify(report, null, 2));
  return findings.length ? 1 : 0;
}

function selfTest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'modaryx-v2-guard-'));
  try {
    const safe = path.join(tmp, 'safe');
    const bad = path.join(tmp, 'bad');
    fs.mkdirSync(safe);
    fs.mkdirSync(bad);
    fs.writeFileSync(path.join(safe, 'entry.js'), "import './v2-sw.js';\nconst ns='modaryx:v2:preferences';\n");
    fs.writeFileSync(path.join(bad, 'entry.js'), "import '../assets/shell.js';\nconst old='project-ember-textures.html';\n");

    const safeFindings = inspectRoot(safe);
    const badFindings = inspectRoot(bad);

    const expectedShell = badFindings.some((x) => x.value === 'assets/shell.js');
    const expectedProjectRoute = badFindings.some((x) => x.kind === 'forbidden-regex' && x.value.includes('project-'));
    const safeAccepted = safeFindings.length === 0;

    const failures = [];
    if (!safeAccepted) failures.push('safe fixture rejected');
    if (!expectedShell) failures.push('legacy shell fixture not detected');
    if (!expectedProjectRoute) failures.push('legacy project route fixture not detected');

    console.log(JSON.stringify({
      marker: failures.length ? 'FAIL_V2_ANTI_CONTAMINATION_SELF_TEST' : 'PASS_V2_ANTI_CONTAMINATION_SELF_TEST',
      result: failures.length ? 'FAIL' : 'PASS',
      safeFindings,
      badFindings,
      failures
    }, null, 2));
    return failures.length ? 1 : 0;
  } finally {
    fs.rmSync(tmp, {recursive:true, force:true});
  }
}

process.exitCode = process.argv.includes('--self-test') ? selfTest() : runScan();
