---
title: "社群展示"
---

這是由社群維護的精選清單，收錄使用 OpenSpec 建置或為 OpenSpec 提供支援的專案與資源。歡迎提交工具、整合、工作流程和學習資源。社群成員透過提交 issue 來推動此展示頁的擴充，由維護者新增條目。

所列專案均由各自維護者獨立維護。收錄不代表 OpenSpec 官方提供支援或認可。有關設定和支援，請檢視各專案的文件和問題追蹤器。

## 專案與資源

- **[OpenSpec Workbench](https://github.com/VeryComplexAndLongName/OpenSpec-UI)**：執行並監督針對 OpenSpec 變更的智慧代理程式。
- **[openspec-guard](https://github.com/guillaume-flambard/spec-guard)**：CLI 和 GitHub Action，可報告哪些 OpenSpec 情境已由 Vitest 或 Jest 測試覆蓋，而不執行測試。

## 託管服務

提供 OpenSpec CLI 未提供之 OpenSpec 功能的託管產品。每個條目都會說明其帳戶、付費及資料處理條款。

- **[MySpec](https://myspec.dev)**：雲端測試版（需要帳戶；提供免費方案，無需信用卡），可引導進行規格訪談，並匯出四檔案套件或與 OpenSpec 相容的變更。其 MCP 伺服器（`@myspec/mcp-server`）與 [Claude Code 外掛](https://github.com/myspecs/claude-plugins) 讓編碼智慧代理程式讀取這些規格、撰寫 OpenSpec 變更，並逐項任務實作。該服務會將提交的內容傳送給第三方 AI 提供者，不適用於敏感資料。
- **[Entalpa](https://entalpa.com/en/openspec)**：匯入公開 GitHub 儲存庫的 `openspec/specs/`（最多 300 項需求）到可瀏覽的專案中，新增利害關係人、使用者故事，以及標示為推論的未決問題，並將結果匯出為 `openspec/specs/` 目錄樹；它從不寫入該儲存庫。匯入與閱讀不需要帳戶；儲存或編輯則需要，且 AI 功能使用付費點數。匯入的內容會傳送給第三方 AI 提供者。
- **[OpenSpec Review](https://skillgild.dev/skills/openspec-review) 與 [OpenSpec Compact](https://skillgild.dev/skills/openspec-compact)**：來自 SkillGild 的託管技能，適用於 Claude Code、Codex、Cursor、Gemini CLI 或任何 MCP 用戶端。Review 會將變更發布為連結，任何持有該連結的人都可以不需帳戶，即逐項需求核准、要求修改或留言，並顯示如同 `openspec archive` 會寫入的主規格，同時標示其他未結變更也會觸及的需求。Compact 會在主規格之間找出詞彙相近的需求與重複的情境，並將整理結果撰寫為 OpenSpec 變更。兩者都需要 SkillGild CLI 與免費帳戶（每個技能每月 25 次執行）。兩者都會將規格內容傳送至 SkillGild 的伺服器，該伺服器執行閉源程式碼，且不進行任何 AI 模型呼叫；Review 另外還會傳送提案、設計與任務，並將變更保留 30 天。

## 新增你的專案

提交 issue，寫明你希望新增的一行內容：專案名稱、直接連結，以及它與 OpenSpec 的簡短關聯說明。由維護者將其新增至此檔案。

- 條目應聚焦於使用 OpenSpec 建置的內容或支援使用 OpenSpec 的內容，而非一般性的產品宣傳。
- 描述人們可以用它做什麼。避免宣傳性說法、推薦連結和追蹤連結。
- 如有付費功能或必需賬戶，請在條目中說明。
- 託管或付費服務只有在提供 OpenSpec CLI 尚未提供的 OpenSpec 功能，且有免費試用方式時，才會列於「託管服務」下。重新包裝 OpenSpec 自身技能或命令的服務不予列出。

也歡迎更正和更新現有條目。
