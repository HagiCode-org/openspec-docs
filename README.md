# OpenSpec Docs

An independently buildable Astro/Starlight site for OpenSpec documentation. English documentation is imported at build time from the pinned `Fission-AI/openspec` submodule; the Chinese home and reviewed translations remain site-owned.

## Local development

```bash
npm install
git submodule update --init --recursive
npm run dev
npm run check
npm run build
npm run preview
npm test
```

`dev`, `check`, and `build` import the pinned upstream `docs/**/*.md` files into the ignored `src/content/docs/en-US/` directory before starting Astro. The importer maps `docs/README.md` to the English home and preserves the upstream directory tree; Starlight renders directory levels as nested sidebar groups. Relative Markdown links and local assets are resolved, and missing or unsupported input fails with an actionable error. Generated content is replaced on every run; it is never used as a fallback when the submodule is unavailable.

`npm run check` also checks translation baselines. Run `npm test` after a build; the suite checks importer behavior, source contracts, and generated routes.

## Reviewing upstream updates

The `upstream/openspec` gitlink pins the exact source revision. Builds never fetch the latest branch. To review a candidate update:

```bash
git -C upstream/openspec fetch origin
git -C upstream/openspec log --oneline HEAD..origin/main
git -C upstream/openspec diff HEAD..origin/main -- docs/
git -C upstream/openspec checkout --detach <reviewed-commit>
npm run check
npm run build
npm test
```

Commit the new submodule pointer only after reviewing the source changes and generated site. CI and publication workflows check out submodules recursively, and publication remains gated on successful verification.

## GitHub Actions

The CI workflow runs for pull requests targeting `main`, pushes to `main`, and a weekly schedule. It uses the locked dependencies and the same commands as local verification:

```bash
npm ci
npm run check
npm run build
npm test
```

The publication workflow runs on pushes to `main` and can be started manually for `main`. It publishes the verified build with `esa.jsonc`, `wrangler.jsonc`, and `dist/` at the root of the `gh-pages` branch; manual runs selected for other branches are skipped. The deployment configs live in `.github/gh-pages/`. The build job is read-only, and only the publisher needs `contents: write`. In repository settings, allow Actions' `GITHUB_TOKEN` to write repository contents (`Settings > Actions > General > Workflow permissions`); organization policy must also permit this access.

Publishing the branch does not configure a host or change where `https://openspec.hagicode.com` is served from. Any hosting source, domain, and routing setup remains separate.

## Writing and localizing pages

The site offers ten languages: Simplified Chinese (`zh-CN`), English (`en-US`), Traditional Chinese (`zh-Hant`), Japanese (`ja-JP`), Korean (`ko-KR`), German (`de-DE`), French (`fr-FR`), Spanish (`es-ES`), Brazilian Portuguese (`pt-BR`), and Russian (`ru-RU`). Each language has a localized home and interface. Reviewed Simplified Chinese topics use the same paths as their English sources. For any configured non-English locale without an authored topic, the import creates an ignored English fallback at that locale's topic path. The page shows a localized notice and a canonical English-topic link, and marks the article body as `en-US` so it is not presented as translated.

The Starlight default locale is English at `/en-US/`. The site root `/` defaults to the English home on a first visit. An explicit language choice is stored in Starlight's `starlight-route` preference (`lang` field) and is used on later visits to `/`; a stored `root` value also means English on this site. If storage is blocked, language switching still works for the current visit. Explicit `/en-US/` and `/zh-CN/` URLs remain unchanged. The English home and topics are imported under `src/content/docs/en-US/`; do not edit those generated pages. Add or revise upstream English content in the upstream repository and review a new pinned revision here.

Keep reviewed translations in the corresponding site-owned locale path, using the same topic path as the English source. When reviewing a translation against upstream, add its locale/topic entry to `src/content/translation-baselines.json` with the source path, SHA-256, and reviewed upstream revision. Compute the source hash with `sha256sum upstream/openspec/docs/<source-file>`. `npm run check:translation-baselines` reports changed or removed sources and authored translations that have no baseline; generated fallbacks are excluded from this audit. Locale homes are shell content, not upstream topic translations, and do not need a baseline.

Authored non-English pages show an AI-translation notice by default. Review each translation against its English source and verify important details before publishing; the notice describes AI assistance, not translation accuracy. For content known to be entirely human-translated or written, opt out with `isAITranslation: false` in its frontmatter:

```yaml
---
title: "A human-authored page"
isAITranslation: false
---
```

Omitting `isAITranslation` keeps the notice enabled. English pages and generated English fallbacks are not labeled as translations; the existing fallback flag and notice remain unchanged.

Use site-root paths such as `/zh-CN/getting-started/` for links between translated topics so they resolve correctly from the published locale routes.

The importer tracks generated fallbacks in `src/content/docs/.generated-english-fallbacks.json`, refreshes them on each import, and removes only unchanged generated pages when an upstream topic is removed. To turn a generated fallback into an authored translation, remove its `isEnglishFallback` frontmatter flag, edit the content, add a reviewed baseline, and run `npm run import:english`; the importer then stops ignoring that path and preserves it for baseline auditing. The language chooser keeps the current topic when a translation or English source exists; it uses a locale home only for a topic with no source or matching translation.

When adding a locale, configure its Starlight route and document language in `astro.config.mjs`, add its Starlight UI strings under `src/content/i18n/`, add locale-keyed shell and fallback-notice copy in `src/i18n/site-copy.mjs`, and provide a localized home before exposing it in the language chooser. Add reviewed translated pages under the locale's content directory as they become available.

## HagiCode promotion

Every page renders a localized, server-rendered HagiCode introduction after its article content and before Starlight's metadata, pagination, and site footer. This article-end link points directly to `https://www.hagicode.com` and does not depend on JavaScript or remote promotion data.

The separate viewport-bottom banner starts with localized HagiCode fallback copy. Its client enhancement discovers `promotion-flags` and `promotion-content` through the HagiCode Index catalog, then uses the stable `/promote.json` and `/promote_content.json` endpoints if catalog discovery fails. It shows the first enabled, in-window campaign with matching, usable localized content; missing, invalid, or unavailable campaign data leaves the local fallback in place. Campaign data is fetched only in the browser, never during the static build.

The banner hides while the site footer intersects the viewport and can be dismissed independently of the article-end introduction. Dismissals are stored per campaign or fallback when browser storage is available and apply to the current page view when storage is blocked.

## Analytics and privacy

Copy `.env.example` to `.env` and set only identifiers owned by the OpenSpec documentation site:

- `PUBLIC_OPENSPEC_GA_ID` enables Google Analytics.
- `PUBLIC_OPENSPEC_51LA_ID` enables 51LA page tracking.

Either provider can be enabled independently; empty values disable tracking. Analytics scripts are emitted only in production builds and are requested only when the browser is on `openspec.hagicode.com`. A locally served production preview therefore does not send analytics requests. 51LA screen recording is disabled. Review applicable privacy and consent requirements before configuring production identifiers.
