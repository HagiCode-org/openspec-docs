import assert from "node:assert/strict";
import test from "node:test";
import { loadFirstPromotion, resolvePromotionEndpoints } from "../src/lib/promote-loader.mjs";

const NOW = Date.parse("2026-09-26T12:00:00Z");

function jsonResponse(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  };
}

function feedFetch({ catalog, flags, contents, failAt } = {}) {
  const seen = [];
  const fetchImpl = async (input) => {
    const url = input.toString();
    seen.push(url);
    if (url.endsWith("/index-catalog.json")) {
      if (failAt === "catalog") throw new Error("catalog unavailable");
      return jsonResponse(catalog ?? {
        entries: [
          { id: "promotion-flags", path: "/feeds/flags.json" },
          { id: "promotion-content", path: "/feeds/content.json" },
        ],
      });
    }
    if (url.endsWith("/feeds/flags.json") || url.endsWith("/promote.json")) {
      if (failAt === "flags") throw new Error("flags unavailable");
      return jsonResponse(flags ?? { promotes: [] });
    }
    if (url.endsWith("/feeds/content.json") || url.endsWith("/promote_content.json")) {
      if (failAt === "content") throw new Error("content unavailable");
      return jsonResponse(contents ?? { contents: [] });
    }
    throw new Error(`Unexpected promotion URL: ${url}`);
  };
  fetchImpl.seen = seen;
  return fetchImpl;
}

test("discovers catalog paths and chooses the first enabled ID-matched campaign", async () => {
  const fetchImpl = feedFetch({
    flags: {
      promotes: [
        { id: "disabled", on: false },
        { id: "no-content", on: true },
        { id: "first", on: true },
        { id: "second", on: true },
      ],
    },
    contents: {
      contents: [
        { id: "second", title: { en: "Second" }, description: { en: "Second copy" }, link: "https://example.com/second" },
        { id: "first", title: { en: "First" }, description: { en: "First copy" }, link: "https://example.com/first" },
      ],
    },
  });

  assert.deepEqual(await resolvePromotionEndpoints(fetchImpl), {
    flagsUrl: "https://index.hagicode.com/feeds/flags.json",
    contentUrl: "https://index.hagicode.com/feeds/content.json",
    source: "catalog",
  });
  assert.deepEqual(await loadFirstPromotion({ locale: "en-US", fetchImpl, now: NOW }), {
    id: "first",
    title: "First",
    description: "First copy",
    ctaLabel: "Visit",
    href: "https://example.com/first",
  });
});

test("filters scheduled, expired, malformed, incomplete, and unsafe campaigns", async () => {
  const fetchImpl = feedFetch({
    flags: {
      promotes: [
        { id: "future", on: true, startTime: "2026-09-26T12:00:01Z" },
        { id: "expired", on: true, endTime: "2026-09-26T12:00:00Z" },
        { id: "bad-time", on: true, startTime: "not a date" },
        { id: "invalid-window", on: true, startTime: "2026-09-27T00:00:00Z", endTime: "2026-09-25T00:00:00Z" },
        { id: "missing-title", on: true },
        { id: "unsafe-link", on: true },
        { id: "valid", on: true, startTime: "2026-09-26T12:00:00Z" },
      ],
    },
    contents: {
      contents: [
        { id: "future", title: { en: "Future" }, description: { en: "Future" }, link: "https://example.com" },
        { id: "expired", title: { en: "Expired" }, description: { en: "Expired" }, link: "https://example.com" },
        { id: "bad-time", title: { en: "Bad" }, description: { en: "Bad" }, link: "https://example.com" },
        { id: "invalid-window", title: { en: "Bad range" }, description: { en: "Bad range" }, link: "https://example.com" },
        { id: "missing-title", title: {}, description: { en: "Description" }, link: "https://example.com" },
        { id: "unsafe-link", title: { en: "Unsafe" }, description: { en: "Unsafe" }, link: "javascript:alert(1)" },
        { id: "valid", title: { en: "Current" }, description: { en: "Available now" }, link: "https://example.com/current" },
      ],
    },
  });

  assert.equal((await loadFirstPromotion({ locale: "en-US", fetchImpl, now: NOW }))?.id, "valid");
});

test("treats empty schedule fields as an open-ended campaign window", async () => {
  const fetchImpl = feedFetch({
    flags: { promotes: [{ id: "open", on: true, startTime: "", endTime: null }] },
    contents: {
      contents: [{ id: "open", title: { en: "Open" }, description: { en: "No time limits" }, link: "https://example.com/open" }],
    },
  });
  assert.equal((await loadFirstPromotion({ locale: "en-US", fetchImpl, now: NOW }))?.id, "open");
});

test("prefers the page locale and falls back to available nonempty localized values", async () => {
  const fetchImpl = feedFetch({
    flags: { promotes: [{ id: "localized", on: true }, { id: "fallback", on: true }] },
    contents: {
      contents: [
        {
          id: "localized",
          title: { "zh-CN": "中文标题", en: "English title" },
          description: { "zh-CN": "中文说明", en: "English description" },
          cta: { "zh-CN": "查看详情" },
          link: "https://example.com/localized",
        },
        {
          id: "fallback",
          title: { "zh-CN": "仅中文标题" },
          description: { "zh-CN": "仅中文说明" },
          link: "https://example.com/fallback",
        },
      ],
    },
  });

  const chinese = await loadFirstPromotion({ locale: "root", fetchImpl, now: NOW });
  const english = await loadFirstPromotion({ locale: "en-US", fetchImpl, now: NOW });
  assert.equal(chinese?.title, "中文标题");
  assert.equal(chinese?.ctaLabel, "查看详情");
  assert.equal(english?.title, "English title");
  assert.equal(english?.description, "English description");
});

test("uses stable endpoints after catalog discovery failure", async () => {
  const fetchImpl = feedFetch({
    failAt: "catalog",
    flags: { promotes: [{ id: "stable", on: true }] },
    contents: {
      contents: [{ id: "stable", title: { en: "Stable" }, description: { en: "Fallback path" }, link: "https://example.com/stable" }],
    },
  });

  assert.deepEqual(await resolvePromotionEndpoints(fetchImpl), {
    flagsUrl: "https://index.hagicode.com/promote.json",
    contentUrl: "https://index.hagicode.com/promote_content.json",
    source: "fallback",
  });
  assert.equal((await loadFirstPromotion({ locale: "en-US", fetchImpl, now: NOW }))?.id, "stable");
});

test("returns no campaign when remote feeds fail or have no valid match", async () => {
  assert.equal(await loadFirstPromotion({ fetchImpl: feedFetch({ failAt: "flags" }), now: NOW }), null);
  assert.equal(await loadFirstPromotion({
    fetchImpl: feedFetch({ flags: { promotes: [{ id: "missing", on: true }] } }),
    now: NOW,
  }), null);
});
