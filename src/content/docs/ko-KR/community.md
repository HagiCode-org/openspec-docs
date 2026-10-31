---
title: "커뮤니티 쇼케이스"
---

OpenSpec을 사용해 만들었거나 OpenSpec을 위해 만든 프로젝트와 자료를 모은 커뮤니티 운영 목록입니다. 도구, 통합 기능, 워크플로 및 학습 자료를 환영합니다. 커뮤니티 구성원은 이슈를 열어 이 쇼케이스를 키우고, 관리자가 항목을 추가합니다.

목록에 있는 프로젝트는 각자 독립적으로 관리됩니다. 목록에 포함되었다고 해서 OpenSpec이 공식적으로 지원하거나 보증한다는 뜻은 아닙니다. 설치 및 지원 정보는 각 프로젝트의 문서와 이슈 트래커를 확인하세요.

## 프로젝트 및 자료

- **[OpenSpec Workbench](https://github.com/VeryComplexAndLongName/OpenSpec-UI)**: OpenSpec 변경 사항을 대상으로 agents를 실행하고 감독합니다.
- **[openspec-guard](https://github.com/guillaume-flambard/spec-guard)**: 테스트를 실제로 실행하지 않고도 어떤 OpenSpec 시나리오가 Vitest 또는 Jest 테스트로 검증되는지 알려 주는 CLI 및 GitHub Action입니다.

## 호스팅 서비스

CLI가 제공하지 않는 OpenSpec 기능을 추가하는 호스팅 제품입니다. 각 항목에는 계정, 결제, 데이터 처리 조건이 명시되어 있습니다.

- **[MySpec](https://myspec.dev)**: 클라우드 베타(계정 필요, 무료 요금제 제공, 신용카드 불필요)입니다. 안내형 사양 인터뷰를 진행하고 네 개 파일로 구성된 묶음 또는 OpenSpec 호환 변경 사항으로 내보냅니다. MCP 서버(`@myspec/mcp-server`)와 [Claude Code 플러그인](https://github.com/myspecs/claude-plugins)을 사용하면 coding agents가 해당 사양을 읽고, OpenSpec 변경 사항을 작성하며, 작업 단위로 구현할 수 있습니다. 이 서비스는 제출된 내용을 제3자 AI 제공업체로 전송하므로 민감한 데이터에는 적합하지 않습니다.
- **[Entalpa](https://entalpa.com/en/openspec)**: 공개 GitHub 저장소의 `openspec/specs/`(최대 300개 요구 사항)를 탐색 가능한 프로젝트로 가져오고, 이해관계자와 스토리를 추가하며, 추론된 내용임을 표시한 미해결 질문을 더합니다. 결과는 `openspec/specs/` 트리로 내보내며, 저장소에는 절대 쓰지 않습니다. 가져오기와 읽기에는 계정이 필요하지 않지만, 저장하거나 편집하려면 계정이 필요합니다. AI 기능은 유료 크레딧을 사용합니다. 가져온 내용은 제3자 AI 제공업체로 전송됩니다.
- **[OpenSpec Review](https://skillgild.dev/skills/openspec-review)** 및 **[OpenSpec Compact](https://skillgild.dev/skills/openspec-compact)**: Claude Code, Codex, Cursor, Gemini CLI 또는 모든 MCP 클라이언트에서 쓸 수 있는 SkillGild의 호스팅 스킬입니다. Review는 변경 사항을 링크로 게시하며, 링크를 가진 누구나 계정 없이 요구 사항별로 승인, 변경 요청 또는 댓글을 남길 수 있습니다. `openspec archive`가 기록할 기본 사양을 보여 주고, 다른 열린 변경 사항과도 겹치는 요구 사항을 표시합니다. Compact는 기본 사양 전반에서 어휘적으로 유사한 요구 사항과 반복되는 시나리오를 찾아, 정리 작업을 OpenSpec 변경 사항으로 작성합니다. SkillGild CLI와 무료 계정(스킬당 월 25회 실행)이 필요합니다. 두 도구 모두 사양 내용을 SkillGild의 서버로 보내며, 이 서버는 비공개 소스 코드를 실행하고 AI 모델 호출은 하지 않습니다. Review는 제안, 설계, 작업 내용도 함께 보내며 변경 사항을 30일 동안 보관합니다.

## 프로젝트 추가

프로젝트 이름, 직접 연결되는 링크, OpenSpec과의 관련성을 설명하는 짧은 소개를 한 줄로 적어 이슈를 열어 주세요. 관리자가 이 파일에 추가합니다.

- 일반적인 제품 홍보가 아니라 OpenSpec으로 만들었거나 OpenSpec 사용을 지원하는 내용에 초점을 맞춰 주세요.
- 사람들이 실제로 사용할 수 있는 기능을 설명하세요. 홍보성 주장, 추천인 링크, 추적 링크는 피하세요.
- 유료 기능이나 필수 계정이 있다면 항목에 명시하세요.
- 호스팅 서비스나 유료 서비스는 CLI가 아직 제공하지 않는 OpenSpec 기능을 추가하고 무료로 체험할 방법이 있을 때만 호스팅 서비스 아래에 나열합니다. OpenSpec 자체의 스킬이나 명령을 재포장한 서비스는 나열하지 않습니다.

기존 항목의 수정과 업데이트도 환영합니다.
