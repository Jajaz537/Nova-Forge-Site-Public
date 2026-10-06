import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import worker from "../worker/index.js";

test("serves existing static assets without a fallback", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/assets/v2-test.js"), {
    ASSETS: {
      fetch: async (request) => {
        calls.push(new URL(request.url).pathname);
        return new Response("asset", { status: 200 });
      },
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/assets/v2-test.js"]);
});

test("falls back to index.html for an unknown app route", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/flow/step-two?source=share", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          calls.push(url.pathname + url.search);
          return new Response(url.pathname === "/index.html" ? "app" : "missing", {
            status: url.pathname === "/index.html" ? 200 : 404,
          });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/flow/step-two?source=share", "/index.html"]);
});

test("does not turn missing API or write requests into the app shell", async () => {
  for (const request of [
    new Request("https://example.test/api/missing", { headers: { accept: "application/json" } }),
    new Request("https://example.test/flow", { method: "POST", headers: { accept: "text/html" } }),
  ]) {
    let calls = 0;
    const response = await worker.fetch(request, {
      ASSETS: {
        fetch: async () => {
          calls += 1;
          return new Response("missing", { status: 404 });
        },
      },
    });

    assert.equal(response.status, 404);
    assert.equal(calls, 1);
  }
});

test("emits the files required by Sites packaging", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));
});


test("serves only known V2 deep links and injects route metadata", async () => {
  const index='<!doctype html><html><head><meta name="description" content="old" /><title>Old</title></head><body><div id="root"></div></body></html>';
  const assets={
    fetch: async request => {
      const url=new URL(request.url);
      if(url.pathname==="/index.html"||url.pathname==="/") return new Response(index,{status:200,headers:{"content-type":"text/html"}});
      return new Response("missing",{status:404,headers:{"content-type":"text/plain"}});
    },
  };
  const known=await worker.fetch(new Request("https://example.test/games/aetherlands",{headers:{accept:"text/html"}}),{ASSETS:assets});
  assert.equal(known.status,200);
  const knownText=await known.text();
  assert.match(knownText,/<title>Aetherlands — MODARYX<\/title>/);
  assert.match(knownText,/data-modaryx-route="\/games\/aetherlands"/);
  assert.equal(known.headers.get("x-robots-tag"),"noindex, nofollow, noarchive");

  const content=await worker.fetch(new Request("https://example.test/content/sentiers-de-laube",{headers:{accept:"text/html"}}),{ASSETS:assets});
  assert.equal(content.status,200);
  assert.match(await content.text(),/<title>Sentiers de l’aube — MODARYX<\/title>/);

  const unknown=await worker.fetch(new Request("https://example.test/not-a-v2-route",{headers:{accept:"text/html"}}),{ASSETS:assets});
  assert.equal(unknown.status,404);
});
