const PRODUCTION_HOSTNAME = "openspec.hagicode.com";

function appendScript(documentRef, id, src) {
  const script = documentRef.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  documentRef.head.appendChild(script);
  return script;
}

export function initializeAnalytics({ hostname, googleId = "", fiftyOneLaId = "" }, browser) {
  if (hostname !== PRODUCTION_HOSTNAME || !browser) return;

  browser.__openspecAnalyticsLoaded ??= new Set();

  if (googleId && !browser.__openspecAnalyticsLoaded.has("google")) {
    browser.__openspecAnalyticsLoaded.add("google");
    browser.dataLayer ??= [];
    browser.gtag ??= (...args) => browser.dataLayer.push(args);
    browser.gtag("js", new Date());
    browser.gtag("config", googleId);
    appendScript(
      browser.document,
      "openspec-google-analytics",
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleId)}`,
    );
  }

  if (fiftyOneLaId && !browser.__openspecAnalyticsLoaded.has("51la")) {
    browser.__openspecAnalyticsLoaded.add("51la");
    const script = appendScript(browser.document, "openspec-51la-analytics", "https://sdk.51.la/js-sdk-pro.min.js");
    script.onload = () => {
      browser.LA?.init({
        id: fiftyOneLaId,
        ck: fiftyOneLaId,
        autoTrack: true,
        hashMode: true,
        screenRecord: false,
      });
    };
  }
}
