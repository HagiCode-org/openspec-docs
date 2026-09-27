import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  getEnglishTopicHref,
  getLocaleHref,
  getPreferredLocale,
  LANGUAGE_PREFERENCE_KEY,
  preserveUrlContext,
  readLocalePreference,
  serializeLocalePreference,
  SUPPORTED_LOCALES,
  writeLocalePreference,
} from "../src/lib/locale-navigation.mjs";

const root = new URL("../", import.meta.url);

test("Chinese home remains authored while English topics are generated from upstream", async () => {
  const chineseHome = await readFile(new URL("src/content/docs/zh-CN/index.mdx", root), "utf8");
  const englishHome = await readFile(new URL("src/content/docs/en-US/index.md", root), "utf8");
  const gettingStarted = await readFile(new URL("src/content/docs/en-US/getting-started.md", root), "utf8");
  const nestedTopic = await readFile(new URL("src/content/docs/en-US/stores-beta/user-guide.md", root), "utf8");

  assert.match(chineseHome, /OpenSpec 帮助你和 AI 编程助手/u);
  assert.match(chineseHome, /## 文档导航/u);
  assert.match(chineseHome, /\[快速入门\]\(\.\/getting-started\/\)/u);
  assert.doesNotMatch(chineseHome, /This is the home for everything OpenSpec/u);
  assert.match(englishHome, /^title: "OpenSpec Documentation"/mu);
  assert.match(gettingStarted, /^title: "Getting Started"/mu);
  assert.match(nestedTopic, /^title: "Stores: Plan in Its Own Repo"/mu);
});

test("every configured locale keeps its prefixed route and document language", async () => {
  const config = await readFile(new URL("astro.config.mjs", root), "utf8");
  for (const locale of SUPPORTED_LOCALES) {
    assert.match(config, new RegExp(`"${locale}":\\s*\\{[\\s\\S]*?lang:\\s*"${locale}"`, "u"));
  }
  assert.match(config, /defaultLocale:\s*"en-US"/u);
  assert.doesNotMatch(config, /root:\s*\{/u);
  assert.match(config, /site:\s*"https:\/\/openspec\.hagicode\.com"/u);
});

test("language navigation preserves translated topics in nested routes across all locales", () => {
  const publishedIds = SUPPORTED_LOCALES.map((locale) => `${locale}/stores-beta/user-guide.md`);

  for (const locale of SUPPORTED_LOCALES) {
    assert.equal(
      getLocaleHref("/en-US/stores-beta/user-guide/", locale, publishedIds),
      `/${locale}/stores-beta/user-guide/`,
    );
    assert.equal(
      getLocaleHref("/en-US/stores-beta/user-guide/index/", locale, publishedIds),
      `/${locale}/stores-beta/user-guide/`,
    );
  }
});

test("language navigation keeps authored and fallback topics and uses locale home for source-less topics", () => {
  const publishedIds = [
    "en-US/index.md",
    "en-US/getting-started.md",
    "zh-CN/index.mdx",
    "zh-CN/getting-started.md",
    "ja-JP/getting-started.md",
    "de-DE/getting-started.md",
  ];

  for (const locale of ["zh-CN", "ja-JP", "de-DE"]) {
    assert.equal(
      getLocaleHref("/en-US/getting-started/", locale, publishedIds),
      `/${locale}/getting-started/`,
    );
  }
  assert.equal(getLocaleHref("/en-US/unknown-topic/", "ja-JP", publishedIds), "/ja-JP/");
  assert.equal(
    getLocaleHref("/zh-CN/site-owned-topic/", "zh-CN", [...publishedIds, "zh-CN/site-owned-topic.md"]),
    "/zh-CN/site-owned-topic/",
  );
  assert.equal(getLocaleHref("/zh-CN/site-owned-topic/", "ja-JP", publishedIds), "/ja-JP/");
  assert.equal(getLocaleHref("/en-US/", "zh-CN", publishedIds), "/zh-CN/");
  assert.equal(getEnglishTopicHref("/ja-JP/stores-beta/user-guide/"), "/en-US/stores-beta/user-guide/");
  assert.equal(getEnglishTopicHref("/zh-CN/"), "/en-US/");
  assert.throws(() => getLocaleHref("/en-US/", "invalid", publishedIds), RangeError);
});

test("scripted navigation retains query parameters and fragments", () => {
  const currentUrl = new URL("https://openspec.hagicode.com/en-US/getting-started/?view=full&lang=en#install");
  const target = preserveUrlContext("/ja-JP/", currentUrl);
  assert.equal(target, "https://openspec.hagicode.com/ja-JP/?view=full&lang=en#install");
});

test("saved preferences accept all locales and map root to English", () => {
  for (const locale of SUPPORTED_LOCALES) {
    assert.equal(getPreferredLocale(JSON.stringify({ lang: locale })), locale);
  }
  assert.equal(getPreferredLocale('{"lang":"root"}'), "en-US");
  assert.equal(getPreferredLocale('{"lang":"unsupported"}'), null);
  assert.equal(getPreferredLocale('{"lang":4}'), null);
  assert.equal(getPreferredLocale('{"lang":"en-US"'), null);
  assert.equal(getPreferredLocale(null), null);
});

test("preference writes preserve unrelated Starlight route fields", () => {
  const serialized = serializeLocalePreference('{"path":"/guide/","theme":"dark","lang":"root"}', "zh-Hant");
  assert.deepEqual(JSON.parse(serialized), { path: "/guide/", theme: "dark", lang: "zh-Hant" });
  assert.deepEqual(JSON.parse(serializeLocalePreference("{invalid", "fr-FR")), { lang: "fr-FR" });
  assert.throws(() => serializeLocalePreference(null, "invalid"), RangeError);
});

test("blocked storage does not prevent locale navigation", () => {
  const storage = {
    getItem(key) {
      assert.equal(key, LANGUAGE_PREFERENCE_KEY);
      return '{"path":"/guide/","lang":"root"}';
    },
    setItem(key, value) {
      assert.equal(key, LANGUAGE_PREFERENCE_KEY);
      this.value = value;
    },
  };

  assert.equal(readLocalePreference(storage), "en-US");
  assert.equal(writeLocalePreference(storage, "de-DE"), true);
  assert.deepEqual(JSON.parse(storage.value), { path: "/guide/", lang: "de-DE" });

  const blockedStorage = {
    getItem() {
      throw new Error("storage blocked");
    },
    setItem() {
      throw new Error("storage blocked");
    },
  };
  assert.equal(readLocalePreference(blockedStorage), null);
  assert.equal(writeLocalePreference(blockedStorage, "de-DE"), false);
});
