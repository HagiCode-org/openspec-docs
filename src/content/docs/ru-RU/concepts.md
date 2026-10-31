---
title: "Основные понятия"
---

В этом руководстве объясняются основные идеи OpenSpec и их взаимосвязь. Практические сведения см. в разделах [Начало работы](/ru-RU/getting-started/) и [Рабочие процессы](/ru-RU/workflows/).

## Философия

В основе OpenSpec лежат четыре принципа:

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### Почему эти принципы важны

**Гибкость, а не жёсткость.** Традиционные системы спецификаций привязывают вас к этапам: сначала планирование, затем реализация, после чего работа считается завершённой. OpenSpec гибче — артефакты можно создавать в любом порядке, подходящем для вашей задачи.

**Итерации, а не каскадная модель.** Требования меняются, понимание задачи углубляется. Подход, казавшийся удачным вначале, может не подойти после изучения кодовой базы. OpenSpec учитывает эту реальность.

**Простота, а не сложность.** Некоторые платформы для спецификаций требуют длительной настройки, жёстких форматов и тяжеловесных процессов. OpenSpec не мешает работе: инициализация занимает секунды, после неё можно сразу начинать, а настройка нужна только при необходимости.

**Приоритет существующим системам.** Большинство задач разработки — это не создание с нуля, а изменение работающих систем. Дельта-подход OpenSpec упрощает описание изменений существующего поведения, а не только новых систем.

## Общая картина

OpenSpec разделяет работу на две основные области:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Спецификации** — источник истины; они описывают текущее поведение системы.

**Изменения** — предлагаемые модификации; они хранятся в отдельных папках до момента слияния.

Такое разделение принципиально важно. Можно параллельно работать над несколькими изменениями, не создавая конфликтов, и проверить изменение до того, как оно затронет основные спецификации. При архивации его дельты аккуратно объединяются с источником истины.

## Спецификации

Спецификации описывают поведение системы с помощью структурированных требований и сценариев.

### Структура

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentication behavior
├── payments/
│   └── spec.md           # Payment processing
├── notifications/
│   └── spec.md           # Notification system
└── ui/
    └── spec.md           # UI behavior and themes
```

Группируйте спецификации по областям — логическим частям системы. Распространённые варианты:

- **По функциональной области**: `auth/`, `payments/`, `search/`
- **По компоненту**: `api/`, `frontend/`, `workers/`
- **По ограниченному контексту**: `ordering/`, `fulfillment/`, `inventory/`

### Формат спецификации

Спецификация содержит требования, а каждое требование — сценарии:

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**Основные элементы:**

| Элемент | Назначение |
|---------|---------|
| `## Purpose` | Краткое описание области этой спецификации |
| `### Requirement:` | Конкретное поведение, обязательное для системы |
| `#### Scenario:` | Конкретный пример выполнения требования |
| SHALL/MUST/SHOULD | Ключевые слова RFC 2119, задающие обязательность требования |

### Почему спецификации устроены именно так

**Требования описывают «что»** — что должна делать система, без указания реализации.

**Сценарии описывают «когда»** — это конкретные, проверяемые примеры. Хорошие сценарии:
- можно проверить (для них можно написать автоматизированный тест);
- охватывают успешное выполнение и граничные случаи;
- используют формат Given/When/Then или похожую структуру.

**Ключевые слова RFC 2119** (SHALL, MUST, SHOULD, MAY) передают степень обязательности:
- **MUST/SHALL** — безусловное требование;
- **SHOULD** — рекомендация, допускающая исключения;
- **MAY** — необязательное условие.

### Чем является спецификация (и чем не является)

Спецификация — это **контракт поведения**, а не план реализации.

Что следует включать в спецификацию:
- наблюдаемое поведение, от которого зависят пользователи и последующие системы;
- входные и выходные данные, а также условия ошибок;
- внешние ограничения (безопасность, конфиденциальность, надёжность, совместимость);
- сценарии, которые можно протестировать или явно проверить.

Чего следует избегать в спецификациях:
- названий внутренних классов и функций;
- выбора библиотек и фреймворков;
- пошаговых деталей реализации;
- подробных планов выполнения (они относятся к `design.md` или `tasks.md`).

Быстрая проверка:
- если реализацию можно изменить, не меняя внешне наблюдаемого поведения, скорее всего, ей не место в спецификации.

### Лёгкий подход: постепенное повышение строгости

OpenSpec помогает избежать бюрократии. Используйте минимальный уровень строгости, который всё ещё позволяет проверить изменение.

**Облегчённая спецификация (по умолчанию):**
- краткие требования, ориентированные на поведение;
- ясная область работ и явно исключённые задачи;
- несколько конкретных критериев приёмки.

**Полная спецификация (для более рискованных изменений):**
- изменения между командами или репозиториями;
- изменения API/контрактов, миграции, вопросы безопасности и конфиденциальности;
- изменения, в которых неоднозначность может привести к дорогостоящей переработке.

Большинство изменений должны оставаться в облегчённом режиме.

### Совместная работа человека и agent

Во многих командах люди исследуют задачу, а agents составляют черновики артефактов. Рекомендуемый цикл:

1. Человек задаёт цель, контекст и ограничения.
2. Agent преобразует их в требования и сценарии, ориентированные на поведение.
3. Agent описывает детали реализации в `design.md` и `tasks.md`, а не в `spec.md`.
4. Перед реализацией проверка подтверждает корректность структуры и ясность.

Так спецификации остаются понятными людям и последовательными для agents.

## Изменения

Изменение — это предлагаемая модификация системы, оформленная в отдельную папку со всем необходимым для понимания и реализации.

### Структура изменения

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what
├── design.md             # How (technical approach)
├── tasks.md              # Implementation checklist
├── .openspec.yaml        # Change metadata (optional): schema, created, skip_specs, retire_capabilities, plus your own x-* keys
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # What's changing in ui/spec.md
```

Каждое изменение самодостаточно. Оно включает:
- **Артефакты** — документы, описывающие цель, проектное решение и задачи;
- **Дельта-спецификации** — спецификации того, что добавляется, меняется или удаляется;
- **Метаданные** — необязательная конфигурация конкретного изменения.

### Почему изменения оформляются в папки

Оформление изменения в виде папки имеет несколько преимуществ:

1. **Всё в одном месте.** Предложение, проектное решение, задачи и спецификации собраны вместе. Не нужно искать их в разных каталогах.

2. **Параллельная работа.** Несколько изменений могут существовать одновременно и не конфликтовать. Работайте над `add-dark-mode`, пока выполняется `fix-auth-bug`.

3. **Понятная история.** При архивации изменения перемещаются в `changes/archive/` со всем контекстом. Позже можно выяснить не только, что изменилось, но и почему.

4. **Удобство проверки.** Папку изменения легко проверить: откройте её, прочитайте предложение, изучите проектное решение и дельты спецификаций.

## Артефакты

Артефакты — документы внутри изменения, направляющие работу.

### Последовательность артефактов

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Артефакты создаются один на основе другого. Каждый предоставляет контекст для следующего.

### Artifact Types

#### Предложение (`proposal.md`)

В предложении в общих чертах описываются **цель**, **область работ** и **подход**.

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**Когда следует обновить предложение:**
- меняется область работ (сужается или расширяется);
- уточняется цель (проблема стала понятнее);
- существенно меняется подход.

#### Спецификации (дельта-спецификации в `specs/`)

Дельта-спецификации описывают, **что меняется** по сравнению с текущими спецификациями. См. раздел [Дельта-спецификации](#дельта-спецификации) ниже.

#### Проектное решение (`design.md`)

Проектное решение описывает **технический подход** и **архитектурные решения**.

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**Когда следует обновить проектное решение:**
- при реализации выяснилось, что подход не сработает;
- найдено более удачное решение;
- изменились зависимости или ограничения.

#### Задачи (`tasks.md`)

Задачи — это **контрольный список реализации** с конкретными шагами и флажками.

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**Рекомендации по задачам:**
- объединяйте связанные задачи в группы под заголовками;
- используйте иерархическую нумерацию (1.1, 1.2 и т. д.);
- делайте задачи достаточно небольшими, чтобы выполнить их за один сеанс;
- указывайте способ проверки каждой задачи (тест, команда или наблюдаемый результат);
- добавляйте тесты и документацию для каждой группы задач в саму эту группу, а не в заключительную группу «наверстать упущенное»;
- отмечайте задачи по мере выполнения.

## Дельта-спецификации

Дельта-спецификации — ключевое понятие, позволяющее использовать OpenSpec при доработке существующих систем. Они описывают, **что меняется**, а не повторяют спецификацию целиком.

### Формат

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### Разделы дельты

| Раздел | Значение | Действие при архивации |
|---------|---------|------------------------|
| `## ADDED Requirements` | Новое поведение | Добавляется в основную спецификацию |
| `## MODIFIED Requirements` | Изменённое поведение | Заменяет существующее требование |
| `## REMOVED Requirements` | Устаревшее поведение | Удаляется из основной спецификации; удаление последнего требования выводит возможность из эксплуатации и удаляет её файл спецификации, если изменение объявляет `retire_capabilities: true` |
| `## Purpose` | Назначение новой возможности | Используется как Purpose создаваемой основной спецификации; игнорируется, если спецификация уже существует |

### Почему используются дельты, а не полные спецификации

**Ясность.** Дельта точно показывает, что меняется. Читая полную спецификацию, вам пришлось бы самостоятельно сравнивать её с текущей версией.

**Предотвращение конфликтов.** Два изменения могут затрагивать один файл спецификации, не конфликтуя, если меняют разные требования.

**Эффективность проверки.** Проверяющие видят изменение, а не неизменившийся контекст, и могут сосредоточиться на важном.

**Подходит для существующих систем.** Большинство задач меняют уже существующее поведение. Дельты позволяют считать такие изменения основным сценарием, а не исключением.

## Схемы

Схемы определяют типы артефактов и их зависимости в рабочем процессе.

### Как работают схемы

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # No dependencies, can create first

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Needs proposal before creating

  - id: design
    generates: design.md
    requires: [proposal]      # Can create in parallel with specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Needs both specs and design first
```

**Артефакты образуют граф зависимостей:**

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

**Зависимости — опоры, а не gates.** Они показывают, что можно создать, а не что обязательно создавать следующим. Если проектное решение не требуется, этап design можно пропустить. Спецификации можно создать до или после design — и те и другие зависят только от proposal.

### Встроенные схемы

**spec-driven** (по умолчанию)

Стандартный рабочий процесс разработки на основе спецификаций:

```
proposal → specs → design → tasks → implement
```

Лучше всего подходит для: большинства функциональных изменений, в которых нужно согласовать спецификации до реализации.

### Пользовательские схемы

Создавайте пользовательские схемы для рабочего процесса своей команды:

```bash
# Create from scratch
openspec schema init research-first

# Or fork an existing one
openspec schema fork spec-driven research-first
```

**Пример пользовательской схемы:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Do research first

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal informed by research

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Skip specs/design, go straight to tasks
```

Подробные сведения о создании и использовании пользовательских схем см. в разделе [Настройка](/ru-RU/customization/).

## Архивация

Архивация завершает изменение: его дельта-спецификации объединяются с основными, а само изменение сохраняется в истории.

### Что происходит при архивации

```
Before archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


After archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Now includes 2FA requirements
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Preserved for history
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Процесс архивации

1. **Объединение дельт.** Каждый раздел дельта-спецификации (ADDED/MODIFIED/REMOVED) применяется к соответствующей основной спецификации.

2. **Перемещение в архив.** Папка изменения переносится в `changes/archive/` с префиксом даты для хронологической сортировки.

3. **Сохранение контекста.** Все артефакты сохраняются в архиве без изменений. В любой момент можно узнать, почему было сделано изменение.

### Почему архивация важна

**Чистое состояние.** В списке активных изменений (`changes/`) отображается только незавершённая работа. Завершённые изменения перемещаются в архив.

**Журнал изменений.** В архиве сохраняется полный контекст каждого изменения: не только что изменилось, но и предложение с объяснением «зачем», проектное решение с объяснением «как» и задачи, отражающие выполненную работу.

**Развитие спецификаций.** Спецификации естественным образом расширяются по мере архивации изменений. Каждая архивация объединяет дельты, постепенно создавая полную спецификацию.

## Как всё взаимосвязано

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTIFACTS  │  Creates proposal → specs → design → tasks              │
│   │                │  (based on schema dependencies)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Work through tasks, checking them off                  │
│   │                │◄──── Update artifacts as you learn                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFY     │  /opsx:verify (optional)                                │
│   │     WORK       │  Check implementation matches specs                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVE    │────►│  Delta specs merge into main specs           │    │
│   │     CHANGE     │     │  Change folder moves to archive/             │    │
│   └────────────────┘     │  Specs are now the updated source of truth   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Полезный цикл:**

1. Спецификации описывают текущее поведение.
2. Изменения предлагают модификации в виде дельт.
3. Реализация воплощает изменения.
4. Архивация объединяет дельты со спецификациями.
5. Спецификации теперь описывают новое поведение.
6. Следующее изменение опирается на обновлённые спецификации.

## Глоссарий

| Термин | Определение |
|------|------------|
| **Артефакт** | Документ внутри изменения (предложение, проектное решение, задачи или дельта-спецификации) |
| **Архивация** | Завершение изменения и объединение его дельт с основными спецификациями |
| **Изменение** | Предлагаемая модификация системы, оформленная в папку с артефактами |
| **Дельта-спецификация** | Спецификация изменений (ADDED/MODIFIED/REMOVED) относительно текущих спецификаций |
| **Область** | Логическая группа спецификаций (например, `auth/`, `payments/`) |
| **Требование** | Конкретное поведение, которое должна обеспечивать система |
| **Сценарий** | Конкретный пример выполнения требования, обычно в формате Given/When/Then |
| **Схема** | Определение типов артефактов и их зависимостей |
| **Спецификация** | Описание поведения системы, содержащее требования и сценарии |
| **Источник истины** | Каталог `openspec/specs/`, содержащий актуальное согласованное описание поведения |

## Следующие шаги

- [Начало работы](/ru-RU/getting-started/) — первые практические шаги
- [Рабочие процессы](/ru-RU/workflows/) — распространённые шаблоны и их применение
- [Команды](/ru-RU/commands/) — полный справочник команд
- [Настройка](/ru-RU/customization/) — создание пользовательских схем и конфигурация проекта
