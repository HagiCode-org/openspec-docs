---
title: "コミュニティ紹介"
---

OpenSpec を使って構築されたプロジェクトや、OpenSpec のために作られたリソースを紹介する、コミュニティ運営のリストです。ツール、統合機能、ワークフロー、学習リソースを歓迎します。コミュニティメンバーは Issue を開くことでこの紹介ページを充実させ、掲載項目はメンテナーが追加します。

掲載プロジェクトはそれぞれ独立して保守されています。掲載されていることは、OpenSpec による公式サポートや推奨を意味しません。セットアップとサポートについては、各プロジェクトのドキュメントと課題トラッカーを確認してください。

## プロジェクトとリソース

- **[OpenSpec Workbench](https://github.com/VeryComplexAndLongName/OpenSpec-UI)**: OpenSpec の変更に対する agent の実行と監視。
- **[openspec-guard](https://github.com/guillaume-flambard/spec-guard)**: Vitest または Jest のテストを実行せずに、どの OpenSpec シナリオがテストでカバーされているかを報告する CLI および GitHub Action。

## ホスト型サービス

OpenSpec の CLI にはない OpenSpec の機能を追加するホスト型製品です。各項目には、アカウント、支払い、データの取り扱いに関する条件を記載しています。

- **[MySpec](https://myspec.dev)**: クラウドベータ版（アカウントが必要。無料枠あり、クレジットカード不要）。ガイド付きの仕様インタビューを行い、4ファイルのバンドルまたは OpenSpec 互換の change をエクスポートします。MCP サーバー（`@myspec/mcp-server`）と [Claude Code プラグイン](https://github.com/myspecs/claude-plugins) により、coding agent はそれらの仕様を読み取り、OpenSpec の change を書き、タスクごとに実装できます。このサービスは送信された内容をサードパーティの AI プロバイダーに送信するため、機密データには向いていません。
- **[Entalpa](https://entalpa.com/en/openspec)**: 公開 GitHub リポジトリの `openspec/specs/`（最大300件の要件）を取り込み、閲覧可能なプロジェクトにします。ステークホルダー、ストーリー、推測によるものとラベルされたオープンな質問を追加し、結果を `openspec/specs/` のツリーとしてエクスポートします。リポジトリへの書き込みは一切行いません。取り込みと閲覧にアカウントは不要です。保存や編集にはアカウントが必要で、AI 機能は有料クレジットを使用します。取り込まれた内容はサードパーティの AI プロバイダーに送信されます。
- **[OpenSpec Review](https://skillgild.dev/skills/openspec-review) と [OpenSpec Compact](https://skillgild.dev/skills/openspec-compact)**: Claude Code、Codex、Cursor、Gemini CLI、任意の MCP クライアント向けの SkillGild によるホスト型スキルです。Review は change をリンクとして公開し、リンクを持つ人は誰でもアカウントなしで要件ごとに承認、変更要求、コメントができます。`openspec archive` が書き込む形でメインの仕様を表示し、他のオープンな change も変更している要件に印を付けます。Compact は、メインの仕様全体で語彙的に類似した要件と繰り返されるシナリオを見つけ、整理内容を OpenSpec の change として書き出します。SkillGild CLI と無料アカウントが必要です（スキルごとに月25回まで）。どちらも仕様の内容を SkillGild のサーバーに送信します。このサーバーはクローズドソースのコードを実行し、AI モデルの呼び出しは行いません。Review は proposal、design、tasks も送信し、change を30日間保存します。

## プロジェクトを追加する

プロジェクト名、直接リンク、OpenSpec との関係を示す短い説明を1行にまとめた Issue を開いてください。メンテナーがこのファイルに追加します。

- 一般的な製品広告ではなく、OpenSpec を使って構築されたもの、またはその利用を支援するものに絞ってください。
- 利用者が何に使えるかを説明してください。宣伝文句、紹介リンク、トラッキングリンクは避けてください。
- 有料機能や必須アカウントがある場合は、掲載内容に明記してください。
- ホスト型や有料のサービスは、CLI がまだ提供していない OpenSpec の機能を追加し、無料で試せる方法がある場合に限って「ホスト型サービス」に掲載します。OpenSpec 自身のスキルやコマンドを再パッケージしただけのサービスは掲載しません。

既存項目の訂正や更新も歓迎します。
