---
title: "명령 작동 방식"
---

**기억할 점 하나: OpenSpec 명령은 두 종류이며 서로 다른 위치에서 실행됩니다.**

- `openspec ...` 명령은 **터미널**에서 실행합니다. (예: `openspec init`)
- `/opsx:...` 명령은 **AI 어시스턴트 채팅**에서 실행합니다. (예: `/opsx:propose`)

터미널에 `/opsx:propose`를 입력해도 아무 일도 일어나지 않았다면 그 이유가 바로 이 페이지에 있습니다. OpenSpec의 잘못된 쪽에 명령을 입력한 것입니다. 슬래시 명령은 터미널 명령이 아닙니다. 평소 "로그인 양식 추가"라고 요청할 때 사용하는 채팅창에서 AI 코딩 어시스턴트에 전달하는 지시입니다.

이 차이는 신규 사용자가 가장 자주 막히는 부분이므로 분명하게 짚고 넘어가겠습니다.

## 두 가지 인터페이스

OpenSpec은 두 가지 역할을 가진 하나의 프로젝트입니다.

**CLI(터미널 인터페이스).** 셸에서 설치해 실행하는 `openspec` 프로그램입니다. 프로젝트를 설정하고 변경 사항을 나열 및 검증하며 대시보드를 표시하고 완료된 작업을 보관합니다. `git`이나 `npm`을 실행하는 iTerm, VS Code 터미널, PowerShell 등의 위치에서 명령을 입력합니다.

```bash
openspec init        # set up OpenSpec in this project
openspec list        # see active changes
openspec view        # open the interactive dashboard
```

**슬래시 명령(채팅 인터페이스).** `/opsx:propose`, `/opsx:apply`와 같이 AI 어시스턴트에 입력하는 짧은 명령입니다. 제안 초안 작성, 사양 작성, 작업 목록에 따른 구현, 완료 후 보관 등 OpenSpec 워크플로를 따르도록 AI에 지시합니다. Claude Code, Cursor, Devin Desktop, Copilot 등 사용 중인 어시스턴트에서 입력합니다.

```text
/opsx:propose add-dark-mode    (typed in your AI chat)
/opsx:apply                    (typed in your AI chat)
/opsx:archive                  (typed in your AI chat)
```

개념을 그림으로 나타내면 다음과 같습니다.

```text
        YOUR TERMINAL                         YOUR AI ASSISTANT'S CHAT
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   installs    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   commands    │  /opsx:archive                │
   └──────────────────────┘    & skills   └──────────────────────────────┘
        run openspec here                       run /opsx:* here
```

화살표에 주목하세요. 터미널에서 `openspec init`을 실행하면 AI 도구에 슬래시 명령이 *설치*됩니다. 터미널 인터페이스가 채팅 인터페이스를 설정합니다. 설정이 끝난 뒤에는 주로 채팅에서 일상적인 작업을 진행합니다.

## "대화형 모드는 어떻게 시작하나요?"

**별도로 시작할 대화형 모드는 없습니다.** 이 질문이 자주 나오므로 간단히 설명하겠습니다.

특별한 OpenSpec 모드에 들어갈 필요가 없습니다. 평소처럼 AI 코딩 어시스턴트를 열고 채팅에 슬래시 명령을 입력하세요. 슬래시 명령이 OpenSpec에 "들어가는" 방법입니다. 어시스턴트가 명령을 인식하고 해당 OpenSpec 스킬을 불러와 워크플로를 따르기 시작합니다.

실제 절차는 다음과 같습니다.

1. 프로젝트에서 AI 코딩 어시스턴트(Claude Code, Cursor, Devin Desktop 등)를 엽니다.
2. 다른 요청을 입력하는 곳과 같은 채팅창에 `/opsx:propose`를 입력합니다.
3. 자동 완성 목록을 확인합니다. OpenSpec이 설치되어 있다면 슬래시를 입력할 때 `/opsx:propose`, `/opsx:apply` 등의 명령이 표시됩니다.

이것이 전부입니다. 전환할 모드도, 실행할 데몬도, 별도의 창도 없습니다.

터미널에서 실제로 대화형으로 작동하는 기능은 `openspec view`입니다. 사양과 변경 사항을 탐색하는 대시보드를 엽니다. 하지만 이는 조회용 도구이며 제안과 구현에 사용하는 기능은 아닙니다. 채팅에서 슬래시 명령을 사용해 구현을 진행합니다.

## 인터페이스를 분리한 이유

이 구조를 이해하면 OpenSpec이 30개 이상의 서로 다른 AI 도구에서 작동하는 이유를 알 수 있습니다.

CLI는 **엔진**입니다. 변경 사항 폴더의 구조, 산출물 간 의존성, 델타 사양을 기준 정보에 병합하는 방법 등 규칙을 알고 있습니다. 어디서나 동일하게 작동합니다.

슬래시 명령은 **핸들**이며 AI 도구마다 형태가 약간씩 다릅니다. Claude Code에서는 이를 명령이라고 부릅니다. Cursor와 Devin Desktop에는 자체 형식이 있고 일부 도구는 스킬이라고 부릅니다. `openspec init`을 실행하면 선택한 각 도구에 맞는 파일이 생성되므로 어떤 어시스턴트를 사용하더라도 같은 `/opsx:propose` 의도를 전달할 수 있습니다.

이 설계의 장점은 워크플로를 한 번 익히면 여러 도구에서 그대로 사용할 수 있다는 점입니다. 단점은 도구에 따라 명령 구문이 조금씩 다를 수 있다는 것입니다. 다음 섹션에서 설명합니다.

## 도구별 슬래시 명령 구문

명령의 의도는 어디서나 동일합니다. 표기는 도구가 불러오는 파일 형식에 따라 달라집니다.

| 도구별 명령 파일 | 입력 방법 | 도구 예 |
|--------------------------|-----------------|---------------|
| `.../commands/opsx/<id>.*` | `/opsx:propose` | Claude Code, Gemini CLI, Crush |
| `.../opsx-<id>.*` | `/opsx-propose` | Cursor, GitHub Copilot (IDE), Devin Desktop, Trae, Oh My Pi |
| `.amazonq/prompts/opsx-<id>.md` | `@opsx-propose` | Amazon Q Developer |
| none — skills only | `/openspec-propose` | CodeArts, ForgeCode, Hermes, Mistral Vibe, Zed Agent, shared `.agents` |
| none — Kimi Code | `/skill:openspec-propose` | Kimi Code |
| none — Codex CLI | `$openspec-propose` | Codex |

두 행에 모두 해당하는 도구는 Devin뿐입니다. Devin Desktop은 `.devin/workflows/`를 읽으므로 여기서는 `/opsx-propose`가 작동합니다. [Devin Local은 워크플로를 지원하지 않으므로](https://docs.devin.ai/desktop/devin-local) 해당 에이전트에서는 `/openspec-propose` 스킬을 사용하세요. OpenSpec이 `.devin/skills/`에 작성하는 스킬은 두 에이전트 모두에서 사용할 수 있습니다. 그래서 서로 스킬 이름으로 참조합니다.

모든 도구는 [호출 방법](/ko-KR/supported-tools/#호출-방법)에 나열되어 있으며 해당 표가 기준입니다. 두 행은 슬래시 명령이 아닙니다. Amazon Q는 `@`로 호출하는 프롬프트 라이브러리에 파일을 불러오며, 마지막 세 행은 명령 ID가 아니라 *스킬* 이름을 사용합니다(`/opsx:apply`의 스킬 이름은
`openspec-apply-change`입니다).

확실하지 않다면 `openspec init`이 출력한 "시작하기" 줄을 읽어 보세요. 등록한 도구에 맞는 형식이 이미 표시되어 있습니다. 슬래시를 입력하고 자동 완성 목록을 확인하는 방법도 있습니다(슬래시 명령을 표시하는 도구에 한함).

## 명령이 설치되는 방식: 스킬과 명령 파일

`openspec init`(또는 `openspec update`)을 실행하면 AI 도구가 워크플로를 찾을 수 있도록 프로젝트에 작은 파일을 작성합니다. 도구와 설정에 따라 **스킬**, **명령 파일** 또는 둘 다가 생성됩니다.

- **스킬**은 `.claude/skills/openspec-*/SKILL.md`와 같은 위치에 있습니다. 어시스턴트가 자동으로 찾아 사용하는 지침 폴더로, 여러 도구에서 사용되는 새로운 표준입니다.
- **명령 파일**은 `.cursor/commands/opsx-<id>.md` 또는 `.claude/commands/opsx/<id>.md`와 같은 위치에 있습니다. 파일 구성은 도구마다 다르며 명령 입력 방식도 도구에 따라 결정됩니다. 도구별 슬래시 명령을 위한 이전 방식입니다. Codex에는 명령 파일이 생성되지 않으므로 `.agents/skills/openspec-*`를 사용하세요.

도구에서 어떤 방식을 사용하는지 신경 쓸 필요는 없습니다. 슬래시 명령을 입력하면 작동합니다. 하지만 문제가 생겼을 때 파일이 존재한다는 사실을 알면 도움이 됩니다. 명령이 사라졌다면 대개 해당 파일이 없거나 오래된 상태이며 `openspec update`로 다시 생성할 수 있습니다.

도구별 정확한 경로는 [지원 도구](/ko-KR/supported-tools/)를, 스킬이 기존 명령 전용 방식을 대체한 방법은 [마이그레이션 안내서](/ko-KR/migration-guide/)를 참조하세요.

## 설치 여부 확인하기

빠른 순서대로 확인하세요.

1. **AI 채팅에서 슬래시를 입력합니다.** `/opsx`를 입력하기 시작하고 자동 완성 제안을 확인하세요. 제안이 나타나면 설정된 것입니다. 스킬만 사용하는 도구(Codex, Kimi Code, CodeArts, ForgeCode, Hermes, Mistral Vibe, Zed Agent, 공유 `.agents` 대상)에서는 정상적으로 설치되어 있어도 `/opsx`가 자동 완성되지 않습니다. 대신 위 표의 스킬 이름을 사용하세요.
2. **파일을 확인합니다.** Claude Code에서는 `.claude/skills/`에 `openspec-*` 폴더가 있는지 확인하세요. 다른 도구는 각자 다른 디렉터리를 사용합니다([지원 도구](/ko-KR/supported-tools/)에 목록이 있습니다).
3. **설정을 다시 실행합니다.** 프로젝트 루트에서 `openspec update`를 실행하세요. 구성된 도구의 스킬 및 명령 파일을 다시 생성합니다.
4. **어시스턴트를 다시 시작합니다.** 많은 도구가 시작 시 스킬과 명령을 검색하므로 새 창을 열어야 할 수 있습니다.

## 사용할 수 있는 명령은 무엇인가요?

기본적으로 OpenSpec은 **core** 슬래시 명령 집합을 설치합니다.

- `/opsx:explore`: 변경 사항을 확정하기 전에 AI와 아이디어를 검토합니다(확신이 없을 때 좋은 시작 단계).
- `/opsx:propose`: 변경 사항을 만들고 모든 계획 산출물의 초안을 한 단계에서 작성합니다.
- `/opsx:apply`: 작업 목록을 따라 변경 사항을 구현합니다.
- `/opsx:update`: 변경 사항의 계획 산출물을 수정하고 일관성을 유지합니다.
- `/opsx:sync`: 변경 사항의 사양 업데이트를 기본 사양에 병합합니다(대개 자동으로 진행됨).
- `/opsx:archive`: 변경 사항을 완료하고 보관합니다.

권장되는 기본 흐름은 다음과 같습니다. 무엇을 할지 정할 때 `explore`를 실행한 다음 `propose`, `apply`, `archive` 순서로 진행합니다. 첫 탐색이 유용한 이유는 [먼저 탐색하기](/ko-KR/explore/) 안내서에서 설명합니다.

더 세밀한 제어를 원하는 사용자를 위한 **확장** 명령 모음도 있습니다(`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). `openspec config profile`로 활성화한 다음 `openspec update`를 실행해 적용하세요.

처음 사용하나요? 확장 명령인 `/opsx:onboard`는 자신의 코드베이스에서 변경 사항 전체를 각 단계를 설명하며 진행합니다. 가장 친절한 입문 방식입니다.

각 명령의 세부 기능은 [명령](/ko-KR/commands/)을, 상황별 사용 방법은 [워크플로](/ko-KR/workflows/)를 참조하세요.

## 처음부터 시작하기

앞선 내용을 정리하면 다음과 같습니다. 각 단계가 실행되는 위치를 표시했습니다.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (installs slash commands into your AI tool)

AI CHAT      /opsx:explore
              (optional: think the idea through with the AI first)

AI CHAT      /opsx:propose add-dark-mode
              (AI drafts proposal, specs, design, tasks)

AI CHAT      /opsx:apply
              (AI builds it, checking off tasks)

AI CHAT      /opsx:archive
              (change is merged into your specs and filed away)
```

터미널에서 두 단계로 설정한 다음 채팅에서 작업합니다. 이것이 기본 흐름입니다.

## 관련 문서

- [시작하기](/ko-KR/getting-started/): 첫 변경 사항 전체 안내
- [명령](/ko-KR/commands/): 모든 슬래시 명령의 상세 설명
- [CLI](/ko-KR/cli/): 모든 터미널 명령의 상세 설명
- [지원 도구](/ko-KR/supported-tools/): 도구별 구문 및 파일 위치
- [자주 묻는 질문](/ko-KR/faq/): 그 밖의 간단한 답변
- [문제 해결](/ko-KR/troubleshooting/): 명령이 표시되지 않을 때의 해결 방법
