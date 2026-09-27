---
title: "문제 해결"
---

각 문제에 대한 구체적인 해결 방법을 안내합니다. 항목마다 증상을 설명하고 가능한 원인과 해결책을 제시합니다. 여기서 문제를 찾을 수 없다면 [자주 묻는 질문](/ko-KR/faq/)을 확인하거나 [Discord](https://discord.gg/YctCnvvshC)에서 도움을 받으세요.

## 설치 및 설정

### `openspec: command not found`(openspec 명령을 찾을 수 없음)

CLI가 설치되지 않았거나 셸에서 찾을 수 없습니다. 전역으로 설치한 뒤 확인하세요.

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

설치했는데도 찾을 수 없다면 npm 전역 바이너리 디렉터리가 `PATH`에 없을 수 있습니다. 전역 패키지가 설치된 위치를 확인하려면 `npm prefix -g`를 실행하세요. macOS와 Linux에서는 해당 디렉터리의 `bin/`에 실행 파일이 있고, Windows에서는 디렉터리 바로 아래에 있습니다. 해당 경로가 `PATH`에 포함되어 있는지 확인하세요. (`npm bin -g`는 npm 9에서 제거되었습니다.)

 [AI 지원 설치](/ko-KR/installation/#ai-어시스턴트를-사용해-설치하기)를 사용했다면 여기서 다음 단계로 넘어가면 됩니다. 해당 안내는 어시스턴트가 셸 시작 파일을 직접 수정하는 대신 `PATH` 변경 내용을 표시하도록 합니다.

### "Requires Node.js 20.19.0 or higher"(Node.js 20.19.0 이상 필요)

OpenSpec은 Node 20.19.0 이상에서 실행됩니다. 버전을 확인하고 필요한 경우 업그레이드하세요.

```bash
node --version
```

OpenSpec 설치에 bun을 사용하더라도 실제로는 Node에서 *실행*되므로 `PATH`에서 Node 20.19.0 이상을 사용할 수 있어야 합니다. [설치](/ko-KR/installation/)를 참조하세요.

### `openspec init`이 AI 도구를 구성하지 않음

Init은 설정할 도구를 묻습니다. 도구 선택을 건너뛰었거나 다른 도구를 추가하려면 다시 실행하거나 비대화형 형식을 사용하세요.

```bash
openspec init --tools claude,cursor
```

전체 도구 ID 목록은 [지원 도구](/ko-KR/supported-tools/)에 있습니다. 모든 도구를 선택하려면 `--tools all`, 도구 설정을 건너뛰려면 `--tools none`을 사용하세요.

## 명령이 표시되지 않음

`/opsx:propose`(또는 도구별 해당 명령)가 표시되지 않거나 작동하지 않는다면 다음 항목을 순서대로 확인하세요. 확인이 빠른 항목부터 나열했습니다.

1. **잘못된 위치에서 실행했을 수 있습니다.** 슬래시 명령은 터미널이 아니라 AI 어시스턴트 채팅에 입력합니다. 셸에 `/opsx:propose`를 입력했다면 이것이 문제입니다. [명령 작동 방식](/ko-KR/how-commands-work/)을 참조하세요.

2. **파일을 다시 생성합니다.** 프로젝트 루트에서 다음을 실행하세요.

   ```bash
   openspec update
   ```

   구성한 각 도구의 스킬 및 명령 파일을 다시 작성합니다.

   지침 파일은 *설치된* CLI에서 생성됩니다. 따라서 CLI가 오래된 경우 새로운 워크플로를 작성하지 않고도 모든 항목이 최신이라고 보고할 수 있습니다. `openspec update`는 이제 이를 확인하고 업그레이드를 제안합니다. 제안이 표시되면 업그레이드하세요.

3. **어시스턴트를 다시 시작합니다.** 대부분의 도구는 시작 시 스킬과 명령을 검색합니다. 새 창을 열면 해결되는 경우가 많습니다.

4. **파일이 있는지 확인합니다.** Claude Code에서는 `.claude/skills/`에 `openspec-*` 폴더가 있는지 확인하세요. 다른 도구는 각자의 디렉터리를 사용하며 [지원 도구](/ko-KR/supported-tools/)에 모두 나와 있습니다.

5. **현재 프로젝트를 초기화했는지 확인합니다.** 스킬은 프로젝트별로 작성됩니다. 저장소를 복제했거나 다른 폴더로 이동했다면 해당 위치에서 `openspec init`(또는 `openspec update`)을 실행하세요.

6. **도구가 명령 파일을 지원하는지 확인합니다.** Codex, CodeArts, ForgeCode, Hermes, Kimi Code, Mistral Vibe, Zed Agent 및 공유 `.agents` 대상에는 `opsx-*` 명령 파일이 생성되지 않습니다. 대신 스킬을 사용하므로 `/opsx`가 자동 완성되지 않습니다. Codex에서는 `$openspec-propose`, Kimi Code에서는 `/skill:openspec-propose`, 나머지 도구에서는 `/openspec-propose`를 입력하세요. 공유 `.agents` 대상은 특정 공급업체에 종속되지 않으므로 `/openspec-propose`는 공통 형식일 뿐 항상 작동한다고 보장할 수 없습니다. 어시스턴트가 응답하지 않으면 스킬 호출 방법을 해당 도구의 문서에서 확인하세요. Amazon Q에는 명령 파일이 생성되지만 슬래시 메뉴가 아니라 프롬프트 라이브러리에 로드됩니다. `/opsx`가 아니라 `@opsx-propose`를 입력하세요. 각 도구의 호출 형식은 [호출 방법](/ko-KR/supported-tools/#호출-방법)에 나와 있습니다.

## 변경 사항 작업

### "Change not found"(변경 사항을 찾을 수 없음)

명령에서 어떤 변경 사항을 뜻하는지 확인할 수 없습니다. 이름을 명시하거나 현재 항목을 확인하세요.

```bash
openspec list                    # see active changes
/opsx:apply add-dark-mode        # name the change in chat
```

올바른 프로젝트 디렉터리에 있는지도 확인하세요.

### "No artifacts ready"(작성 준비가 된 산출물 없음)

모든 산출물이 이미 생성됐거나 의존 항목을 기다리느라 차단된 상태입니다. 차단 원인을 확인하세요.

```bash
openspec status --change <name>
```

먼저 누락된 의존 산출물을 생성하세요. 제안은 사양과 설계를 가능하게 하고, 사양과 설계가 모두 있어야 작업 목록을 작성할 수 있습니다.

### `openspec validate`에서 경고 또는 오류를 보고함

검증은 사양과 변경 사항에 구조적 문제가 있는지 확인합니다. 메시지에 문제가 있는 파일과 내용이 표시되므로 이를 읽어 보세요.

```bash
openspec validate <name>           # validate one item
openspec validate --all            # validate everything
openspec validate --all --strict   # stricter checks, good for CI
openspec validate --archived       # fail if archived changes have unchecked tasks
```

흔한 원인으로는 필수 섹션 누락(예: 시나리오가 없는 사양)이나 잘못된 델타 헤더가 있습니다. 파일을 수정한 뒤 다시 실행하세요. 출력 형식은 [CLI 참조](/ko-KR/cli/#openspec-validate)에 설명되어 있습니다.

다음 메시지는 별도로 설명할 필요가 있습니다.

```text
MODIFIED "<requirement>" omits scenario(s) the current spec still has: "<scenario>"
```

`MODIFIED` 요구 사항은 기존 요구 사항 블록 전체를 대체하므로 수정한 시나리오뿐 아니라 변경 후에도 유지될 모든 시나리오를 포함해야 합니다. `openspec/specs/<capability-path>/spec.md`에서 메시지에 나온 시나리오를 델타에 복사하고 경로의 도메인 디렉터리도 유지하세요. 다른 사람의 변경 사항이 같은 요구 사항에 시나리오를 추가한 후 오래된 변경 사항을 검증할 때 이 메시지가 자주 나타납니다. 어느 경우든 보관할 수 없으며 이제 구현 전에 검증 단계에서 이를 알려 줍니다.

### AI가 산출물을 불완전하거나 잘못 작성함

AI에 맥락이 충분하지 않았습니다. 다음 방법을 사용해 보세요.

- `openspec/config.yaml`에 프로젝트 컨텍스트를 추가해 기술 스택과 관례가 모든 요청에 포함되도록 하세요. [사용자 지정](/ko-KR/customization/#프로젝트-구성)을 참조하세요.
- 사양에만 적용되는 지침처럼 산출물별 `rules:`를 추가하세요.
- 제안할 때 더 자세히 설명하세요.
- `/opsx:ff`로 한꺼번에 모두 작성하는 대신 확장 명령 `/opsx:continue`를 사용해 산출물을 하나씩 만들고 검토하세요.

### 보관이 완료되지 않거나 미완료 작업에 대한 경고가 표시됨

미완료 작업이 있어도 보관을 *차단하지는* 않지만 일반적으로 보관은 작업이 끝났다는 의미이므로 경고가 표시됩니다. 일부 변경 사항을 기록하려는 등 의도적으로 작업이 남아 있다면 계속 진행하세요. 그렇지 않다면 먼저 작업을 완료하세요. 아직 동기화하지 않은 경우 델타 사양을 기본 사양에 동기화할지도 묻습니다. 특별한 이유가 없다면 동기화에 동의하세요.

### "User force closed the prompt with 0 null"(사용자가 프롬프트를 강제로 닫음)

AI 에이전트가 도구에서 호출하거나 CI 작업 또는 표준 입력이 닫힌 셸에서 실행하는 등 질문에 답할 수 없는 환경에서 `openspec archive`가 실행됐습니다. 보관은 최대 세 번 확인을 요청하며, 이전에는 응답할 수 없는 경우 원시 오류 메시지와 함께 실패했습니다.

미리 확인에 동의하려면 `--yes`를 전달하세요.

```bash
openspec archive <change-name> --yes
```

기존에 전달하던 플래그는 그대로 유지하세요. `--skip-specs`와 `--no-validate`는 보관 동작을 바꾸므로 `--yes`만 붙여 다시 실행하면 원래와 다른 명령이 됩니다. 최신 버전에서는 필요한 플래그와 복사해서 사용할 수 있는 `Fix:` 줄을 안내합니다. 목록에서 항목을 선택하려던 경우 변경 사항 이름도 명시하세요. 선택 목록에도 응답이 필요합니다.

반면 출력을 파일로 리디렉션하거나 도구로 캡처하면서 답변을 파이프로 전달한 경우(`printf 'y\n' | openspec archive …`), 이전 버전은 프롬프트를 표시할 때 터미널 이스케이프 코드를 출력에 기록했습니다. 환경에 따라 파일이 크게 부풀어 오를 수 있었습니다. 최신 버전은 표준 출력이 터미널이 아니면 확인 프롬프트를 일반 텍스트로 읽고, 인수가 없는 `openspec archive`(대화형 변경 사항 선택기를 표시하는 명령)는 캡처에 메뉴를 렌더링하는 대신 변경 사항 이름을 먼저 전달하도록 요청합니다. 두 경우 모두 리디렉션 및 에이전트 실행이 깔끔하게 유지됩니다. 변경 사항 이름과 함께 `--yes`를 전달하면 프롬프트를 완전히 건너뜁니다.

## 구성

### My `config.yaml` isn't being applied(`config.yaml`이 적용되지 않음)

일반적인 원인은 다음 세 가지입니다.

1. **파일 이름이 잘못됐습니다.** `.yml`이 아니라 `openspec/config.yaml`이어야 합니다.
2. **YAML이 유효하지 않습니다.** YAML 검증기로 확인하세요. CLI도 구문 오류와 줄 번호를 표시합니다.
3. **다시 시작해야 한다고 생각했습니다.** 다시 시작할 필요가 없습니다. 구성 변경 사항은 즉시 적용됩니다.

### "Unknown artifact ID in rules: X"(규칙에 알 수 없는 산출물 ID 지정)

`rules:` 아래의 키가 스키마의 산출물과 일치하지 않습니다. 기본 `spec-driven` 스키마에서 유효한 ID는 `proposal`, `specs`, `design`, `tasks`입니다. 스키마별 ID를 확인하려면 다음을 실행하세요.

```bash
openspec schemas --json
```

### "Context too large"(컨텍스트가 너무 큼)

`context:` 필드는 모든 요청에 주입되므로 의도적으로 50KB로 제한되어 있습니다. 긴 문서를 붙여 넣는 대신 요약하거나 링크를 추가하세요. 간결한 컨텍스트는 더 빠르고 좋은 결과도 만들어 냅니다.

### "Schema not found"(스키마를 찾을 수 없음)

참조한 스키마가 존재하지 않습니다. 사용 가능한 목록을 확인하고 철자가 맞는지 살펴보세요.

```bash
openspec schemas                    # list available schemas
openspec schema which <name>        # see where a schema resolves from
openspec schema init <name>         # create a custom one
```

 [사용자 지정](/ko-KR/customization/#사용자-지정-스키마)을 참조하세요.

## 기존 워크플로에서 마이그레이션

### "Legacy files detected in non-interactive mode"(비대화형 모드에서 기존 파일 감지)

CI 또는 비대화형 셸에서 실행 중이며 OpenSpec이 정리할 이전 파일을 찾았지만 확인을 요청할 수 없습니다. 자동으로 승인하세요.

```bash
openspec init --force
```

Codex에서는 OpenSpec이 `$CODEX_HOME/prompts` 또는 `~/.codex/prompts`의 이전 관리형 프롬프트 파일을 감지할 수 있습니다. 정리 대상은 OpenSpec 허용 목록에 포함된 기존 Codex 프롬프트 파일 이름으로 제한되며, 비대화형 `openspec init`은 대체 파일인 `.agents/skills/openspec-*` 스킬이 존재하는 항목만 제거합니다. 비대화형 `openspec update`는 `--force`를 전달하지 않으면 기존 파일을 정리하지 않습니다.

### 마이그레이션 후 명령이 표시되지 않음

IDE를 다시 시작하세요. 스킬은 시작할 때 검색됩니다. 그래도 표시되지 않는다면 `openspec update`를 실행하고 [지원 도구](/ko-KR/supported-tools/)에서 파일 위치를 확인하세요.

### 이전 `project.md`가 마이그레이션되지 않음

의도된 동작입니다. 직접 작성한 컨텍스트가 들어 있을 수 있으므로 OpenSpec은 `project.md`를 자동으로 삭제하지 않습니다. 유용한 부분을 `config.yaml`의 `context:` 섹션으로 옮긴 다음 직접 삭제하세요. [마이그레이션 안내서](/ko-KR/migration-guide/#projectmd를-configyaml로-마이그레이션)에서 AI에 전달해 내용을 추려 내도록 하는 프롬프트를 포함해 전체 과정을 설명합니다.

## 여전히 해결되지 않나요?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **터미널에서:** `openspec feedback "what went wrong"`을 실행하면 이슈를 열 수 있습니다.

문제를 보고할 때 OpenSpec 버전(`openspec --version`), Node 버전(`node --version`), AI 도구, 정확한 명령과 출력을 포함하세요. 훨씬 빠르게 도움을 받을 수 있습니다.
