import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("shared integrations publish default robots, sitemap, and Starlight RSS output", async () => {
  const [robots, sitemap, config, defaultFeed, englishAlias, chineseFeed] = await Promise.all([
    readFile(new URL("dist/robots.txt", root), "utf8"),
    readFile(new URL("dist/sitemap-index.xml", root), "utf8"),
    readFile(new URL("astro.config.mjs", root), "utf8"),
    readFile(new URL("dist/rss.xml", root), "utf8"),
    readFile(new URL("dist/rss.en.xml", root), "utf8"),
    readFile(new URL("dist/rss.zh-CN.xml", root), "utf8"),
  ]);

  assert.match(config, /hagilightDiscovery\(\)/u);
  assert.match(robots, /Sitemap: https:\/\/openspec\.hagicode\.com\/sitemap-index\.xml/u);
  assert.match(sitemap, /https:\/\/openspec\.hagicode\.com\/sitemap-\d+\.xml/u);
  assert.equal((defaultFeed.match(/<item>/gu) ?? []).length, 27);
  assert.equal((chineseFeed.match(/<item>/gu) ?? []).length, 27);
  assert.deepEqual(
    [...englishAlias.matchAll(/<link>([^<]+)<\/link>/gu)].map(([, link]) => link),
    [...defaultFeed.matchAll(/<link>([^<]+)<\/link>/gu)].map(([, link]) => link),
  );
});
