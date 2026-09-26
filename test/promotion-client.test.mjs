import assert from "node:assert/strict";
import test from "node:test";
import { enhancePromotionCard } from "../src/lib/promotion-client.mjs";

class MockElement {
  constructor(attributes = {}) {
    this.attributes = new Map(Object.entries(attributes));
    this.listeners = new Map();
    this.children = new Map();
    this.hidden = false;
    this.inert = false;
    this.textContent = "";
  }

  querySelector(selector) {
    return this.children.get(selector) ?? null;
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  addEventListener(name, callback) {
    this.listeners.set(name, callback);
  }

  click() {
    this.listeners.get("click")?.();
  }
}

function setup({ storage = new Map(), blockedStorage = false, footerBounds = { top: 900, bottom: 1100 } } = {}) {
  const title = new MockElement();
  const description = new MockElement();
  const link = new MockElement();
  const dismiss = new MockElement();
  const footer = { getBoundingClientRect: () => footerBounds };
  const root = new MockElement({ "data-promotion-signature": "fallback:hagicode" });
  root.children.set("[data-promotion-title]", title);
  root.children.set("[data-promotion-description]", description);
  root.children.set("[data-promotion-link]", link);
  root.children.set("[data-promotion-dismiss]", dismiss);
  const documentObject = { querySelector: () => footer };
  const windowObject = {
    innerHeight: 800,
    addEventListener() {},
    removeEventListener() {},
  };
  Object.defineProperty(windowObject, "localStorage", {
    get() {
      if (blockedStorage) throw new Error("storage blocked");
      return {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
      };
    },
  });

  let observerCallback;
  class MockObserver {
    constructor(callback) {
      observerCallback = callback;
    }
    observe() {}
    disconnect() {}
  }

  const cleanup = enhancePromotionCard(root, {
    windowObject,
    documentObject,
    Observer: MockObserver,
  });
  return {
    root,
    title,
    description,
    link,
    dismiss,
    storage,
    notifyFooter: (isIntersecting) => observerCallback([{ isIntersecting }]),
    cleanup,
  };
}

test("hides and disables the promotion while the footer intersects", () => {
  const page = setup();
  assert.equal(page.root.hidden, false);
  page.notifyFooter(true);
  assert.equal(page.root.hidden, true);
  assert.equal(page.root.inert, true);
  assert.equal(page.root.getAttribute("aria-hidden"), "true");
  page.notifyFooter(false);
  assert.equal(page.root.hidden, false);
  assert.equal(page.root.inert, false);
  page.cleanup();
});

test("persists dismissal per campaign and allows another campaign to appear", async () => {
  const page = setup();
  page.dismiss.click();
  assert.equal(page.root.hidden, true);
  assert.equal(page.storage.get("hagicode:openspec-docs:promotion:dismissed:fallback%3Ahagicode"), "1");

  const nextPage = setup({ storage: page.storage });
  assert.equal(nextPage.root.hidden, true);

  const campaignPage = setup({
    storage: page.storage,
  });
  const complete = enhancePromotionCard(campaignPage.root, {
    windowObject: {
      innerHeight: 800,
      localStorage: {
        getItem: (key) => campaignPage.storage.get(key) ?? null,
        setItem: (key, value) => campaignPage.storage.set(key, value),
      },
    },
    documentObject: { querySelector: () => null },
    loadPromotion: async () => ({
      id: "launch",
      title: "Launch",
      description: "Campaign copy",
      ctaLabel: "Learn more",
      href: "https://example.com/launch",
    }),
  });
  await Promise.resolve();
  assert.equal(campaignPage.root.hidden, false);
  assert.equal(campaignPage.root.getAttribute("data-promotion-signature"), "campaign:launch");
  assert.equal(campaignPage.title.textContent, "Launch");
  assert.equal(campaignPage.link.href, "https://example.com/launch");
  complete();
});

test("keeps dismissal effective for the page view when storage is blocked", () => {
  const page = setup({ blockedStorage: true });
  page.dismiss.click();
  assert.equal(page.root.hidden, true);
  page.cleanup();
});

test("keeps the static fallback visible when a remote campaign is unavailable", async () => {
  const page = setup();
  const cleanup = enhancePromotionCard(page.root, {
    documentObject: { querySelector: () => null },
    loadPromotion: async () => null,
  });
  await Promise.resolve();
  assert.equal(page.root.hidden, false);
  assert.equal(page.root.getAttribute("data-promotion-signature"), "fallback:hagicode");
  cleanup();
});
