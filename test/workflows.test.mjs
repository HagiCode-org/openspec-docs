import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function readWorkflow(name) {
  return readFile(new URL(`.github/workflows/${name}`, root), "utf8");
}

function getJob(workflow, name) {
  const lines = workflow.split("\n");
  const start = lines.findIndex((line) => line === `  ${name}:`);
  assert.notEqual(start, -1, `workflow contains the ${name} job`);

  const end = lines.findIndex((line, index) => index > start && /^  [\w-]+:$/u.test(line));
  return lines.slice(start, end === -1 ? undefined : end).join("\n");
}

function assertVerificationOrder(workflow) {
  const commands = ["run: npm ci", "run: npm run check", "run: npm run build", "run: npm test"];
  const positions = commands.map((command) => workflow.indexOf(command));

  assert.ok(positions.every((position) => position !== -1), "workflow includes each verification command");
  assert.deepEqual(positions, [...positions].sort((left, right) => left - right));
}

test("CI covers pull requests, main pushes, and weekly verification with read-only access", async () => {
  const workflow = await readWorkflow("docs-ci.yml");

  assert.match(workflow, /^  pull_request:\n    branches: \[main\]/mu);
  assert.match(workflow, /^  push:\n    branches: \[main\]/mu);
  assert.match(workflow, /^  schedule:\n    - cron: "0 6 \* \* 1"/mu);
  assert.match(workflow, /^permissions:\n  contents: read$/mu);
  assert.match(workflow, /node-version: 22/u);
  assert.match(workflow, /cache: npm\n\s+cache-dependency-path: package-lock\.json/u);
  assertVerificationOrder(workflow);
});

test("publication is main-only and gates the artifact on the full verification sequence", async () => {
  const workflow = await readWorkflow("docs-deploy-gh-pages.yml");
  const build = getJob(workflow, "build");
  const publish = getJob(workflow, "publish");

  assert.match(workflow, /^  push:\n    branches: \[main\]/mu);
  assert.match(workflow, /^  workflow_dispatch:$/mu);
  assert.match(build, /if: \$\{\{ github\.ref == 'refs\/heads\/main' \}\}/u);
  assert.match(publish, /if: \$\{\{ github\.ref == 'refs\/heads\/main' \}\}/u);
  assertVerificationOrder(build);
  assert.ok(build.indexOf("run: npm test") < build.indexOf("actions/upload-artifact@v4"));
  assert.match(build, /cp \.github\/gh-pages\/esa\.jsonc/u);
  assert.match(build, /cp \.github\/gh-pages\/wrangler\.jsonc/u);
  assert.match(build, /cp -R dist\/\. "\$PUBLICATION_DIR\/dist\/"/u);
  assert.match(build, /name: openspec-docs-dist\n\s+path: \.deploy\/gh-pages\//u);
  assert.match(build, /if-no-files-found: error/u);
});

test("publication passes a verified artifact to an isolated, serialized writer", async () => {
  const workflow = await readWorkflow("docs-deploy-gh-pages.yml");
  const build = getJob(workflow, "build");
  const publish = getJob(workflow, "publish");

  assert.match(workflow, /cancel-in-progress: false/u);
  assert.match(publish, /needs: build/u);
  assert.match(publish, /actions\/download-artifact@v4[\s\S]*?name: openspec-docs-dist/u);
  assert.ok(publish.indexOf("actions/download-artifact@v4") < publish.indexOf("peaceiris/actions-gh-pages@v4"));
  assert.match(publish, /publish_dir: \.\/\.deploy\/gh-pages/u);
  assert.match(publish, /publish_branch: gh-pages/u);
  assert.match(build, /permissions:\n\s+contents: read/u);
  assert.match(publish, /permissions:\n\s+contents: write/u);
  assert.doesNotMatch(build, /contents: write/u);
  assert.doesNotMatch(workflow.slice(0, workflow.indexOf("jobs:")), /contents: write/u);
});

test("ESA and Wrangler configs serve the built static site from the publication payload", async () => {
  const esa = await readFile(new URL(".github/gh-pages/esa.jsonc", root), "utf8");
  const wrangler = await readFile(new URL(".github/gh-pages/wrangler.jsonc", root), "utf8");

  assert.match(esa, /"assets":\s*\{\s*"directory": "\.\/dist"/u);
  assert.match(wrangler, /"assets":\s*\{\s*"directory": "\.\/dist"/u);
});
