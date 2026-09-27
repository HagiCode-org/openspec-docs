---
title: "CLI 참조"
---

OpenSpec CLI(`openspec`)는 프로젝트 설정, 검증, 상태 확인, 관리에 사용할 터미널 명령을 제공합니다. [명령](/ko-KR/commands/)에 설명된 AI 슬래시 명령(`/opsx:propose` 등)을 보완합니다.

## 요약

| 범주 | 명령 | 목적 |
|----------|----------|---------|
| **설정** | `init`, `update` | 프로젝트에서 OpenSpec 초기화 및 업데이트 |
| **Stores(독립 OpenSpec 저장소)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | 등록한 독립 OpenSpec 저장소 관리 |
| **상태** | `doctor` | 확인된 루트의 관계 상태 보고 |
| **작업 컨텍스트** | `context` | 작업 집합(루트 + 참조된 store) 구성 |
| **개인 작업 세트** | `workset create`, `workset list`, `workset open`, `workset remove` | 도구에서 사용할 개인 로컬 작업 보기 저장 및 열기 |
| **탐색** | `list`, `view`, `show` | 변경 사항 및 사양 탐색 |
| **검증** | `validate` | 변경 사항 및 사양의 문제 확인 |
| **생명 주기** | `archive` | 완료된 변경 사항 마무리 |
| **워크플로** | `new change`, `status`, `instructions`, `templates`, `schemas` | 산출물 기반 워크플로 지원 |
| **스키마** | `schema init`, `schema fork`, `schema validate`, `schema which` | 사용자 지정 워크플로 생성 및 관리 |
| **구성** | `config` | 설정 확인 및 수정 |
| **유틸리티** | `feedback`, `completion` | 피드백 및 셸 통합 |

---

## 사용자용 명령과 에이전트용 명령

대부분의 CLI 명령은 터미널에서 **사용자가 직접 사용**하도록 설계되었습니다. 일부 명령은 JSON 출력을 통해 **에이전트/스크립트에서 사용**하는 것도 지원합니다.

### 사용자 전용 명령

다음 명령은 대화형이며 터미널에서 사용하도록 설계되었습니다.

| 명령 | 목적 |
|---------|---------|
| `openspec init` | 프로젝트 초기화(대화형 프롬프트) |
| `openspec view` | 대화형 대시보드 |
| `openspec workset open <name>` | 저장된 작업 세트 열기(편집기 창 또는 터미널 에이전트 세션) |
| `openspec config edit` | 편집기에서 구성 열기 |
| `openspec feedback` | GitHub를 통해 피드백 제출 |
| `openspec completion install` | 셸 자동 완성 설치 |

### 에이전트 호환 명령

다음 명령은 AI 에이전트와 스크립트에서 사용할 수 있도록 `--json` 출력을 지원합니다.

| 명령 | 사용자 사용 | 에이전트 사용 |
|---------|-----------|-----------|
| `openspec list` | 변경 사항/사양 탐색 | 구조화된 데이터에는 `--json` |
| `openspec show <item>` | 내용 읽기 | 파싱에는 `--json` |
| `openspec validate` | 문제 확인 | 일괄 검증에는 `--all --json` |
| `openspec status` | 산출물 진행 상태 확인 | 구조화된 상태에는 `--json` |
| `openspec instructions` | 다음 단계 확인 | 에이전트 지침에는 `--json` |
| `openspec templates` | 템플릿 경로 확인 | 경로 확인에는 `--json` |
| `openspec schemas` | 사용 가능한 스키마 나열 | 스키마 탐색에는 `--json`, 등록된 루트 선택에는 `--store <id>` |
| `openspec store setup <id>` | 로컬 store 생성 및 등록 | 구조화된 설정 결과에는 명시적 입력과 함께 `--json` |
| `openspec store register <path>` | 기존 store 등록 | 구조화된 등록 결과에는 `--json` |
| `openspec store unregister <id>` | 로컬 store 등록 해제 | 구조화된 정리 결과에는 `--json` |
| `openspec store remove <id>` | 등록된 로컬 store 폴더 삭제 | 비대화형 삭제에는 `--yes --json` |
| `openspec store list` | 등록된 store 탐색 | 구조화된 등록 정보에는 `--json` |
| `openspec store doctor` | 로컬 store 설정 확인 | 구조화된 진단에는 `--json` |
| `openspec new change <id>` | 저장소 로컬 변경 사항 기본 구조 생성 | `--json`; 등록된 store를 OpenSpec 루트로 사용하려면 `--store <id>`도 지정 |
| `openspec workset create [name]` | 개인 작업 보기 구성 | 비대화형 구성에는 `--member <path> --json` |
| `openspec workset list` | 저장된 작업 세트 탐색 | 구조화된 보기에는 `--json` |
| `openspec workset remove <name>` | 저장된 보기 삭제 | 비대화형 제거에는 `--yes --json` |

---

## 전역 옵션

다음 옵션은 모든 명령에서 사용할 수 있습니다.

| 옵션 | 설명 |
|--------|-------------|
| `--version`, `-V` | 버전 번호 표시 |
| `--no-color` | 색상 출력 비활성화 |
| `--help`, `-h` | 명령 도움말 표시 |

---

## 설정 명령

### `openspec init`

프로젝트에서 OpenSpec을 초기화합니다. 폴더 구조를 만들고 AI 도구 통합을 구성합니다.

기본 동작은 전역 구성의 기본값(profile `core`, 전달 방식 `both`, 워크플로 `propose, explore, apply, update, sync, archive`)을 사용합니다.

```
openspec init [path] [options]
```

새 프로젝트의 `openspec/config.yaml`에 언어 지침을 추가하려면 `--language <language>`를 사용하세요. 기존 프로젝트에서는 OpenSpec이 프로젝트별 지침을 덮어쓰지 않도록 구성의 `context` 필드를 직접 편집하세요.

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `path` | 아니요 | 대상 디렉터리(기본값: 현재 디렉터리) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--tools <list>` | AI 도구를 비대화형으로 구성합니다. `all`, `none` 또는 쉼표로 구분된 목록 사용 |
| `--language <language>` | 새 구성을 만들 때 이 언어로 산출물을 작성합니다. |
| `--force` | 확인 없이 기존 파일을 자동 정리합니다. |
| `--profile <profile>` | 이 초기화 실행에서 전역 프로필 재정의(`core` 또는 `custom`) |
| `--no-animation` | 애니메이션 대신 정적인 시작 화면을 표시합니다. |
| `--copilot-cloud` | 확인 없이 GitHub Copilot [클라우드 코딩 에이전트 파일](/ko-KR/supported-tools/#github-copilot-클라우드-코딩-에이전트)을 설정합니다. |
| `--no-copilot-cloud` | 확인 없이 GitHub Copilot 클라우드 코딩 에이전트 파일 설정을 건너뜁니다. |

`--profile custom`은 전역 구성에서 현재 선택된 워크플로를 사용합니다(`openspec config profile`).

`OPENSPEC_NO_ANIMATION` 환경 변수가 설정된 경우(빈 값을 포함해 모든 값), `NO_COLOR`에 비어 있지 않은 값이 설정된 경우, 또는 OS의 동작 줄이기 설정이 활성화된 경우(macOS의 동작 줄이기, GNOME 애니메이션 비활성화)에도 시작 애니메이션을 생략합니다.

**지원 도구 ID(`--tools`)** — `windsurf`는 `devin`의 별칭으로도 허용됩니다: `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `command-code`, `codeartsagent`, `codex`, `devin`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `minimax-code`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `codeassistant`, `qoder`, `qwen`, `rovodev`, `roocode`, `trae`, `zed`, `zcode`, `agents`

> 이 목록은 `src/core/config.ts`의 `AI_TOOLS`와 일치합니다. 도구별 스킬 및 명령 경로는 [지원 도구](/ko-KR/supported-tools/)를 참조하세요.

**Examples:**

```bash
# Interactive initialization
openspec init

# Initialize in a specific directory
openspec init ./my-project

# Non-interactive: configure for Claude and Cursor
openspec init --tools claude,cursor

# Non-interactive: configure global MiniMax Code skills
openspec init --tools minimax-code

# Configure for all supported tools
openspec init --tools all

# Override profile for this run
openspec init --profile core

# Skip prompts and auto-cleanup legacy files
openspec init --force
```

**생성 항목:**

```
openspec/
├── specs/              # Your specifications (source of truth)
├── changes/            # Proposed changes
└── config.yaml         # Project configuration

.claude/skills/         # Claude Code skills (if claude selected)
.cursor/skills/         # Cursor skills (if cursor selected)
.cursor/commands/       # Cursor OPSX commands (if delivery includes commands)
.agents/skills/         # Shared skills for AGENTS.md-compatible tools (if agents selected)
... (other tool configs)
```

---

### `openspec update`

CLI 업그레이드 후 OpenSpec 지침 파일을 업데이트합니다. 현재 전역 프로필, 선택한 워크플로, 전달 모드에 따라 AI 도구 구성 파일을 다시 생성합니다.

```
openspec update [path] [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `path` | 아니요 | 대상 디렉터리(기본값: 현재 디렉터리) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--force` | 파일이 최신이어도 강제로 업데이트합니다. |

**Example:**

```bash
# Update instruction files after npm upgrade
npm install -g @fission-ai/openspec@latest
openspec update
```

먼저 패키지를 업그레이드하세요. 지침 파일은 설치된 CLI에서 생성되므로 오래된 설치 버전에서 `openspec update`를 실행하면 새 릴리스의 워크플로를 추가하지 않고도 모든 항목이 최신이라고 보고합니다.

이를 확인하기 위해 `openspec update`는 npm 레지스트리에 최신 CLI가 배포됐는지 묻습니다. 현재 버전이 오래된 경우 업그레이드를 제안합니다.

```text
A newer OpenSpec CLI is available (v1.6.0 → v1.7.0).
  Running from: /usr/local/lib/node_modules/@fission-ai/openspec
? Upgrade to v1.7.0 now? (Y/n)
```

예라고 답하면 `npm install -g @fission-ai/openspec@latest`를 실행한 다음 새 CLI로 업데이트를 다시 실행해 새 워크플로를 한 번에 설치합니다. npm 종료 코드만 신뢰하지 않고 설치된 바이너리에 버전을 확인해 업그레이드 여부를 검증합니다. `PATH`에서 앞선 다른 설치가 계속 실행 중이면 성공했다고 주장하는 대신 이를 알려 줍니다. 아니요라고 답하면 명령을 출력하고 현재 CLI로 업데이트합니다. Ctrl-C를 누르면 명령이 중지됩니다.

업그레이드 제안은 대화형 터미널에서만 표시되며 npm이 설치를 관리하는 경우에만 나타납니다. `npm install -g`로 실제 해결할 수 있는 경우입니다. 그 밖의 설치 방식에는 해당 설치 방법에 맞는 명령을 표시합니다.

| OpenSpec 설치 방식 | 표시되는 내용 |
|---------------------------|--------------|
| 전역 npm 설치 | 대화형 터미널에서는 확인 프롬프트와 자동 업그레이드가 제공됩니다. 출력을 파이프로 연결하면 명령만 표시됩니다. |
| 전역 pnpm, bun, yarn, volta 설치 | 해당 패키지 관리자의 명령: `pnpm add -g …@latest`, `bun add -g …@latest`, `yarn global add …@latest` 또는 `volta install …@latest` |
| 프로젝트 종속성 | 잠금 파일을 소유한 패키지 관리자에서 종속성을 업데이트하라는 안내 |
| `npx` / `dlx` 캐시 | `npx @fission-ai/openspec@latest update` — 이 명령 자체가 업데이트이므로 별도 단계가 없습니다. |
| git clone | 별도 동작 없음 — 브랜치에 지정된 버전을 사용합니다. |

무엇이든 출력되면 실행 중인 CLI를 불러온 디렉터리가 표시됩니다. 업그레이드했지만 오래된 shim이 여전히 `PATH`를 점유할 때 확인해야 할 위치입니다.

`npm_config_registry`가 npm에 의해 내보내졌으면 해당 레지스트리에, 그렇지 않으면 `https://registry.npmjs.org`에 요청합니다. `.npmrc`는 읽지 않습니다. 파일 내용에 따라 외부 요청 대상이 결정되는 흐름은 피해야 하며 프로젝트의 `.npmrc`는 저장소와 함께 이동하기 때문입니다. 사설 미러를 사용하는 경우 `npm_config_registry`를 내보내거나 `OPENSPEC_NO_UPDATE_CHECK`를 설정해 확인을 완전히 건너뛰세요. `CI`가 명시적인 비활성 값(`false`, `0`, `no`, `off`, 빈 값)이 아닌 값으로 설정되거나 `NODE_ENV=test`, `OPENSPEC_NO_UPDATE_CHECK`(모든 값), `DO_NOT_TRACK=1`, `OPENSPEC_TELEMETRY=0`이 설정된 경우 확인을 건너뜁니다. 업데이트 전에 실행하며 최대 1.5초까지 지연될 수 있습니다. 네트워크 패킷이 조용히 유실되더라도 그 이후에는 중단하고 레지스트리에 연결할 수 없어도 아무 메시지를 표시하지 않습니다.

**"최신 상태"를 판단하는 방법:** 스킬 파일에는 생성한 버전이 기록되므로 OpenSpec은 이를
설치된 CLI와 비교합니다. 명령 파일에는
버전 정보가 없으므로 명령은 있지만 스킬이 없는 도구(전달 방식이
`commands`)에서는 현재 생성할 파일 내용과 비교합니다.
해당 파일을 직접 편집한 경우 변경된 것으로 간주되어 덮어씁니다.
전달 방식이 `skills` 또는 `both`이면 기록된 버전만 확인하므로 직접 편집한 파일도
버전이 일치하면 그대로 유지됩니다. 강제로 다시 작성하려면 `--force`를 사용하세요. 어느 경우든 생성된 파일은 OpenSpec이 관리하므로 자체 지침은 다른 곳에 보관하세요.

---

## Stores(독립 OpenSpec 저장소)

> **베타.** Stores와 이를 기반으로 하는 기능(참조, 작업 컨텍스트, 작업 세트)은 새 기능입니다. 릴리스에 따라 명령 이름, 플래그, 파일 형식, JSON 출력이 바뀔 수 있습니다. 문제를 먼저 설명하는 안내는 [stores 안내서](/ko-KR/stores-beta/user-guide/)를 참조하세요.

store는 이 컴퓨터에 등록한 독립 OpenSpec 저장소입니다(예: 계획 저장소 또는 계약 저장소). store를 등록하면 어디서든 `--store <id>`를 지정해 일반 명령(`list`, `show`, `status`, `validate`, `new change`, `archive` 등)을 실행할 수 있습니다.

### `openspec store setup`

로컬 store를 만들고 등록합니다. 터미널에서 인수 없이 실행하면 OpenSpec이 설정 과정을 안내합니다. 에이전트와 스크립트에서는 입력을 명시하고 `--json`을 사용해야 합니다.

```bash
openspec store setup [id] [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--path <path>` | store를 둘 폴더(예: `~/openspec/<id>`) |
| `--remote <url>` | 정식 원격 주소를 새 store의 `store.yaml`에 기록합니다. |
| `--init-git` | 초기 커밋과 함께 Git 저장소를 초기화합니다(기본값). |
| `--no-init-git` | Git 작업을 모두 건너뜁니다(초기화 및 초기 커밋 없음). |
| `--json` | JSON 출력 |

비대화형 실행(`--json`, 스크립트, 에이전트)에서는 store ID와 `--path`를 모두 지정해야 합니다. 대화형 터미널에서는 사용자가 볼 수 있고 직접 관리하는 위치(예: `~/openspec/<id>`)를 편집 가능한 제안값으로 보여 주며, OpenSpec이 관리하는 데이터 디렉터리를 기본값으로 사용하지 않습니다.

예:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

기존 로컬 store 폴더를 등록합니다. Stores 베타 기간에는 루트에
변경 사항이 있거나 사양을 적용하거나 변경 사항을 보관하기 전에도 등록할 수 있습니다. 이 경우 일반 명령에서 생성할 때까지 `openspec/changes/`, `openspec/specs/`, `openspec/changes/archive/`가 없어도 됩니다. `store: <id>`를 선언한 구성 전용 저장소는 다른 store를 가리키는 포인터로 유지되며 해당 포인터를 제거하지 않는 한 store 루트로 등록되지 않습니다.

```bash
openspec store register [path] [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--id <id>` | Store ID. 기본값은 store 메타데이터 또는 폴더 이름입니다. |
| `--yes` | 정상 OpenSpec 루트에 store 식별 메타데이터를 생성하는 작업을 확인합니다. |
| `--json` | JSON 출력 |

### `openspec store unregister`

파일을 삭제하지 않고 로컬 store 등록을 해제합니다.

```bash
openspec store unregister <id> [--json]
```

store를 이동하거나 다른 위치에 복제했거나 이 컴퓨터의 OpenSpec에서 더 이상 표시하지 않으려는 경우 사용하세요.

### `openspec store remove`

로컬 store 등록을 해제하고 해당 로컬 폴더를 삭제합니다.

```bash
openspec store remove <id> [--yes] [--json]
```

대화형 터미널에서 `remove`를 실행하면 삭제 전에 정확한 폴더를 표시합니다. 에이전트, 스크립트, JSON 호출자는 삭제를 확인하기 위해 `--yes`를 전달해야 합니다. OpenSpec은 일치하는 store 메타데이터가 없는 폴더를 삭제하지 않습니다.

### `openspec store list`

로컬에 등록된 store를 나열합니다.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

로컬 store 등록, 메타데이터, Git 저장소 유무를 확인합니다.

```bash
openspec store doctor [id] [--json]
```

doctor는 진단 전용입니다. store를 수정하지 않고 누락된 루트, 메타데이터 불일치, 잘못된 로컬 레지스트리 상태를 보고합니다.

### 프로젝트에서 store 참조하기

프로젝트 저장소는 `openspec/config.yaml`에서 작업에 사용할 store를 선언할 수 있습니다.

```yaml
schema: spec-driven
references:
  - team-context
```

이후 해당 저장소의 `openspec instructions` 출력(산출물별 및 `apply` 인터페이스, JSON 및 대화형 모드)에는 참조된 각 store의 사양 색인이 포함됩니다. 사양 ID, 각 사양의 Purpose 섹션을 한 줄로 요약한 내용, 가져오기 명령(`openspec show <spec-id> --type spec --store <id>`)이 표시됩니다. 색인은 실행할 때마다 등록된 체크아웃에서 실시간으로 구성되며 사양 내용 자체는 출력에 복사되지 않습니다.

참조는 읽기 전용 컨텍스트입니다. 명령 실행 위치를 바꾸지 않습니다. 작업은 저장소 자체 루트에서 계속 진행하며 참조된 store에 기록하려면 `--store`를 명시해야 합니다. 확인할 수 없는 참조(예: 이 컴퓨터에 등록되지 않은 store)는 색인에 정확한 해결 방법과 함께 경고로 표시되며 지침은 계속 생성됩니다. `openspec doctor`에서 참조 상태를 한곳에 모아 확인할 수 있습니다.

### Store 복제 원본 기록하기

Store는 커밋하는 식별 파일에 정식 복제 원본을 기록할 수 있으므로 새로 합류한 팀원이 "store를 등록하세요"라는 안내에서 막히지 않습니다.

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

원격 주소는 초기 커밋의 `.openspec-store/store.yaml`에 기록되므로 복제본에서 바로 확인할 수 있습니다. 기존 store에서는 `store.yaml`을 직접 편집해 커밋하세요. `store doctor`에는 기록된 원격 주소와 체크아웃에서 확인한 Git 원본이 표시됩니다. setup/register에서 공유 안내에 원격 주소가 포함되고 register는 체크아웃의 원본을 컴퓨터 로컬 레지스트리에 기록합니다.

참조 선언에 복제 원본을 함께 기록할 수도 있습니다. 그러면 아직 store가 없는 팀원에게 붙여 넣어 실행할 수 있는 전체 해결 명령(`git clone <remote> <path> && openspec store register <path> --id <id>`)이 제공됩니다.

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

원격 주소를 기록하는 것은 동기화가 아닙니다. OpenSpec은 직접 복제, pull, push를 하지 않습니다.

### 기본 store 선언하기

계획을 전부 외부화한 저장소(로컬 `openspec/specs/` 또는 `openspec/changes/`가 없음)에서는 모든 명령에 `--store`를 지정하는 대신 store를 한 번 선언할 수 있습니다.

```yaml
# openspec/config.yaml (the only file under openspec/)
store: team-context
```

이후 일반 명령은 선언된 store로 자동 연결됩니다. 루트 배너와 JSON `root` 블록에 store ID와 함께 `source: "declared"`가 표시되며, 출력되는 안내에는 계속 `--store <id>`가 포함됩니다. 선언은 대체 경로일 뿐 우선하지 않습니다. 명시적으로 지정한 `--store`가 항상 우선하며 실제 계획 폴더가 있는 디렉터리에서는 포인터를 무시하고 경고를 출력합니다. 포인터 저장소를 로컬 OpenSpec 루트로 바꾸려면 `store:` 줄을 제거한 다음 `openspec init`을 실행하세요. 선언이 있으면 init은 기본 구조를 만들지 않습니다.

컴퓨터 수준 설정은 모든 저장소에 한꺼번에 적용됩니다. `openspec config set defaultStore <id>`를 사용하세요(구성 참조). `--store`, 로컬 루트, 프로젝트 포인터로 모두 루트를 확인할 수 없을 때만 사용하며 루트 배너와 JSON `root` 블록에 `source: "global_default"`가 표시됩니다.

## Doctor(관계 상태)

읽기 전용으로 한곳에서 확인합니다. OpenSpec 루트가 정상이며 참조된 store를 이 컴퓨터에서 사용할 수 있나요?

```bash
openspec doctor [--store <id>] [--json]
```

보고서에서는 루트 상태, store 메타데이터 상태(기록된 원격 주소와 체크아웃 원본이 다를 때의 알림 및 store 체크아웃이 마지막으로 가져온 업스트림 추적 참조보다 뒤처졌을 때의 알림 포함), 참조 상태(지침에 표시되는 진단과 동일하며 확인할 수 없는 참조에는 복제 방법 포함)를 구분합니다. 상태 진단의 심각도와 무관하게 종료 코드 0을 반환하며 에이전트는 `status` 배열을 읽습니다. 루트 없음, 알 수 없는 store와 같은 명령 실패만 종료 코드 1을 반환합니다. Doctor는 복제, 동기화, 복구를 하지 않습니다. 상태가 아니라 전체 작업 집합을 보려면 `openspec context`를 사용하세요.

## 작업 컨텍스트(구성된 집합)

OpenSpec 선언을 통해 이 작업과 관련된 모든 항목, 즉 OpenSpec 루트와 참조하는 store를 하나의 작업 집합으로 구성합니다.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

JSON 요약은 에이전트에서 사용할 수 있습니다(사용 가능한 참조 store마다 가져오기 절차가 포함되며 확인할 수 없는 항목에는 동일한 해결 지침이 포함됨). `--code-workspace`를 사용하면 루트와 사용 가능한 참조 store(`ref:<id>` 폴더)가 포함된 VS Code workspace 파일도 작성합니다. 이 명령은 이 파일 하나만 작성하며 파일이 이미 있으면 `--force` 없이 거부합니다. 사용할 수 없는 항목은 임의로 추측하지 않고 보고합니다.

"작업 컨텍스트"는 구성된 집합이며 `openspec/config.yaml`의 `context:` 필드는 지침에 삽입되는 프로젝트 배경 정보입니다. 서로 다른 개념입니다. `openspec doctor`는 집합의 상태를, `openspec context`는 집합의 구성을 보여 줍니다.

## 개인 작업 세트

> **베타.** 작업 세트는 새 베타 기능입니다. 릴리스에 따라 명령, 플래그, 파일 형식이 바뀔 수 있습니다. 전체 안내는 [stores 안내서](/ko-KR/stores-beta/user-guide/#작업-세트-함께-작업하는-폴더-다시-열기)를 참조하세요.

작업 세트는 계획 루트와 원하는 다른 폴더 등 함께 작업하는 폴더를 이름으로 저장해 도구에서 다시 여는 개인용 보기입니다. 컴퓨터 로컬에만 저장되며 커밋하거나 공유하지 않고 선언을 바탕으로 생성하지도 않습니다. 작업 세트를 삭제해도 구성 폴더에는 영향을 주지 않습니다.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create`는 짧은 안내 절차를 실행합니다(비대화형 모드에서는 `--member` 플래그 사용 가능. 첫 번째 구성원이 기본 항목이며 세션은 여기서 시작). `open`은 선택한 도구를 실행합니다. VS Code, Cursor와 같은 편집기는 모든 구성원이 포함된 창을 열고 반환하며, Claude Code, codex와 같은 CLI 에이전트는 모든 구성원이 연결되고 프롬프트가 미리 입력되지 않은 세션으로 현재 터미널을 사용하다가 종료 시 반환합니다. 열 때 누락된 구성원 폴더는 안내와 함께 건너뛰고 나머지는 엽니다. 저장된 도구 기본 설정은 열 때마다 `--tool`로 재정의할 수 있습니다.

새 도구 지원에는 코드 변경이 아니라 구성만 필요합니다. 모든 도구는 두 실행 방식 중 하나를 사용합니다. `workspace-file`(생성된 `.code-workspace` 파일로 실행) 또는 `attach-dirs`(구성원별 연결 플래그 사용)입니다. 전역 `config.json`의 `openers` 키를 사용하면 도구를 추가하거나 기본 설정의 특정 필드를 조정할 수 있습니다(`openspec config edit`로 열기).

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

모든 작업 세트 상태는 전역 데이터 디렉터리의 `worksets/` 폴더에 저장됩니다(저장된 보기와 생성된 `<name>.code-workspace` 파일 포함. 파일은 열 때마다 다시 생성). 이 폴더를 삭제하면 모든 흔적이 제거됩니다.

---

## 탐색 명령

### `openspec list`

프로젝트의 변경 사항 또는 사양을 나열합니다.

```
openspec list [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--specs` | 변경 사항 대신 사양을 나열합니다. |
| `--changes` | 변경 사항을 나열합니다(기본값). |
| `--sort <order>` | `recent`(기본값) 또는 `name` 기준으로 정렬합니다. |
| `--json` | JSON 출력 |

**예:**

```bash
# List all active changes
openspec list

# List all specs
openspec list --specs

# JSON output for scripts
openspec list --json
```

**출력(텍스트):**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

사양과 변경 사항을 탐색하는 대화형 대시보드를 표시합니다.

```
openspec view
```

프로젝트의 사양 및 변경 사항을 탐색하는 터미널 기반 인터페이스를 엽니다.

---

### `openspec show`

변경 사항 또는 사양의 세부 정보를 표시합니다.

```
openspec show [item-name] [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `item-name` | 아니요 | 변경 사항 또는 사양 이름(생략하면 입력 요청) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--type <type>` | 유형 지정: `change` 또는 `spec`(모호하지 않으면 자동 감지) |
| `--json` | JSON 출력 |
| `--no-interactive` | 프롬프트 비활성화 |

**변경 사항 전용 옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--deltas-only` | 델타 사양만 표시합니다(JSON 모드). |

**사양 전용 옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--requirements` | 시나리오를 제외하고 요구 사항만 표시합니다(JSON 모드). |
| `--no-scenarios` | 시나리오 내용을 제외합니다(JSON 모드). |
| `-r, --requirement <id>` | 1부터 시작하는 인덱스로 특정 요구 사항을 표시합니다(JSON 모드). |

**예:**

```bash
# Interactive selection
openspec show

# Show a specific change
openspec show add-dark-mode

# Show a specific spec
openspec show auth --type spec

# JSON output for parsing
openspec show add-dark-mode --json
```

---

## 검증 명령

### `openspec validate`

변경 사항과 사양의 구조적 문제를 검증하고 변경 사항의 MODIFIED 요구 사항을 대체 대상인 기본 사양과 대조합니다.

```
openspec validate [item-name] [options]
```

사양 델타가 없는 변경 사항은 `.openspec.yaml`에 `skip_specs: true`를 선언하지 않으면 검증에 실패합니다(순수 리팩터링, 도구 또는 문서 작업. [레시피 5](/ko-KR/examples/#레시피-5-동작-변경-없는-리팩터링) 참조).

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `item-name` | 아니요 | 검증할 항목(생략하면 입력 요청) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--all` | 모든 변경 사항과 사양을 검증합니다. |
| `--changes` | 모든 변경 사항을 검증합니다. |
| `--specs` | 모든 사양을 검증합니다. |
| `--archived` | 보관된 변경 사항의 모든 작업이 완료됐는지 검증합니다(커밋 전 린트용). |
| `--type <type>` | 이름이 모호한 경우 유형 지정: `change` 또는 `spec` |
| `--strict` | 엄격한 검증 모드를 활성화합니다. |
| `--json` | JSON 출력 |
| `--concurrency <n>` | 병렬 검증 최대 수(기본값: 6 또는 `OPENSPEC_CONCURRENCY` 환경 변수) |
| `--no-interactive` | 프롬프트 비활성화 |

`--archived`는 독립된 범위입니다. 이미 보관 시 적용된 사양 델타는 검증하지 않고 `changes/archive/` 아래의 모든 변경 사항에서 `tasks.md` 체크박스가 전부 선택됐는지 확인합니다. 하나라도 선택되지 않은 경우 0이 아닌 종료 코드를 반환합니다. 미완료 작업을 남긴 채 보관한 변경 사항을 감지하므로 커밋 전 훅에 유용합니다.

**예:**

```bash
# Interactive validation
openspec validate

# Validate a specific change
openspec validate add-dark-mode

# Validate all changes
openspec validate --changes

# Validate everything with JSON output (for CI/scripts)
openspec validate --all --json

# Strict validation with increased parallelism
openspec validate --all --strict --concurrency 12

# Fail if any archived change still has unchecked tasks
openspec validate --archived
```

**출력(텍스트):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**출력(JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## 생명 주기 명령

### `openspec archive`

완료된 변경 사항을 보관하고 델타 사양을 기본 사양에 병합합니다.

```
openspec archive [change-name] [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니요 | 보관할 변경 사항(생략하면 입력 요청, 프롬프트에 응답할 수 없는 환경에서는 필수) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `-y, --yes` | 확인 프롬프트를 건너뜁니다. AI 에이전트, CI 작업 또는 표준 입력이 닫힌 실행처럼 프롬프트에 응답할 수 없는 경우 필수입니다. |
| `--skip-specs` | 이번 보관에서 사양 업데이트를 건너뜁니다. 사양 델타가 영구히 없는 변경 사항은 `.openspec.yaml`에 `skip_specs: true`를 선언해야 합니다. 이 경우 플래그 없이 보관할 수 있습니다. |
| `--no-validate` | 검증을 건너뜁니다(확인 필요). 기능 폐기도 비활성화됩니다. 검증기 판단이 없으면 아무것도 폐기되지 않습니다. |

**예:**

```bash
# Interactive archive (asks which change, then confirms)
openspec archive

# Archive specific change
openspec archive add-dark-mode

# Archive without prompts (agents, CI, scripts)
openspec archive add-dark-mode --yes

# Archive a tooling change that doesn't affect specs
openspec archive update-ci-config --skip-specs
```

**기능 폐기:** 변경 사항 메타데이터에 폐기 표시를 추가합니다.

```yaml
# openspec/changes/retire-legacy/.openspec.yaml
schema: spec-driven
retire_capabilities: true
```

그런 다음 평소처럼 변경 사항을 보관합니다.

```bash
openspec archive retire-legacy --yes
```

변경 사항에서 해당 기능의 마지막 요구 사항을 제거하면 OpenSpec이 실제
`spec.md`를 삭제합니다. 같은 변경 사항의 다른 기능 델타는 기본 사양을 계속 업데이트합니다. 표시가 없으면 보관은 파일을 변경하기 전에 중지되고 표시를 추가하라는 안내를 출력합니다.

**수행 작업:**

1. 변경 사항을 검증합니다(`--no-validate`가 아닌 경우).
2. 확인을 요청합니다(`--yes`가 아닌 경우).
3. 기본 사양을 변경하기 전에 보관 대상 경로를 확보합니다.
4. 활성 델타 사양을 검증해 `openspec/specs/`에 병합합니다. 변경 사항에서 마지막 요구 사항을 제거한 기능은 폐기되고 사양 파일도 삭제되지만 변경 사항의 `.openspec.yaml`에서 `schema:`와 함께 `retire_capabilities: true`를 선언한 경우에만 해당합니다.
5. 변경 사항 폴더를 `openspec/changes/archive/YYYY-MM-DD-<name>/`으로 이동합니다.
6. 보관이 완료되기 전에 사양 수정 또는 마지막 이동이 실패하면 사양을 복원하고 변경 사항을 기존 활성 경로에 남기거나 되돌립니다.
7. 확인된 대체 복사본을 만들었지만 준비된 원본 정리가 실패한 경우 복구를 위해 완전한 보관 파일과 커밋된 사양 상태를 유지합니다.

**터미널을 사용할 수 없는 경우:** AI 에이전트, CI 작업 또는 표준 입력이 닫힌 실행은
2단계에서 응답할 수 없으므로 보관은 아무것도 수정하지 않은 채 중지되고 종료 코드 1을 반환하며 재실행할 명령(`openspec archive <name> --yes`와 기존에 지정한 다른 플래그)을 안내합니다. 다시 시도하지 않으려면 처음부터 `--yes`와 변경 사항 이름을 전달하세요.

---

## 워크플로 명령

이 명령은 산출물 기반 OPSX 워크플로를 지원합니다. 진행 상황을 확인하는 사용자와 다음 단계를 결정하는 에이전트 모두에게 유용합니다.

### `openspec new change`

확인된 OpenSpec 루트에 변경 사항 디렉터리와 선택적인 커밋용 메타데이터를 만듭니다.

```bash
openspec new change <name> [options]
```

변경 사항 이름은 소문자 kebab-case를 사용해야 합니다. 소문자, 숫자,
단일 하이픈을 사용할 수 있습니다. 공백, 밑줄, 대문자, 연속 하이픈, 시작/끝 하이픈은 사용할 수 없습니다. 이름 앞에 숫자를 붙일 수 있으므로 `100-add-feature` 또는 `00001-add-auth`처럼 순서나 등급을 표시할 수 있습니다.

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--description <text>` | `README.md`에 추가할 설명 |
| `--goal <text>` | 변경 사항과 함께 저장할 선택적 목표 메타데이터 |
| `--schema <name>` | 사용할 워크플로 스키마 |
| `--store <id>` | OpenSpec 루트로 사용할 store ID(등록된 독립 OpenSpec 저장소) |
| `--json` | JSON 출력 |

예:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

변경 사항의 산출물 완료 상태를 표시합니다.

```
openspec status [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--change <id>` | 변경 사항 이름(생략하면 입력 요청) |
| `--schema <name>` | 스키마 재정의(변경 사항 구성에서 자동 감지) |
| `--json` | JSON 출력 |

**예:**

```bash
# Interactive status check
openspec status

# Status for specific change
openspec status --change add-dark-mode

# JSON for agent use
openspec status --change add-dark-mode --json
```

**출력(텍스트):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[x] specs
[ ] design
[-] tasks (blocked by: design)
```

`skip_specs: true`를 선언한 변경 사항은 사양 단계를 `[~] specs (skipped: change declares skip_specs)`로 표시하고 진행률 계산에서 제외합니다.

**출력(JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isPlanningComplete": false,
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

`isPlanningComplete`은 건너뛴 항목을 제외한 계획 산출물이 모두 있는지 표시합니다.
건너뛴 산출물은 생성하지 않아도 충족된 것으로 간주합니다. 구현 작업의 완료 여부를 나타내지는 않습니다. `isComplete`는 같은 값을 사용하는 호환 별칭으로 유지됩니다.

산출물은 의존성 순서로 나열되며 의존 항목이
이를 필요로 하는 항목보다 뒤에 표시되지 않습니다. 동시에 준비되는 산출물(spec-driven의 `specs`와 `design`은 모두 `proposal`만 필요)은 알파벳순이 아니라 스키마 선언 순서를 따릅니다. 따라서 첫 번째 `ready` 항목이 다음에 작성할 산출물입니다.

---

### `openspec instructions`

산출물 생성 또는 작업 적용을 위한 상세 지침을 가져옵니다. AI 에이전트가 다음에 생성할 내용을 파악하는 데 사용합니다.

```
openspec instructions [artifact] [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `artifact` | 아니요 | 산출물 ID 또는 워크플로 입력 인터페이스: `apply` 또는 `archive` |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--change <id>` | 변경 사항 이름(비대화형 모드에서 필수) |
| `--schema <name>` | 스키마 재정의 |
| `--json` | JSON 출력 |

**특수 사례:** 작업 구현 지침은 `apply`를 사용해 가져오세요. `archive`는 유효한 변경 사항의 현재 읽기 전용 보관 입력(`context`, `operationGuidance`)을 가져옵니다. 실제로 보관하거나 내용을 수정하지 않습니다.

**예:**

```bash
# Get instructions for next artifact
openspec instructions --change add-dark-mode

# Get specific artifact instructions
openspec instructions design --change add-dark-mode

# Get apply/implementation instructions
openspec instructions apply --change add-dark-mode

# Get current archive operation inputs without archiving
openspec instructions archive --change add-dark-mode --json

# JSON for agent consumption
openspec instructions design --change add-dark-mode --json
```

**출력 항목:**

- 산출물의 템플릿 내용
- 구성 파일의 프로젝트 컨텍스트
- 의존 산출물의 내용
- 구성 파일에서 산출물별로 지정한 규칙
- `apply`/`archive`에 대한 현재 프로젝트 컨텍스트 및 일치하는 작업 안내

작업 입력은 호출할 때마다 확인된 저장소 또는 선택된 store에서 읽습니다. 프로젝트 컨텍스트는 프롬프트에 반드시 포함해야 하는 입력입니다. 에이전트는 이를 읽고 관련 프로젝트 사실, 관례, 제약 조건을 적용합니다. 작업 안내는 선택적으로 추가되는 조언입니다. 에이전트는 모든 항목을 고려하되 기본 제공 워크플로에 적용 가능하고 호환되는 항목만 따릅니다. 두 필드는 사용자가 명시적으로 선택한 내용, CLI가 관리하는 상태, 기본 지침, 산출물 규칙과 별도로 유지됩니다. 서로 충돌하는 컨텍스트는 보고하며 충돌하거나 적용할 수 없는 안내는 따르지 않고 이유를 설명합니다. 이는 생성된 에이전트의 동작 계약이며 CLI에서 강제되는 검사는 아닙니다. `instructions archive`는 선택한 변경 사항, 선택적 입력, 루트 메타데이터만 반환하며 정적인 보관 워크플로는 포함하지 않습니다.

`skip_specs: true`로 건너뛴 산출물은 출력에 경고만 표시합니다(JSON에서는 `skipped`/`warning` 필드 추가). 해당 산출물을 만들면 안 됩니다.

---

### `openspec templates`

스키마의 모든 산출물에 대해 확인된 템플릿 경로를 표시합니다.

```
openspec templates [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--schema <name>` | 확인할 스키마(기본값: `spec-driven`) |
| `--json` | JSON 출력 |

**예:**

```bash
# Show template paths for default schema
openspec templates

# Show templates for custom schema
openspec templates --schema my-workflow

# JSON for programmatic use
openspec templates --json
```

**출력(텍스트):**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

사용 가능한 워크플로 스키마와 설명 및 산출물 흐름을 나열합니다.

```
openspec schemas [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--json` | JSON 출력 |
| `--store <id>` | 등록된 store를 OpenSpec 루트로 사용 |

**예:**

```bash
openspec schemas
```

**출력:**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## 스키마 명령

사용자 지정 워크플로 스키마를 생성하고 관리하는 명령입니다.

### `openspec schema init`

새 프로젝트 로컬 스키마를 만듭니다.

```
openspec schema init <name> [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `name` | 예 | 스키마 이름(kebab-case) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--description <text>` | 스키마 설명 |
| `--artifacts <list>` | 쉼표로 구분된 산출물 ID(기본값: `proposal,specs,design,tasks`) |
| `--default` | 프로젝트 기본 스키마로 설정 |
| `--no-default` | 기본값으로 설정할지 묻지 않음 |
| `--force` | 기존 스키마 덮어쓰기 |
| `--json` | JSON 출력 |

**예:**

```bash
# Interactive schema creation
openspec schema init research-first

# Non-interactive with specific artifacts
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**생성 항목:**

```
openspec/schemas/<name>/
├── schema.yaml           # Schema definition
└── templates/
    ├── proposal.md       # Template for each artifact
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

사용자 지정할 수 있도록 기존 스키마를 프로젝트에 복사합니다.

```
openspec schema fork <source> [name] [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `source` | 예 | 복사할 스키마 |
| `name` | 아니요 | 새 스키마 이름(기본값: `<source>-custom`) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--force` | 기존 대상 덮어쓰기 |
| `--json` | JSON 출력 |

**예:**

```bash
# Fork the built-in spec-driven schema
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

스키마의 구조와 템플릿을 검증합니다.

```
openspec schema validate [name] [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `name` | 아니요 | 검증할 스키마(생략하면 전체 검증) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--verbose` | 상세 검증 단계 표시 |
| `--json` | JSON 출력 |

**예:**

```bash
# Validate a specific schema
openspec schema validate my-workflow

# Validate all schemas
openspec schema validate
```

---

### `openspec schema which`

스키마가 어떤 위치에서 확인되는지 표시합니다(우선순위 문제를 디버깅할 때 유용).

```
openspec schema which [name] [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `name` | 아니요 | 스키마 이름 |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--all` | 모든 스키마와 출처 나열 |
| `--json` | JSON 출력 |

**예:**

```bash
# Check where a schema comes from
openspec schema which spec-driven
```

**출력:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**스키마 우선순위:**

1. 프로젝트: `openspec/schemas/<name>/`
2. 사용자: `~/.local/share/openspec/schemas/<name>/`
3. 패키지: 기본 제공 스키마

---

## 구성 명령

### `openspec config`

전역 OpenSpec 구성을 확인하고 수정합니다.

```
openspec config <subcommand> [options]
```

**하위 명령:**

| 하위 명령 | 설명 |
|------------|-------------|
| `path` | 구성 파일 위치 표시 |
| `list` | 현재 설정 모두 표시 |
| `get <key>` | 특정 값 가져오기 |
| `set <key> <value>` | 값 설정 |
| `unset <key>` | 키 제거 |
| `reset` | 기본값으로 초기화 |
| `edit` | `$EDITOR`에서 열기 |
| `profile [preset]` | 대화형 또는 프리셋을 통해 워크플로 프로필 구성 |

**예:**

```bash
# Show config file path
openspec config path

# List all settings
openspec config list

# Get a specific value
openspec config get telemetry.enabled

# Set a value (disable anonymous usage telemetry)
openspec config set telemetry.enabled false

# Set a string value explicitly
openspec config set user.name "My Name" --string

# Remove a custom setting
openspec config unset user.name

# Set a machine-level default store (fallback root when no --store,
# local root, or project store: pointer resolves)
openspec config set defaultStore team-plans

# Reset all configuration
openspec config reset --all --yes

# Edit config in your editor
openspec config edit

# Configure profile with action-based wizard
openspec config profile

# Fast preset: switch workflows to core (keeps delivery mode)
openspec config profile core
```

**텔레메트리 거부:** `telemetry.enabled`를 지정하지 않으면 기본적으로 켜집니다(거부 방식).
익명 사용 통계와 `openspec update` 버전 확인을 비활성화하려면 `false`로 설정하세요.
환경 변수는 구성보다 우선합니다. `OPENSPEC_TELEMETRY=0`, `DO_NOT_TRACK=1`,
또는 참으로 평가되는 `CI` 값(예: `true`/`1`/`yes)이 설정되면 구성 값과 관계없이 텔레메트리를 비활성화합니다.

`openspec config profile`은 현재 상태 요약을 표시한 뒤 다음 항목을 선택하게 합니다.
- 전달 방식 및 워크플로 변경
- 전달 방식만 변경
- 워크플로만 변경
- 현재 설정 유지(종료)

현재 설정을 유지하면 변경 사항을 기록하지 않고 업데이트 확인도 표시하지 않습니다.
구성은 바뀌지 않았지만 현재 프로젝트 파일이 전역 프로필/전달 방식과 동기화되지 않은 경우 OpenSpec은 경고를 표시하고 `openspec update`를 제안합니다.
`Ctrl+C`를 누르면 스택 추적 없이 정상적으로 흐름을 취소하고 종료 코드 `130`을 반환합니다.
워크플로 체크리스트에서 `[x]`는 전역 구성에서 선택된 워크플로를 의미합니다. 선택 항목을 프로젝트 파일에 적용하려면 `openspec update`를 실행하거나 프로젝트 내부 프롬프트에서 `Apply changes to this project now?`를 선택하세요.

**대화형 예:**

```bash
# Delivery-only update
openspec config profile
# choose: Change delivery only
# choose delivery: Skills only

# Workflows-only update
openspec config profile
# choose: Change workflows only
# toggle workflows in the checklist, then confirm
```

---

## 유틸리티 명령

### `openspec feedback`

OpenSpec에 대한 피드백을 제출합니다. GitHub 이슈를 생성합니다.

```
openspec feedback <message> [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `message` | 예 | 피드백 요약. 긴 텍스트는 이슈 제목에서 줄이고 본문에는 그대로 남깁니다. |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--body <text>` | 요약 뒤에 추가할 세부 정보 |

**요구 사항:** GitHub CLI(`gh`)를 설치하고 인증해야 합니다.

**예:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

OpenSpec CLI의 셸 자동 완성을 관리합니다.

```
openspec completion <subcommand> [shell]
```

**하위 명령:**

| 하위 명령 | 설명 |
|------------|-------------|
| `generate [shell]` | 자동 완성 스크립트를 표준 출력으로 내보냅니다. |
| `install [shell]` | 셸 자동 완성을 설치합니다. |
| `uninstall [shell]` | 설치된 자동 완성을 제거합니다. |

**지원 셸:** `bash`, `zsh`, `fish`, `powershell`

**예:**

```bash
# Install completions (auto-detects shell)
openspec completion install

# Install for specific shell
openspec completion install zsh

# Generate script for manual installation (bash)
openspec completion generate bash > ~/.bash_completion.d/openspec

# Uninstall
openspec completion uninstall
```

**Windows(PowerShell):** 현재 PowerShell 호스트용 자동 완성을 설치합니다.

```powershell
$env:PROFILE = $PROFILE
openspec completion install powershell
. $PROFILE
```

`$env:PROFILE`은 이 세션에서 구성할 프로필을 OpenSpec에 알려 줍니다. 설치 프로그램은 누락된 프로필 디렉터리를 만들고 `OpenSpecCompletion.ps1`을 불러오는 관리 블록을 추가합니다. 프로필을 다시 불러오면 자동 완성이 즉시 활성화됩니다.

현재 호스트에서 제거하려면 다음을 실행하세요.

```powershell
$env:PROFILE = $PROFILE
openspec completion uninstall powershell
```

현재 세션에서 자동 완성을 지우려면 제거한 뒤 PowerShell을 다시 시작하세요.

자동 완성은 선택 사항입니다. CLI는 대화형 터미널에서 명령을 처음
실행할 때 표준 오류에 한 번만 안내하며 이후에는 다시 표시하지 않습니다. 이미 자동 완성이 설치되어 있으면 안내하지 않습니다. 안내를 완전히 숨기려면 `OPENSPEC_NO_COMPLETIONS=1`을 설정하세요.

---

## 종료 코드

| 코드 | 의미 |
|------|---------|
| `0` | 성공 |
| `1` | 오류(검증 실패, 파일 누락 등) |

---

## 환경 변수

| 변수 | 설명 |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | `0`으로 설정하면 텔레메트리와 `openspec update` 버전 확인을 비활성화합니다(전역 구성의 `telemetry.enabled`보다 우선). |
| `DO_NOT_TRACK` | `1`로 설정하면 텔레메트리와 `openspec update` 버전 확인을 비활성화합니다(표준 DNT 신호, 구성보다 우선). |
| `OPENSPEC_CONCURRENCY` | 일괄 검증의 기본 동시 실행 수(기본값: 6) |
| `EDITOR` 또는 `VISUAL` | `openspec config edit`에서 사용할 편집기 |
| `NO_COLOR` | 설정된 경우 색상 출력 비활성화 |
| `OPENSPEC_NO_ANIMATION` | 설정된 경우 `openspec init` 시작 애니메이션 비활성화 |
| `OPENSPEC_NO_COMPLETIONS` | `1`로 설정하면 셸 자동 완성에 관한 일회성 안내를 숨깁니다. |
| `OPENSPEC_NO_UPDATE_CHECK` | 설정된 경우(빈 값 포함 모든 값) `openspec update`의 최신 CLI 버전 확인을 비활성화합니다. `CI`가 설정되었거나(`false`/`0`/`no`/`off` 제외) `NODE_ENV=test`인 경우에도 확인하지 않습니다. |
| `npm_config_registry` | `openspec update` 버전 확인에 사용할 레지스트리입니다. `http(s)` URL이어야 하며 아니면 `https://registry.npmjs.org`로 대체됩니다. `.npmrc` 파일은 읽지 않습니다. |

---

## 관련 문서

- [명령](/ko-KR/commands/) — AI 슬래시 명령(`/opsx:propose`, `/opsx:apply` 등)
- [워크플로](/ko-KR/workflows/) — 일반적인 패턴과 각 명령을 사용할 시점
- [사용자 지정](/ko-KR/customization/) — 사용자 지정 스키마 및 템플릿 만들기
- [시작하기](/ko-KR/getting-started/) — 최초 설정 안내서
