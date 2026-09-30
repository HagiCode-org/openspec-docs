import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function loadPublishedModule(filename, imports = []) {
  const packageDir = new URL("../node_modules/@hagicode/hagilight-core/", import.meta.url);
  let source = await readFile(new URL(filename, packageDir), "utf8");
  for (const [specifier, replacement] of imports) {
    source = source.replaceAll(specifier, replacement);
  }
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const url = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
  return { exports: await import(url), url };
}

const promotionsModule = await loadPublishedModule("dist/promotions.js");
const promotions = promotionsModule.exports;
const banner = (await loadPublishedModule("dist/promoto-banner.js", [
  ["'./promotions.js'", JSON.stringify(promotionsModule.url)],
])).exports;

const now = Date.parse("2026-09-26T12:00:00Z");

function response(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => "application/json" },
    json: async () => payload,
  };
}

function fakeFetch({ flags, contents, failAt } = {}) {
  return async (input) => {
    const url = input.toString();
    if (url.endsWith("/index-catalog.json")) {
      if (failAt === "catalog") throw new Error("catalog unavailable");
      return response({
        entries: [
          { id: "promotion-flags", path: "/feeds/flags.json" },
          { id: "promotion-content", path: "/feeds/content.json" },
        ],
      });
    }
    if (url.endsWith("/feeds/flags.json") || url.endsWith("/promote.json")) {
      if (failAt === "flags") throw new Error("flags unavailable");
      return response(flags ?? { promotes: [] });
    }
    if (url.endsWith("/feeds/content.json") || url.endsWith("/promote_content.json")) {
      if (failAt === "content") throw new Error("content unavailable");
      return response(contents ?? { contents: [] });
    }
    throw new Error(`Unexpected promotion URL: ${url}`);
  };
}

test("loads eligible localized campaigns and falls back to canonical feeds when discovery fails", async () => {
  const fetchImpl = fakeFetch({
    flags: {
      promotes: [
        { id: "disabled", on: false },
        { id: "first", on: true },
        { id: "second", on: true },
        { id: "future", on: true, startTime: "2026-09-27T00:00:00Z" },
        { id: "expired", on: true, endTime: "2026-09-26T12:00:00Z" },
      ],
    },
    contents: {
      contents: [
        {
          id: "first",
          title: { "zh-CN": "中文标题", "en-US": "English title" },
          description: { "zh-CN": "中文说明", "en-US": "English description" },
          link: "https://example.com/first",
        },
        {
          id: "second",
          title: { "zh-CN": "第二项", "en-US": "Second campaign" },
          description: { "zh-CN": "第二项说明", "en-US": "Second description" },
          link: "https://example.com/second",
        },
        {
          id: "future",
          title: { "en-US": "Future" },
          description: { "en-US": "Not active yet" },
          link: "https://example.com/future",
        },
        {
          id: "expired",
          title: { "en-US": "Expired" },
          description: { "en-US": "No longer active" },
          link: "https://example.com/expired",
        },
      ],
    },
  });

  const cards = await promotions.loadActivePromotions({
    locale: "zh-CN",
    fetchImpl,
    now,
  });
  assert.deepEqual(cards.map(({ id }) => id), ["first", "second"]);
  assert.equal(cards[0].title, "中文标题");
  assert.equal(cards[1].description, "第二项说明");

  const fallbackFeeds = fakeFetch({
    failAt: "catalog",
    flags: { promotes: [{ id: "stable", on: true }] },
    contents: {
      contents: [{
        id: "stable",
        title: { "en-US": "Stable campaign" },
        description: { "en-US": "Canonical feed fallback" },
        link: "https://example.com/stable",
      }],
    },
  });
  assert.equal((await promotions.resolvePromotionDocumentUrls(fallbackFeeds)).source, "fallback");
  assert.equal((await promotions.loadActivePromotions({
    locale: "en-US",
    fetchImpl: fallbackFeeds,
    now,
  }))[0].id, "stable");
  assert.deepEqual(await promotions.loadActivePromotions({
    locale: "en-US",
    fetchImpl: fakeFetch({ failAt: "flags" }),
    now,
  }), []);
});

test("selects one card at a time and handles fallback, set dismissal, footer visibility, and motion", () => {
  const fallback = {
    id: "docs-fallback",
    title: "Explore HagiCode",
    description: "Localized site fallback",
    ctaLabel: "Visit HagiCode",
    link: "https://www.hagicode.com",
  };
  const first = { ...fallback, id: "first", title: "First campaign" };
  const second = { ...fallback, id: "second", title: "Second campaign" };
  const cards = banner.selectPromotionCards([first, second], fallback);
  assert.deepEqual(cards.map(({ id }) => id), ["first", "second"]);
  assert.deepEqual(banner.selectPromotionCards([], fallback), [fallback]);

  const signature = banner.getPromotionSetSignature([fallback]);
  assert.equal(banner.getPromotionVisibility([fallback], signature, signature, false), "dismissed");
  assert.equal(banner.getPromotionVisibility([fallback], signature, null, true), "footer-hidden");
  assert.equal(banner.getPromotionVisibility([fallback], signature, null, false), "ready");
  assert.equal(banner.getPromotionVisibility([], null, null, false), "hidden");
  assert.notEqual(banner.getPromotionSetSignature([first]), signature);

  assert.equal(banner.getNextPromotionIndex(0, cards.length, -1), 1);
  assert.equal(banner.getNextPromotionIndex(1, cards.length, 1), 0);
  assert.equal(banner.shouldAutoRotate(2, false, false, true, "ready"), true);
  assert.equal(banner.shouldAutoRotate(2, false, true, true, "ready"), false);
  assert.equal(banner.shouldAutoRotate(2, false, false, true, "footer-hidden"), false);
  assert.equal(banner.shouldAutoRotate(1, false, false, true, "ready"), false);
});

test("published banner exposes keyboard controls, persisted dismissal, and responsive reduced-motion styles", async () => {
  const [component, client] = await Promise.all([
    readFile(new URL("../node_modules/@hagicode/hagilight-core/PromotoBanner.astro", import.meta.url), "utf8"),
    readFile(new URL("../node_modules/@hagicode/hagilight-core/dist/promoto-banner.js", import.meta.url), "utf8"),
  ]);

  assert.match(component, /fallback\?: PromotionCard/u);
  assert.match(component, /data-promoto-dismiss[\s\S]*aria-label="Dismiss promotion"/u);
  assert.match(component, /data-promoto-previous[\s\S]*aria-label="Previous promotion"/u);
  assert.match(component, /data-promoto-next[\s\S]*aria-label="Next promotion"/u);
  assert.match(component, /data-promoto-pause/u);
  assert.match(component, /data-promoto-status aria-live="polite"/u);
  assert.match(component, /@media \(max-width: 720px\)/u);
  assert.match(component, /@media \(prefers-reduced-motion: reduce\)/u);
  assert.match(client, /hagilight:promoto-banner:dismissed-signature/u);
  assert.match(client, /localStorage\.getItem\(DISMISSED_SIGNATURE_KEY\)/u);
  assert.match(client, /localStorage\.setItem\(DISMISSED_SIGNATURE_KEY, signature\)/u);
  assert.match(client, /shouldAutoRotate\(/u);
  assert.match(client, /this\.footer\.getBoundingClientRect\(\)/u);
});
