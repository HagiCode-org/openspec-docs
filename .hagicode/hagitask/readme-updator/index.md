---
public: true
multilingual: false
style: product
---

# README requirements

## Product focus

- Introduce OpenSpec Docs as the documentation site for OpenSpec at https://openspec.hagicode.com, where readers learn installation, concepts, commands, the CLI, customization and migration for the OpenSpec spec-driven workflow.
- Describe what readers get: English documentation tracking a pinned upstream `Fission-AI/openspec` revision, reviewed Simplified Chinese topics, ten site languages with a clearly marked English fallback, and RSS feeds.
- Address people learning or adopting OpenSpec. Lead with reader value and a prominent site link, not how the site is built.

## Required content

- Open with a short introduction and the link to https://openspec.hagicode.com.
- Describe the reading areas that exist, such as getting started, installation, concepts, commands, CLI, customization, FAQ and migration, and the language selection with English fallback.
- Give the English feed `https://openspec.hagicode.com/rss.xml` and the per-language feed pattern `https://openspec.hagicode.com/rss.<locale>.xml`.
- Mention that AI-assisted translations carry a visible notice.

## Exclusions

- Exclude analytics keys, tokens, secret values, internal hosts, machine-specific paths and private links.
- Keep repository maintenance instructions out of the README: repository layout, internal architecture, CI, build internals, upstream import and review, translation baselines and publication workflow.
- Do not list documentation topics the site does not show.
