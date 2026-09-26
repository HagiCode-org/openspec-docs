import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkTranslationBaselines, createImportPlan, writeImportPlan } from "../scripts/upstream-docs.mjs";

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

    const localizedTopic = path.join(contentRoot, "fr-FR/getting-started.md");
    await mkdir(path.dirname(localizedTopic), { recursive: true });
    await writeFile(localizedTopic, "# Guide de démarrage\n");
    await assert.rejects(
      checkTranslationBaselines(options),
      /fr-FR\/getting-started: translation has no reviewed upstream baseline/u,
    );
    await rm(localizedTopic);

    await writeFile(sourcePath, "# Getting started\n\nUpdated source.\n");
    await assert.rejects(checkTranslationBaselines(options), /upstream source changed/u);
    await rm(sourcePath);
    await assert.rejects(checkTranslationBaselines(options), /upstream source was removed/u);
  });
});
