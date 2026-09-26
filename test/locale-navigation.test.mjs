import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { getLocaleHref } from "../src/lib/locale-navigation.mjs";

const root = new URL("../", import.meta.url);

test("Chinese home remains authored while English topics are generated from upstream", async () => {
  const chineseHome = await readFile(new URL("src/content/docs/index.mdx", root), "utf8");
  const englishHome = await readFile(new URL("src/content/docs/en-US/index.md", root), "utf8");
  const gettingStarted = await readFile(new URL("src/content/docs/en-US/getting-started.md", root), "utf8");
  const nestedTopic = await readFile(new URL("src/content/docs/en-US/stores-beta/user-guide.md", root), "utf8");

  assert.match(chineseHome, /欢迎阅读 OpenSpec 文档/u);
  assert.match(englishHome, /^title: "OpenSpec Documentation"/mu);
  assert.match(gettingStarted, /^title: "Getting Started"/mu);
  assert.match(nestedTopic, /^title: "Stores: Plan in Its Own Repo"/mu);
});

test("Starlight declares matching Chinese root and English prefixed locales", async () => {
  const config = await readFile(new URL("astro.config.mjs", root), "utf8");
  assert.match(config, /defaultLocale:\s*"root"/u);
  assert.match(config, /root:\s*\{[\s\S]*?lang:\s*"zh-CN"/u);
  assert.match(config, /"en-US":\s*\{[\s\S]*?lang:\s*"en-US"/u);
  assert.match(config, /"en-US":\s*\{[\s\S]*?lang:\s*"en-US"/u);
  assert.match(config, /site:\s*"https:\/\/openspec\.hagicode\.com"/u);
});

test("language navigation preserves a published translation", () => {
  const publishedIds = ["index", "en-US/index", "en-US/getting-started"];
  assert.equal(getLocaleHref("/en-US/getting-started/", "en-US", publishedIds), "/en-US/getting-started/");
});

test("language navigation preserves matching topics and falls back for upstream-only topics", () => {
  const publishedIds = ["index", "en-US/index", "en-US/getting-started"];
  assert.equal(getLocaleHref("/en-US/", "root", publishedIds), "/");
  assert.equal(getLocaleHref("/en-US/getting-started/", "root", publishedIds), "/");
  assert.equal(getLocaleHref("/", "en-US", publishedIds), "/en-US/");
  assert.equal(
    getLocaleHref("/en-US/getting-started/", "root", ["index", "getting-started", "en-US/getting-started"]),
    "/getting-started/",
  );
});
