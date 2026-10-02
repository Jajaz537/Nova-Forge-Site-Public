import http from "node:http";
import { createReadStream, statSync, existsSync } from "node:fs";
import { extname, join } from "node:path";
import { cwd } from "node:process";

const root = cwd();
const port = Number(process.argv[2] || 4173);

const publicFiles = new Map([
  ["/", join(root, "index.html")],
  ["/index.html", join(root, "index.html")],
  ["/univers.html", join(root, "univers.html")],
  ["/compagnons.html", join(root, "compagnons.html")],
  ["/aventures.html", join(root, "aventures.html")],
  ["/lieux.html", join(root, "lieux.html")],
  ["/factions.html", join(root, "factions.html")],
  ["/communaute.html", join(root, "communaute.html")],
  ["/404.html", join(root, "404.html")],
  ["/site.webmanifest", join(root, "site.webmanifest")],
  ["/favicon.svg", join(root, "favicon.svg")],
  ["/assets/modaryx-public-home.css", join(root, "assets", "modaryx-public-home.css")],
  ["/assets/modaryx-public-route.css", join(root, "assets", "modaryx-public-route.css")],
  ["/assets/modaryx-finishline-canon.png", join(root, "assets", "modaryx-finishline-canon.png")],
  ["/assets/modaryx-mark.svg", join(root, "assets", "modaryx-mark.svg")],
  ["/assets/modaryx-mark-192.png", join(root, "assets", "modaryx-mark-192.png")],
  ["/assets/modaryx-mark-512.png", join(root, "assets", "modaryx-mark-512.png")]
]);

const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".webmanifest", "application/manifest+json; charset=utf-8"]
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

  const file = publicFiles.get(pathname);
  if (!file || !existsSync(file)) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  try {
    const st = statSync(file);
    if (!st.isFile()) throw new Error("not file");

    res.writeHead(200, {
      "content-type": types.get(extname(file).toLowerCase()) || "application/octet-stream",
      "content-length": st.size,
      "cache-control": "no-store"
    });

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    createReadStream(file).pipe(res);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`MODARYX_STATIC_READY http://127.0.0.1:${port}`);
});
