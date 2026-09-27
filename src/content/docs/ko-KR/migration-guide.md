---
title: "OPSX로 마이그레이션"
---

이 안내서는 기존 OpenSpec 워크플로에서 OPSX로 전환하는 방법을 설명합니다. 기존 작업을 보존하며 새 시스템의 유연성을 제공하는 원활한 마이그레이션을 목표로 합니다.

## 무엇이 바뀌나요?

OPSX는 단계에 고정된 기존 워크플로를 유연한 동작 기반 접근 방식으로 바꿉니다. 주요 변경 사항은 다음과 같습니다.

| 항목 | 기존 방식 | OPSX |
|--------|--------|------|
| **명령** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | 기본값: `/opsx:propose`, `/opsx:explore`, `/opsx:apply`, `/opsx:update`, `/opsx:sync`, `/opsx:archive`(확장 워크플로 명령은 선택 사항) |
| **워크플로** | 모든 산출물을 한 번에 생성 | 점진적으로 또는 한꺼번에 생성 — 원하는 방식 선택 |
| **이전 단계로 돌아가기** | 불편한 단계별 관문 | 자연스럽게 언제든 산출물 업데이트 |
| **사용자 지정** | 고정된 구조 | 스키마 기반, 자유롭게 조정 가능 |
| **구성** | 표시 블록이 있는 `CLAUDE.md` + `project.md` | `openspec/config.yaml`에 정리된 구성 |

**철학의 변화:** 작업은 선형적이지 않습니다. OPSX는 작업이 선형적이라고 가장하지 않습니다.

---

## 시작하기 전에

### 기존 작업은 안전하게 보존됩니다

마이그레이션은 기존 작업을 보존하도록 설계되었습니다.

- **`openspec/changes/`의 활성 변경 사항** — 완전히 보존되며 OPSX 명령으로 계속 진행할 수 있습니다.
- **보관된 변경 사항** — 수정하지 않습니다. 이력이 유지됩니다.
- **`openspec/specs/`의 기본 사양** — 수정하지 않습니다. 기준 정보로 유지됩니다.
- **CLAUDE.md, AGENTS.md 등의 사용자 콘텐츠** — 보존됩니다. OpenSpec 표시 블록만 제거하고 직접 작성한 내용은 그대로 둡니다.

### 제거되는 항목

대체할 OpenSpec 관리 파일만 제거합니다.

| 항목 | 이유 |
|------|-----|
| 기존 슬래시 명령 디렉터리/파일 | 새로운 스킬 시스템으로 대체 |
| `openspec/AGENTS.md` | 더 이상 사용하지 않는 워크플로 실행 파일 |
| `CLAUDE.md`, `AGENTS.md` 등의 OpenSpec 표시 | 더 이상 필요하지 않음 |

**도구별 기존 명령 위치**(예이며 사용 중인 도구에 따라 다를 수 있음):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Devin Desktop, formerly Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md`(IDE 확장 전용, Copilot CLI에서 지원하지 않음)
- Codex: OpenSpec은 이제 표준 경로인 `.agents/skills/openspec-*`를 사용합니다. 기존 `.codex/skills` 경로의 OpenSpec 관리 `SKILL.md` 파일은 대체 파일이 생성된 뒤에만 정리하며 사용자 지정 파일과 서로 다른 복사본은 그대로 둡니다. 표시가 없는 `.agents` 트리에 OpenSpec 스킬이 이미 있으면 기존 Codex(`$openspec-*`) 또는 일반(`/openspec-*`) 형식을 유지하며 기존 디렉터리만으로 형식을 추측하지 않습니다. 소유 대상을 바꾸려면 `openspec init`에서 `codex`를 명시적으로 선택하세요. 기존 프롬프트 정리는 `$CODEX_HOME/prompts` 또는 `~/.codex/prompts`에 있는 OpenSpec 허용 목록의 파일 이름만 대상으로 합니다.
- 그 외(Augment, Continue, Amazon Q 등)

마이그레이션 과정에서 구성된 도구를 감지하고 해당 도구의 기존 파일을 정리합니다.

제거 목록이 길어 보일 수 있지만 모두 OpenSpec이 처음 생성한 파일입니다. 사용자 콘텐츠는 삭제되지 않습니다.

### 직접 처리해야 하는 항목

파일 하나는 직접 마이그레이션해야 합니다.

**`openspec/project.md`** — 직접 작성한 프로젝트 컨텍스트가 있을 수 있으므로 자동으로 삭제하지 않습니다. 다음 작업을 진행하세요.

1. 내용을 검토합니다.
2. 유용한 컨텍스트를 `openspec/config.yaml`로 옮깁니다(아래 안내 참조).
3. 준비가 되면 파일을 삭제합니다.

**이렇게 변경한 이유:**

기존 `project.md`는 수동적인 파일이었습니다. 에이전트가 읽을 수도 있고, 읽지 않을 수도 있으며, 읽은 내용을 잊어버릴 수도 있습니다. 따라서 일관성이 부족했습니다.

새 `config.yaml` 컨텍스트는 **모든 OpenSpec 계획 요청에 직접 주입됩니다.** 따라서 AI가 산출물을 작성할 때 프로젝트 관례, 기술 스택, 규칙이 항상 포함되어 신뢰성이 높아집니다.

**절충점:**

컨텍스트가 모든 요청에 주입되므로 간결하게 작성해야 합니다. 중요한 내용에 집중하세요.
- 기술 스택 및 주요 관례
- AI가 알아야 하는, 쉽게 파악하기 어려운 제약 조건
- 이전에 자주 무시되던 규칙

완벽하게 작성하는 데 너무 신경 쓰지 마세요. 가장 효과적인 방식을 계속 알아가고 있으며 실험을 통해 컨텍스트 주입 방법을 개선하겠습니다.

---

## 마이그레이션 실행

`openspec init`과 `openspec update` 모두 기존 파일을 감지하고 동일한 정리 과정을 안내합니다. 상황에 맞는 명령을 사용하세요.

- 새로 설치하면 기본 프로필 `core`(`propose`, `explore`, `apply`, `update`, `sync`, `archive`)를 사용합니다.
- 마이그레이션 설치에서는 필요한 경우 `custom` 프로필을 작성해 이전에 설치된 워크플로를 유지합니다.

### `openspec init` 사용

새 도구를 추가하거나 구성된 도구를 재설정하려면 다음을 실행하세요.

```bash
openspec init
```

init 명령은 기존 파일을 감지하고 정리 과정을 안내합니다.

```
Upgrading to the new OpenSpec

OpenSpec now uses agent skills, the emerging standard across coding
agents. This simplifies your setup while keeping everything working
as before.

Files to remove
No user content to preserve:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Files to update
OpenSpec markers will be removed, your content preserved:
  • CLAUDE.md
  • AGENTS.md

Needs your attention
  • openspec/project.md
    We won't delete this file. It may contain useful project context.

    The new openspec/config.yaml has a "context:" section for planning
    context. This is included in every OpenSpec request and works more
    reliably than the old project.md approach.

    Review project.md, move any useful content to config.yaml's context
    section, then delete the file when ready.

? Upgrade and clean up legacy files? (Y/n)
```

**예라고 답하면 다음 작업을 수행합니다.**

1. 기존 슬래시 명령 디렉터리를 제거합니다.
2. `CLAUDE.md`, `AGENTS.md` 등에서 OpenSpec 표시를 제거합니다(사용자 콘텐츠는 유지).
3. `openspec/AGENTS.md`를 삭제합니다.
4. `.claude/skills/`에 새 스킬을 설치합니다.
5. 기본 스키마를 포함해 `openspec/config.yaml`을 생성합니다.

### `openspec update` 사용

마이그레이션만 진행하고 기존 도구를 최신 버전으로 새로 고치려면 실행하세요.

```bash
openspec update
```

update 명령은 기존 산출물도 감지해 정리한 다음 현재 프로필 및 전달 설정에 맞게 생성된 스킬/명령을 새로 고칩니다.

### 비대화형/CI 환경

스크립트에서 마이그레이션하려면 다음을 실행하세요.

```bash
openspec init --force --tools claude
```

`--force` 플래그는 프롬프트를 건너뛰고 정리를 자동으로 승인합니다.

전역 Codex 프롬프트 디렉터리의 OpenSpec 관리 Codex 프롬프트 파일도 정리합니다. 정리 대상은 OpenSpec 허용 목록의 기존 Codex 프롬프트 파일 이름으로 한정되며 대체 파일인 `.agents/skills/openspec-*` 스킬이 생성된 후에만 삭제합니다. 다른 모든 파일은 보존합니다.

---

## project.md를 config.yaml로 마이그레이션

기존 `openspec/project.md`는 프로젝트 컨텍스트를 자유 형식으로 작성하는 Markdown 파일이었습니다. 새로운 `openspec/config.yaml`은 구조화된 형식이며 중요한 점은 **모든 계획 요청에 주입되어** AI가 작업할 때 항상 관례가 포함된다는 것입니다.

### 이전(project.md)

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### 이후(config.yaml)

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### 주요 차이점

| project.md | config.yaml |
|------------|-------------|
| 자유 형식 Markdown | 구조화된 YAML |
| 텍스트 덩어리 하나 | 컨텍스트와 산출물별 규칙을 분리 |
| 사용 시점 불명확 | 컨텍스트는 모든 산출물에, 규칙은 일치하는 산출물에만 표시 |
| 스키마 선택 없음 | `schema:` 필드로 기본 워크플로 지정 |

### 유지할 내용과 제외할 내용

마이그레이션할 때 필요한 내용만 선택하세요. "AI가 *모든* 계획 요청에서 이 내용을 알아야 할까?"라고 자문하세요.

**`context:`에 적합한 내용**
- 기술 스택(언어, 프레임워크, 데이터베이스)
- 주요 아키텍처 패턴(모노레포, 마이크로서비스 등)
- 쉽게 파악하기 어려운 제약 조건("라이브러리 X를 사용할 수 없는 이유...")
- 자주 무시되는 중요한 관례

**대신 `rules:`로 옮길 내용**
- 산출물별 형식("사양에 Given/When/Then 사용")
- 검토 기준("제안에 롤백 계획 포함")
- 일치하는 산출물에만 표시되어 다른 요청을 간결하게 유지

**완전히 제외할 내용**
- AI가 이미 알고 있는 일반적인 모범 사례
- 요약할 수 있는 장황한 설명
- 현재 작업에 영향을 주지 않는 과거 맥락

### 마이그레이션 단계

1. **config.yaml 생성**(init에서 아직 생성하지 않은 경우):
   ```yaml
   schema: spec-driven
   ```

2. **컨텍스트 추가**(간결하게 작성하세요. 모든 요청에 포함됩니다):
   ```yaml
   context: |
     Your project background goes here.
     Focus on what the AI genuinely needs to know.
   ```

3. **산출물별 규칙 추가**(선택 사항):
   ```yaml
   rules:
     proposal:
       - Your proposal-specific guidance
     specs:
       - Your spec-writing rules
   ```

4. 유용한 내용을 모두 옮긴 뒤 **project.md를 삭제**합니다.

**너무 고민하지 마세요.** 핵심 내용부터 시작해 반복해서 다듬으세요. AI가 중요한 내용을 놓치는 것을 알게 되면 추가하고 컨텍스트가 지나치게 길면 줄이세요. 계속 업데이트하는 문서입니다.

### 도움이 필요하신가요? 다음 프롬프트를 사용하세요

project.md에서 내용을 어떻게 추려야 할지 확실하지 않다면 AI 어시스턴트에 다음과 같이 요청하세요.

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

AI가 핵심 내용과 줄여도 되는 내용을 구분하는 데 도움을 줍니다.

---

## 새 명령

사용할 수 있는 명령은 프로필에 따라 다릅니다.

**기본(`core` 프로필):**

| 명령 | 목적 |
|---------|---------|
| `/opsx:propose` | 변경 사항을 만들고 계획 산출물을 한 단계에서 생성 |
| `/opsx:explore` | 정해진 구조 없이 아이디어 검토 |
| `/opsx:apply` | tasks.md의 작업 구현 |
| `/opsx:update` | 변경 사항의 계획 산출물을 수정하고 일관성 유지 |
| `/opsx:sync` | 델타 사양을 기본 사양에 병합 |
| `/opsx:archive` | 변경 사항을 마무리하고 보관 |

**확장 워크플로(사용자 지정 선택):**

| 명령 | 목적 |
|---------|---------|
| `/opsx:new` | 새 변경 사항의 기본 구조 시작 |
| `/opsx:continue` | 다음 산출물 작성(한 번에 하나씩) |
| `/opsx:ff` | 빠른 진행 — 계획 산출물을 한 번에 생성 |
| `/opsx:verify` | 구현이 사양과 일치하는지 검증 |
| `/opsx:bulk-archive` | 여러 변경 사항을 한 번에 보관 |
| `/opsx:onboard` | 처음부터 끝까지 안내하는 온보딩 워크플로 |

`openspec config profile`로 확장 명령을 활성화한 다음 `openspec update`를 실행하세요.

### 기존 명령과의 대응 관계

| 기존 명령 | OPSX 대응 명령 |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose`(기본) 또는 `/opsx:new` 후 `/opsx:ff`(확장) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### 새로운 기능

다음 기능은 확장 워크플로 명령 모음에 포함됩니다.

**세분화된 산출물 생성:**
```
/opsx:continue
```
의존성에 따라 산출물을 한 번에 하나씩 생성합니다. 각 단계를 검토하고 싶을 때 사용하세요.

**탐색 모드:**
```
/opsx:explore
```
변경 사항을 확정하기 전에 파트너와 함께 아이디어를 검토합니다.

---

## 새로운 아키텍처 이해

### 단계 기반에서 유연한 방식으로

기존 워크플로는 선형 진행을 강제했습니다.

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

If you're in implementation and realize the design is wrong?
Too bad. Phase gates don't let you go back easily.
```

OPSX는 단계가 아니라 동작을 사용합니다.

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### 의존성 그래프

산출물은 방향성 그래프를 구성합니다. 의존성은 관문이 아니라 다음을 가능하게 하는 요소입니다.

```
                        proposal
                       (root node)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (requires:                  (requires:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (requires:
                     specs, design)
```

`/opsx:continue`를 실행하면 작성 준비가 된 산출물을 확인하고 다음 산출물을 제안합니다. 동시에 준비된 산출물이 여러 개라면 임의의 순서로 만들 수도 있습니다.

### 스킬과 명령 비교

기존 시스템은 도구별 명령 파일을 사용했습니다.

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX는 새롭게 부상하는 **스킬** 표준을 사용합니다.

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

스킬은 여러 AI 코딩 도구에서 인식되며 더 풍부한 메타데이터를 제공합니다.

OPSX에서 Codex는 스킬만 사용합니다. OpenSpec은 Codex 사용자 지정 프롬프트 파일을 더 이상 생성하지 않으므로 생성된 `.agents/skills/openspec-*` 디렉터리를 사용하세요.

---

## 기존 변경 사항 이어서 진행하기

진행 중인 변경 사항은 OPSX 명령과 원활하게 사용할 수 있습니다.

**기존 워크플로에서 진행 중인 변경 사항이 있나요?**

```
/opsx:apply add-my-feature
```

OPSX는 기존 산출물을 읽고 마지막 작업 지점부터 이어서 진행합니다.

**기존 변경 사항에 산출물을 더 추가하고 싶나요?**

```
/opsx:continue add-my-feature
```

이미 존재하는 산출물을 바탕으로 생성할 준비가 된 항목을 표시합니다.

**상태를 확인하고 싶나요?**

```bash
openspec status --change add-my-feature
```

---

## 새로운 구성 시스템

### config.yaml 구조

```yaml
# Required: Default schema for new changes
schema: spec-driven

# Optional: Project context (max 50KB)
# Injected into ALL artifact instructions
context: |
  Your project background, tech stack,
  conventions, and constraints.

# Optional: Per-artifact rules
# Only injected into matching artifacts
rules:
  proposal:
    - Include rollback plan
  specs:
    - Use Given/When/Then format
  design:
    - Document fallback strategies
  tasks:
    - Break into 2-hour maximum chunks
```

### 스키마 확인 순서

사용할 스키마를 결정할 때 OPSX는 다음 순서로 확인합니다.

1. **CLI 플래그**: `--schema <name>`(최우선)
2. **변경 사항 메타데이터**: 변경 사항 디렉터리의 `.openspec.yaml`
3. **프로젝트 구성**: `openspec/config.yaml`
4. **기본값**: `spec-driven`

### 사용 가능한 스키마

| 스키마 | 산출물 | 적합한 대상 |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | 대부분의 프로젝트 |

사용 가능한 스키마를 모두 나열하려면 다음을 실행하세요.

```bash
openspec schemas
```

### 사용자 지정 스키마

자체 워크플로를 만드세요.

```bash
openspec schema init my-workflow
```

또는 기존 스키마를 포크하세요.

```bash
openspec schema fork spec-driven my-workflow
```

자세한 내용은 [사용자 지정](/ko-KR/customization/)을 참조하세요.

---

## 문제 해결

### "Legacy files detected in non-interactive mode"(비대화형 모드에서 기존 파일 감지)

CI 또는 비대화형 환경에서 실행 중입니다. 다음을 사용하세요.

```bash
openspec init --force
```

### 마이그레이션 후 명령이 표시되지 않음

IDE를 다시 시작하세요. 스킬은 시작할 때 검색됩니다.

### "Unknown artifact ID in rules"(규칙에 알 수 없는 산출물 ID 지정)

`rules:` 키가 스키마의 산출물 ID와 일치하는지 확인하세요.

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

유효한 산출물 ID를 확인하려면 다음을 실행하세요.

```bash
openspec schemas --json
```

### 구성이 적용되지 않음

1. 파일이 `.yml`이 아니라 `openspec/config.yaml`에 있는지 확인합니다.
2. YAML 구문을 검증합니다.
3. 구성 변경 사항은 즉시 적용되므로 다시 시작할 필요가 없습니다.

### project.md가 마이그레이션되지 않음

사용자 지정 내용이 있을 수 있으므로 시스템은 의도적으로 `project.md`를 보존합니다. 직접 검토한 뒤 유용한 부분을 `config.yaml`로 옮기고 삭제하세요.

### 정리될 항목을 미리 확인하고 싶나요?

init을 실행하고 정리 프롬프트를 거절하세요. 아무것도 수정하지 않은 채 감지된 전체 항목을 확인할 수 있습니다.

---

## 빠른 참조

### 마이그레이션 후 파일

```
project/
├── openspec/
│   ├── specs/                    # Unchanged
│   ├── changes/                  # Unchanged
│   │   └── archive/              # Unchanged
│   └── config.yaml               # NEW: Project configuration
├── .claude/
│   └── skills/                   # NEW: OPSX skills
│       ├── openspec-propose/     # default core profile
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-update-change/
│       ├── openspec-sync-specs/
│       ├── openspec-archive-change/
│       └── ...                   # expanded profile adds new/continue/ff/etc.
├── CLAUDE.md                     # OpenSpec markers removed, your content preserved
└── AGENTS.md                     # OpenSpec markers removed, your content preserved
```

### 제거되는 항목

- `.claude/commands/openspec/` — `.claude/skills/`로 대체
- `openspec/AGENTS.md` — 더 이상 사용하지 않음
- `openspec/project.md` — `config.yaml`로 옮긴 뒤 삭제
- `CLAUDE.md`, `AGENTS.md` 등에 있는 OpenSpec 표시 블록

### 명령 요약

```text
/opsx:propose      Start quickly (default core profile)
/opsx:apply        Implement tasks
/opsx:archive      Finish and archive

# Expanded workflow (if enabled):
/opsx:new          Scaffold a change
/opsx:continue     Create next artifact
/opsx:ff           Create planning artifacts
```

---

## 도움말

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **문서**: 전체 OPSX 참조는 [OPSX 문서](/ko-KR/opsx/)를 확인하세요.
