const ENGLISH_LOCALE = "en-US";

function normalizeTopicPath(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] === ENGLISH_LOCALE ? ENGLISH_LOCALE : "root";
  const topicSegments = locale === ENGLISH_LOCALE ? segments.slice(1) : segments;
  const topicPath = topicSegments.at(-1) === "index" ? topicSegments.slice(0, -1) : topicSegments;

  return { locale, topic: topicPath.join("/") };
}

function normalizeEntryId(id) {
  const segments = id.replace(/\.(md|mdx)$/u, "").split("/").filter(Boolean);
  const locale = segments[0] === ENGLISH_LOCALE ? ENGLISH_LOCALE : "root";
  const topicSegments = locale === ENGLISH_LOCALE ? segments.slice(1) : segments;
  const topicPath = topicSegments.at(-1) === "index" ? topicSegments.slice(0, -1) : topicSegments;

  return { locale, topic: topicPath.join("/") };
}

export function getLocaleHref(pathname, targetLocale, publishedIds) {
  const { topic } = normalizeTopicPath(pathname);
  const hasTranslation = publishedIds.some((id) => {
    const entry = normalizeEntryId(id);
    return entry.locale === targetLocale && entry.topic === topic;
  });

  if (!topic || !hasTranslation) {
    return targetLocale === ENGLISH_LOCALE ? "/en-US/" : "/";
  }

  return `/${targetLocale === ENGLISH_LOCALE ? `${ENGLISH_LOCALE}/` : ""}${topic}/`;
}
