---
title: "Поддерживаемые инструменты"
---

OpenSpec работает со множеством ИИ-ассистентов для программирования. При выполнении `openspec init` он настраивает выбранные инструменты с учётом активного профиля, набора рабочих процессов и режима установки.

## Как это работает

Для каждого выбранного инструмента OpenSpec может установить:

1. **Навыки** (если выбранный способ установки их включает): `.../skills/openspec-*/SKILL.md`
2. **Команды** (если выбранный способ установки их включает): файлы команд `opsx-*` для конкретного инструмента

Для Codex поддерживаются только навыки: OpenSpec устанавливает для него `.agents/skills/openspec-*/SKILL.md`, даже если выбран режим установки `commands`, и не создаёт пользовательские файлы запросов Codex. Ранее созданные навыки OpenSpec в устаревшем каталоге `.codex/skills` согласуются после записи новых версий; пользовательские и отличающиеся файлы сохраняются.

По умолчанию OpenSpec использует профиль `core`, включающий:
- `propose`
- `explore`
- `apply`
- `update`
- `sync`
- `archive`

Расширенные рабочие процессы (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) можно включить с помощью `openspec config profile`, а затем запустить `openspec update`.

## Вызов команд

В этой документации в качестве основного имени используется `/opsx:propose`, однако каждый инструмент задаёт написание по формату загружаемого им файла OpenSpec. Найдите путь команды для своего инструмента в разделе [Справочник по каталогам инструментов](#справочник-по-каталогам-инструментов), а затем выберите соответствующий ему вариант ниже.

| Файл команды, создаваемый OpenSpec | Вводимая команда | Инструменты |
|------------------------------|----------|-------|
| `.../commands/opsx/<id>.*` — каталог `opsx/` задаёт пространство имён команды | `/opsx:<id>` | Claude Code, CodeBuddy, Crush, Gemini CLI, Lingma, Qoder, ZCode |
| `.../opsx-<id>.*` — имя файла является командой | `/opsx-<id>` | Все остальные инструменты с генерируемыми файлами команд, кроме Amazon Q и Devin |
| `.devin/workflows/opsx-<id>.md` — читается только одним из двух агентов Devin | `/opsx-<id>` в Devin Desktop, `/openspec-<skill>` в Devin Local | Devin Desktop\*\*\*\* |
| `.amazonq/prompts/opsx-<id>.md` — запрос, а не команда | `@opsx-<id>` | Amazon Q Developer |
| отсутствует — только навыки | `/openspec-<skill>` | CodeArts, ForgeCode, Hermes, MiniMax Code, Mistral Vibe, Zed Agent, общий `.agents` |
| отсутствует — Kimi Code | `/skill:openspec-<skill>` | Kimi Code |
| отсутствует — Codex CLI | `$openspec-<skill>` | Codex ([`/openspec-<skill>` не распознаётся](https://github.com/openai/codex/issues/11817)) |

Таким образом, `/opsx:propose` в Cursor записывается как `/opsx-propose`, в Amazon Q — как `@opsx-propose`, а в Codex — как `$openspec-propose`.

Независимо друг от друга меняются два параметра — поэтому эти строки нельзя объединить:

- **Имя.** В первых двух строках различается только то, как файл задаёт имя команды; основа `opsx-<id>` / `opsx:<id>` одинакова у всех инструментов с генерируемыми файлами команд.
- **Обёртка.** Amazon Q загружает файлы в библиотеку запросов, вызываемую через `@`. Инструменты, использующие только навыки, вообще не создают файлов команд, поэтому в последних трёх строках используются имена *навыков* (перечислены в разделе [Сгенерированные имена навыков](#имена-создаваемых-навыков)), которые не соответствуют идентификаторам команд один к одному (`/opsx:apply` — это навык `openspec-apply-change`).

Шаблоны путей команд выше намеренно не зависят от расширения (`.*`): расширение определяется инструментом (`.toml` для Gemini CLI, `.prompt` для Continue, `.prompt.md` для Kiro и GitHub Copilot), а некоторые инструменты отображают имя вместе с расширением в списке команд. Сопоставляйте структуру каталогов, а не расширение.

В сгенерированных файлах OpenSpec и подсказке «Начало работы», выводимой после настройки, уже используется правильный формат для выбранных инструментов. Поэтому быстрее всего прочитать эту подсказку.

## Справочник по каталогам инструментов

| Инструмент (ID) | Шаблон пути навыка | Шаблон пути команды |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| Command Code (`command-code`) | `.commandcode/skills/openspec-*/SKILL.md` | `.commandcode/commands/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | Не создаётся (нет адаптера команд; используйте вызов навыков `/openspec-*`) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.agents/skills/openspec-*/SKILL.md` | Не создаётся (только навыки; используйте `$openspec-*`) |
| Devin Desktop, formerly Windsurf (`devin`) | `.devin/skills/openspec-*/SKILL.md` | `.devin/workflows/opsx-<id>.md`\*\*\*\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Не создаётся (нет адаптера команд; используйте вызов навыков `/openspec-*`) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | Не создаётся (нет адаптера команд; используйте вызов навыков `/openspec-*`) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilo/command/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | Не создаётся (нет адаптера команд; используйте вызов навыков `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| MiniMax Code (`minimax-code`) | `~/.minimax/skills/openspec-*/SKILL.md` | Не создаётся (нет адаптера команд; используйте навыки MiniMax Code) |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Не создаётся (нет адаптера команд; используйте вызов навыков `/openspec-*`) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| SourceCraft Code Assistant for VS Code (`codeassistant`) | `.codeassistant/skills/openspec-*/SKILL.md` | `.codeassistant/commands/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Rovo Dev CLI](https://support.atlassian.com/rovo/docs/use-rovo-dev-cli/) (`rovodev`) | `.rovodev/skills/openspec-*/SKILL.md` | Не создаётся. В Rovo нет slash-команд: навыки подбираются автоматически или по запросу (например, «используй навык openspec-propose»); команда `/skills` служит только для управления ими. В созданных материалах навыки упоминаются по имени, а не как команды `/openspec-*`. |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| [Zed Agent](https://zed.dev/docs/ai/skills) (`zed`) | `.agents/skills/openspec-*/SKILL.md` | Не создаётся (только навыки; используйте `/openspec-*` или `@openspec-*`) |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |
| Общие навыки `.agents` (`agents`) | `.agents/skills/openspec-*/SKILL.md` | Не создаётся (нет адаптера команд; используйте вызов навыков `/openspec-*`) |

\*\* Файлы запросов GitHub Copilot распознаются как пользовательские slash-команды в расширениях IDE (VS Code, JetBrains, Visual Studio). Copilot CLI сейчас не использует файлы `.github/prompts/*.prompt.md` напрямую. При выборе `github-copilot` также можно настроить **облачного агента для программирования** GitHub — см. раздел [Облачный агент GitHub Copilot](#облачный-агент-для-программирования-github-copilot) ниже.

\*\*\* По умолчанию Hermes загружает навыки из `~/.hermes/skills/`. Чтобы использовать локальные навыки OpenSpec, добавьте каталог проекта `.hermes/skills/` в `skills.external_dirs` файла `~/.hermes/config.yaml`; после этого Hermes будет предоставлять навыки в виде пользовательских slash-вызовов, например `/openspec-propose`.

\*\*\*\* 2 июня 2026 года Windsurf был [переименован в Devin Desktop](https://docs.devin.ai/desktop/devin-desktop-faq), а каталог конфигурации изменился: `.devin/` стал предпочтительным каталогом для чтения и записи, а `.windsurf/` — устаревшим каталогом только для чтения. OpenSpec учитывает переименование: идентификатор инструмента — `devin`, а `--tools windsurf` по-прежнему соответствует ему, чтобы существующие сценарии настройки продолжали работать. При следующем `openspec update` проекту, в котором ещё есть файлы OpenSpec в `.windsurf/`, будет предложено переместить их; отказ оставит их на месте, а файлы, созданные вами, не будут затронуты. Рабочие процессы вызываются по имени файла, поэтому `.devin/workflows/opsx-apply.md` вызывается командой `/opsx-apply`. Агент [Devin Local не поддерживает рабочие процессы](https://docs.devin.ai/desktop/devin-local), а работает только с навыками и вообще не читает `.windsurf/`. Поэтому, когда OpenSpec записывает навыки Devin, в их содержимом и подсказке о начале работы используются вызовы навыков `/openspec-*`, работающие в обоих агентах. В режиме установки только команд навыки не записываются, и оба агента используют вариант `/opsx-*`.

Поддержка SourceCraft Code Assistant предназначена для расширения VS Code. Его [пользовательские команды](https://sourcecraft.dev/portal/docs/en/code-assistant/operations/agent/slash-commands) и [навыки](https://sourcecraft.dev/portal/docs/ru/code-assistant/operations/agent/skills) доступны только в VS Code. Эта интеграция не настраивает SourceCraft в веб-версии или JetBrains.

При установке только навыков попросите Code Assistant применить навык `openspec-propose` к вашей идее. Навыки активируются при сопоставлении с запросом; OpenSpec не создаёт для этого инструмента команды `/openspec-*`.

MiniMax Code — глобальная интеграция, использующая только навыки. OpenSpec записывает
только каталоги `openspec-*` в `~/.minimax/skills/`; локальные каталоги проекта
`.minimax` или `.mavis` не создаются. Режим установки только команд не затрагивает
существующие глобальные навыки MiniMax Code, чтобы настройки одного проекта не могли
удалить навыки, используемые другим проектом.

### Облачный агент для программирования GitHub Copilot

Агент [Copilot для программирования](https://docs.github.com/en/copilot/using-github-copilot/coding-agent) работает на GitHub в среде GitHub Actions отдельно от Copilot в редакторе. OpenSpec может настроить его для использования CLI OpenSpec, создав два файла:

- `.github/workflows/copilot-setup-steps.yml` — устанавливает `@fission-ai/openspec` в среде агента
- `.github/agents/openspec.agent.md` — объясняет агенту, как управлять OpenSpec

Поскольку в репозиторий добавляется рабочий процесс GitHub Actions, эту функцию нужно **включить явно**:

| Способ | Поведение |
|-----|----------|
| `openspec init` (interactive) | Спрашивает, нужно ли настроить облачные файлы. По умолчанию — **нет**. |
| `openspec init --copilot-cloud` | Настраивает их без запроса (для сценариев и CI). |
| `openspec init --no-copilot-cloud` | Пропускает настройку без запроса и удаляет ранее созданные файлы. |
| `openspec update` | Не задаёт вопросов. Обновляет файлы, только если вы включили эту функцию (или файлы уже есть в проекте). Если вы отказались, удаляет облачные файлы, управляемые OpenSpec. |

Выбор сохраняется в `openspec/config.yaml` как `githubCopilot.cloudAgent: true|false`, поэтому при неинтерактивных обновлениях он учитывается. OpenSpec записывает и удаляет только созданные им файлы. Если вы изменили `copilot-setup-steps.yml` или `openspec.agent.md` либо создали их самостоятельно, файлы останутся нетронутыми (команды `init` и `update` сообщат об этом).

### Когда выбирать общий каталог `.agents`

`agents` — нейтральный по отношению к поставщику вариант: он записывает навыки в `.agents/skills/`, общий каталог, который читают многие инструменты для работы с агентами, а не в каталог отдельного инструмента.

| Ситуация | Выбор |
|-----------|------|
| Для вашего инструмента выше есть отдельная строка | Его собственный ID — вы получите интеграцию с этим инструментом, включая slash-команды, если он их поддерживает |
| Несколько агентов работают с одним репозиторием и читают `.agents/skills` | `agents` — одно дерево навыков вместо отдельного для каждого инструмента |
| Вашего инструмента пока нет в списке, но он читает `.agents/skills` | `agents` |

Его можно выбрать вместе с ID конкретного инструмента: обычно каждый записывает
файлы в свой корневой каталог. Исключение — Codex и Zed Agent, использующие один
общий каталог `.agents`. Если выбран Codex вместе с Zed или `agents`, OpenSpec
сохраняет одно дерево навыков, организованное для Codex. В инструкциях передачи
указываются `$openspec-*` для Codex и `/openspec-*` для других агентов, поэтому
`--tools all` и существующие конфигурации с несколькими агентами работают без
перезаписи одних файлов разными инструментами.
OpenSpec также предлагает эту цель автоматически, если в проекте есть каталог
`.agents/skills/`. Одного `.agents/` недостаточно, поскольку инструменты также
используют этот каталог для правил и определений подагентов. Обратите внимание:
`.agents` — не то же самое, что `.agent`; каталог в единственном числе принадлежит
Antigravity.

Нужно знать две вещи:

- **Только навыки.** Адаптера команд нет, поэтому файлы команд `opsx-*` не
  записываются. В режиме установки, включающем команды, `openspec init` перечисляет
  `agents` среди инструментов в сообщении `Commands skipped for: … (no adapter)`.
  Рабочие процессы вызываются по имени навыка — чаще всего ассистенты, читающие
  `.agents/skills`, используют `/openspec-propose`, как указано в подсказке OpenSpec.
  Цель нейтральна по отношению к поставщику, поэтому, если ваш ассистент использует
  другую форму, обратитесь к его документации.
- **Файл `AGENTS.md` не создаётся и не редактируется.** Цель настройки — каталог
  `.agents/`. Если в корневом `AGENTS.md` остались блоки-маркеры OpenSpec от старой
  версии, `openspec update` удалит их — см. [Руководство по миграции](/ru-RU/migration-guide/).

Поддерживается встроенный Zed Agent. Zed External Agents и Terminal
Threads используют собственные интеграции. Для навыков агентов требуется
[Zed v1.4.2](https://github.com/zed-industries/zed/releases/tag/v1.4.2) or newer.
Локальные навыки проекта недоступны в недоверенном рабочем дереве, пока вы не
[предоставите ему доверие](https://zed.dev/docs/worktree-trust).

Поскольку каталог `.agents/skills/` используется совместно Codex, Zed Agent и
нейтральной целью, важно знать, какими файлами в нём управляет OpenSpec:
он записывает, обновляет и удаляет только каталоги навыков `openspec-*` для
выбранных рабочих процессов, а также маркер `.openspec-target`, указывающий,
какой инструмент (Codex, Zed Agent или нейтральная цель) создал это общее дерево.
Остальные файлы в каталоге не затрагиваются. Считайте имена `openspec-*` и маркер
принадлежащими OpenSpec: при следующем `openspec update` изменения внутри них будут
заменены, как и в интеграциях с другими инструментами.

В проектах без маркера OpenSpec определяет владельца по ссылкам на управляемые навыки:
`$openspec-*` указывает на Codex, а `/openspec-*` — на нейтральную цель. Общее дерево
навыков вместе с устаревшим каталогом `.codex/skills` считается старой установкой
для двух целей и объединяется в совместимое общее дерево.

Команда `openspec update` также учитывает владельца каталога. Если проект использует
`.agents` как нейтральную цель, а об оставшейся установке Codex свидетельствуют
только отдельные файлы запросов, команда оставит существующее дерево `agents`
без изменений, не переписывая его в синтаксисе Codex, и сохранит устаревшие файлы
запросов вместо их удаления. Чтобы передать общее дерево Codex, явно выполните
`openspec init --tools codex`.

## Неинтерактивная настройка

Для настройки в CI/CD или с помощью сценария используйте `--tools` (и при необходимости `--profile`):

```bash
# Настроить определённые инструменты
openspec init --tools claude,cursor

# Настроить все поддерживаемые инструменты
openspec init --tools all

# Пропустить настройку инструментов
openspec init --tools none

# Переопределить профиль для этого запуска init
openspec init --profile core
```

**Доступные ID инструментов (`--tools`)** — также принимается `windsurf` как псевдоним `devin`: `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `command-code`, `codeartsagent`, `codex`, `devin`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `minimax-code`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `codeassistant`, `trae`, `zed`, `zcode`, `agents`

## Установка в зависимости от рабочего процесса

OpenSpec устанавливает артефакты для выбранных рабочих процессов:

- **Профиль core (по умолчанию):** `propose`, `explore`, `apply`, `update`, `sync`, `archive`
- **Пользовательский выбор:** любое подмножество всех ID рабочих процессов:
  `propose`, `explore`, `new`, `continue`, `apply`, `update`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Иными словами, количество навыков и команд зависит от профиля и способа установки, а не является фиксированным.

## Имена создаваемых навыков

Если они выбраны в конфигурации профиля или рабочего процесса, OpenSpec создаёт следующие навыки:

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

Описание команд см. в разделе [Команды](/ru-RU/commands/), а параметры `init` и `update` — в разделе [CLI](/ru-RU/cli/).

## Связанные разделы

- [Справочник CLI](/ru-RU/cli/) — команды терминала
- [Команды](/ru-RU/commands/) — slash-команды и навыки
- [Начало работы](/ru-RU/getting-started/) — первоначальная настройка
