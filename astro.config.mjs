import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import hagilight from "@hagicode/hagilight-starlight";
import { locales as hagilightLocales } from "@hagicode/hagilight-starlight/locales";

export default defineConfig({
  site: "https://openspec.hagicode.com",
  base: "/",
  integrations: [
    starlight({
      title: "OpenSpec Docs",
      description: "OpenSpec documentation",
      defaultLocale: "en-US",
      locales: Object.fromEntries(
        Object.values(hagilightLocales).map((locale) => [locale.lang, locale]),
      ),
      components: {
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
          },
          aiDisclosures: {
            isAITranslation: true,
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
