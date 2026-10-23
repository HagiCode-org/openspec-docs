import { locales as HAGILIGHT_LOCALES } from "@hagicode/hagilight-starlight/locales";

export const LANGUAGE_OPTIONS = [
  ...Object.values(HAGILIGHT_LOCALES).map(({ lang, label }) => ({ code: lang, label, lang })),
];

/**
 * @template {Record<string, unknown>} T
 * @param {string} locale
 * @param {T} copy
 * @returns {{ lang: string, languageLabel: string } & T}
 */
function localizedCopy(locale, copy) {
  const option = LANGUAGE_OPTIONS.find(({ code }) => code === locale);
  if (!option) throw new RangeError(`Unsupported locale: ${locale}`);
  return { lang: option.lang, languageLabel: option.label, ...copy };
}

export const SITE_COPY = {
  "zh-CN": localizedCopy("zh-CN", {
    englishFallbackNotice: "该主题尚无简体中文译文，目前显示英文原文。",
    englishFallbackLinkLabel: "阅读英文原文",
  }),
  "en-US": localizedCopy("en-US", {
    englishFallbackNotice: "This topic has not been translated yet; the English original is shown.",
    englishFallbackLinkLabel: "Read the English original",
  }),
  "zh-Hant": localizedCopy("zh-Hant", {
    englishFallbackNotice: "此主題尚無繁體中文譯文，目前顯示英文原文。",
    englishFallbackLinkLabel: "閱讀英文原文",
  }),
  "ja-JP": localizedCopy("ja-JP", {
    englishFallbackNotice: "このトピックはまだ日本語に翻訳されていないため、英語の原文を表示しています。",
    englishFallbackLinkLabel: "英語の原文を読む",
  }),
  "ko-KR": localizedCopy("ko-KR", {
    englishFallbackNotice: "이 항목은 아직 한국어로 번역되지 않아 영어 원문을 표시합니다.",
    englishFallbackLinkLabel: "영어 원문 읽기",
  }),
  "de-DE": localizedCopy("de-DE", {
    englishFallbackNotice: "Dieses Thema ist noch nicht ins Deutsche übersetzt; angezeigt wird das englische Original.",
    englishFallbackLinkLabel: "Englisches Original lesen",
  }),
  "fr-FR": localizedCopy("fr-FR", {
    englishFallbackNotice: "Ce sujet n’est pas encore traduit en français ; la version anglaise est affichée.",
    englishFallbackLinkLabel: "Lire l’original anglais",
  }),
  "es-ES": localizedCopy("es-ES", {
    englishFallbackNotice: "Este tema aún no está traducido al español; se muestra el original en inglés.",
    englishFallbackLinkLabel: "Leer el original en inglés",
  }),
  "pt-BR": localizedCopy("pt-BR", {
    englishFallbackNotice: "Este tópico ainda não foi traduzido para português; o original em inglês está sendo exibido.",
    englishFallbackLinkLabel: "Ler o original em inglês",
  }),
  "ru-RU": localizedCopy("ru-RU", {
    englishFallbackNotice: "Эта тема ещё не переведена на русский; отображается английский оригинал.",
    englishFallbackLinkLabel: "Читать оригинал на английском",
  }),
};

/**
 * @param {string | undefined} locale
 * @returns {locale is keyof typeof SITE_COPY}
 */
export function isSiteLocale(locale) {
  return typeof locale === "string" && LANGUAGE_OPTIONS.some(({ code }) => code === locale);
}
