import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import hagilight from "@hagicode/hagilight-starlight";
import { SITE_COPY } from "./src/i18n/site-copy.mjs";

const localizedCopy = (key) => Object.fromEntries(
  Object.entries(SITE_COPY).map(([locale, copy]) => [locale, copy[key]]),
);
const productDocsUrls = Object.fromEntries(
  Object.keys(SITE_COPY).map((locale) => [
    locale,
    `https://docs.hagicode.com/${locale === "zh-CN" ? "" : `${locale}/`}`,
  ]),
);
const docsRepo = "https://github.com/HagiCode-org/openspec-docs";

export default defineConfig({
  site: "https://openspec.hagicode.com",
  base: "/",
  integrations: [
    starlight({
      title: "OpenSpec Docs",
      description: "OpenSpec documentation",
      defaultLocale: "en-US",
      locales: {
        "zh-CN": {
          label: "简体中文",
          lang: "zh-CN",
        },
        "en-US": {
          label: "English",
          lang: "en-US",
        },
        "zh-Hant": {
          label: "繁體中文",
          lang: "zh-Hant",
        },
        "ja-JP": {
          label: "日本語",
          lang: "ja-JP",
        },
        "ko-KR": {
          label: "한국어",
          lang: "ko-KR",
        },
        "de-DE": {
          label: "Deutsch",
          lang: "de-DE",
        },
        "fr-FR": {
          label: "Français",
          lang: "fr-FR",
        },
        "es-ES": {
          label: "Español",
          lang: "es-ES",
        },
        "pt-BR": {
          label: "Português (Brasil)",
          lang: "pt-BR",
        },
        "ru-RU": {
          label: "Русский",
          lang: "ru-RU",
        },
      },
      components: {
        Head: "./src/components/StarlightHead.astro",
        MarkdownContent: "./src/components/EnglishFallbackMarkdownContent.astro",
        PageTitle: "./src/components/EnglishFallbackPageTitle.astro",
      },
      customCss: ["./src/styles/site.css"],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/HagiCode-org/openspec-docs",
        },
      ],
      plugins: [
        hagilight({
          links: {
            siteId: "openspec-docs",
            siteUrl: "https://openspec.hagicode.com/",
            relatedSites: [{
              id: "hagicode-main",
              name: localizedCopy("websiteLabel"),
              url: "https://www.hagicode.com/",
              supportsLocalePath: true,
            }],
            overrides: {
              home: { label: localizedCopy("websiteLabel") },
              productDocs: {
                label: localizedCopy("productDocsLabel"),
                href: productDocsUrls,
              },
              github: {
                label: localizedCopy("sourceLabel"),
                href: docsRepo,
                external: true,
              },
              issueFeedback: {
                label: localizedCopy("issuesLabel"),
                href: `${docsRepo}/issues`,
                external: true,
              },
            },
            extraLinks: {
              header: [{
                label: localizedCopy("productDocsLabel"),
                href: productDocsUrls,
                external: true,
              }],
              quick: [
                {
                  label: localizedCopy("hagiTaskLabel"),
                  href: "https://tasks.hagicode.com/",
                  external: true,
                },
                {
                  label: localizedCopy("openSpecSourceLabel"),
                  href: "https://github.com/Fission-AI/OpenSpec",
                  external: true,
                },
              ],
            },
          },
          promoto: { enabled: false },
          analytics: {
            googleAnalytics: { enabled: false },
            fiftyOneLa: { enabled: false },
          },
          aiDisclosures: {
            isAITranslation: false,
            isAIAuthor: false,
            sourceLocale: "en-US",
          },
          contentComponents: {
            pageTitle: false,
            markdownContent: false,
          },
        }),
      ],
    }),
    sitemap(),
  ],
});
