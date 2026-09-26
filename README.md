# OpenSpec Docs

An independently buildable Astro/Starlight site for OpenSpec documentation. Authored pages live in this repository and do not depend on the HagiCode Docs content pipeline.

## Local development

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
npm test
```

Run `npm test` after a build; the suite checks both source contracts and generated routes.

## GitHub Actions

The CI workflow runs for pull requests targeting `main`, pushes to `main`, and a weekly schedule. It uses the locked dependencies and the same commands as local verification:

```bash
npm ci
npm run check
npm run build
npm test
```

The publication workflow runs on pushes to `main` and can be started manually for `main`. It publishes the verified build output to the root of the `gh-pages` branch; manual runs selected for other branches are skipped. The build job is read-only, and only the publisher needs `contents: write`. In repository settings, allow Actions' `GITHUB_TOKEN` to write repository contents (`Settings > Actions > General > Workflow permissions`); organization policy must also permit this access.

Publishing the branch does not configure a host or change where `https://openspec.hagicode.com` is served from. Any hosting source, domain, and routing setup remains separate.

## Writing and localizing pages

Add guide Markdown or MDX pages under `src/content/docs/guides/`. Chinese pages use that directory directly; English translations go under `src/content/docs/en-US/guides/`. The sidebar discovers guide pages automatically and uses each page's `title` and `description` frontmatter. The locale home pages are `src/content/docs/index.mdx` and `src/content/docs/en-US/index.mdx`.

When adding a locale, configure its Starlight route and document language in `astro.config.mjs`, add locale-keyed shell copy in `src/i18n/site-copy.mjs`, and provide translated pages under the locale's content directory. The language link keeps a topic URL when the target translation is published and otherwise links to that locale's home page.

## Analytics and privacy

Copy `.env.example` to `.env` and set only identifiers owned by the OpenSpec documentation site:

- `PUBLIC_OPENSPEC_GA_ID` enables Google Analytics.
- `PUBLIC_OPENSPEC_51LA_ID` enables 51LA page tracking.

Either provider can be enabled independently; empty values disable tracking. Analytics scripts are emitted only in production builds and are requested only when the browser is on `openspec.hagicode.com`. A locally served production preview therefore does not send analytics requests. 51LA screen recording is disabled. Review applicable privacy and consent requirements before configuring production identifiers.
