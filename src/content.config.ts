import { defineCollection } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema, i18nSchema } from "@astrojs/starlight/schema";
import { i18nLoader } from "@astrojs/starlight/loaders";
import { articlePromotionSchema } from "@hagicode/hagilight-starlight/article-promotion-schema";
import { aiDisclosureSchema } from "@hagicode/hagilight-starlight/ai-disclosure-schema";
import { rssSchema } from "@hagicode/hagilight-starlight/rss-schema";
import { seoSchema } from "@hagicode/hagilight-starlight/seo-schema";
import { z } from "astro/zod";

function generateDocumentId({ entry }: { entry: string }) {
  const segments = entry.replace(/\.[^./]+$/u, "").split("/");
  if (segments[0]?.toLowerCase() === "en-us") {
    segments[0] = "en-US";
  }
  return segments.join("/");
}

export const collections = {
  docs: defineCollection({
    loader: docsLoader({ generateId: generateDocumentId }),
    schema: docsSchema({
      extend: z.object({ isEnglishFallback: z.boolean().optional() })
        .extend(aiDisclosureSchema.shape)
        .extend(articlePromotionSchema.shape)
        .extend(rssSchema.shape)
        .extend(seoSchema.shape),
    }),
  }),
  i18n: defineCollection({
    loader: i18nLoader(),
    schema: i18nSchema(),
  }),
};
