---
title: "설치"
---

## 사전 요구 사항

- **Node.js 20.19.0 이상** — 버전 확인: `node --version`

## AI 어시스턴트를 사용해 설치하기

직접 설치하고 싶지 않나요? 셸 명령을 실행할 수 있는 Claude Code, Codex, Cursor, Gemini CLI, Copilot 등의 코딩 어시스턴트에 아래 프롬프트를 붙여 넣으세요. CLI를 설치하고 프로젝트를 초기화한 뒤 실제로 수행한 작업을 알려 줍니다. [지원 도구](/ko-KR/supported-tools/)를 참조하세요.

아래의 수동 단계가 기준이며 프롬프트는 해당 단계를 대신 실행할 뿐입니다. 어시스턴트가 중간에 멈추고 작업을 넘기는 것은 의도된 동작입니다. 권한이 필요한 작업은 먼저 확인을 요청하며 셸 시작 파일을 직접 수정하지 않습니다. [패키지 관리자](#package-managers)와 [문제 해결](/ko-KR/troubleshooting/)을 참고해 남은 단계를 직접 완료하세요.

```text
Install OpenSpec in this project and set it up for me. Follow these steps in
order, and stop where a step tells you to stop.

1. RUNTIME. Run `node --version`. OpenSpec needs Node.js 20.19.0 or higher. If
   Node is missing or older, say so and stop — don't install Node, switch
   versions, or reconfigure my version manager for me.

2. INSTALL. Use whichever package manager is already on my PATH, preferring npm:
     npm install -g @fission-ai/openspec@latest
     pnpm add -g @fission-ai/openspec@latest
     bun add -g @fission-ai/openspec@latest
     yarn global add @fission-ai/openspec@latest   (Yarn 1.x only)
   Don't pick based on this project's lockfile — a global install has nothing to
   do with how this repo's own dependencies are installed. If none of those four
   is available, stop and tell me — don't improvise an install. (If I'm on Nix,
   point me at the Nix section of the OpenSpec installation docs instead.)
   Show me the exact command and let me confirm before you run it; this installs
   software outside the project, and I may want a different package manager to
   own it.
   Stop and ask me again if the install needs sudo or admin rights, fails with a
   permissions error, or reports that its global bin directory is missing or
   unconfigured. Never edit my shell startup files (.bashrc, .zshrc, .profile,
   fish, PowerShell profile), and never run a setup command that edits them for
   me — show me the change and let me make it.

3. PATH. Run `openspec --version`. If the command isn't found, it may just be
   missing from this shell: tell me where the package manager installed it and
   how to add that directory to PATH for my shell and OS, then stop until I
   confirm. If it prints an older version than the one the install just
   reported, an earlier copy is shadowing it on PATH — tell me both versions
   instead of continuing. If I use a version manager, say so rather than editing
   PATH around it: with nvm or fnm the CLI is tied to the Node version that was
   active when you installed it, and with asdf or volta a shim may need
   regenerating.

4. INITIALIZE. Ask me which AI coding tool or tools I use and map each to an id
   from `openspec init --help` (Copilot is `github-copilot`, Zoo Code is
   `roocode`). `--tools` takes a comma-separated list, so name all of them.
   `openspec init --tools <ids>` deletes leftovers from older OpenSpec versions
   automatically, without asking — including `opsx-*.md` prompt files in my home
   directory (Codex keeps them in ~/.codex/prompts). Before you run it, look for
   those: `.../commands/openspec/` folders, OpenSpec marker blocks in files like
   CLAUDE.md or AGENTS.md, and home-directory `opsx-*.md` prompts. List whatever
   you find and wait for my go-ahead; if you find nothing, say so and carry on
   without asking. An existing `openspec/` folder is not a problem — init
   refreshes it and leaves my specs and changes alone.
   Confirm I'm in the right folder too: init creates `openspec/` wherever it
   runs, including inside a monorepo package.
   Then run: openspec init --tools <ids>

5. REPORT. Don't assume what should exist — tell me what init actually printed:
   how many skills and/or commands it created and where, the config file line,
   any "Setup required" note, and what to restart or reload. Some tools are
   skills-only and correctly create zero command files, so missing commands is
   not a failure on its own. If init said nothing was generated, relay the fix
   it suggested instead of retrying. Finish by telling me how to invoke OpenSpec
   in my tool, and take the exact spelling from the files init created rather
   than from its summary line: the punctuation differs per tool (/opsx:propose
   in some, /opsx-propose in others, @opsx-propose in Amazon Q), and tools that
   get skills instead of commands are invoked by skill name (/openspec-propose,
   or $openspec-propose in Codex, or /skill:openspec-propose in Kimi Code).
```

프롬프트는 특정 공급업체에 종속되지 않습니다. 일반적인 지침과 이 페이지에 설명된 명령만 사용합니다. macOS, Linux, Windows에서 작동하며 권한이 필요한 단계에서 임의로 진행하는 대신 의도적으로 멈춥니다. 단, 일부 IDE 통합 기능과 달리 어시스턴트에서 셸 명령을 실행할 수 있어야 합니다.

## 패키지 관리자

### npm

```bash
npm install -g @fission-ai/openspec@latest
```

### pnpm

```bash
pnpm add -g @fission-ai/openspec@latest
```

### yarn

```bash
yarn global add @fission-ai/openspec@latest
```

Yarn 2 이상(Berry)에서는 `global` 명령이 제거되었습니다. 이 버전에서는 npm, pnpm 또는 bun으로 OpenSpec을 설치하세요. 전역 CLI는 프로젝트의 패키지 관리자와 동일할 필요가 없습니다.

### deno

Deno에서 `@latest` 태그를 해석하지 못하는 경우가 있습니다. 이 경우 처음 설치할 때 버전을 지정할 수 있습니다.
그런 문제가 발생하면 `@latest` 대신 `@^1.3.1`과 같은 버전 태그를 사용해 보세요.

```bash
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@latest
# or
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@^1.3.1
```

참고: `config edit`, `feedback`, `workspace open`과 같은 하위 명령에서 외부 도구를 실행하는 경우 범위를 지정한 `--allow-run=<program>` 권한이 필요할 수 있습니다.

### bun

Bun을 사용해 OpenSpec을 전역 설치할 수 있지만 현재 OpenSpec은 Node.js에서 실행됩니다.
따라서 `PATH`에서 Node.js 20.19.0 이상을 사용할 수 있어야 합니다.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Run OpenSpec directly without installation:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Or install to your profile:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Or add to your development environment in `flake.nix`:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    openspec.url = "github:Fission-AI/OpenSpec";
  };

  outputs = { nixpkgs, openspec, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [ openspec.packages.x86_64-linux.default ];
    };
  };
}
```

## 설치 확인

```bash
openspec --version
```

## 업데이트

패키지를 업그레이드한 다음 각 프로젝트의 생성 파일을 새로 고치세요.

```bash
npm install -g @fission-ai/openspec@latest   # or pnpm/yarn/bun equivalent
openspec update                              # run inside each project
```

`openspec update`는 구성한 도구의 스킬과 명령 파일을 다시 생성해 슬래시 명령을 설치된 버전에 맞춥니다. 새 워크플로는 업그레이드해야 사용할 수 있으므로 최신 CLI가 배포됐는지도 확인하고 업그레이드를 제안합니다. [CLI 참조](/ko-KR/cli/#openspec-update)를 참조하세요.

## 제거

OpenSpec은 전역 패키지와 프로젝트 파일로 구성되므로 `openspec uninstall` 명령이 없습니다. 몇 가지 수동 단계만 거치면 제거할 수 있으며 소스 코드는 건드리지 않습니다.

**1. 전역 패키지 제거:**

```bash
npm uninstall -g @fission-ai/openspec   # or: pnpm rm -g / yarn global remove / bun rm -g
```

**2. 프로젝트에서 OpenSpec 제거(선택 사항).** 사양과 변경 사항이 더 이상 필요하지 않다면 `openspec/` 디렉터리를 삭제하세요.

```bash
rm -rf openspec/
```

삭제하기 전에 신중하게 생각하세요. `openspec/specs/`와 `openspec/changes/archive/`에는 시스템 동작 방식과 변경 이유가 기록됩니다. 이 이력이 필요할 수 있다면 제거 후에도 폴더를 유지하거나 git에 보관하세요.

**3. 생성된 AI 도구 파일 제거(선택 사항).** OpenSpec은 `.claude/skills/openspec-*/`, `.cursor/commands/opsx-*`와 같은 도구별 디렉터리에 스킬과 명령 파일을 작성합니다. 구성한 도구에서 `openspec-*` 스킬과 `opsx-*` 명령을 삭제하세요. 도구별 정확한 경로는 [지원 도구](/ko-KR/supported-tools/)에 나와 있습니다.

`CLAUDE.md`, `AGENTS.md` 등의 파일에 OpenSpec 표시 블록이 있다면 직접 삭제하세요. 해당 파일의 나머지 내용은 그대로 유지할 수 있습니다.

## 다음 단계

설치한 뒤 프로젝트에서 OpenSpec을 초기화하세요.

```bash
cd your-project
openspec init
```

전체 안내는 [시작하기](/ko-KR/getting-started/)를 참조하세요.
