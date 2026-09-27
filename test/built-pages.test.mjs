import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { LANGUAGE_OPTIONS, SITE_COPY } from "../src/i18n/site-copy.mjs";
import {
  getPublishedEnglishTopicHref,
  shouldShowAITranslationNotice,
  SUPPORTED_LOCALES,
} from "../src/lib/locale-navigation.mjs";

async function readBuiltPage(path) {
  return readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");
}

async function listBuiltHtml(directory) {
  const entries = await readdir(new URL(`../dist/${directory}`, import.meta.url), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listBuiltHtml(relative));
    else if (entry.name.endsWith(".html")) files.push(relative);
  }
  return files;
}

function builtFileForUrl(url) {
  let relative = decodeURIComponent(url.pathname).replace(/^\/+/u, "");
  if (!relative || relative.endsWith("/") || !path.posix.extname(relative)) {
    relative = path.posix.join(relative, "index.html");
  }
  return new URL(`../dist/${relative}`, import.meta.url);
}

test("built upstream routes expose English, authored Chinese, and reviewed locale articles", async () => {
  const [zhHome, zhOverview, enHome, enGuide, enNested, jaGuide] = await Promise.all([
    readBuiltPage("zh-CN/index.html"),
    readBuiltPage("zh-CN/overview/index.html"),
    readBuiltPage("en-US/index.html"),
    readBuiltPage("en-US/getting-started/index.html"),
    readBuiltPage("en-US/stores-beta/user-guide/index.html"),
    readBuiltPage("ja-JP/getting-started/index.html"),
  ]);

  assert.match(zhHome, /<html lang="zh-CN"/u);
  assert.ok(zhHome.includes('<link rel="canonical" href="https://openspec.hagicode.com/zh-CN/"/>'));
  assert.match(zhOverview, /<html lang="zh-CN"/u);
  assert.match(zhOverview, /<main[^>]*lang="zh-CN"/u);
  assert.doesNotMatch(zhOverview, /尚无简体中文译文/u);
  assert.match(zhOverview, /<h1[^>]*>[^<]*[\u3400-\u9fff]/u);
  assert.doesNotMatch(zhOverview, /This page is the whole mental model on one screen/u);
  assert.match(enHome, /<html lang="en-US"/u);
  assert.ok(enHome.includes('<link rel="canonical" href="https://openspec.hagicode.com/en-US/"/>'));
  assert.match(enGuide, /<html lang="en-US"/u);
  assert.ok(enGuide.includes('<link rel="canonical" href="https://openspec.hagicode.com/en-US/getting-started/"/>'));
  assert.ok(enNested.includes('<link rel="canonical" href="https://openspec.hagicode.com/en-US/stores-beta/user-guide/"/>'));
  assert.match(enGuide, /This guide explains how OpenSpec works/u);
  assert.match(enNested, /store<\/strong> is the answer/u);
  assert.match(jaGuide, /<html lang="ja-JP"/u);
  assert.match(jaGuide, /<main[^>]*lang="ja-JP"/u);
  assert.match(jaGuide, /<h1[^>]*>[^<]*[\u3040-\u30ff]/u);
  assert.doesNotMatch(jaGuide, /This guide explains how OpenSpec works/u);
  assert.ok(!jaGuide.includes(SITE_COPY["ja-JP"].englishFallbackNotice));
  assert.ok(jaGuide.includes('<link rel="canonical" href="https://openspec.hagicode.com/ja-JP/getting-started/"/>'));
});

test("localized authored pages show a localized AI translation notice below the title", async () => {
  const homePages = await Promise.all(SUPPORTED_LOCALES.map(async (locale) => [
    locale,
    await readBuiltPage(`${locale}/index.html`),
  ]));

  for (const [locale, html] of homePages) {
    const notices = [...html.matchAll(/<aside class="ai-translation-notice"[\s\S]*?<\/aside>/gu)];
    if (locale === "en-US") {
      assert.equal(notices.length, 0);
      continue;
    }

    assert.equal(notices.length, 1, `${locale} home has one translation notice`);
    const copy = SITE_COPY[locale].translationNotice;
    const notice = notices[0][0];
    assert.ok(notice.includes(copy.label));
    assert.ok(notice.includes(copy.title));
    assert.ok(notice.includes(copy.description));
    assert.ok(notice.includes(copy.viewOriginal));
    assert.ok(notice.includes('href="/en-US/"'));

    const titleEnd = html.indexOf("</h1>");
    const noticeStart = notices[0].index;
    const noticeEnd = noticeStart + notice.length;
    const bodyStart = html.indexOf('class="sl-markdown-content', noticeEnd);
    assert.ok(titleEnd >= 0 && titleEnd < noticeStart, `${locale} notice follows the title`);
    assert.ok(bodyStart > noticeEnd, `${locale} notice precedes article content`);
  }

  const [zhTopic, enTopic, enHome, jaTopic] = await Promise.all([
    readBuiltPage("zh-CN/overview/index.html"),
    readBuiltPage("en-US/overview/index.html"),
    readBuiltPage("en-US/index.html"),
    readBuiltPage("ja-JP/writing-specs/index.html"),
  ]);
  assert.equal((zhTopic.match(/<aside class="ai-translation-notice"/gu) ?? []).length, 1);
  assert.ok(zhTopic.includes(SITE_COPY["zh-CN"].translationNotice.title));
  assert.ok(zhTopic.includes('href="/en-US/overview/"'));
  assert.equal((enTopic.match(/<aside class="ai-translation-notice"/gu) ?? []).length, 0);
  assert.equal((enHome.match(/<aside class="ai-translation-notice"/gu) ?? []).length, 0);
  assert.equal((jaTopic.match(/<aside class="ai-translation-notice"/gu) ?? []).length, 1);
  assert.ok(jaTopic.includes(SITE_COPY["ja-JP"].translationNotice.title));
  assert.ok(!jaTopic.includes(SITE_COPY["ja-JP"].englishFallbackNotice));
  assert.match(jaTopic, /<main[^>]*lang="ja-JP"/u);
  assert.doesNotMatch(jaTopic, /<div lang="en-US"/u);
});

test("translation notice eligibility and English source links use published routes", () => {
  assert.equal(shouldShowAITranslationNotice("zh-CN", false, undefined), true);
  assert.equal(shouldShowAITranslationNotice("en-US", false, undefined), false);
  assert.equal(shouldShowAITranslationNotice("ja-JP", true, undefined), false);
  assert.equal(shouldShowAITranslationNotice("zh-CN", false, false), false);
  assert.equal(shouldShowAITranslationNotice("xx-XX", false, undefined), false);

  assert.equal(
    getPublishedEnglishTopicHref("/zh-CN/overview/", ["en-US/overview.md"]),
    "/en-US/overview/",
  );
  assert.equal(
    getPublishedEnglishTopicHref("/zh-CN/unpublished/", ["zh-CN/unpublished.md"]),
    null,
  );
  assert.equal(getPublishedEnglishTopicHref("/zh-CN/", ["en-US/index.md"]), "/en-US/");
});

test("translation notice styles use theme tokens with responsive spacing and visible focus", async () => {
  const styles = await readFile(new URL("../src/styles/site.css", import.meta.url), "utf8");
  assert.match(styles, /\.ai-translation-notice[\s\S]*?var\(--sl-color-bg-sidebar\)/u);
  assert.match(styles, /\.ai-translation-notice__title\s*\{[^}]*color:\s*var\(--sl-color-text\)/u);
  assert.match(styles, /@media \(max-width: 42rem\)\s*\{[\s\S]*?\.ai-translation-notice[\s\S]*?padding:/u);
  assert.match(styles, /\.ai-translation-notice__link:focus-visible\s*\{[^}]*outline: 2px solid var\(--sl-color-text-accent\)/u);
});

test("root entry defaults to English, honors saved locales, and has a no-script link", async () => {
  const root = await readBuiltPage("index.html");
  const chineseHome = await readBuiltPage("zh-CN/index.html");
  const entrySource = await readFile(new URL("../src/pages/index.astro", import.meta.url), "utf8");

  assert.doesNotMatch(root, /http-equiv="refresh"/u);
  assert.match(root, /href="\/en-US\/">Continue to the OpenSpec documentation/u);
  assert.match(entrySource, /readBrowserLocalePreference\(\)\s*\?\?\s*"en-US"/u);
  assert.match(entrySource, /preserveUrlContext/u);
  assert.match(entrySource, /window\.location\.replace\(target\)/u);
  assert.match(chineseHome, /<html lang="zh-CN"/u);
  assert.ok(chineseHome.includes('<link rel="canonical" href="https://openspec.hagicode.com/zh-CN/"/>'));
});

test("localized homepages and guides retain both HagiCode surfaces and the existing footer", async () => {
  const pages = await Promise.all([
    ...SUPPORTED_LOCALES.map(async (locale) => [locale, await readBuiltPage(`${locale}/index.html`), false]),
    ["en-US", await readBuiltPage("en-US/getting-started/index.html"), true],
    ["en-US", await readBuiltPage("en-US/stores-beta/user-guide/index.html"), true],
    ["zh-CN", await readBuiltPage("zh-CN/overview/index.html"), true],
    ["ja-JP", await readBuiltPage("ja-JP/getting-started/index.html"), true],
  ]);

  for (const [locale, html, hasPagination] of pages) {
    const copy = SITE_COPY[locale];
    const productDocsUrl = `https://docs.hagicode.com/${locale === "zh-CN" ? "" : `${locale}/`}`;
    const headerStart = html.indexOf('<header class="header');
    const headerEnd = html.indexOf("</header>", headerStart);
    assert.ok(headerStart >= 0 && headerEnd > headerStart);
    const headerMarkup = html.slice(headerStart, headerEnd);
    assert.ok(headerMarkup.includes('href="https://www.hagicode.com/"'));
    assert.ok(headerMarkup.includes(productDocsUrl));
    assert.ok(headerMarkup.includes(copy.websiteLabel));
    assert.ok(headerMarkup.includes(copy.productDocsLabel));
    assert.ok(headerMarkup.includes(copy.websiteCompactLabel));
    assert.ok(headerMarkup.includes(copy.productDocsCompactLabel));
    assert.ok(headerMarkup.includes(`aria-label="${copy.websiteLabel}"`));
    assert.ok(headerMarkup.includes(`aria-label="${copy.productDocsLabel}"`));
    assert.match(headerMarkup, /<site-search/u);
    assert.match(headerMarkup, /data-language-chooser/u);
    assert.match(headerMarkup, /<starlight-theme-select/u);
    assert.ok(headerMarkup.includes('href="https://github.com/HagiCode-org/openspec-docs"'));

    const endCard = html.indexOf("data-hagicode-end-card");
    const promotion = html.indexOf("data-hagicode-promotion");
    const footer = html.indexOf('<footer class="sl-flex site-footer');
    assert.ok(endCard >= 0 && endCard < promotion && promotion < footer);
    const endCardMarkup = html.slice(endCard, promotion);
    const promotionMarkup = html.slice(promotion, footer);
    assert.ok(endCardMarkup.includes('href="https://www.hagicode.com"'));
    assert.ok(endCardMarkup.includes(copy.hagicodeLead));
    assert.match(endCardMarkup, /data-hagicode-feature/u);
    assert.match(endCardMarkup, /\/img\/hagicode\/light-main\.png/u);
    assert.ok(endCardMarkup.includes(copy.hagicodeVisitLabel));
    assert.match(promotionMarkup, /data-promotion-image/u);
    assert.match(promotionMarkup, /\/img\/hagicode\/light-main\.png/u);
    assert.ok(promotionMarkup.includes('href="https://www.hagicode.com"'));
    assert.match(html, /data-promotion-dismiss[^>]*aria-label=/u);
    assert.match(html, /type="button"[^>]*data-promotion-dismiss/u);
    assert.ok(promotionMarkup.includes(copy.promoteCloseLabel));

    const footerMarkup = html.slice(footer, html.indexOf("</footer>", footer));
    assert.ok(footerMarkup.includes('href="https://www.hagicode.com/"'));
    assert.ok(footerMarkup.includes(productDocsUrl));
    assert.ok(footerMarkup.includes('href="https://tasks.hagicode.com/"'));
    assert.ok(footerMarkup.includes(copy.websiteLabel));
    assert.ok(footerMarkup.includes(copy.productDocsLabel));
    assert.ok(footerMarkup.includes(copy.hagiTaskLabel));
    assert.ok(footerMarkup.includes('href="/zh-CN/"'));
    assert.ok(footerMarkup.includes('href="/en-US/"'));
    assert.ok(footerMarkup.includes('href="https://github.com/Fission-AI/OpenSpec"'));
    assert.ok(footerMarkup.includes(copy.openSpecSourceLabel));
    assert.match(footerMarkup, /href="https:\/\/github\.com\/HagiCode-org\/openspec-docs"/u);
    assert.match(footerMarkup, /href="https:\/\/github\.com\/HagiCode-org\/openspec-docs\/issues"/u);
    assert.ok(footerMarkup.includes(copy.footerLabel));
    assert.ok(footerMarkup.includes(copy.copyright));
    if (hasPagination) assert.match(footerMarkup, /pagination/u);
  }
});

test("built site includes the local HagiCode preview image", async () => {
  const image = await readFile(new URL("../dist/img/hagicode/light-main.png", import.meta.url));
  assert.ok(image.byteLength > 0);
});

test("translated documentation routes and in-page references resolve in the built site", async () => {
  const brokenLinks = [];
  for (const locale of SUPPORTED_LOCALES.filter((code) => code !== "en-US")) {
    const pages = await listBuiltHtml(locale);
    const headingIds = new Map();

    for (const pagePath of pages) {
      const html = await readBuiltPage(pagePath);
      const pageUrl = new URL(`/${pagePath.replace(/index\.html$/u, "")}`, "https://openspec.hagicode.com");
      const mainStart = html.indexOf("<main");
      const mainEnd = html.indexOf("</main>", mainStart);
      assert.ok(mainStart >= 0 && mainEnd >= 0, `${pagePath} has no article main element`);
      const article = html.slice(mainStart, mainEnd + "</main>".length);
      const footerStart = article.indexOf('<footer class="sl-flex site-footer');
      const pageContent = footerStart < 0 ? article : article.slice(0, footerStart);
      assert.match(article, new RegExp(`<main[^>]*lang="${locale}"`, "u"), `${pagePath} has localized article metadata`);
      const ids = new Set([...article.matchAll(/\bid="([^"]+)"/gu)].map(([, id]) => id));
      headingIds.set(pageUrl.pathname, ids);

      for (const [, href] of pageContent.matchAll(/\bhref="([^"]+)"/gu)) {
        const target = new URL(href.replaceAll("&amp;", "&"), pageUrl);
        if (target.origin !== pageUrl.origin) continue;
        const targetsAnotherTranslation = SUPPORTED_LOCALES.some((otherLocale) =>
          otherLocale !== locale
          && otherLocale !== "en-US"
          && target.pathname.startsWith(`/${otherLocale}/`));
        if (targetsAnotherTranslation) {
          brokenLinks.push(`${pagePath}: internal topic link leaves ${locale}: ${href}`);
        }
        const targetFile = builtFileForUrl(target);
        try {
          await stat(targetFile);
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
          brokenLinks.push(`${pagePath}: ${href}`);
          continue;
        }
        if (target.hash && targetFile.pathname.endsWith(".html")) {
          let targetIds = headingIds.get(target.pathname);
          if (!targetIds) {
            const targetHtml = await readFile(targetFile, "utf8");
            const targetMainStart = targetHtml.indexOf("<main");
            const targetMainEnd = targetHtml.indexOf("</main>", targetMainStart);
            const targetArticle = targetHtml.slice(targetMainStart, targetMainEnd + "</main>".length);
            targetIds = new Set([...targetArticle.matchAll(/\bid="([^"]+)"/gu)].map(([, id]) => id));
            headingIds.set(target.pathname, targetIds);
          }
          if (!targetIds.has(decodeURIComponent(target.hash.slice(1)))) {
            brokenLinks.push(`${pagePath}: ${href}`);
          }
        }
      }
    }
  }
  assert.deepEqual(brokenLinks, []);
});

test("all locales have localized homes and the chooser offers valid translated or home routes", async () => {
  const homePages = await Promise.all(SUPPORTED_LOCALES.map((locale) => readBuiltPage(`${locale}/index.html`)));
  const [zhHome, enHome, enGuide] = await Promise.all([
    readBuiltPage("zh-CN/index.html"),
    readBuiltPage("en-US/index.html"),
    readBuiltPage("en-US/getting-started/index.html"),
  ]);

  assert.equal(LANGUAGE_OPTIONS.length, 10);
  assert.deepEqual(LANGUAGE_OPTIONS.map(({ code }) => code), SUPPORTED_LOCALES);
  const missingTopicMessages = {
    "zh-Hant": "尚未翻譯為繁體中文",
    "ja-JP": "まだ日本語に翻訳されていません",
    "ko-KR": "아직 한국어로 번역되지 않았습니다",
    "de-DE": "noch nicht ins Deutsche übersetzt",
    "fr-FR": "n’ont pas encore été traduites",
    "es-ES": "todavía no se han traducido",
    "pt-BR": "ainda não foram traduzidas",
    "ru-RU": "ещё не переведена на русский",
  };

  for (const [index, locale] of SUPPORTED_LOCALES.entries()) {
    const html = homePages[index];
    assert.match(html, new RegExp(`<html lang="${locale}"`, "u"));
    assert.ok(html.includes(SITE_COPY[locale].dialogTitle));
    assert.ok(html.includes(SITE_COPY[locale].languageLabel));
    if (missingTopicMessages[locale]) {
      assert.ok(html.includes(missingTopicMessages[locale]));
      const article = await readBuiltPage(`${locale}/getting-started/index.html`);
      assert.match(article, new RegExp(`<main[^>]*lang="${locale}"`, "u"));
      assert.ok(!article.includes(SITE_COPY[locale].englishFallbackNotice));
      assert.doesNotMatch(article, /<div lang="en-US"/u);
    }
  }

  for (const [html, activeLocale] of [[enHome, "en-US"], [zhHome, "zh-CN"], [enGuide, "en-US"]]) {
    const dialogs = [...html.matchAll(/<dialog class="language-dialog[\s\S]*?<\/dialog>/gu)];
    assert.equal(dialogs.length, 2);
    for (const dialogMatch of dialogs) {
      const dialog = dialogMatch[0];
      assert.equal((dialog.match(/data-language-option/gu) ?? []).length, 10);
      assert.equal((dialog.match(/aria-current="page"/gu) ?? []).length, 1);
      const activeLink = dialog.match(/<a\b(?=[^>]*data-language-option)(?=[^>]*aria-current="page")[^>]*>/u)?.[0];
      assert.ok(activeLink?.includes(`data-locale="${activeLocale}"`));
      for (const option of LANGUAGE_OPTIONS) {
        assert.ok(dialog.includes(`hreflang="${option.lang}" lang="${option.lang}"`));
      }
    }
    const firstDialog = dialogs[0][0];
    for (const locale of SUPPORTED_LOCALES) {
      const target = html === enGuide ? `/${locale}/getting-started/` : `/${locale}/`;
      assert.ok(firstDialog.includes(`href="${target}"`));
    }
  }

  assert.match(zhHome, /href="\/en-US\/"/u);
  assert.match(enHome, /href="\/zh-CN\/"/u);
  assert.match(enGuide, /href="\/zh-CN\/getting-started\/"/u);
  const sidebarStart = enGuide.indexOf('<ul class="top-level');
  const sidebarEnd = enGuide.indexOf("</sl-sidebar-state-persist>", sidebarStart);
  const sidebar = enGuide.slice(sidebarStart, sidebarEnd);
  assert.match(sidebar, /href="\/en-US\/installation\/"/u);
  assert.match(sidebar, /href="\/en-US\/stores-beta\/user-guide\/"/u);
  assert.match(sidebar, /Getting Started/u);
  assert.match(sidebar, /<span class="large[^>]*>stores-beta<\/span>/u);
  assert.match(zhHome, /aria-label="选择语言"/u);
  assert.match(enGuide, /aria-label="Choose a language"/u);
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

test("mobile menu retains one visible chooser and responsive keyboard focus styles", async () => {
  const [html, header, styles, chooser] = await Promise.all([
    readBuiltPage("zh-CN/index.html"),
    readFile(new URL("../src/components/StarlightHeader.astro", import.meta.url), "utf8"),
    readFile(new URL("../src/styles/site.css", import.meta.url), "utf8"),
    readFile(new URL("../src/components/StarlightLanguageSelect.astro", import.meta.url), "utf8"),
  ]);

  assert.match(html, /<button popovertarget="starlight__sidebar"[^>]*>[\s\S]*?<\/button>/u);
  assert.equal((html.match(/data-language-chooser/gu) ?? []).length, 2);
  assert.match(header, /StarlightLanguageSelect/u);
  assert.match(header, /related-links a:focus-visible/u);
  assert.match(header, /@media \(max-width: 50rem\)[\s\S]*--sl-nav-height: 6\.5rem;[\s\S]*"links links"/u);
  assert.match(header, /@media \(max-width: 30rem\)[\s\S]*"links search"/u);
  assert.match(header, /\.wide-label\s*\{\s*display:\s*none/u);
  assert.match(header, /\.compact-label\s*\{\s*display:\s*inline/u);
  assert.match(html, /language-trigger[^>]*aria-haspopup="dialog"/u);
  assert.match(chooser, /<noscript>/u);
  assert.match(chooser, /case "ArrowDown"[\s\S]*case "ArrowUp"[\s\S]*case "Home"[\s\S]*case "End"/u);
  assert.match(chooser, /dialog\.addEventListener\("close"[\s\S]*trigger\.focus\(\)/u);
  assert.match(chooser, /writeBrowserLocalePreference\(targetLocale\);[\s\S]*window\.location\.assign\(targetUrl\)/u);
  assert.match(chooser, /calc\(100vw - 2rem\)/u);
  assert.match(styles, /@media \(max-width: 30rem\)/u);
  assert.match(styles, /\.mobile-preferences \.language-control\s*\{\s*display:\s*none/u);
});
