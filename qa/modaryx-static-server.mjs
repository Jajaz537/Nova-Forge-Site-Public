import http from "node:http";
import { createReadStream, statSync, existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { cwd } from "node:process";

const root = cwd();
const port = Number(process.argv[2] || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

const server = http.createServer((req, res) => {
  const raw = decodeURIComponent((req.url || "/").split("?")[0]);
  const rel = raw === "/" ? "index.html" : raw.replace(/^\/+/, "");
  const safe = normalize(rel).replace(/^(\.\.[/\\])+/, "");
  const file = join(root, safe);
  if (!existsSync(file)) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  try {
    const st = statSync(file);
    if (!st.isFile()) throw new Error("not file");
    res.writeHead(200, {
      "content-type": types[extname(file).toLowerCase()] || "application/octet-stream",
      "cache-control": "no-store"
    });
    createReadStream(file).pipe(res);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`MODARYX_STATIC_READY http://127.0.0.1:${port}`);
});
