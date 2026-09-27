import { LANGUAGE_OPTIONS } from "../i18n/site-copy.mjs";

export const SUPPORTED_LOCALES = LANGUAGE_OPTIONS.map(({ code }) => code);

export const LANGUAGE_PREFERENCE_KEY = "starlight-route";

function localeFromSegments(segments) {
  const locale = SUPPORTED_LOCALES.find((code) => code === segments[0]);
  return locale ?? "en-US";
}

function normalizeTopicSegments(segments) {
  return segments.at(-1) === "index" ? segments.slice(0, -1) : segments;
}

function normalizeTopicPath(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  const hasLocalePrefix = SUPPORTED_LOCALES.includes(segments[0]);
  const locale = localeFromSegments(segments);
  const topicSegments = hasLocalePrefix ? segments.slice(1) : segments;

  return { locale, topic: normalizeTopicSegments(topicSegments).join("/") };
}

function normalizeEntryId(id) {
  const segments = id.replace(/\.(md|mdx)$/u, "").split("/").filter(Boolean);
  const hasLocalePrefix = SUPPORTED_LOCALES.includes(segments[0]);
  const locale = localeFromSegments(segments);
  const topicSegments = hasLocalePrefix ? segments.slice(1) : segments;

  return { locale, topic: normalizeTopicSegments(topicSegments).join("/") };
}

export function getLocaleHref(pathname, targetLocale, publishedIds) {
  if (!SUPPORTED_LOCALES.includes(targetLocale)) {
    throw new RangeError(`Unsupported locale: ${targetLocale}`);
  }

  const { topic } = normalizeTopicPath(pathname);
  const hasTranslation = publishedIds.some((id) => {
    const entry = normalizeEntryId(id);
    return entry.locale === targetLocale && entry.topic === topic;
  });

  if (!topic || !hasTranslation) return `/${targetLocale}/`;
  return `/${targetLocale}/${topic}/`;
}

export function getEnglishTopicHref(pathname) {
  const { topic } = normalizeTopicPath(pathname);
  return topic ? `/en-US/${topic}/` : "/en-US/";
}

export function getPublishedEnglishTopicHref(pathname, publishedIds) {
  const { topic } = normalizeTopicPath(pathname);
  const hasEnglishSource = publishedIds.some((id) => {
    const entry = normalizeEntryId(id);
    return entry.locale === "en-US" && entry.topic === topic;
  });

  return hasEnglishSource ? getEnglishTopicHref(pathname) : null;
}

export function shouldShowAITranslationNotice(locale, isEnglishFallback, isAITranslation) {
  return SUPPORTED_LOCALES.includes(locale)
    && locale !== "en-US"
    && isEnglishFallback !== true
    && isAITranslation !== false;
}

export function preserveUrlContext(href, currentUrl) {
  const targetUrl = new URL(href, currentUrl);
  targetUrl.search = currentUrl.search;
  targetUrl.hash = currentUrl.hash;
  return targetUrl.toString();
}

export function getPreferredLocale(storageValue) {
  if (typeof storageValue !== "string" || storageValue.length === 0) return null;

  let preference;
  try {
    preference = JSON.parse(storageValue);
  } catch {
    return null;
  }

  if (!preference || typeof preference !== "object" || Array.isArray(preference)) return null;
  if (preference.lang === "root") return "en-US";
  return SUPPORTED_LOCALES.includes(preference.lang) ? preference.lang : null;
}

export function serializeLocalePreference(storageValue, locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) {
    throw new RangeError(`Unsupported locale: ${locale}`);
  }

  let preference = {};
  if (typeof storageValue === "string" && storageValue.length > 0) {
    try {
      const parsed = JSON.parse(storageValue);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) preference = parsed;
    } catch {
      preference = {};
    }
  }

  return JSON.stringify({ ...preference, lang: locale });
}

export function readLocalePreference(storage) {
  try {
    return getPreferredLocale(storage.getItem(LANGUAGE_PREFERENCE_KEY));
  } catch {
    return null;
  }
}

export function writeLocalePreference(storage, locale) {
  try {
    const currentValue = storage.getItem(LANGUAGE_PREFERENCE_KEY);
    storage.setItem(LANGUAGE_PREFERENCE_KEY, serializeLocalePreference(currentValue, locale));
    return true;
  } catch {
    return false;
  }
}

export function readBrowserLocalePreference() {
  try {
    return getPreferredLocale(localStorage.getItem(LANGUAGE_PREFERENCE_KEY));
  } catch {
    return null;
  }
}

export function writeBrowserLocalePreference(locale) {
  try {
    return writeLocalePreference(localStorage, locale);
  } catch {
    return false;
  }
}
