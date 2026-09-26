import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { getLocaleHref } from "../src/lib/locale-navigation.mjs";

const root = new URL("../", import.meta.url);

test("starter pages exist in both locales and share a topic", async () => {
  const pages = [
    "src/content/docs/index.mdx",
    "src/content/docs/guides/getting-started.md",
    "src/content/docs/en-US/index.mdx",
    "src/content/docs/en-US/guides/getting-started.md",
  ];

  for (const page of pages) {
    const content = await readFile(new URL(page, root), "utf8");
    assert.match(content, /^---\ntitle:/u, `${page} has a title`);
    assert.match(content, /^description:/mu, `${page} has a description`);
  }
});

test("Starlight declares matching Chinese root and English prefixed locales", async () => {
  const config = await readFile(new URL("astro.config.mjs", root), "utf8");
  assert.match(config, /defaultLocale:\s*"root"/u);
  assert.match(config, /root:\s*\{[\s\S]*?lang:\s*"zh-CN"/u);
  assert.match(config, /"en-US":\s*\{[\s\S]*?lang:\s*"en-US"/u);
  assert.match(config, /autogenerate:\s*\{\s*directory:\s*"guides"\s*\}/u);
  assert.match(config, /site:\s*"https:\/\/openspec\.hagicode\.com"/u);
});

test("language navigation preserves a published translation", () => {
  const publishedIds = [
    "index",
    "guides/getting-started",
    "en-US/index",
    "en-US/guides/getting-started",
  ];
  assert.equal(getLocaleHref("/guides/getting-started/", "en-US", publishedIds), "/en-US/guides/getting-started/");
  assert.equal(getLocaleHref("/en-US/guides/getting-started/", "root", publishedIds), "/guides/getting-started/");
});

test("language navigation falls back to the selected locale home", () => {
  const rootOnlyPages = ["index", "advanced-guide", "en-US/index"];
  const englishOnlyPages = ["index", "en-US/index", "en-US/advanced-guide"];
  assert.equal(getLocaleHref("/advanced-guide/", "en-US", rootOnlyPages), "/en-US/");
  assert.equal(getLocaleHref("/en-US/advanced-guide/", "root", englishOnlyPages), "/");
});
