const STORAGE_PREFIX = "hagicode:openspec-docs:promotion:dismissed:";

function storageKey(signature) {
  return `${STORAGE_PREFIX}${encodeURIComponent(signature)}`;
}

/**
 * @param {HTMLElement | null | undefined} root
 * @param {{
 *   loadPromotion?: () => Promise<{ id: string, title: string, description: string, ctaLabel: string, href: string, image?: { src: string, alt: string, width?: number, height?: number } | null } | null>,
 *   windowObject?: Window,
 *   documentObject?: Document,
 *   Observer?: typeof IntersectionObserver
 * }} options
 */
export function enhancePromotionCard(
  root,
  {
    loadPromotion,
    windowObject = globalThis.window,
    documentObject = root?.ownerDocument ?? globalThis.document,
    Observer = windowObject?.IntersectionObserver,
  } = {},
) {
  const title = /** @type {HTMLElement | null | undefined} */ (root?.querySelector("[data-promotion-title]"));
  const description = /** @type {HTMLElement | null | undefined} */ (root?.querySelector("[data-promotion-description]"));
  const visitLink = /** @type {HTMLAnchorElement | null | undefined} */ (root?.querySelector("[data-promotion-link]"));
  const dismissButton = /** @type {HTMLButtonElement | null | undefined} */ (root?.querySelector("[data-promotion-dismiss]"));
  const image = /** @type {HTMLImageElement | null | undefined} */ (root?.querySelector("[data-promotion-image]"));
  if (!root || !title || !description || !visitLink || !dismissButton || !image) return () => {};

  const dismissedThisPage = new Set();
  let footerIntersects = false;
  let observer;
  let onScroll;
  let onResize;

  function currentSignature() {
    return root.getAttribute("data-promotion-signature") ?? "fallback:hagicode";
  }

  image.addEventListener("error", () => {
    image.src = image.dataset.fallbackSrc ?? "/img/hagicode/light-main.png";
    image.alt = image.dataset.fallbackAlt ?? title.textContent ?? "";
  }, { once: true });

  function isDismissed(signature) {
    if (dismissedThisPage.has(signature)) return true;
    try {
      return windowObject?.localStorage?.getItem(storageKey(signature)) === "1";
    } catch {
      return false;
    }
  }

  function renderVisibility() {
    const hidden = footerIntersects || isDismissed(currentSignature());
    root.hidden = hidden;
    root.inert = hidden;
    root.setAttribute("aria-hidden", String(hidden));
  }

  function updateFooterVisibility() {
    const footer = documentObject?.querySelector("footer.site-footer");
    if (!footer || !windowObject) return;
    const bounds = footer.getBoundingClientRect();
    footerIntersects = bounds.top < windowObject.innerHeight && bounds.bottom > 0;
    renderVisibility();
  }

  dismissButton.addEventListener("click", () => {
    const signature = currentSignature();
    dismissedThisPage.add(signature);
    try {
      windowObject?.localStorage?.setItem(storageKey(signature), "1");
    } catch {
      // The in-memory set still dismisses this campaign for the current page view.
    }
    renderVisibility();
  });

  const footer = documentObject?.querySelector("footer.site-footer");
  if (footer && Observer) {
    observer = new Observer((entries) => {
      footerIntersects = Boolean(entries[0]?.isIntersecting);
      renderVisibility();
    }, { threshold: 0 });
    observer.observe(footer);
  } else if (footer && windowObject) {
    onScroll = updateFooterVisibility;
    onResize = updateFooterVisibility;
    windowObject.addEventListener("scroll", onScroll, { passive: true });
    windowObject.addEventListener("resize", onResize);
    updateFooterVisibility();
  }

  if (loadPromotion) {
    void loadPromotion().then((campaign) => {
      if (!campaign) return;
      title.textContent = campaign.title;
      description.textContent = campaign.description;
      visitLink.textContent = campaign.ctaLabel;
      visitLink.href = campaign.href;
      image.alt = campaign.image?.alt || campaign.title;
      if (campaign.image?.src) {
        image.src = campaign.image.src;
        if (campaign.image.width) image.width = campaign.image.width;
        if (campaign.image.height) image.height = campaign.image.height;
      }
      root.setAttribute("data-promotion-signature", `campaign:${campaign.id}`);
      renderVisibility();
    });
  }

  renderVisibility();
  return () => {
    observer?.disconnect();
    if (onScroll) windowObject?.removeEventListener("scroll", onScroll);
    if (onResize) windowObject?.removeEventListener("resize", onResize);
  };
}
