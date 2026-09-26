import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://openspec.hagicode.com",
  base: "/",
  integrations: [
    starlight({
      title: "OpenSpec Docs",
      description: "OpenSpec documentation",
      defaultLocale: "root",
      locales: {
        root: {
          label: "简体中文",
          lang: "zh-CN",
        },
        "en-US": {
          label: "English",
          lang: "en-US",
        },
      },
      components: {
        Head: "./src/components/StarlightHead.astro",
        Header: "./src/components/StarlightHeader.astro",
        Footer: "./src/components/StarlightFooter.astro",
        LanguageSelect: "./src/components/StarlightLanguageSelect.astro",
      },
      customCss: ["./src/styles/site.css"],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/HagiCode-org/openspec-docs",
        },
      ],
    }),
    sitemap(),
  ],
});
