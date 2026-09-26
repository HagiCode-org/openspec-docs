import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readBuiltPage(path) {
  return readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");
}

test("built localized routes expose correct document language and canonical URLs", async () => {
  const [zhHome, enHome, zhGuide, enGuide] = await Promise.all([
    readBuiltPage("index.html"),
    readBuiltPage("en-US/index.html"),
    readBuiltPage("guides/getting-started/index.html"),
    readBuiltPage("en-US/guides/getting-started/index.html"),
  ]);

  assert.match(zhHome, /<html lang="zh-CN"/u);
  assert.ok(zhHome.includes('<link rel="canonical" href="https://openspec.hagicode.com/"/>'));
  assert.match(enHome, /<html lang="en-US"/u);
  assert.ok(enHome.includes('<link rel="canonical" href="https://openspec.hagicode.com/en-US/"/>'));
  assert.match(zhGuide, /<html lang="zh-CN"/u);
  assert.match(enGuide, /<html lang="en-US"/u);
  assert.ok(enGuide.includes('<link rel="canonical" href="https://openspec.hagicode.com/en-US/guides/getting-started/"/>'));
});

test("built sidebar and shared shell link to published topics and locale routes", async () => {
  const [zhGuide, enGuide] = await Promise.all([
    readBuiltPage("guides/getting-started/index.html"),
    readBuiltPage("en-US/guides/getting-started/index.html"),
  ]);

  assert.match(zhGuide, /class="language-link[^"]*" href="\/en-US\/guides\/getting-started\/"/u);
  assert.match(enGuide, /class="language-link[^"]*" href="\/guides\/getting-started\/"/u);
  assert.ok(zhGuide.includes('href="/guides/getting-started/"'));
  assert.ok(enGuide.includes('href="/en-US/guides/getting-started/"'));
  assert.match(zhGuide, /aria-label="切换到英语"/u);
  assert.match(enGuide, /aria-label="Switch to Chinese"/u);
});

test("built production output without identifiers has no analytics bootstraps", async () => {
  const html = await readBuiltPage("index.html");
  assert.doesNotMatch(html, /<script type="application\/json"[^>]*data-openspec-analytics/u);
  assert.doesNotMatch(html, /<(?:script|link)[^>]+(?:googletagmanager\.com|sdk\.51\.la)/u);
});

test("mobile menu and language links remain semantic and keyboard reachable", async () => {
  const [html, header, styles] = await Promise.all([
    readBuiltPage("index.html"),
    readFile(new URL("../src/components/StarlightHeader.astro", import.meta.url), "utf8"),
    readFile(new URL("../src/styles/site.css", import.meta.url), "utf8"),
  ]);

  assert.match(html, /<button popovertarget="starlight__sidebar"[^>]*>[\s\S]*?<\/button>/u);
  assert.equal((html.match(/class="[^"]*language-link[^"]*"/gu) ?? []).length, 2);
  assert.match(header, /:focus-visible/u);
  assert.match(styles, /@media \(max-width: 30rem\)/u);
});
