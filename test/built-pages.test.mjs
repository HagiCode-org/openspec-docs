import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readBuiltPage(path) {
  return readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");
}

test("built upstream routes expose readable content and canonical URLs", async () => {
  const [zhHome, enHome, enGuide, enNested] = await Promise.all([
    readBuiltPage("index.html"),
    readBuiltPage("en-US/index.html"),
    readBuiltPage("en-US/getting-started/index.html"),
    readBuiltPage("en-US/stores-beta/user-guide/index.html"),
  ]);

  assert.match(zhHome, /<html lang="zh-CN"/u);
  assert.ok(zhHome.includes('<link rel="canonical" href="https://openspec.hagicode.com/"/>'));
  assert.match(enHome, /<html lang="en-US"/u);
  assert.ok(enHome.includes('<link rel="canonical" href="https://openspec.hagicode.com/en-US/"/>'));
  assert.match(enGuide, /<html lang="en-US"/u);
  assert.ok(enGuide.includes('<link rel="canonical" href="https://openspec.hagicode.com/en-US/getting-started/"/>'));
  assert.ok(enNested.includes('<link rel="canonical" href="https://openspec.hagicode.com/en-US/stores-beta/user-guide/"/>'));
  assert.match(enGuide, /This guide explains how OpenSpec works/u);
  assert.match(enNested, /store<\/strong> is the answer/u);
});

test("localized homepages and guides retain both HagiCode surfaces and the existing footer", async () => {
  const pages = [
    ["zh-CN", await readBuiltPage("index.html"), false],
    ["en-US", await readBuiltPage("en-US/index.html"), false],
    ["en-US", await readBuiltPage("en-US/getting-started/index.html"), true],
    ["en-US", await readBuiltPage("en-US/stores-beta/user-guide/index.html"), true],
  ];

  for (const [locale, html, hasPagination] of pages) {
    const endCard = html.indexOf("data-hagicode-end-card");
    const promotion = html.indexOf("data-hagicode-promotion");
    const footer = html.indexOf('<footer class="sl-flex site-footer');
    assert.ok(endCard >= 0 && endCard < promotion && promotion < footer);
    assert.ok(html.slice(endCard, promotion).includes('href="https://www.hagicode.com"'));
    assert.ok(html.slice(promotion, footer).includes('href="https://www.hagicode.com"'));
    assert.match(html, /data-promotion-dismiss[^>]*aria-label=/u);
    assert.match(html, /type="button"[^>]*data-promotion-dismiss/u);

    const footerMarkup = html.slice(footer, html.indexOf("</footer>", footer));
    assert.match(footerMarkup, /href="https:\/\/github\.com\/HagiCode-org\/openspec-docs"/u);
    assert.match(footerMarkup, /href="https:\/\/github\.com\/HagiCode-org\/openspec-docs\/issues"/u);
    if (hasPagination) assert.match(footerMarkup, /pagination/u);
    if (locale === "zh-CN") {
      assert.match(html.slice(endCard, promotion), /访问 HagiCode/u);
      assert.match(html.slice(promotion, footer), /关闭 HagiCode 推广/u);
    } else {
      assert.match(html.slice(endCard, promotion), /Visit HagiCode/u);
      assert.match(html.slice(promotion, footer), /Dismiss HagiCode promotion/u);
    }
  }
});

test("English topics are discoverable and language switching uses translation fallback", async () => {
  const [zhHome, enHome, enGuide] = await Promise.all([
    readBuiltPage("index.html"),
    readBuiltPage("en-US/index.html"),
    readBuiltPage("en-US/getting-started/index.html"),
  ]);

  assert.match(zhHome, /class="language-link[^"]*" href="\/en-US\/"/u);
  assert.match(enHome, /class="language-link[^"]*" href="\/"/u);
  assert.match(enGuide, /class="language-link[^"]*" href="\/"/u);
  const sidebarStart = enGuide.indexOf('<ul class="top-level');
  const sidebarEnd = enGuide.indexOf("</sl-sidebar-state-persist>", sidebarStart);
  const sidebar = enGuide.slice(sidebarStart, sidebarEnd);
  assert.match(sidebar, /href="\/en-US\/installation\/"/u);
  assert.match(sidebar, /href="\/en-US\/stores-beta\/user-guide\/"/u);
  assert.match(sidebar, /Getting Started/u);
  assert.match(zhHome, /aria-label="切换到英语"/u);
  assert.match(enGuide, /aria-label="Switch to Chinese"/u);
});

test("retired placeholder guides are neither published nor linked", async () => {
  await assert.rejects(readBuiltPage("guides/getting-started/index.html"), { code: "ENOENT" });
  await assert.rejects(readBuiltPage("en-US/guides/getting-started/index.html"), { code: "ENOENT" });

  async function readHtmlFiles(directory) {
    const { readdir } = await import("node:fs/promises");
    const entries = await readdir(new URL(`../dist/${directory}`, import.meta.url), { withFileTypes: true });
    const html = [];
    for (const entry of entries) {
      const relative = `${directory}/${entry.name}`;
      if (entry.isDirectory()) html.push(...await readHtmlFiles(relative));
      else if (entry.name.endsWith(".html")) html.push(await readBuiltPage(relative));
    }
    return html;
  }

  const pages = await readHtmlFiles("");
  assert.ok(pages.every((html) => !html.includes("/guides/getting-started/")));
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
