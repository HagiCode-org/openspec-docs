# OpenSpec Docs — Agent Guide

Independently buildable Astro/Starlight site for OpenSpec documentation. English docs are imported at build time from a pinned upstream submodule; the Chinese home and reviewed translations are site-owned. Read this before editing or building.

## Scope and ownership

- Package `@hagicode/openspec-docs` (private). Built with Astro + Starlight; shared shell from `@hagicode/hagilight` / `@hagicode/hagilight-starlight` pinned to `0.2.2` (the compatibility boundary — do not bump casually).
- This repository is **documentation-maintenance scope only** for agent edits: modify `AGENTS.md` as instructed. Treat source, generated, and cache files as read-only unless the user expands scope.

## Commands

```sh
git submodule update --init --recursive   # required before first build (upstream/openspec)
npm install
npm run dev                  # import:english + astro dev
npm run build                # import:english + astro build
npm run preview              # serve the production build
npm run check                # import:english + check:translation-baselines + astro check
npm run check:translation-baselines     # audit reviewed translations
npm test                    # node --test test/*.test.mjs
```

Before a pull request: `npm run check`, `npm run build`, `npm test`.

## Architecture

- `upstream/openspec/` — git submodule (Fission-AI/openspec) pinned to an exact source revision; builds never fetch the latest branch.
- `scripts/import-upstream-docs.mjs` → `upstream-docs.mjs` (import `docs/**/*.md`, map `docs/README.md` to English home, preserve tree, resolve links/assets, fail on missing/unsupported input), `english-fallbacks.mjs` (tracks generated fallbacks in `src/content/docs/.generated-english-fallbacks.json`), `check-translation-baselines.mjs`.
- `src/` — site-owned Starlight config (`content.config.ts`, `hagilight.d.ts`), `components/`, `content/` (generated `docs/en-US/` + `translation-baselines.json`), `i18n/`, `lib/`, `pages/`, `styles/`. Generated content under `src/content/docs/en-US/` is Git-ignored and replaced every run.
- `test/` — `built-pages.test.mjs`, `upstream-docs.test.mjs`, `locale-navigation.test.mjs`, `hagilight-promotion.test.mjs`, `workflows.test.mjs`.

## Conventions

- Do **not** edit generated `src/content/docs/en-US/` pages; change upstream and review a new pinned revision. Generated pages are never used as a fallback when the submodule is unavailable.
- Reviewed Simplified Chinese topics use the same paths as their English sources; keep them under the site-owned locale path.
- `src/content/translation-baselines.json` records each reviewed translation: source path, SHA-256, and reviewed upstream revision. Compute the source hash with `sha256sum upstream/openspec/docs/<source-file>`. `npm run check:translation-baselines` reports changed/removed sources and authored translations without a baseline (generated fallbacks are excluded). Locale homes are shell content, not topic translations, and need no baseline.
- AI-disclosure frontmatter: omit `isAITranslation` to keep the notice enabled; set `isAITranslation: false` for human-authored pages. English pages are not labeled as translations.
- To convert a generated English fallback into an authored translation: remove its `isEnglishFallback` flag, edit, add a reviewed baseline, then re-run `npm run import:english`.
- Canonical URL `https://openspec.hagicode.com` (publishing the branch does not configure a host or DNS). All-language feed at `/rss.xml`; per-language at `/rss.<locale>.xml`.
- Hagilight owns header, locale chooser, footer, content-width control, site links, article-end promotion, analytics (GA `G-EN03FMT2Q4`, 51LA `L6b88a5yK4h2Xnci` with screen recording), and the campaign banner. Review privacy/consent before publishing.

## Testing

- `npm test` runs `node --test test/*.test.mjs`, covering importer behavior, source contracts, generated routes, locale navigation, Hagilight promotion, and CI workflows.
- Run tests after a build (`npm run build` first) since suites assert on built output.

## Deployment / Publishing

- CI (`.github/workflows/docs-ci.yml`) runs for PRs targeting `main`, pushes to `main`, and a weekly schedule, using `npm ci` + check/build/test.
- `docs-deploy-gh-pages.yml` runs on pushes to `main` (and manually for `main` only) and publishes the verified build: `esa.jsonc`, `wrangler.jsonc`, and `dist/` at the `gh-pages` branch root. The build job is read-only; only the publisher needs `contents: write`. Deploy configs live in `.github/gh-pages/`. Enable Actions `GITHUB_TOKEN` write in repo settings.
- Commit a new submodule pointer only after reviewing source changes and the generated site; publication remains gated on successful verification.
