---
title: "対応ツール"
---

OpenSpec はさまざまな AI コーディングアシスタントに対応しています。`openspec init` を実行すると、現在有効なプロファイル/ワークフローの選択と配布モードに基づいて、選択したツールを設定します。

## 仕組み

選択した各ツールに、OpenSpec は次のファイルをインストールできます。

1. **スキル**（配布モードにスキルが含まれる場合）: `.../skills/openspec-*/SKILL.md`
2. **コマンド**（配布モードにコマンドが含まれる場合）: ツール固有の `opsx-*` コマンドファイル

Codex はスキルのみを使用します。配布モードが `commands` に設定されていても、OpenSpec は Codex 用に `.agents/skills/openspec-*/SKILL.md` をインストールし、Codex のカスタムプロンプトファイルは生成しません。従来の `.codex/skills` パスにある既存の OpenSpec 管理スキルは、置き換え先を書き込んだ後に整理されます。カスタムファイルや差異のあるファイルは保持されます。

既定では、OpenSpec は次の項目を含む `core` プロファイルを使用します。
- `propose`
- `explore`
- `apply`
- `update`
- `sync`
- `archive`

`openspec config profile` で拡張ワークフロー（`new`、`continue`、`ff`、`verify`、`bulk-archive`、`onboard`）を有効にしてから、`openspec update` を実行できます。

## 呼び出し方法

このドキュメントでは `/opsx:propose` を標準名として使いますが、各ツールでは OpenSpec が作成したファイルの読み込み方法に応じて表記が異なります。以下の[ツールディレクトリリファレンス](#ツールディレクトリリファレンス)でツールのコマンドパスを確認し、対応する形式を見つけてください。

| OpenSpec が作成するコマンドファイル | 入力する形式 | ツール |
|------------------------------|----------|-------|
| `.../commands/opsx/<id>.*` — コマンドを `opsx/` フォルダーで名前空間化 | `/opsx:<id>` | Claude Code, CodeBuddy, Crush, Gemini CLI, Lingma, Qoder, ZCode |
| `.../opsx-<id>.*` — ファイル名がコマンド名 | `/opsx-<id>` | Amazon Q と Devin を除く、コマンドファイルを生成するその他すべてのツール |
| `.devin/workflows/opsx-<id>.md` — Devin の2種類のエージェントのうち1つだけが読み込む | Devin Desktop では `/opsx-<id>`、Devin Local では `/openspec-<skill>` | Devin Desktop\*\*\*\* |
| `.amazonq/prompts/opsx-<id>.md` — コマンドではなくプロンプト | `@opsx-<id>` | Amazon Q Developer |
| なし — スキルのみ | `/openspec-<skill>` | CodeArts, ForgeCode, Hermes, MiniMax Code, Mistral Vibe, Zed Agent, shared `.agents` |
| なし — Kimi Code | `/skill:openspec-<skill>` | Kimi Code |
| なし — Codex CLI | `$openspec-<skill>` | Codex ([`/openspec-<skill>` は認識されません](https://github.com/openai/codex/issues/11817)) |

そのため `/opsx:propose` は、Cursor では `/opsx-propose`、Amazon Q では `@opsx-propose`、Codex では `$openspec-propose` になります。

互いに独立して変化する点が2つあるため、表の行は統合できません。

- **名前。** 1〜2行目の違いは、ファイル内でのコマンド名の表記だけです。生成されたコマンドファイルを使うすべてのツールで、`opsx-<id>` / `opsx:<id>` の部分は共通です。
- **呼び出し方法。** Amazon Q はファイルを `@` で呼び出すプロンプトライブラリに読み込みます。スキルのみのツールはコマンドファイルを一切生成しないため、最後の3行では[生成されるスキル名](#生成されるスキル名)を使います。スキル名はコマンド ID と1対1で対応しません（`/opsx:apply` は `openspec-apply-change` スキルです）。

上記のコマンドパスパターンでは、意図的に拡張子を `.*` としてあります。拡張子はツールによって異なります（Gemini CLI は `.toml`、Continue は `.prompt`、Kiro と GitHub Copilot は `.prompt.md`）。ピッカーに拡張子付きの名前が表示されるツールもあります。拡張子ではなくディレクトリ構成を確認してください。

OpenSpec が生成するファイルと、セットアップ後に表示される「はじめに」のヒントは、選択したツールに適した形式になっています。最も手早く確認するには、ヒントを読んでください。

## ツールディレクトリリファレンス

| ツール（ID） | スキルのパスパターン | コマンドのパスパターン |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| Command Code (`command-code`) | `.commandcode/skills/openspec-*/SKILL.md` | `.commandcode/commands/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | 未生成（コマンドアダプターなし。スキルによる `/openspec-*` 呼び出しを使用） |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.agents/skills/openspec-*/SKILL.md` | 未生成（スキルのみ。`$openspec-*` を使用） |
| Devin Desktop（旧 Windsurf、`devin`） | `.devin/skills/openspec-*/SKILL.md` | `.devin/workflows/opsx-<id>.md`\*\*\*\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | 未生成（コマンドアダプターなし。スキルによる `/openspec-*` 呼び出しを使用） |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | 未生成（コマンドアダプターなし。スキルによる `/openspec-*` 呼び出しを使用） |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilo/command/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | 未生成（コマンドアダプターなし。スキルによる `/skill:openspec-*` 呼び出しを使用） |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| MiniMax Code (`minimax-code`) | `~/.minimax/skills/openspec-*/SKILL.md` | 未生成（コマンドアダプターなし。MiniMax Code スキルを使用） |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | 未生成（コマンドアダプターなし。スキルによる `/openspec-*` 呼び出しを使用） |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| SourceCraft Code Assistant for VS Code (`codeassistant`) | `.codeassistant/skills/openspec-*/SKILL.md` | `.codeassistant/commands/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Rovo Dev CLI](https://support.atlassian.com/rovo/docs/use-rovo-dev-cli/) (`rovodev`) | `.rovodev/skills/openspec-*/SKILL.md` | 未生成。Rovo にはスラッシュコマンドの仕組みがありません。スキルは自動的に、またはプロンプト（例:「openspec-propose スキルを使って」）で照合されます。`/skills` はスキルの管理にのみ使います。生成されるコンテンツではスキル名を参照し、`/openspec-*` コマンドとして扱うことはありません。 |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| [Zed Agent](https://zed.dev/docs/ai/skills) (`zed`) | `.agents/skills/openspec-*/SKILL.md` | 未生成（スキルのみ。`/openspec-*` または `@openspec-*` を使用） |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |
| 共有 `.agents` スキル (`agents`) | `.agents/skills/openspec-*/SKILL.md` | 未生成（コマンドアダプターなし。スキルによる `/openspec-*` 呼び出しを使用） |

\*\* GitHub Copilot のプロンプトファイルは、IDE 拡張機能（VS Code、JetBrains、Visual Studio）でカスタムスラッシュコマンドとして認識されます。現在 Copilot CLI は `.github/prompts/*.prompt.md` を直接読み込みません。`github-copilot` を選択すると、GitHub 上の **クラウドコーディングエージェント** も設定できます。下記の[GitHub Copilot クラウドコーディングエージェント](#github-copilot-クラウドコーディングエージェント)を参照してください。

\*\*\* Hermes は既定で `~/.hermes/skills/` からスキルを読み込みます。プロジェクトローカルの OpenSpec スキルを使うには、プロジェクトの `.hermes/skills/` ディレクトリを `~/.hermes/config.yaml` の `skills.external_dirs` に追加します。Hermes で `/openspec-propose` のようなスラッシュコマンドからスキルを呼び出せるようになります。

\*\*\*\* Windsurf は2026年6月2日に[Devin Desktop に名称変更](https://docs.devin.ai/desktop/devin-desktop-faq)され、設定ディレクトリも移動しました。`.devin/` が推奨される読み書き場所で、`.windsurf/` は従来の読み取り専用フォールバックです。OpenSpec も名称変更に対応しています。ツール ID は `devin` ですが、既存のセットアップスクリプトを引き続き使えるよう、`--tools windsurf` も同じツールとして解決されます。`.windsurf/` に OpenSpec ファイルが残っているプロジェクトでは、次回の `openspec update` 時に移動が提示されます。拒否した場合はそのまま残り、自分で作成したファイルには触れません。ワークフローはファイル名で呼び出すため、`.devin/workflows/opsx-apply.md` は `/opsx-apply` となります。[Devin Local エージェントはワークフローに対応せず](https://docs.devin.ai/desktop/devin-local)、スキルのみを使い、`.windsurf/` も読み込みません。そのため OpenSpec が Devin スキルを書き込む場合、両エージェントで使える `/openspec-*` のスキル呼び出しを、スキル本体と「はじめに」のヒントで使用します。コマンドのみの配布モードではスキルは書き込まれず、両方で `/opsx-*` を使います。

SourceCraft Code Assistant のサポート対象は VS Code 拡張機能です。[カスタムコマンド](https://sourcecraft.dev/portal/docs/en/code-assistant/operations/agent/slash-commands)と[スキル](https://sourcecraft.dev/portal/docs/ru/code-assistant/operations/agent/skills)は VS Code でのみ利用できます。この統合は SourceCraft web や JetBrains を設定しません。

スキルのみの配布モードでは、Code Assistant にアイデアとともに `openspec-propose` スキルを使うよう依頼してください。スキルは依頼内容との照合によって有効になるため、このツール用に OpenSpec が `/openspec-*` コマンドを生成することはありません。

MiniMax Code はグローバルなスキルのみの統合です。OpenSpec が書き込むのは
`~/.minimax/skills/` 以下の `openspec-*` ディレクトリのみです。リポジトリ内に
`.minimax` や `.mavis` ディレクトリを作ることはありません。コマンドのみの配布モードでも、
既存のグローバル MiniMax Code スキルは変更しません。あるプロジェクトの配布設定によって
別のプロジェクトが使うスキルが削除されることはありません。

### GitHub Copilot クラウドコーディングエージェント

GitHub の [Copilot coding agent](https://docs.github.com/en/copilot/using-github-copilot/coding-agent) は、エディター内の Copilot とは別に、GitHub Actions 環境で GitHub 上で実行されます。OpenSpec CLI を使えるように、OpenSpec は次の2つのファイルを生成して設定できます。

- `.github/workflows/copilot-setup-steps.yml` — エージェント環境に `@fission-ai/openspec` をインストール
- `.github/agents/openspec.agent.md` — OpenSpec の操作方法をエージェントに指示

リポジトリに GitHub Actions ワークフローを書き込むため、**オプトイン** 方式です。

| 方法 | 動作 |
|-----|----------|
| `openspec init`（対話形式） | クラウド用ファイルを設定するか尋ねます。既定値は **No** です。 |
| `openspec init --copilot-cloud` | 確認なしで設定します（スクリプト/CI 用）。 |
| `openspec init --no-copilot-cloud` | 確認なしでスキップし、以前生成したファイルがあれば削除します。 |
| `openspec update` | 確認は行いません。オプトイン済み（またはプロジェクトに既存ファイルがある）場合のみ更新します。オプトアウト済みなら、OpenSpec 管理のクラウドファイルを削除します。 |

選択内容は `openspec/config.yaml` の `githubCopilot.cloudAgent: true|false` として保存されるため、非対話型の更新にも反映されます。OpenSpec が書き込みまたは削除するのは、自ら生成した内容のファイルだけです。`copilot-setup-steps.yml` や `openspec.agent.md` をカスタマイズした場合、または独自のファイルがすでにある場合、それらは変更されません（`init`/`update` がその旨を通知します）。

### 共有 `.agents` ターゲットを選ぶ場合

`agents` はベンダー中立の選択肢です。ツール固有のディレクトリではなく、多くのエージェントツールが読み込む共有ルート `.agents/skills/` にスキルを書き込みます。

| 状況 | 選択 |
|-----------|------|
| 使用するツールが上の表にある | そのツールの ID — スラッシュコマンドに対応する場合はその統合も利用できます |
| 1つのリポジトリで複数のエージェントが `.agents/skills` を読む | `agents` — ツールごとに作成せず、1つのスキルツリーを共有 |
| 使用するツールはまだ一覧にないが `.agents/skills` を読む | `agents` |

ツール固有 ID と一緒に選択しても問題ありません。通常、それぞれ別のルートに書き込みます。ただし、Codex と Zed Agent は同じ標準 `.agents` ルートを使う例外です。Codex と Zed または `agents` が同時に選択されている場合、OpenSpec は Codex 主導のツリーを1つだけ保持します。引き継ぎでは Codex 用の `$openspec-*` と他のエージェント用の `/openspec-*` の両方を記載するため、`--tools all` や既存の複数エージェント構成でも、複数の書き込み元が同じファイルを上書きせずに動作します。
また、プロジェクトに `.agents/skills/` ディレクトリがあれば、OpenSpec はこのターゲットを自動的に提示します。`.agents/` だけでは不十分です。他のツールもそのルートをルールやサブエージェント定義に使うためです。`.agents` と `.agent` は別物です。単数形のディレクトリは Antigravity 用です。

次の2点に注意してください。

- **スキルのみ。** コマンドアダプターがないため `opsx-*` コマンドファイルは作成されません。コマンドを含む配布モードでは、`openspec init` の `Commands skipped for: … (no adapter)` の一覧に `agents` が表示されます。スキル名でワークフローを呼び出してください。`.agents/skills` を読む多くのアシスタントでは `/openspec-propose` と入力します（OpenSpec のセットアップヒントにもこの形式が表示されます）。ベンダー中立のターゲットなので、別の形式を使う場合はアシスタントのドキュメントを確認してください。
- **`AGENTS.md` は作成も編集もしません。** 対象は `.agents/` ディレクトリです。ルートの `AGENTS.md` に古いバージョンの OpenSpec マーカーブロックが残っている場合、`openspec update` が削除します。[移行ガイド](/ja-JP/migration-guide/)を参照してください。

ここでの Zed 対応は、組み込み Zed Agent 向けです。Zed External Agents と Terminal
Threads はそれぞれ独自の統合を使います。Agent Skills には
[Zed v1.4.2](https://github.com/zed-industries/zed/releases/tag/v1.4.2) or newer.
以上が必要です。信頼されていない worktree では、[信頼を付与](https://zed.dev/docs/worktree-trust)するまでプロジェクトローカルのスキルを利用できません。

`.agents/skills/` は Codex、Zed Agent、ベンダー中立ターゲットで共有されるため、OpenSpec が管理する内容を把握しておくとよいでしょう。
選択したワークフローに対応する `openspec-*` スキルディレクトリのみを書き込み、更新、削除します。また、共有ツリーを Codex、Zed Agent、ベンダー中立ターゲットのどれが生成したかを記録する `.openspec-target` マーカーも管理します。それ以外の内容には触れません。`openspec-*` 名とマーカーは OpenSpec が管理するものとして扱ってください。他のツールと同様、それらの内容を編集しても次の `openspec update` で置き換えられます。

マーカーがない既存プロジェクトでは、OpenSpec は管理対象スキルへの参照から所有者を推測します。
`$openspec-*` means Codex and `/openspec-*` means the vendor-neutral target. A
従来の `.codex/skills` と並ぶ汎用の標準ツリーは、古い二重ターゲットのインストールと見なされ、互換性のある共有ツリーに統合されます。

`openspec update` はこの所有権も尊重します。プロジェクトが `.agents` をベンダー中立ターゲットとして所有し、残存する Codex インストールが不要なプロンプトファイルだけから検出された場合、確立済みの `agents` ツリーを Codex 構文で書き直さず、そのまま残します。また、従来のプロンプトファイルも削除せずに保持します。共有ツリーを Codex に割り当てるには、`openspec init --tools codex` を明示的に実行してください。

## 非対話型セットアップ

CI/CD またはスクリプトでセットアップする場合は、`--tools`（必要に応じて `--profile`）を使います。

```bash
# 特定のツールを設定
openspec init --tools claude,cursor

# 対応するすべてのツールを設定
openspec init --tools all

# ツールの設定をスキップ
openspec init --tools none

# この init 実行に限りプロファイルを上書き
openspec init --profile core
```

**利用可能なツール ID（`--tools`）** — `devin` の別名として `windsurf` も使用できます: `amazon-q`、`antigravity`、`auggie`、`bob`、`claude`、`cline`、`command-code`、`codeartsagent`、`codex`、`devin`、`forgecode`、`codebuddy`、`continue`、`costrict`、`crush`、`cursor`、`factory`、`gemini`、`github-copilot`、`hermes`、`iflow`、`junie`、`kilocode`、`kimi`、`kiro`、`lingma`、`minimax-code`、`vibe`、`oh-my-pi`、`opencode`、`pi`、`qoder`、`qwen`、`roocode`、`codeassistant`、`trae`、`zed`、`zcode`、`agents`

## ワークフローに応じたインストール

OpenSpec は選択したワークフローに基づいて成果物をインストールします。

- **Core プロファイル（既定）:** `propose`、`explore`、`apply`、`update`、`sync`、`archive`
- **カスタム選択:** 次のワークフロー ID の任意の組み合わせ:
  `propose`, `explore`, `new`, `continue`, `apply`, `update`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

つまり、スキル/コマンドの数は固定ではなく、プロファイルと配布モードによって変わります。

## 生成されるスキル名

プロファイル/ワークフロー設定で選択すると、OpenSpec は次のスキルを生成します。

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

コマンドの動作は[コマンド](/ja-JP/commands/)、`init`/`update` のオプションは[CLI](/ja-JP/cli/)を参照してください。

## 関連ページ

- [CLI リファレンス](/ja-JP/cli/) — ターミナルコマンド
- [コマンド](/ja-JP/commands/) — スラッシュコマンドとスキル
- [はじめに](/ja-JP/getting-started/) — 初回セットアップ
