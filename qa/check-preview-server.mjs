import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const port = 4187;
const child = spawn(process.execPath, ["preview.mjs"], {
  cwd: root,
  env: { ...process.env, HOST: "127.0.0.1", PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"],
});

async function request(path) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      return await fetch(`http://127.0.0.1:${port}${path}`);
    } catch {
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 50));
    }
  }
  throw new Error(`Preview server did not answer ${path}`);
}

try {
  const home = await request("/");
  assert.equal(home.status, 200);
  assert.match(home.headers.get("content-type") ?? "", /^text\/html/);
  assert.equal(home.headers.get("cache-control"), "no-store");

  const cleanRoute = await request("/catalog");
  assert.equal(cleanRoute.status, 200);
  assert.match(await cleanRoute.text(), /<main\b/);

  const asset = await request("/assets/shell.js");
  assert.equal(asset.status, 200);
  assert.match(asset.headers.get("content-type") ?? "", /^text\/javascript/);

  const missing = await request("/missing-preview-route");
  assert.equal(missing.status, 404);
  assert.equal(missing.headers.get("x-content-type-options"), "nosniff");

  console.log("Preview server: 4 targeted checks passed");
} finally {
  child.kill("SIGTERM");
}
