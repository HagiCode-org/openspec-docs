const INDEX_ORIGIN = "https://index.hagicode.com";
const CATALOG_URL = `${INDEX_ORIGIN}/index-catalog.json`;
const FALLBACK_FLAGS_URL = `${INDEX_ORIGIN}/promote.json`;
const FALLBACK_CONTENT_URL = `${INDEX_ORIGIN}/promote_content.json`;

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

async function readJson(fetchImpl, url) {
  const response = await fetchImpl(url, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Promotion request failed (${response.status}): ${url}`);
  return response.json();
}

function resolveCatalogPath(path) {
  if (!nonEmptyString(path)) return null;
  try {
    const url = new URL(path.trim(), INDEX_ORIGIN);
    if (url.protocol !== "https:" || url.origin !== INDEX_ORIGIN) return null;
    return url.href;
  } catch {
    return null;
  }
}

export async function resolvePromotionEndpoints(fetchImpl = globalThis.fetch) {
  try {
    const catalog = await readJson(fetchImpl, CATALOG_URL);
    const entries = isRecord(catalog) && Array.isArray(catalog.entries) ? catalog.entries : [];
    const flagsEntry = entries.find((entry) => isRecord(entry) && entry.id === "promotion-flags");
    const contentEntry = entries.find((entry) => isRecord(entry) && entry.id === "promotion-content");
    const flagsUrl = isRecord(flagsEntry) ? resolveCatalogPath(flagsEntry.path) : null;
    const contentUrl = isRecord(contentEntry) ? resolveCatalogPath(contentEntry.path) : null;
    if (flagsUrl && contentUrl) return { flagsUrl, contentUrl, source: "catalog" };
  } catch {
    // The stable endpoints remain available when catalog discovery fails.
  }

  return {
    flagsUrl: FALLBACK_FLAGS_URL,
    contentUrl: FALLBACK_CONTENT_URL,
    source: "fallback",
  };
}

function localizedText(value, locale) {
  if (!isRecord(value)) return null;
  const keys = locale === "root" || locale?.toLowerCase().startsWith("zh")
    ? ["zh-CN", "zh", "zh-Hans", "en-US", "en"]
    : ["en-US", "en", "zh-CN", "zh"];
  for (const key of keys) {
    if (nonEmptyString(value[key])) return value[key].trim();
  }
  for (const candidate of Object.values(value)) {
    if (nonEmptyString(candidate)) return candidate.trim();
  }
  return null;
}

function scheduleTime(value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || value.trim().length === 0) return null;
  return Date.parse(value);
}

function isWithinSchedule(flag, now) {
  if (flag.on !== true) return false;
  const start = scheduleTime(flag.startTime);
  const end = scheduleTime(flag.endTime);
  if ((start !== null && !Number.isFinite(start)) || (end !== null && !Number.isFinite(end))) return false;
  if (start !== null && end !== null && start >= end) return false;
  return !(start !== null && now < start) && !(end !== null && now >= end);
}

function safeDestination(value) {
  if (!nonEmptyString(value)) return null;
  try {
    const url = new URL(value.trim(), INDEX_ORIGIN);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.href;
  } catch {
    return null;
  }
}

function campaignImage(value, title, fallbackAlt) {
  const srcValue = nonEmptyString(value)
    ? value
    : isRecord(value)
      ? value.src ?? value.url ?? value.imageUrl
      : null;
  if (!nonEmptyString(srcValue)) return null;
  let src;
  try {
    const url = new URL(srcValue.trim(), INDEX_ORIGIN);
    if (url.protocol !== "https:") return null;
    src = url.href;
  } catch {
    return null;
  }

  const dimension = (candidate) =>
    typeof candidate === "number" && Number.isFinite(candidate) && candidate > 0
      ? Math.round(candidate)
      : undefined;
  return {
    src,
    alt: isRecord(value) && nonEmptyString(value.alt)
      ? value.alt.trim()
      : nonEmptyString(fallbackAlt)
        ? fallbackAlt.trim()
        : title,
    width: isRecord(value) ? dimension(value.width) : undefined,
    height: isRecord(value) ? dimension(value.height) : undefined,
  };
}

function parseCampaigns(flagsPayload, contentPayload, locale, now) {
  if (!isRecord(flagsPayload) || !Array.isArray(flagsPayload.promotes)) return [];
  if (!isRecord(contentPayload) || !Array.isArray(contentPayload.contents)) return [];
  const campaigns = new Map();
  for (const content of contentPayload.contents) {
    if (isRecord(content) && nonEmptyString(content.id) && !campaigns.has(content.id.trim())) {
      campaigns.set(content.id.trim(), content);
    }
  }

  const ctaFallback = locale === "root" || locale?.toLowerCase().startsWith("zh")
    ? "访问"
    : "Visit";
  const selected = [];
  for (const flag of flagsPayload.promotes) {
    if (!isRecord(flag) || !nonEmptyString(flag.id) || !isWithinSchedule(flag, now)) continue;
    const content = campaigns.get(flag.id.trim());
    if (!content) continue;
    const title = localizedText(content.title, locale);
    const description = localizedText(content.description, locale);
    const href = safeDestination(content.link);
    if (!title || !description || !href) continue;
    selected.push({
      id: flag.id.trim(),
      title,
      description,
      ctaLabel: localizedText(content.cta, locale) ?? ctaFallback,
      href,
      image: campaignImage(content.image ?? content.imageUrl ?? content.imageURL, title, content.imageAlt),
    });
  }
  return selected;
}

export async function loadFirstPromotion({ locale = "root", fetchImpl = globalThis.fetch, now = Date.now() } = {}) {
  try {
    const { flagsUrl, contentUrl } = await resolvePromotionEndpoints(fetchImpl);
    const [flags, content] = await Promise.all([
      readJson(fetchImpl, flagsUrl),
      readJson(fetchImpl, contentUrl),
    ]);
    return parseCampaigns(flags, content, locale, now)[0] ?? null;
  } catch {
    return null;
  }
}
