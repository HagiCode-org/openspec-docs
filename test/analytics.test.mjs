import assert from "node:assert/strict";
import test from "node:test";
import { getAnalyticsIdentifiers } from "../src/lib/analytics-config.mjs";
import { initializeAnalytics } from "../src/lib/analytics-client.mjs";

function createBrowser() {
  const scripts = [];
  const browser = {
    dataLayer: [],
    document: {
      createElement: () => ({}),
      head: {
        appendChild: (script) => scripts.push(script),
      },
    },
    location: { hostname: "openspec.hagicode.com" },
  };

  return { browser, scripts };
}

test("analytics identifiers are opt-in and production-only", () => {
  assert.equal(getAnalyticsIdentifiers(false, "ga-example", "la-example"), undefined);
  assert.equal(getAnalyticsIdentifiers(true), undefined);
  assert.deepEqual(getAnalyticsIdentifiers(true, "ga-example"), {
    googleId: "ga-example",
    fiftyOneLaId: "",
  });
  assert.deepEqual(getAnalyticsIdentifiers(true, "", "la-example"), {
    googleId: "",
    fiftyOneLaId: "la-example",
  });
  assert.deepEqual(getAnalyticsIdentifiers(true, " ga-example ", " la-example "), {
    googleId: "ga-example",
    fiftyOneLaId: "la-example",
  });
});

test("no configured identifiers means no analytics requests", () => {
  const { browser, scripts } = createBrowser();
  initializeAnalytics({ hostname: browser.location.hostname }, browser);
  assert.equal(scripts.length, 0);
});

test("development and local production previews never request analytics", () => {
  for (const hostname of ["localhost", "127.0.0.1", "preview.example.test"]) {
    const { browser, scripts } = createBrowser();
    initializeAnalytics({ hostname, googleId: "ga-example", fiftyOneLaId: "la-example" }, browser);
    assert.equal(scripts.length, 0, `${hostname} does not load providers`);
  }
});

test("each production provider is independently configured and initialized once", () => {
  const { browser, scripts } = createBrowser();
  initializeAnalytics(
    { hostname: browser.location.hostname, googleId: "ga-example", fiftyOneLaId: "la-example" },
    browser,
  );
  initializeAnalytics(
    { hostname: browser.location.hostname, googleId: "ga-example", fiftyOneLaId: "la-example" },
    browser,
  );

  assert.equal(scripts.length, 2);
  assert.match(scripts[0].src, /googletagmanager\.com\/gtag\/js\?id=ga-example/u);
  assert.equal(scripts[1].src, "https://sdk.51.la/js-sdk-pro.min.js");
  assert.equal(browser.dataLayer.at(-1)[0], "config");
  assert.equal(browser.dataLayer.at(-1)[1], "ga-example");

  let laConfig;
  browser.LA = { init: (config) => { laConfig = config; } };
  scripts[1].onload();
  assert.deepEqual(laConfig, {
    id: "la-example",
    ck: "la-example",
    autoTrack: true,
    hashMode: true,
    screenRecord: false,
  });
});

test("one missing production identifier leaves the other provider enabled", () => {
  const { browser, scripts } = createBrowser();
  initializeAnalytics({ hostname: browser.location.hostname, fiftyOneLaId: "la-example" }, browser);
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, "https://sdk.51.la/js-sdk-pro.min.js");
});

test("Google Analytics works without a 51LA identifier", () => {
  const { browser, scripts } = createBrowser();
  initializeAnalytics({ hostname: browser.location.hostname, googleId: "ga-example" }, browser);
  assert.equal(scripts.length, 1);
  assert.match(scripts[0].src, /googletagmanager\.com\/gtag\/js\?id=ga-example/u);
});
