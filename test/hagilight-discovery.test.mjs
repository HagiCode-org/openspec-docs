import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const locales = ["en-US", "zh-CN", "zh-Hant", "ja-JP", "ko-KR", "de-DE", "fr-FR", "es-ES", "pt-BR", "ru-RU"];

function assertFeed(xml, language) {
  assert.match(xml, /^<\?xml/u);
  const channel = xml.match(/<channel>([\s\S]*?)<\/channel>/u)?.[1];
  assert.ok(channel, "RSS feed has a channel");
  assert.match(channel, /<title>[^<]+<\/title>/u);
  assert.match(channel, /<description>[^<]+<\/description>/u);
  assert.match(channel, new RegExp(`<language>${language}</language>`, "u"));
  assert.match(channel, /<link>https:\/\/openspec\.hagicode\.com\/<\/link>/u);
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gu)].map(([, item]) => {
    const link = item.match(/<link>([^<]+)<\/link>/u)?.[1];
    assert.ok(link && /^https:\/\/openspec\.hagicode\.com\//u.test(link), "RSS item links are absolute site URLs");
    return link;
  });
}

test("shared integrations publish default robots, sitemap, and Starlight RSS output", async () => {
  const [robots, sitemap, config, defaultFeed, englishAlias, chineseFeed] = await Promise.all([
    readFile(new URL("dist/robots.txt", root), "utf8"),
    readFile(new URL("dist/sitemap-index.xml", root), "utf8"),
    readFile(new URL("astro.config.mjs", root), "utf8"),
    readFile(new URL("dist/rss.xml", root), "utf8"),
    readFile(new URL("dist/rss.en.xml", root), "utf8"),
    readFile(new URL("dist/rss.zh-CN.xml", root), "utf8"),
  ]);

  assert.equal((config.match(/hagilight\(\s*\{/gu) ?? []).length, 1);
  assert.equal((config.match(/hagilightDiscovery\(\)/gu) ?? []).length, 1);
  assert.match(robots, /Sitemap: https:\/\/openspec\.hagicode\.com\/sitemap-index\.xml/u);
  assert.match(sitemap, /https:\/\/openspec\.hagicode\.com\/sitemap-\d+\.xml/u);
  const englishLinks = assertFeed(defaultFeed, "en-US");
  assert.deepEqual(assertFeed(englishAlias, "en-US"), englishLinks);
  assert.equal(englishLinks.length, 27);
  const chineseLinks = assertFeed(chineseFeed, "zh-CN");
  assert.equal(chineseLinks.length, 27);
  assert.ok(chineseLinks.every((link) => link.includes("/zh-CN/")));

  for (const locale of locales) {
    const filename = locale === "en-US" ? "en" : locale;
    const xml = await readFile(new URL(`dist/rss.${filename}.xml`, root), "utf8");
    const links = assertFeed(xml, locale);
    if (locale !== "en-US") assert.ok(links.every((link) => link.includes(`/${locale}/`)));
  }

  await assert.rejects(stat(new URL("dist/rss.all.xml", root)), { code: "ENOENT" });
});
