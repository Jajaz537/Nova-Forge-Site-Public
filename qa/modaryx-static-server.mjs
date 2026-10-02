import http from "node:http";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";

const root = cwd();
const port = Number(process.argv[2] || 4173);

const load = (relativePath, contentType) => {
  const body = readFileSync(join(root, ...relativePath));
  return Object.freeze({ body, contentType });
};

const publicFiles = new Map([
  ["/", load(["index.html"], "text/html; charset=utf-8")],
  ["/index.html", load(["index.html"], "text/html; charset=utf-8")],
  ["/univers.html", load(["univers.html"], "text/html; charset=utf-8")],
  ["/compagnons.html", load(["compagnons.html"], "text/html; charset=utf-8")],
  ["/aventures.html", load(["aventures.html"], "text/html; charset=utf-8")],
  ["/lieux.html", load(["lieux.html"], "text/html; charset=utf-8")],
  ["/factions.html", load(["factions.html"], "text/html; charset=utf-8")],
  ["/communaute.html", load(["communaute.html"], "text/html; charset=utf-8")],
  ["/404.html", load(["404.html"], "text/html; charset=utf-8")],
  ["/site.webmanifest", load(["site.webmanifest"], "application/manifest+json; charset=utf-8")],
  ["/favicon.svg", load(["favicon.svg"], "image/svg+xml")],
  ["/assets/modaryx-public-home.css", load(["assets", "modaryx-public-home.css"], "text/css; charset=utf-8")],
  ["/assets/modaryx-public-route.css", load(["assets", "modaryx-public-route.css"], "text/css; charset=utf-8")],
  ["/assets/modaryx-finishline-canon.png", load(["assets", "modaryx-finishline-canon.png"], "image/png")],
  ["/assets/modaryx-mark.svg", load(["assets", "modaryx-mark.svg"], "image/svg+xml")],
  ["/assets/modaryx-mark-192.png", load(["assets", "modaryx-mark-192.png"], "image/png")],
  ["/assets/modaryx-mark-512.png", load(["assets", "modaryx-mark-512.png"], "image/png")]
]);

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "content-type": "text/plain; charset=utf-8" });
    res.end("Method not allowed");
    return;
  }

  let pathname = "/";
  try {
    pathname = new URL(req.url || "/", "http://127.0.0.1").pathname;
  } catch {
    res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    res.end("Bad request");
    return;
  }

  const asset = publicFiles.get(pathname);
  if (!asset) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  res.writeHead(200, {
    "content-type": asset.contentType,
    "content-length": asset.body.length,
    "cache-control": "no-store"
  });

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  res.end(asset.body);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`MODARYX_STATIC_READY http://127.0.0.1:${port}`);
});
