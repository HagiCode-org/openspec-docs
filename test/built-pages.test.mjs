import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { LANGUAGE_OPTIONS, SITE_COPY } from "../src/i18n/site-copy.mjs";
import { SUPPORTED_LOCALES } from "../src/lib/locale-navigation.mjs";

async function readBuiltPage(path) {
  return readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");
}

test("localized RSS feeds and the all-language feed are published", async () => {
  const [home, englishFeed, allLanguagesFeed] = await Promise.all([
    readBuiltPage("en-US/index.html"),
    readFile(new URL("../dist/rss.xml", import.meta.url), "utf8"),
    readFile(new URL("../dist/rss.all.xml", import.meta.url), "utf8"),
  ]);
  assert.match(home, /rel="alternate"[^>]*type="application\/rss\+xml"[^>]*href="https:\/\/openspec\.hagicode\.com\/rss\.xml"/u);
  assert.match(englishFeed, /<language>en-US<\/language>/u);
  const englishItems = [...englishFeed.matchAll(/<item>([\s\S]*?)<\/item>/gu)].map(([, item]) => item);
  assert.ok(englishItems.length > 0);
  assert.ok(englishItems.every((item) => item.includes("https://openspec.hagicode.com/en-US/")));

  const items = [...allLanguagesFeed.matchAll(/<item>([\s\S]*?)<\/item>/gu)].map(([, item]) => item);
  assert.match(allLanguagesFeed, /<language>und<\/language>/u);
  assert.ok(items.length > 0);
  assert.ok(items.every((item) => {
    const link = item.match(/<link>([^<]+)<\/link>/u)?.[1] ?? '';
    const locale = new URL(link).pathname.split('/')[1];
    return LANGUAGE_OPTIONS.some(({ code }) => code === locale)
      && link.startsWith(`https://openspec.hagicode.com/${locale}/`)
      && !item.includes('<language>');
  }));
  for (const { code } of LANGUAGE_OPTIONS) {
    const filename = code === "en-US" ? "en" : code;
    const localeFeed = await readFile(new URL(`../dist/rss.${filename}.xml`, import.meta.url), "utf8");
    assert.match(localeFeed, new RegExp(`<language>${code}</language>`, "u"));
    const localeItems = [...localeFeed.matchAll(/<item>([\s\S]*?)<\/item>/gu)].map(([, item]) => item);
    assert.ok(localeItems.length > 0);
    assert.ok(localeItems.every((item) => item.includes(`https://openspec.hagicode.com/${code}/`)));
  }
});

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
  assert.match(enHome, /"@type":"Organization","name":"HagiCode"/u);
  assert.match(enGuide, /<html lang="en-US"/u);
  assert.ok(enGuide.includes('<link rel="canonical" href="https://openspec.hagicode.com/en-US/getting-started/"/>'));
  assert.match(enGuide, /"@type":"BreadcrumbList"/u);
  assert.match(enGuide, /<meta property="og:description"/u);
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

test("English fallbacks retain English language semantics", async () => {
  const [pageTitle, markdownContent] = await Promise.all([
    readFile(new URL("../src/components/EnglishFallbackPageTitle.astro", import.meta.url), "utf8"),
    readFile(new URL("../src/components/EnglishFallbackMarkdownContent.astro", import.meta.url), "utf8"),
  ]);

  assert.match(pageTitle, /isFallback \? <div lang="en-US">/u);
  assert.match(pageTitle, /<ContentLayoutToggle \/>/u);
  assert.match(markdownContent, /isFallback && \(/u);
  assert.match(markdownContent, /isFallback \? <div lang="en-US">/u);
  assert.match(markdownContent, /isAITranslation: !isFallback/u);
  assert.match(markdownContent, /<HagilightMarkdownContent aiDisclosures=\{aiDisclosures\}>/u);
});

test("localized authored pages use Hagilight's localized AI translation notice after the article", async () => {
  const homePages = await Promise.all(SUPPORTED_LOCALES.map(async (locale) => [
    locale,
    await readBuiltPage(`${locale}/index.html`),
  ]));

  for (const [locale, html] of homePages) {
    const notices = [...html.matchAll(/<aside class="hagilight-ai-disclosure" role="note">[\s\S]*?<\/aside>/gu)];
    if (locale === "en-US") {
      assert.equal(notices.length, 0);
      continue;
    }

    assert.equal(notices.length, 1, `${locale} home has one translation notice`);
    const notice = notices[0][0];
    assert.ok(notice.includes('href="/en-US/"'));

    const noticeStart = notices[0].index;
    const bodyStart = html.indexOf('class="sl-markdown-content');
    assert.ok(bodyStart >= 0 && bodyStart < noticeStart, `${locale} notice follows article content`);
  }

  const [zhTopic, enTopic, enHome, jaTopic] = await Promise.all([
    readBuiltPage("zh-CN/overview/index.html"),
    readBuiltPage("en-US/overview/index.html"),
    readBuiltPage("en-US/index.html"),
    readBuiltPage("ja-JP/writing-specs/index.html"),
  ]);
  assert.equal((zhTopic.match(/<aside class="hagilight-ai-disclosure"/gu) ?? []).length, 1);
  assert.ok(zhTopic.includes("本文由 AI 翻译。"));
  assert.ok(zhTopic.includes('href="/en-US/overview/"'));
  assert.equal((enTopic.match(/<aside class="hagilight-ai-disclosure"/gu) ?? []).length, 0);
  assert.equal((enHome.match(/<aside class="hagilight-ai-disclosure"/gu) ?? []).length, 0);
  assert.equal((jaTopic.match(/<aside class="hagilight-ai-disclosure"/gu) ?? []).length, 1);
  assert.ok(jaTopic.includes("この記事は AI によって翻訳されました。"));
  assert.ok(!jaTopic.includes(SITE_COPY["ja-JP"].englishFallbackNotice));
  assert.match(jaTopic, /<main[^>]*lang="ja-JP"/u);
  assert.doesNotMatch(jaTopic, /<div lang="en-US"/u);
});

test("AI translation notice styling comes from Hagilight", async () => {
  const [docsStyles, hagilightStyles] = await Promise.all([
    readFile(new URL("../src/styles/site.css", import.meta.url), "utf8"),
    readFile(new URL("../node_modules/@hagicode/hagilight-starlight/content-width.css", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(docsStyles, /ai-translation-notice/u);
  assert.match(hagilightStyles, /\.hagilight-ai-disclosure\s*\{/u);
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

test("localized homes receive scoped styling and retain their existing documentation links", async () => {
  const [css, topic] = await Promise.all([
    readFile(new URL("../src/styles/site.css", import.meta.url), "utf8"),
    readBuiltPage("en-US/getting-started/index.html"),
  ]);

  for (const locale of SUPPORTED_LOCALES) {
    const home = await readBuiltPage(`${locale}/index.html`);
    assert.match(home, /class="[^"]*\bdocumentation-home-marker\b[^"]*"/u, `${locale} home has the style marker`);
  }

  const [chineseHome, englishHome] = await Promise.all([
    readBuiltPage("zh-CN/index.html"),
    readBuiltPage("en-US/index.html"),
  ]);
  assert.ok(chineseHome.includes('href="/zh-CN/getting-started/"'));
  assert.ok(englishHome.includes('href="/en-US/getting-started/"'));
  assert.doesNotMatch(topic, /documentation-home-marker/u);
  assert.match(css, /\.sl-markdown-content:has\(> \.documentation-home-marker\)/u);
  assert.match(css, /:focus-visible/u);
  assert.match(css, /@media \(max-width: 30rem\)/u);
});

test("localized pages use the shared shell, Hagilight article promotion, and banner", async () => {
  const pages = await Promise.all([
    ...SUPPORTED_LOCALES.map(async (locale) => [locale, await readBuiltPage(`${locale}/index.html`), false]),
    ["en-US", await readBuiltPage("en-US/getting-started/index.html"), true],
    ["en-US", await readBuiltPage("en-US/stores-beta/user-guide/index.html"), true],
    ["zh-CN", await readBuiltPage("zh-CN/overview/index.html"), true],
    ["ja-JP", await readBuiltPage("ja-JP/getting-started/index.html"), true],
  ]);

  const config = await readFile(new URL("../astro.config.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(config, /\b(?:overrides|extraLinks):/u);

  for (const [locale, html, hasPagination] of pages) {
    assert.equal(html.split("data-hagilight-content-width-choice=").length - 1, 2, `${locale} has both width choices`);
    if (locale !== "en-US") {
      assert.ok(html.includes(`/rss.${locale}.xml`), `${locale} links its current-language feed`);
    }
    const headerStart = html.indexOf('<header class="header');
    const headerEnd = html.indexOf("</header>", headerStart);
    assert.ok(headerStart >= 0 && headerEnd > headerStart);
    const headerMarkup = html.slice(headerStart, headerEnd);
    assert.match(headerMarkup, /aria-label="Site navigation"/u);
    assert.match(headerMarkup, /<site-search/u);
    assert.match(headerMarkup, /hagilight-language-chooser/u);
    assert.match(headerMarkup, /<starlight-theme-select/u);
    assert.ok(headerMarkup.includes('href="https://github.com/HagiCode-org/openspec-docs"'));

    const articlePromotion = html.indexOf('class="hagilight-article-promotion ');
    const promotion = html.indexOf("<hagilight-promoto-banner");
    const promotionEnd = html.indexOf("</hagilight-promoto-banner>", promotion);
    const pagination = html.indexOf("pagination-links");
    const footer = html.indexOf("hagilight-site-links");
    assert.ok(articlePromotion > html.indexOf('class="sl-markdown-content'));
    assert.ok(articlePromotion < promotion && promotion < promotionEnd);
    assert.ok(footer >= 0 && footer < promotion);
    if (hasPagination) assert.ok(articlePromotion < pagination && pagination < footer);
    assert.equal(html.split("<hagilight-promoto-banner").length - 1, 1);
    assert.equal(html.split('class="hagilight-article-promotion ').length - 1, 1);
    const articlePromotionMarkup = html.slice(articlePromotion, promotion);
    const promotionMarkup = html.slice(promotion, promotionEnd);
    assert.ok(articlePromotionMarkup.includes('href="https://www.hagicode.com/"'));
    assert.match(articlePromotionMarkup, /<img/u);
    assert.match(articlePromotionMarkup, /<li\b/u);
    assert.match(promotionMarkup, /data-promoto-track/u);
    assert.match(promotionMarkup, /data-promoto-dismiss[^>]*aria-label="Dismiss promotion"/u);
    assert.match(promotionMarkup, /data-locale="/u);
    assert.doesNotMatch(promotionMarkup, /data-fallback=/u);
    assert.doesNotMatch(promotionMarkup, /\/img\/hagicode\/light-main\.png/u);

    const footerMarkup = html.slice(footer);
    assert.match(footerMarkup, /href="https:\/\/newbe\.hagicode\.com\/"/u);
    assert.match(footerMarkup, /©\s+\d{4}\s+HagiCode/u);
  }
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
    const chooserStart = html.indexOf("<hagilight-language-chooser");
    const dialogStart = html.indexOf("<dialog", chooserStart);
    const dialogEnd = html.indexOf("</dialog>", dialogStart);
    const dialog = html.slice(dialogStart, dialogEnd + "</dialog>".length);
    assert.ok(chooserStart >= 0 && dialogStart > chooserStart && dialogEnd > dialogStart);
    assert.equal((dialog.match(/role="option"/gu) ?? []).length, 10);
    assert.equal((dialog.match(/aria-selected="true"/gu) ?? []).length, 1);
    assert.ok(dialog.includes(`data-locale="${locale}"`));
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
    const chooserStart = html.indexOf("<hagilight-language-chooser");
    const dialogStart = html.indexOf("<dialog", chooserStart);
    const dialogEnd = html.indexOf("</dialog>", dialogStart);
    const dialog = html.slice(dialogStart, dialogEnd + "</dialog>".length);
    const options = [...dialog.matchAll(/<button\b[^>]*role="option"[^>]*>/gu)].map(([option]) => option);
    assert.equal(options.length, 10);
    assert.ok(options.some((option) =>
      option.includes(`data-locale="${activeLocale}"`) && option.includes('aria-selected="true"'),
    ));
    for (const locale of SUPPORTED_LOCALES) {
      const target = html === enGuide ? `data-href="/${locale}/getting-started/"` : `data-href="/${locale}/"`;
      assert.ok(dialog.includes(target));
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
  assert.match(zhHome, /aria-label="选择语言: 简体中文"/u);
  assert.match(enGuide, /aria-label="Select language: English"/u);

  for (const pagePath of await listBuiltHtml("")) {
    if (pagePath.endsWith("404.html")) continue;
    const html = await readBuiltPage(pagePath);
    for (const [, href] of html.matchAll(/data-href="([^"]+)"/gu)) {
      await stat(builtFileForUrl(new URL(href, "https://openspec.hagicode.com")));
    }
  }
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

test("built production pages load each Hagilight analytics provider once", async () => {
  const html = await readBuiltPage("zh-CN/index.html");
  assert.equal((html.match(/googletagmanager\.com\/gtag\/js\?id=G-EN03FMT2Q4/gu) ?? []).length, 1);
  assert.equal((html.match(/sdk\.51\.la\/js-sdk-pro\.min\.js/gu) ?? []).length, 1);
  assert.doesNotMatch(html, /data-openspec-analytics/u);
});

test("mobile menu keeps native locale selection and the shared chooser is keyboard-accessible", async () => {
  const [html, header, languageChooser, languageRouting] = await Promise.all([
    readBuiltPage("zh-CN/index.html"),
    readFile(new URL("../node_modules/@hagicode/hagilight-starlight/Header.astro", import.meta.url), "utf8"),
    readFile(new URL("../node_modules/@hagicode/hagilight-starlight/LanguageChooser.astro", import.meta.url), "utf8"),
    readFile(new URL("../node_modules/@hagicode/hagilight-starlight/language-routing.mjs", import.meta.url), "utf8"),
  ]);

  assert.match(html, /<button popovertarget="starlight__sidebar"[^>]*>[\s\S]*?<\/button>/u);
  assert.equal((html.match(/<hagilight-language-chooser\b/gu) ?? []).length, 1);
  assert.match(html, /<starlight-lang-select>/u);
  assert.match(header, /sl-hidden md:sl-flex print:hidden right-group/u);
  assert.match(header, /@media \(max-width: 72rem\)/u);
  assert.match(header, /header-links\s*\{\s*display:\s*none/u);
  assert.match(html, /language-trigger[^>]*aria-haspopup="dialog"/u);
  assert.match(languageChooser, /aria-modal="true"/u);
  assert.match(languageChooser, /dialog\.showModal\(\)/u);
  assert.match(languageRouting, /case 'ArrowDown'[\s\S]*case 'ArrowUp'[\s\S]*case 'Home'[\s\S]*case 'End'/u);
  assert.match(languageChooser, /dialog\.addEventListener\('close'[\s\S]*trigger\.focus\(\)/u);
  assert.match(languageChooser, /persistStarlightLocaleSelection\(locale\)/u);
  assert.match(languageChooser, /target\.search = window\.location\.search/u);
  assert.match(languageChooser, /target\.hash = window\.location\.hash/u);
  assert.match(languageChooser, /@media \(max-width: 50rem\)/u);
});
