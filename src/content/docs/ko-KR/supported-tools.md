---
title: "지원 도구"
---

OpenSpec은 다양한 AI 코딩 어시스턴트와 함께 사용할 수 있습니다. `openspec init`을 실행하면 활성 프로필/워크플로 선택 및 전달 모드에 따라 선택한 도구를 구성합니다.

## 작동 방식

선택한 각 도구에 다음 항목을 설치할 수 있습니다.

1. **스킬**(전달 방식에 스킬 포함): `.../skills/openspec-*/SKILL.md`
2. **명령**(전달 방식에 명령 포함): 도구별 `opsx-*` 명령 파일

Codex는 스킬만 사용합니다. 전달 방식이 `commands`로 설정되어 있어도 OpenSpec은 Codex용 `.agents/skills/openspec-*/SKILL.md`를 설치하며 Codex 사용자 지정 프롬프트 파일은 생성하지 않습니다. 기존 경로인 `.codex/skills` 아래에서 OpenSpec이 관리하던 스킬은 대체 파일을 작성한 뒤 정리하며 사용자 지정 파일과 변경된 파일은 보존합니다.

기본적으로 OpenSpec은 다음 항목이 포함된 `core` 프로필을 사용합니다.
- `propose`
- `explore`
- `apply`
- `update`
- `sync`
- `archive`

`openspec config profile`로 확장 워크플로(`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`)를 활성화한 뒤 `openspec update`를 실행할 수 있습니다.

## 호출 방법

이 문서에서는 표준 이름으로 `/opsx:propose`를 사용하지만 도구마다 OpenSpec이 작성한 파일을 불러오는 형식에 맞춰 명령을 표기합니다. 아래 [도구 디렉터리 참조](#tool-directory-reference)에서 도구의 명령 경로를 확인한 다음 해당 형식을 사용하세요.

| OpenSpec이 작성하는 명령 파일 | 입력할 명령 | 도구 |
|------------------------------|----------|-------|
| `.../commands/opsx/<id>.*` — `opsx/` 폴더가 명령 이름의 네임스페이스 역할을 합니다. | `/opsx:<id>` | Claude Code, CodeBuddy, Crush, Gemini CLI, Lingma, Qoder, ZCode |
| `.../opsx-<id>.*` — 파일 이름이 명령입니다. | `/opsx-<id>` | Amazon Q와 Devin을 제외하고 명령 파일을 생성하는 나머지 도구 |
| `.devin/workflows/opsx-<id>.md` — Devin 에이전트 두 종류 중 하나만 읽습니다. | Devin Desktop에서는 `/opsx-<id>`, Devin Local에서는 `/openspec-<skill>` | Devin Desktop\*\*\*\* |
| `.amazonq/prompts/opsx-<id>.md` — 명령이 아니라 프롬프트입니다. | `@opsx-<id>` | Amazon Q Developer |
| 없음 — 스킬만 사용 | `/openspec-<skill>` | CodeArts, ForgeCode, Hermes, MiniMax Code, Mistral Vibe, Zed Agent, 공유 `.agents` |
| 없음 — Kimi Code | `/skill:openspec-<skill>` | Kimi Code |
| 없음 — Codex CLI | `$openspec-<skill>` | Codex ([`/openspec-<skill>`은 인식되지 않음](https://github.com/openai/codex/issues/11817)) |

따라서 Cursor에서는 `/opsx:propose`가 `/opsx-propose`, Amazon Q에서는 `@opsx-propose`, Codex에서는 `$openspec-propose`입니다.

행을 하나로 합칠 수 없는 이유는 두 가지 요소가 서로 독립적으로 달라지기 때문입니다.

- **이름.** 1~2행은 파일에서 명령 이름을 표현하는 방식만 다릅니다. 명령 파일을 생성하는 모든 도구에서 `opsx-<id>` / `opsx:<id>`의 기본 형태는 동일합니다.
- **호출 방식.** Amazon Q는 파일을 `@`로 호출하는 프롬프트 라이브러리에 불러옵니다. 스킬만 사용하는 도구는 명령 파일을 생성하지 않으므로 마지막 세 행은 명령 ID와 일대일로 대응하지 않는 *스킬* 이름을 사용합니다(`/opsx:apply`는 `openspec-apply-change` 스킬입니다). [생성된 스킬 이름](#generated-skill-names)을 참조하세요.

위의 명령 경로 패턴은 의도적으로 확장자와 무관한 형식(`.*`)을 사용합니다. 확장자는 도구마다 다릅니다(Gemini CLI는 `.toml`, Continue는 `.prompt`, Kiro와 GitHub Copilot은 `.prompt.md`). 일부 도구는 선택 목록에 확장자가 포함된 이름을 표시합니다. 확장자가 아니라 디렉터리 구조를 기준으로 확인하세요.

OpenSpec이 생성하는 파일과 설정 후 출력되는 "시작하기" 안내에는 선택한 도구에 맞는 형식이 이미 표시됩니다. 따라서 안내를 읽는 것이 가장 빠른 방법입니다.

## 도구 디렉터리 참조

| 도구(ID) | 스킬 경로 패턴 | 명령 경로 패턴 |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| Command Code (`command-code`) | `.commandcode/skills/openspec-*/SKILL.md` | `.commandcode/commands/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | 생성되지 않음(명령 어댑터 없음, 스킬 기반 `/openspec-*` 호출 사용) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.agents/skills/openspec-*/SKILL.md` | 생성되지 않음(스킬만 사용, `$openspec-*` 사용) |
| Devin Desktop(이전 Windsurf, `devin`) | `.devin/skills/openspec-*/SKILL.md` | `.devin/workflows/opsx-<id>.md`\*\*\*\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | 생성되지 않음(명령 어댑터 없음, 스킬 기반 `/openspec-*` 호출 사용) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | 생성되지 않음(명령 어댑터 없음, 스킬 기반 `/openspec-*` 호출 사용) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilo/command/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | 생성되지 않음(명령 어댑터 없음, 스킬 기반 `/skill:openspec-*` 호출 사용) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| MiniMax Code (`minimax-code`) | `~/.minimax/skills/openspec-*/SKILL.md` | 생성되지 않음(명령 어댑터 없음, MiniMax Code 스킬 사용) |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | 생성되지 않음(명령 어댑터 없음, 스킬 기반 `/openspec-*` 호출 사용) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| SourceCraft Code Assistant(VS Code용, `codeassistant`) | `.codeassistant/skills/openspec-*/SKILL.md` | `.codeassistant/commands/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Rovo Dev CLI](https://support.atlassian.com/rovo/docs/use-rovo-dev-cli/) (`rovodev`) | `.rovodev/skills/openspec-*/SKILL.md` | 생성되지 않음. Rovo에는 슬래시 명령 인터페이스가 없으며 스킬을 자동으로 또는 프롬프트(예: "openspec-propose 스킬을 사용해 줘")로 검색합니다. `/skills`는 스킬 관리에만 사용됩니다. 생성된 콘텐츠에서는 스킬 이름을 참조하며 `/openspec-*` 명령으로 표기하지 않습니다. |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| [Zed Agent](https://zed.dev/docs/ai/skills) (`zed`) | `.agents/skills/openspec-*/SKILL.md` | 생성되지 않음(스킬만 사용, `/openspec-*` 또는 `@openspec-*` 사용) |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |
| 공유 `.agents` 스킬(`agents`) | `.agents/skills/openspec-*/SKILL.md` | 생성되지 않음(명령 어댑터 없음, 스킬 기반 `/openspec-*` 호출 사용) |

\*\* GitHub Copilot 프롬프트 파일은 IDE 확장(VS Code, JetBrains, Visual Studio)에서 사용자 지정 슬래시 명령으로 인식됩니다. 현재 Copilot CLI는 `.github/prompts/*.prompt.md`를 직접 사용하지 않습니다. `github-copilot`을 선택하면 GitHub 호스팅 **클라우드 코딩 에이전트**도 설정할 수 있습니다. 아래 [GitHub Copilot 클라우드 코딩 에이전트](#github-copilot-cloud-coding-agent)를 참조하세요.

\*\*\* Hermes는 기본적으로 `~/.hermes/skills/`에서 스킬을 불러옵니다. 프로젝트 로컬 OpenSpec 스킬을 사용하려면 프로젝트의 `.hermes/skills/` 디렉터리를 `~/.hermes/config.yaml`의 `skills.external_dirs`에 추가하세요. 그러면 Hermes에서 `/openspec-propose`와 같은 사용자용 슬래시 호출로 스킬을 사용할 수 있습니다.

\*\*\*\* Windsurf는 2026년 6월 2일 [Devin Desktop으로 브랜드가 변경](https://docs.devin.ai/desktop/devin-desktop-faq)되었으며 구성 디렉터리도 바뀌었습니다. `.devin/`이 권장 읽기/쓰기 위치이고 `.windsurf/`는 이전 버전과의 호환을 위한 읽기 전용 경로입니다. OpenSpec도 이름 변경을 반영해 도구 ID를 `devin`으로 사용하지만 기존 설정 스크립트와의 호환성을 위해 `--tools windsurf`도 같은 도구로 처리합니다. `.windsurf/`에 OpenSpec 파일이 남아 있는 프로젝트에서는 다음 `openspec update` 실행 시 이동 여부를 묻습니다. 거부하면 그대로 두며 직접 작성한 파일은 건드리지 않습니다. 워크플로는 파일 이름으로 호출하므로 `.devin/workflows/opsx-apply.md`는 `/opsx-apply`로 실행합니다. [Devin Local 에이전트는 워크플로를 지원하지 않으며](https://docs.devin.ai/desktop/devin-local) 스킬만 지원하고 `.windsurf/`도 읽지 않습니다. 따라서 OpenSpec이 Devin 스킬을 작성할 때는 두 에이전트에서 모두 사용할 수 있도록 본문과 시작 안내에서 `/openspec-*` 스킬 호출을 사용합니다. 명령만 전달하는 모드에서는 스킬을 작성하지 않으며 두 에이전트 모두 `/opsx-*`를 사용합니다.

SourceCraft Code Assistant 지원은 VS Code 확장을 대상으로 합니다. [사용자 지정 명령](https://sourcecraft.dev/portal/docs/en/code-assistant/operations/agent/slash-commands)과 [스킬](https://sourcecraft.dev/portal/docs/ru/code-assistant/operations/agent/skills)은 VS Code에서만 사용할 수 있습니다. 이 통합 기능은 SourceCraft 웹 또는 JetBrains를 구성하지 않습니다.

스킬만 전달하도록 설정한 경우 Code Assistant에 아이디어와 함께 `openspec-propose` 스킬을 사용하도록 요청하세요. 스킬은 요청 일치 방식으로 활성화되며 OpenSpec은 이 도구에 `/openspec-*` 명령을 생성하지 않습니다.

MiniMax Code는 전역 스킬 전용 통합입니다. OpenSpec은 `~/.minimax/skills/` 아래에 `openspec-*` 디렉터리만 작성하며 저장소 로컬 `.minimax` 또는 `.mavis` 디렉터리는 만들지 않습니다.
명령만 전달하도록 설정해도 기존 전역 MiniMax Code 스킬은 그대로 둡니다. 한 프로젝트의 전달 설정이 다른 프로젝트에서 사용하는 스킬을 제거할 수 없도록 하기 위함입니다.

### GitHub Copilot 클라우드 코딩 에이전트

GitHub의 [Copilot 코딩 에이전트](https://docs.github.com/en/copilot/using-github-copilot/coding-agent)는 편집기의 Copilot과 별개로 GitHub Actions 환경의 GitHub에서 실행됩니다. OpenSpec은 다음 두 파일을 생성해 OpenSpec CLI를 사용하도록 설정할 수 있습니다.

- `.github/workflows/copilot-setup-steps.yml` — 에이전트 환경에 `@fission-ai/openspec` 설치
- `.github/agents/openspec.agent.md` — OpenSpec을 사용하는 방법을 에이전트에 안내

저장소에 GitHub Actions 워크플로를 작성하므로 **선택 사항**입니다.

| 방법 | 동작 |
|-----|----------|
| `openspec init`(대화형) | 클라우드 파일을 설정할지 묻습니다. 기본값은 **아니요**입니다. |
| `openspec init --copilot-cloud` | 확인을 요청하지 않고 파일을 설정합니다(스크립트/CI용). |
| `openspec init --no-copilot-cloud` | 확인 없이 건너뛰고 이전에 생성한 파일이 있다면 삭제합니다. |
| `openspec update` | 확인을 요청하지 않습니다. 선택했거나 프로젝트에 이미 파일이 있는 경우에만 새로 고칩니다. 사용하지 않도록 선택했다면 OpenSpec이 관리하는 클라우드 파일을 제거합니다. |

선택 내용은 `openspec/config.yaml`의 `githubCopilot.cloudAgent: true|false`에 저장되므로 비대화형 업데이트에도 적용됩니다. OpenSpec은 자신이 생성한 콘텐츠가 포함된 파일만 작성하거나 삭제합니다. `copilot-setup-steps.yml` 또는 `openspec.agent.md`를 사용자 지정했거나 직접 만든 파일이 있다면 그대로 보존하며 `init`/`update`에서 이를 알려 줍니다.

### 공유 `.agents` 대상을 선택할 시점

`agents`는 특정 공급업체에 종속되지 않는 선택지입니다. 도구별 디렉터리 대신 여러 에이전트 도구가 읽는 공유 루트인 `.agents/skills/`에 스킬을 작성합니다.

| 상황 | 선택 |
|-----------|------|
| 도구가 위 표에 별도 항목으로 있음 | 해당 도구의 ID — 지원하는 경우 슬래시 명령을 포함한 도구별 통합 기능을 사용합니다. |
| 하나의 저장소에서 여러 에이전트가 모두 `.agents/skills`를 읽음 | `agents` — 도구마다 별도의 스킬 트리를 만들지 않고 하나를 공유합니다. |
| 도구가 아직 목록에 없지만 `.agents/skills`를 읽음 | `agents` |

도구별 ID와 함께 선택해도 됩니다. 일반적으로 각각 자체 루트에 파일을 작성합니다. 예외는 같은 표준
`.agents` 루트를 사용하는 Codex와 Zed Agent입니다. Codex를 Zed 또는 `agents`와 함께 선택하면 OpenSpec은 하나의
Codex 기반 트리를 유지합니다. 핸드오프에는 Codex용 `$openspec-*`와
다른 에이전트용 `/openspec-*`가 함께 표시되므로 `--tools all` 및 기존 다중 에이전트 설정을 사용할 때 두 작성자가 같은 파일을 덮어쓰지 않습니다.
프로젝트에 `.agents/skills/` 디렉터리가 있으면 OpenSpec에서 해당 대상을 자동으로 제안합니다.
`.agents/`만 있는 경우는 충분하지 않습니다. 도구에서 해당 루트를 규칙과 하위 에이전트 정의에도 사용하기 때문입니다. `.agents`와 `.agent`를 혼동하지 마세요. 단수 디렉터리는 Antigravity에 속합니다.

알아둘 점 두 가지:

- **스킬만 사용합니다.** 명령 어댑터가 없으므로 `opsx-*` 명령 파일을
  작성하지 않습니다. 명령을 포함하는 전달 모드에서 `openspec init`은 `Commands skipped for: … (no adapter)` 아래에 `agents`를 표시합니다. 워크플로는 스킬 이름으로 호출합니다. `.agents/skills`를 읽는 대부분의 어시스턴트는 `/openspec-propose` 형식을 사용하며 OpenSpec의 설정 안내에도 표시됩니다. 이 대상은 공급업체 중립적이므로 다른 형식을 사용하는 어시스턴트에서는 자체 문서를 확인하세요.
- **`AGENTS.md`는 생성하거나 편집하지 않습니다.** 대상은 `.agents/` 디렉터리입니다. 루트 `AGENTS.md`에 이전 버전의 OpenSpec 표시 블록이 남아 있다면 `openspec update`가 제거합니다. [마이그레이션 안내서](/ko-KR/migration-guide/)를 참조하세요.

여기서 설명하는 Zed 지원은 기본 제공되는 Zed Agent에 해당합니다. Zed External Agents와 Terminal Threads는 각각 별도의 통합 기능을 사용합니다. Agent Skills를 사용하려면 [Zed v1.4.2](https://github.com/zed-industries/zed/releases/tag/v1.4.2) 이상이 필요합니다. 신뢰하지 않는 작업 트리에서 사용하려면 [신뢰를 허용](https://zed.dev/docs/worktree-trust)해야 합니다.

`.agents/skills/`는 Codex, Zed Agent, 공급업체 중립 대상이 공유하므로 OpenSpec이 관리하는 범위를 알아둘 필요가 있습니다. 선택한 워크플로에 해당하는 `openspec-*` 스킬 디렉터리와 Codex, Zed Agent, 공급업체 중립 대상 중 무엇이 공유 트리를 생성했는지 기록하는 `.openspec-target` 표시만 작성, 새로 고침, 삭제합니다. 디렉터리의 나머지 항목은 그대로 둡니다. `openspec-*` 이름과 표시는 OpenSpec 소유로 간주하세요. 그 안의 수정 사항은 다른 도구와 마찬가지로 다음 `openspec update`에서 대체됩니다.

표시가 없는 프로젝트에서는 OpenSpec이 관리형 스킬 참조를 통해 소유 대상을 추론합니다.
`$openspec-*`는 Codex를, `/openspec-*`는 공급업체 중립 대상을 나타냅니다. 이전 `.codex/skills`와 일반 표준 트리가 함께 있으면 이전의 이중 대상 설치로 간주하고 호환 가능한 공유 트리로 통합합니다.

`openspec update`도 이 소유권을 따릅니다. 프로젝트가 `.agents`를
공급업체 중립 대상으로 소유하고 있으며 남아 있는 Codex 설치 항목이 프롬프트 파일만으로 감지되면 기존 `agents` 트리를 Codex 문법으로 다시 작성하지 않고 그대로 두며 이전 프롬프트 파일도 삭제하지 않고 보존합니다. 공유 트리를 Codex에 넘기려면 `openspec init --tools codex`를 명시적으로 실행하세요.

## 비대화형 설정

CI/CD 또는 스크립트 설정에는 `--tools`를 사용하세요(필요하면 `--profile`도 지정).

```bash
# Configure specific tools
openspec init --tools claude,cursor

# Configure all supported tools
openspec init --tools all

# Skip tool configuration
openspec init --tools none

# Override profile for this init run
openspec init --profile core
```

**사용 가능한 도구 ID(`--tools`)** — `windsurf`는 `devin`의 별칭으로 허용됩니다: `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `command-code`, `codeartsagent`, `codex`, `devin`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `minimax-code`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `codeassistant`, `trae`, `zed`, `zcode`, `agents`

## 워크플로에 따른 설치

OpenSpec은 선택한 워크플로에 따라 관련 산출물을 설치합니다.

- **기본 Core 프로필:** `propose`, `explore`, `apply`, `update`, `sync`, `archive`
- **사용자 지정 선택:** 모든 워크플로 ID 중 일부를 선택할 수 있습니다.
  `propose`, `explore`, `new`, `continue`, `apply`, `update`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

즉, 스킬/명령 개수는 고정된 값이 아니라 프로필과 전달 방식에 따라 달라집니다.

## 생성되는 스킬 이름

프로필/워크플로 구성에서 선택한 경우 OpenSpec은 다음 스킬을 생성합니다.

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-update-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

명령 동작은 [명령](/ko-KR/commands/)을, `init`/`update` 옵션은 [CLI](/ko-KR/cli/)를 참조하세요.

## 관련 문서

- [CLI 참조](/ko-KR/cli/) — 터미널 명령
- [명령](/ko-KR/commands/) — 슬래시 명령 및 스킬
- [시작하기](/ko-KR/getting-started/) — 최초 설정
