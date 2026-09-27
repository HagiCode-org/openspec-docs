import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { checkTranslationBaselines, createImportPlan, writeImportPlan } from "../scripts/upstream-docs.mjs";

const reviewedLocales = ["zh-Hant", "ja-JP", "ko-KR", "de-DE", "fr-FR", "es-ES", "pt-BR", "ru-RU"];

async function createFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "openspec-docs-"));
  const sourceDir = path.join(root, "openspec/docs");
  await mkdir(path.join(sourceDir, "nested"), { recursive: true });
  await writeFile(path.join(root, "openspec/README.md"), "# Upstream README\n");
  await writeFile(path.join(sourceDir, "README.md"), "# Documentation\n\n[Guide](getting-started.md)\n");
  await writeFile(
    path.join(sourceDir, "getting-started.md"),
    "# Getting started\n\n[Home](README.md) and [Nested](nested/user-guide.md#details).\n\n![Diagram](images/diagram.svg)\n",
  );
  await writeFile(path.join(sourceDir, "nested/user-guide.md"), "# User guide\n\n## Details\n");
  await mkdir(path.join(sourceDir, "images"), { recursive: true });
  await writeFile(path.join(sourceDir, "images/diagram.svg"), "<svg></svg>\n");
  return { root, sourceDir, upstreamRoot: path.join(root, "openspec") };
}

async function withFixture(callback) {
  const fixture = await createFixture();
  try {
    await callback(fixture);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
}

function markdownStructure(source) {
  const headingLevels = [];
  const codeBlocks = [];
  const codeBlockLanguages = [];
  let openFence;
  let blockLines = [];

  for (const line of source.replace(/\r\n?/gu, "\n").split("\n")) {
    const fence = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/u);
    if (!openFence) {
      if (fence) {
        openFence = {
          character: fence[1][0],
          length: fence[1].length,
          language: fence[2].trim().split(/[ \t]+/u)[0],
        };
        blockLines = [line];
      } else {
        const heading = line.match(/^ {0,3}(#{1,6})[ \t]+/u);
        if (heading) headingLevels.push(heading[1].length);
      }
      continue;
    }

    blockLines.push(line);
    if (
      fence
      && fence[1][0] === openFence.character
      && fence[1].length >= openFence.length
      && fence[2].trim() === ""
    ) {
      codeBlocks.push(blockLines.join("\n"));
      codeBlockLanguages.push(openFence.language);
      openFence = undefined;
      blockLines = [];
    }
  }
  if (openFence) throw new Error("Unterminated Markdown code fence");
  return { headingLevels, codeBlocks, codeBlockLanguages };
}

async function listMarkdownFiles(directory, base = directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listMarkdownFiles(absolute, base));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(path.relative(base, absolute).split(path.sep).join("/"));
    }
  }
  return files.sort();
}

test("missing pinned docs fail with an actionable initialization command", async () => {
  await withFixture(async ({ root, upstreamRoot }) => {
    await assert.rejects(
      createImportPlan({
        sourceDir: path.join(root, "missing/docs"),
        upstreamRoot,
        revision: "fixture-revision",
      }),
      /git submodule update --init --recursive/u,
    );
  });
});

test("Chinese topics preserve upstream heading structure and technical examples", async () => {
  const baselines = JSON.parse(await readFile(new URL("../src/content/translation-baselines.json", import.meta.url), "utf8"));
  const translations = Object.entries(baselines["zh-CN"] ?? {});
  assert.equal(translations.length, 26);
  const failures = [];

  for (const [topic, baseline] of translations) {
    const source = await readFile(new URL(`../upstream/openspec/docs/${baseline.source}`, import.meta.url), "utf8");
    const translated = await readFile(new URL(`../src/content/docs/zh-CN/${topic}.md`, import.meta.url), "utf8");
    const sourceStructure = markdownStructure(source);
    const translatedStructure = markdownStructure(translated);
    if (sourceStructure.headingLevels[0] !== 1) failures.push(`${topic}: source title is not an H1`);
    if (!/^---\ntitle: /u.test(translated)) failures.push(`${topic}: missing Starlight title`);
    if (JSON.stringify(translatedStructure.headingLevels) !== JSON.stringify(sourceStructure.headingLevels.slice(1))) {
      failures.push(`${topic}: heading hierarchy differs (${sourceStructure.headingLevels.length - 1} source, ${translatedStructure.headingLevels.length} translated)`);
    }
    if (JSON.stringify(translatedStructure.codeBlocks) !== JSON.stringify(sourceStructure.codeBlocks)) {
      failures.push(`${topic}: fenced technical examples differ (${sourceStructure.codeBlocks.length} source, ${translatedStructure.codeBlocks.length} translated)`);
    }
  }
  assert.deepEqual(failures, []);
});

test("all reviewed locales cover every pinned topic with source-aligned structure", async () => {
  const sourceRoot = new URL("../upstream/openspec/docs/", import.meta.url);
  const sourceDirectory = fileURLToPath(sourceRoot);
  const sourceFiles = (await listMarkdownFiles(sourceDirectory))
    .filter((file) => file !== "README.md");
  const topics = sourceFiles.map((file) => file.replace(/\.md$/u, ""));
  const revision = execFileSync("git", ["-C", fileURLToPath(new URL("../upstream/openspec/", import.meta.url)), "rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  const baselines = JSON.parse(await readFile(new URL("../src/content/translation-baselines.json", import.meta.url), "utf8"));
  const failures = [];

  for (const locale of reviewedLocales) {
    const localeDirectory = fileURLToPath(new URL(`../src/content/docs/${locale}/`, import.meta.url));
    const localeFiles = (await listMarkdownFiles(localeDirectory))
      .filter((file) => file !== "index.md" && file !== "index.mdx");
    const localeTopics = localeFiles.map((file) => file.replace(/\.md$/u, ""));
    if (JSON.stringify(localeTopics) !== JSON.stringify(topics)) {
      failures.push(`${locale}: topic coverage differs (expected ${topics.length}, found ${localeFiles.length})`);
    }

    const localeBaselines = baselines[locale] ?? {};
    if (JSON.stringify(Object.keys(localeBaselines).sort()) !== JSON.stringify(topics)) {
      failures.push(`${locale}: baseline coverage differs from the pinned topic set`);
    }

    for (const topic of topics) {
      const sourcePath = sourceFiles.find((file) => file.replace(/\.md$/u, "") === topic);
      const source = await readFile(new URL(`../upstream/openspec/docs/${sourcePath}`, import.meta.url), "utf8");
      const translated = await readFile(new URL(`../src/content/docs/${locale}/${topic}.md`, import.meta.url), "utf8");
      const baseline = localeBaselines[topic];

      if (!/^---\ntitle: .+\n---\n/u.test(translated)) failures.push(`${locale}/${topic}: missing localized title`);
      if (/^isEnglishFallback:\s*true\s*$/mu.test(translated)) failures.push(`${locale}/${topic}: still marked as an English fallback`);
      if (baseline?.source !== sourcePath) failures.push(`${locale}/${topic}: incorrect source path in baseline`);
      if (baseline?.sha256 !== createHash("sha256").update(source).digest("hex")) {
        failures.push(`${locale}/${topic}: incorrect source hash in baseline`);
      }
      if (baseline?.revision !== revision) failures.push(`${locale}/${topic}: incorrect source revision in baseline`);

      const sourceStructure = markdownStructure(source);
      const translatedStructure = markdownStructure(translated);
      if (JSON.stringify(translatedStructure.headingLevels) !== JSON.stringify(sourceStructure.headingLevels.slice(1))) {
        failures.push(`${locale}/${topic}: heading hierarchy differs`);
      }
      if (JSON.stringify(translatedStructure.codeBlockLanguages) !== JSON.stringify(sourceStructure.codeBlockLanguages)) {
        failures.push(`${locale}/${topic}: code fence count or language differs`);
      }
    }
  }
  assert.deepEqual(failures, []);
});

test("README and nested topics map to stable routes and resolve internal links", async () => {
  await withFixture(async ({ sourceDir, upstreamRoot }) => {
    const plan = await createImportPlan({ sourceDir, upstreamRoot, revision: "fixture-revision" });
    assert.equal(plan.documents.get("README.md").output, "index.md");
    assert.equal(plan.documents.get("nested/user-guide.md").output, "nested/user-guide.md");

    const home = plan.documents.get("README.md").rendered;
    const guide = plan.documents.get("getting-started.md").rendered;
    assert.match(home, /title: "Documentation"/u);
    assert.doesNotMatch(home, /^# Documentation$/mu);
    assert.match(home, /\]\(\/en-US\/getting-started\/\)/u);
    assert.match(guide, /\]\(\/en-US\/\)/u);
    assert.match(guide, /\]\(\/en-US\/nested\/user-guide\/#details\)/u);
    assert.match(guide, /!\[Diagram\]\(\/en-US\/assets\/images\/diagram\.svg\)/u);
    assert.equal(plan.assets.size, 1);
  });
});

test("generated Markdown and copied assets are deterministic", async () => {
  await withFixture(async ({ root, sourceDir, upstreamRoot }) => {
    const plan = await createImportPlan({ sourceDir, upstreamRoot, revision: "fixture-revision" });
    const outputDir = path.join(root, "generated/docs");
    const assetsDir = path.join(root, "generated/assets");
    await writeImportPlan(plan, { outputDir, assetsDir });
    const firstPage = await readFile(path.join(outputDir, "getting-started.md"), "utf8");
    const firstAsset = await readFile(path.join(assetsDir, "images/diagram.svg"), "utf8");
    await writeImportPlan(plan, { outputDir, assetsDir });
    assert.equal(await readFile(path.join(outputDir, "getting-started.md"), "utf8"), firstPage);
    assert.equal(await readFile(path.join(assetsDir, "images/diagram.svg"), "utf8"), firstAsset);
  });
});

test("missing topics generate ignored fallbacks without overwriting authored translations", async () => {
  await withFixture(async ({ root, sourceDir, upstreamRoot }) => {
    const plan = await createImportPlan({ sourceDir, upstreamRoot, revision: "fixture-revision" });
    const contentRoot = path.join(root, "site/src/content/docs");
    const outputDir = path.join(contentRoot, "en-US");
    const assetsDir = path.join(root, "site/public/en-US/assets");
    const authored = path.join(contentRoot, "zh-CN/getting-started.md");
    const authoredMdx = path.join(contentRoot, "zh-CN/nested/user-guide.mdx");
    await mkdir(path.dirname(authored), { recursive: true });
    await writeFile(authored, "# 已审核翻译\n");
    await mkdir(path.dirname(authoredMdx), { recursive: true });
    await writeFile(authoredMdx, "# 已审核的嵌套翻译\n");

    const options = { outputDir, assetsDir, locales: ["zh-CN", "ja-JP"] };
    await writeImportPlan(plan, options);

    const fallback = path.join(contentRoot, "ja-JP/getting-started.md");
    const fallbackContent = await readFile(fallback, "utf8");
    assert.match(fallbackContent, /^isEnglishFallback: true$/mu);
    assert.match(fallbackContent, /\[Nested\]\(\/en-US\/nested\/user-guide\/#details\)/u);
    assert.equal(await readFile(authored, "utf8"), "# 已审核翻译\n");
    await assert.rejects(readFile(path.join(contentRoot, "zh-CN/nested/user-guide.md")), { code: "ENOENT" });
    assert.equal(await readFile(authoredMdx, "utf8"), "# 已审核的嵌套翻译\n");

    const manifestPath = path.join(contentRoot, ".generated-english-fallbacks.json");
    const firstManifest = await readFile(manifestPath, "utf8");
    const manifest = JSON.parse(firstManifest);
    assert.ok(manifest.files.some(({ path: generatedPath }) => generatedPath === "ja-JP/getting-started.md"));
    assert.ok(!manifest.files.some(({ path: generatedPath }) => generatedPath === "zh-CN/getting-started.md"));
    assert.match(await readFile(path.join(path.dirname(contentRoot), ".gitignore"), "utf8"), /\/docs\/ja-JP\/getting-started\.md/u);

    await writeImportPlan(plan, options);
    assert.equal(await readFile(fallback, "utf8"), fallbackContent);
    assert.equal(await readFile(manifestPath, "utf8"), firstManifest);

    const authoredFallback = "---\ntitle: \"入门\"\n---\n\n已审核的中文内容。\n";
    await writeFile(fallback, authoredFallback);
    await writeImportPlan(plan, options);
    assert.equal(await readFile(fallback, "utf8"), authoredFallback);
    const updatedManifest = JSON.parse(await readFile(manifestPath, "utf8"));
    assert.ok(!updatedManifest.files.some(({ path: generatedPath }) => generatedPath === "ja-JP/getting-started.md"));
    assert.doesNotMatch(await readFile(path.join(path.dirname(contentRoot), ".gitignore"), "utf8"), /\/docs\/ja-JP\/getting-started\.md/u);
  });
});

test("rebuild removes only generated fallback pages for deleted upstream topics", async () => {
  await withFixture(async ({ root, sourceDir, upstreamRoot }) => {
    const contentRoot = path.join(root, "site/src/content/docs");
    const outputDir = path.join(contentRoot, "en-US");
    const assetsDir = path.join(root, "site/public/en-US/assets");
    const options = { outputDir, assetsDir, locales: ["ja-JP"] };
    const firstPlan = await createImportPlan({ sourceDir, upstreamRoot, revision: "fixture-revision" });
    await writeImportPlan(firstPlan, options);

    const removedFallback = path.join(contentRoot, "ja-JP/nested/user-guide.md");
    assert.match(await readFile(removedFallback, "utf8"), /User guide/u);
    await rm(path.join(sourceDir, "nested/user-guide.md"));
    await writeFile(path.join(sourceDir, "getting-started.md"), "# Getting started\n\nNo nested link remains.\n");

    const nextPlan = await createImportPlan({ sourceDir, upstreamRoot, revision: "next-revision" });
    await writeImportPlan(nextPlan, options);
    await assert.rejects(readFile(removedFallback), { code: "ENOENT" });
    const manifest = JSON.parse(await readFile(path.join(contentRoot, ".generated-english-fallbacks.json"), "utf8"));
    assert.ok(!manifest.files.some(({ path: generatedPath }) => generatedPath === "ja-JP/nested/user-guide.md"));
  });
});

test("fallback generation failures preserve authored locale pages", async () => {
  await withFixture(async ({ root, sourceDir, upstreamRoot }) => {
    const plan = await createImportPlan({ sourceDir, upstreamRoot, revision: "fixture-revision" });
    const contentRoot = path.join(root, "site/src/content/docs");
    const authored = path.join(contentRoot, "fr-FR/getting-started.md");
    await mkdir(path.dirname(authored), { recursive: true });
    await writeFile(authored, "# Guide traduit\n");
    await writeFile(path.join(contentRoot, ".generated-english-fallbacks.json"), "{invalid\n");

    await assert.rejects(
      writeImportPlan(plan, {
        outputDir: path.join(contentRoot, "en-US"),
        assetsDir: path.join(root, "site/public/en-US/assets"),
        locales: ["fr-FR"],
      }),
      /Invalid generated fallback manifest/u,
    );
    assert.equal(await readFile(authored, "utf8"), "# Guide traduit\n");
  });
});

test("broken links, unsupported MDX and output collisions fail before generation", async () => {
  await withFixture(async ({ sourceDir, upstreamRoot }) => {
    const guide = path.join(sourceDir, "getting-started.md");
    await writeFile(guide, "# Getting started\n\n[Missing](missing.md)\n");
    await assert.rejects(
      createImportPlan({ sourceDir, upstreamRoot, revision: "fixture-revision" }),
      /Broken or unsupported Markdown link/u,
    );

    await writeFile(guide, "# Getting started\n\n<CustomWidget />\n");
    await assert.rejects(
      createImportPlan({ sourceDir, upstreamRoot, revision: "fixture-revision" }),
      /MDX components are not supported/u,
    );

    await writeFile(guide, "# Getting started\n");
    await writeFile(path.join(sourceDir, "index.md"), "# Duplicate home\n");
    await assert.rejects(
      createImportPlan({ sourceDir, upstreamRoot, revision: "fixture-revision" }),
      /path collision/u,
    );
  });
});

test("translation checks identify changed or removed upstream sources", async () => {
  await withFixture(async ({ root, sourceDir, upstreamRoot }) => {
    const contentRoot = path.join(root, "translations");
    const manifestPath = path.join(root, "translation-baselines.json");
    await mkdir(contentRoot, { recursive: true });
    const translation = path.join(contentRoot, "getting-started.md");
    const sourcePath = path.join(sourceDir, "getting-started.md");
    const source = await readFile(sourcePath);
    await writeFile(translation, "# Traducción\n");
    await writeFile(manifestPath, JSON.stringify({
      "zh-CN": {
        "getting-started": {
          source: "getting-started.md",
          sha256: createHash("sha256").update(source).digest("hex"),
          revision: "fixture-revision",
        },
      },
    }));

    const options = { sourceDir, contentRoot, manifestPath, upstreamRoot, revision: "fixture-revision" };
    assert.equal((await checkTranslationBaselines(options)).checkedTranslations, 1);

    const localizedTopic = path.join(contentRoot, "zh-Hant/getting-started.md");
    await mkdir(path.dirname(localizedTopic), { recursive: true });
    await writeFile(localizedTopic, "# 開始使用\n");
    await assert.rejects(
      checkTranslationBaselines(options),
      /zh-Hant\/getting-started: translation has no reviewed upstream baseline/u,
    );
    await rm(localizedTopic);

    await writeFile(sourcePath, "# Getting started\n\nUpdated source.\n");
    await assert.rejects(checkTranslationBaselines(options), /upstream source changed/u);
    await rm(sourcePath);
    await assert.rejects(checkTranslationBaselines(options), /upstream source was removed/u);
  });
});

test("baseline checks ignore unchanged generated fallbacks but audit authored edits", async () => {
  await withFixture(async ({ root, sourceDir, upstreamRoot }) => {
    const contentRoot = path.join(root, "content/docs");
    const fallbackPath = path.join(contentRoot, "fr-FR/getting-started.md");
    const fallback = "---\ntitle: \"Getting started\"\nisEnglishFallback: true\n---\n\nEnglish source.\n";
    await mkdir(path.dirname(fallbackPath), { recursive: true });
    await writeFile(fallbackPath, fallback);
    await writeFile(path.join(contentRoot, ".generated-english-fallbacks.json"), JSON.stringify({
      version: 1,
      files: [{
        path: "fr-FR/getting-started.md",
        sha256: createHash("sha256").update(fallback).digest("hex"),
      }],
    }));
    const manifestPath = path.join(root, "translation-baselines.json");
    await writeFile(manifestPath, "{}\n");
    const options = {
      sourceDir,
      contentRoot,
      manifestPath,
      upstreamRoot,
      revision: "fixture-revision",
    };

    assert.equal((await checkTranslationBaselines(options)).checkedTranslations, 0);
    await writeFile(fallbackPath, `${fallback}\nAuthored text.\n`);
    await assert.rejects(
      checkTranslationBaselines(options),
      /fr-FR\/getting-started: translation has no reviewed upstream baseline/u,
    );
  });
});
