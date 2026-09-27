declare module "@hagicode/hagilight-starlight/ai-disclosure-schema" {
  import type { ZodBoolean, ZodObject, ZodOptional } from "astro/zod";

  export const aiDisclosureSchema: ZodObject<{
    isAITranslation: ZodOptional<ZodBoolean>;
    isAIAuthor: ZodOptional<ZodBoolean>;
  }>;
}

declare module "@hagicode/hagilight-starlight/article-promotion-schema" {
  import type { ZodBoolean, ZodObject, ZodOptional } from "astro/zod";

  export const articlePromotionSchema: ZodObject<{
    hagicodePromotion: ZodOptional<ZodBoolean>;
  }>;
}
