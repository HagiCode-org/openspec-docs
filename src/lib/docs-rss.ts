import { generateRssFeed } from "@hagicode/hagilight/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { LANGUAGE_OPTIONS } from "../i18n/site-copy.mjs";

type FeedLocale = (typeof LANGUAGE_OPTIONS)[number]["code"];

export async function getDocsRssResponse(context: APIContext, scope: FeedLocale | "all" = "all") {
  if (!context.site) throw new Error("The Astro site URL is required to generate the RSS feed.");

  const supportedLocales = new Set<string>(LANGUAGE_OPTIONS.map(({ code }) => code));
  const docs = await getCollection("docs", ({ id, data }) => {
    const [locale, ...segments] = id.split("/");
    return supportedLocales.has(locale)
      && segments.join("/") !== "index"
      && !data.isEnglishFallback
      && (scope === "all" || locale === scope);
  });

  return generateRssFeed({
    title: scope === "all" ? "OpenSpec Docs" : `OpenSpec Docs (${scope})`,
    description: "OpenSpec documentation updates",
    site: context.site,
    language: scope === "all" ? "und" : scope,
    items: docs.sort((a, b) => a.id.localeCompare(b.id)).map((doc) => {
      const [locale] = doc.id.split("/");
      const path = doc.id.replace(/\/index$/u, "");
      return {
        title: doc.data.title,
        description: doc.data.description ?? doc.data.title,
        link: `/${path}/`,
      };
    }),
  });
}
