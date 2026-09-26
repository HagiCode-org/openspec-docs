import { checkTranslationBaselines } from "./upstream-docs.mjs";

const result = await checkTranslationBaselines();
console.log(`Translation baselines are current (${result.checkedTranslations} reviewed topics).`);
