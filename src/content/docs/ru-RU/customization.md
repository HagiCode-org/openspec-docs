---
title: "Настройка"
---

OpenSpec предлагает три уровня настройки:

| Уровень | Назначение | Для кого |
|-------|--------------|----------|
| **Конфигурация проекта** | Задать настройки по умолчанию, передавать контекст и правила | Большинство команд |
| **Пользовательские схемы** | Определить собственные артефакты рабочего процесса | Команды с особыми процессами |
| **Глобальные переопределения** | Совместно использовать схемы во всех проектах | Опытные пользователи |

---

## Конфигурация проекта

Файл `openspec/config.yaml` — самый простой способ настроить OpenSpec для команды. Он позволяет:

- **Задать схему по умолчанию** — не указывать `--schema` в каждой команде.
- **Передавать контекст проекта** — ИИ будет знать ваш стек, соглашения и т. п.
- **Добавить правила для артефактов** — пользовательские правила для отдельных артефактов.
- **Добавить рекомендации для операций** — подсказки по работе apply и archive.
- **Сохранить выбор интеграций** — например, включение [облачного агента GitHub Copilot](/ru-RU/supported-tools/#облачный-агент-для-программирования-github-copilot).

### Быстрая настройка

```bash
openspec init
```

Команда поможет создать конфигурацию в интерактивном режиме. Её также можно создать вручную:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones

operations:
  apply:
    guidance:
      - Run focused tests before the full suite
  archive:
    guidance:
      - Keep the completion summary concise

# Set by `openspec init` when you choose (or decline) the GitHub Copilot
# cloud coding agent; controls whether `init`/`update` generate its files.
githubCopilot:
  cloudAgent: false
```

### Как это работает

**Схема по умолчанию:**

```bash
# Without config
openspec new change my-feature --schema spec-driven

# With config - schema is automatic
openspec new change my-feature
```

**Передача контекста и правил:**

При создании любого артефакта контекст и правила добавляются в запрос к ИИ:

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- **Контекст** включается во ВСЕ артефакты.
- **Правила** включаются ТОЛЬКО для соответствующего артефакта.

**Рекомендации для операций:**

`operations.apply.guidance` и `operations.archive.guidance` — необязательные
массивы рекомендаций о том, как агенту выполнять соответствующие операции. Они
отличаются от `rules`: рекомендации для операций не ограничивают содержимое
артефактов, а правила для артефактов не переименовываются в рекомендации.

Apply и archive получают эти данные во время выполнения:

```bash
openspec instructions apply --change my-feature --json
openspec instructions archive --change my-feature --json
```

Обе команды возвращают текущие `context` проекта и соответствующее поле
`operationGuidance` отдельно и при наличии. Каждый вызов получает актуальный
снимок из выбранного корня. Если указан `--store <id>`, изменение, контекст
и рекомендации берутся из хранилища, а не из текущего репозитория. Команда
инструкций архивации работает только на чтение: она не изучает и не объединяет
дельта-спецификации, не записывает основные спецификации, не перемещает изменение
и не запускает статический рабочий процесс архивации.

Контекст проекта — обязательный входной параметр запросов. Сгенерированные
рабочие процессы читают его и учитывают релевантные сведения о проекте,
соглашения и ограничения. Рекомендации для операций — необязательные
дополнительные подсказки: рабочие процессы рассматривают каждую из них и
следуют тем, которые применимы и совместимы со встроенным процессом.

Оба поля остаются отдельными от состояния, управляемого CLI, определённых путей,
встроенных шагов, явного выбора пользователя и правил артефактов. При конфликте
контекста рабочий процесс сообщает о нём, сохраняя приоритетное значение. Он не
выполняет неприменимые или конфликтующие рекомендации и объясняет причину. Ни
одно из полей не является проверяемым требованием, и рабочий процесс не копирует
их текст в файлы реализации, спецификации, артефакты изменения или сводки, если
пользователь отдельно не попросит об этом.

**Безопасность входных данных при архивации и синхронизации спецификаций:**

Команды archive, bulk archive и отдельная команда sync используют
`artifactPaths.specs.existingOutputPaths` из вывода `openspec status --json` как
единственный источник дельта-спецификаций. Если в схеме нет артефакта `specs`
или конкретный список выходных файлов изменения пуст, синхронизировать нечего;
другие артефакты не используются для определения дельта-спецификаций.

Перед тем как семантическое слияние запишет основную спецификацию, рабочий процесс
получает актуальный вывод команды
`openspec instructions specs --change <name> --json`. Выданные правила `specs`
ограничивают только основные спецификации, создаваемые
этим слиянием. Одиночная архивация передаёт снимок встроенной синхронизации,
отдельная синхронизация получает его напрямую, а bulk archive получает все
необходимые снимки до первой записи спецификаций. Ненулевой код завершения
команды инструкций archive/specs или некорректный JSON считаются ошибкой
получения данных, а не пустым вводом: рабочий процесс остановится до записи
затронутой спецификации или перемещения изменения (для bulk archive — до любой
пакетной записи или перемещения).

Эта конфигурация не меняет этапы выполнения архивации, запросы пользователю,
операции файловой системы, владение семантическим слиянием, непосредственную
команду `openspec archive`, структуру или вывод `rules` артефактов.

### Порядок определения схемы

При выборе схемы OpenSpec проверяет источники в следующем порядке:

1. Флаг CLI: `--schema <name>`
2. Метаданные изменения (`.openspec.yaml` в папке изменения)
3. Конфигурация проекта (`openspec/config.yaml`)
4. Значение по умолчанию (`spec-driven`)

---

## Пользовательские схемы

Если конфигурации проекта недостаточно, создайте собственную схему с полностью
пользовательским рабочим процессом. Пользовательские схемы хранятся в
`openspec/schemas/` проекта и версионируются вместе с кодом.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Project config
│   ├── schemas/           # Custom schemas live here
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Your changes
└── src/
```

### Создание копии существующей схемы

Самый быстрый способ настройки — создать копию встроенной схемы:

```bash
openspec schema fork spec-driven my-workflow
```

Команда копирует всю схему `spec-driven` в `openspec/schemas/my-workflow/`, где её можно свободно изменять.

**Полученная структура:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow definition
└── templates/
    ├── proposal.md       # Template for proposal artifact
    ├── spec.md           # Template for specs
    ├── design.md         # Template for design
    └── tasks.md          # Template for tasks
```

Измените `schema.yaml`, чтобы настроить рабочий процесс, или отредактируйте шаблоны, чтобы изменить генерируемое ИИ содержимое.

### Создание схемы с нуля

Чтобы создать полностью новый рабочий процесс:

```bash
# Interactive
openspec schema init research-first

# Non-interactive
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Структура схемы

Схема определяет артефакты рабочего процесса и зависимости между ними:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # Can't create design until proposal exists

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Основные поля:**

| Поле | Назначение |
|-------|---------|
| `id` | Уникальный идентификатор для команд и правил |
| `generates` | Имя выходного файла (поддерживает glob-шаблоны, например `specs/**/*.md`) |
| `template` | Файл шаблона в каталоге `templates/` |
| `instruction` | Инструкции для ИИ по созданию этого артефакта |
| `requires` | Зависимости — артефакты, которые нужно создать заранее |

Перечисляйте артефакты в порядке их создания. Поле `requires` определяет, что
можно создать; порядок элементов в списке `artifacts:` определяет, какой из
нескольких готовых артефактов будет создан первым.

### Шаблоны

Шаблоны — это Markdown-файлы, направляющие работу ИИ. Они добавляются в запрос при создании соответствующего артефакта.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

Шаблоны могут включать:
- заголовки разделов, которые должен заполнить ИИ;
- HTML-комментарии с инструкциями для ИИ;
- примеры формата ожидаемой структуры.

### Проверка схемы

Перед использованием пользовательской схемы проверьте её:

```bash
openspec schema validate my-workflow
```

Проверяется следующее:
- синтаксис `schema.yaml` корректен;
- все указанные шаблоны существуют;
- циклических зависимостей нет;
- ID артефактов допустимы.

### Использование пользовательской схемы

После создания применяйте схему так:

```bash
# Specify on command
openspec new change feature --schema my-workflow

# Or set as default in config.yaml
schema: my-workflow
```

### Отладка определения схемы

Не знаете, какая схема используется? Проверьте это командами:

```bash
# See where a specific schema resolves from
openspec schema which my-workflow

# List all available schemas
openspec schema which --all
```

Вывод показывает, загружена ли схема из проекта, каталога пользователя или пакета:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Примечание:** OpenSpec также поддерживает пользовательские схемы в `~/.local/share/openspec/schemas/` для совместного использования между проектами. Однако рекомендуются схемы проекта в `openspec/schemas/`, поскольку они версионируются вместе с кодом.

---

## Примеры

### Рабочий процесс быстрой итерации

Минимальный рабочий процесс для быстрых итераций:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Добавление артефакта проверки

Создайте копию схемы по умолчанию и добавьте этап проверки:

```bash
openspec schema fork spec-driven with-review
```

Затем добавьте в `schema.yaml`:

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # Now tasks require review too
```

---

## Схемы сообщества

OpenSpec также поддерживает схемы сообщества, распространяемые в отдельных репозиториях. Они предлагают рабочие процессы, объединяющие OpenSpec с другими инструментами и системами, подобно [каталогу расширений сообщества github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) для spec-kit.

Схемы сообщества не входят в OpenSpec core: они находятся в отдельных репозиториях и выпускаются по собственному расписанию. Чтобы использовать такую схему, скопируйте её комплект файлов в `openspec/schemas/<schema-name>/` проекта (инструкции по установке есть в README каждого репозитория).

| Схема | Сопровождающий | Репозиторий | Описание |
|--------|-----------|-----------|-------------|
| `intent-driven` | @harikrishnan83 | [intent-driven-dev/openspec-schemas](https://github.com/intent-driven-dev/openspec-schemas/tree/main/openspec/schemas/intent-driven) | До реализации фиксирует цель изменения, наблюдаемое поведение, техническое решение и долгосрочные архитектурные решения. Добавляет локальный для изменения манифест проверки ADR и записывает подходящие долгосрочные решения в неизменяемые ADR, которые можно заменить новыми. |
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Объединяет управление артефактами OpenSpec с навыками реализации [obra/superpowers](https://github.com/obra/superpowers) (мозговой штурм, планы, TDD с подагентами, проверка кода, завершение работы). Добавляет артефакт `retrospective`, основанный на фактических данных и закрывающий пробел, который Superpowers изначально не покрывает. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | Рабочий процесс с приоритетом управления продуктом. До реализации запускает конвейер планирования [nanopm](https://github.com/nmrtn/nanopm) (аудит → стратегия → дорожная карта → PRD). Связывает продуктовое планирование с инженерным процессом OpenSpec на основе спецификаций. При наличии артефакты читаются из `.nanopm/`: предложение опирается на аудит, проектное решение — на стратегию, а задачи — на декомпозицию PRD. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | Инструкции для сквозного тестирования на уровне возможностей. Для каждой возможности создаются неизменяемая спецификация, неизменяемый шаблон задач и отдельная запись о каждом запуске с отметкой времени. Проверки ограничены наблюдаемым поведением (статус HTTP, тело ответа, сохранённое состояние — но не фрагменты журналов); каждый запуск фиксирует время начала и окончания в UTC, длительность и оценочное потребление токенов LLM. |
| `anvil` | @jikkujoyce | [jikkujoyce/openspec-schemas](https://github.com/jikkujoyce/openspec-schemas/tree/main/schemas/anvil) | Рабочий процесс на основе спецификаций с дисциплиной TDD и состязательной проверкой. Последовательность: `proposal` → `specs` → `design` → `review` → `test-plan` → `tasks` → `apply` → `verify`. `review` подготавливает новый проверяющий с чистым контекстом и доступом только для чтения (при наличии — вторая модель); он выводит строку `VERDICT:`, по которой агент должен блокировать `test-plan`, `tasks` и `apply`. OpenSpec проверяет только наличие артефактов, поэтому соблюдение этого условия нужно обеспечить собственным CI или хуком. `test-plan` сопоставляет каждый сценарий спецификации с именованным тестом и служит журналом red/green, который проверяет `verify`. |
| `ml-research` | @tsenst | [idealo/openspec-schemas](https://github.com/idealo/openspec-schemas/tree/main/openspec/schemas/ml-research) | Рабочий процесс экспериментов в машинном обучении. Последовательность: `proposal` → `design` → `evaluation` → `tasks` → `apply` → `specs`. `evaluation` фиксирует метрики, критерии успеха и условие опровержения до запуска; `apply` записывает `results.md`; `specs` записывает только подтверждённые данными выводы (включая опровергнутые гипотезы) как требования `Finding:` со связанными блоками `Evidence:`. |
| `epic-driven` | @ivanferic| [IvanFeric/openspec-epic-driven](https://github.com/IvanFeric/openspec-epic-driven/tree/main/openspec/schemas/epic-driven) | Рабочий процесс на основе эпиков. Последовательность: `explore` (необязательно) → `epic-propose` → `epic-next` выбирает дочернюю историю → дочерний `apply` → дочерний `archive` → `epic-sync`. У эпика нет фазы `apply`, и он архивируется только после завершения всех своих историй. `epic-propose` создаёт видение, истории и дорожную карту; `epic-next` рекомендует дочернюю историю, а `epic-next <story> start` передаёт планирование дочерней истории обычному рабочему процессу `openspec-propose`; `epic-status` показывает текущий статус всех историй эпика; `epic-replan` может изменить план, сохранив активные или завершённые истории; `epic-sync` обновляет индикаторы завершения историй. |

> Хотите внести вклад в схему сообщества? Создайте issue со ссылкой на репозиторий и однострочным описанием, а сопровождающий добавит строку в таблицу.

---

## См. также

- [Справочник CLI: команды схем](/ru-RU/cli/#команды-схем) — полная документация по командам
