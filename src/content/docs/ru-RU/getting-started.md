---
title: "Начало работы"
---

В этом руководстве объясняется, как работает OpenSpec после установки и инициализации. Инструкции по установке см. в [основном README](https://github.com/Fission-AI/openspec/blob/dc37609827c8c3aba49e49347745f47aaa65cb1b/README.md#quick-start) или в [руководстве по установке](/ru-RU/installation/). Впервые открыли эту документацию? На [главной странице документации](/ru-RU/) описаны все разделы.

> **Где вводить эти команды?** Есть два места, и путаница между ними — самая частая ошибка новичков.
>
> - Команды `openspec ...` (например, `openspec init`) выполняются в **терминале**.
> - Команды `/opsx:...` (например, `/opsx:propose`) вводятся в **чате с ИИ-ассистентом**, в том же окне, где вы просите его написать код.
>
> Не нужно запускать отдельный «интерактивный режим». Просто введите slash-команду в чате, а дальше ассистент сделает всё сам. Подробное объяснение: [Как работают команды](/ru-RU/how-commands-work/).

## Первые пять минут

Весь цикл с указанием места выполнения каждого шага:

```text
TERMINAL   $ curl -fsSL https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.sh | sh
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optional: think it through first)
AI CHAT      /opsx:propose add-dark-mode      (AI drafts the plan; you review it)
AI CHAT      /opsx:apply                      (AI builds it)
AI CHAT      /opsx:archive                    (specs updated, change filed away)
```

Для настройки нужны два шага в терминале, а затем вся работа ведётся в чате. (Windows, npm и другие способы установки описаны в [руководстве по установке](/ru-RU/installation/).) Далее в руководстве объясняется, что делает каждый шаг и что вы увидите.

**Не хотите самостоятельно выполнять команды в терминале?** Вставьте [инструкцию по настройке](/ru-RU/installation/#установка-с-помощью-ии-ассистента) в чат ассистента. Он выполнит обе команды и сообщит, что было создано.

> **Ещё не решили, что разрабатывать? Начните с `/opsx:explore`.** Это партнёр для обдумывания без обязательств: он изучает кодовую базу, сравнивает варианты и превращает расплывчатую идею в конкретный план ещё до написания кода. Когда всё прояснится, он передаст работу команде `/opsx:propose`. Это лучшая привычка при работе с ИИ, который иначе может уверенно построить не то, что нужно. См. [руководство по исследованию](/ru-RU/explore/).

## Как это работает

OpenSpec помогает вам и ИИ-ассистенту договориться, что создавать, прежде чем будет написан код.

**Быстрый путь по умолчанию (профиль core):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

Запустите `/opsx:explore`, если ещё определяетесь с задачей, или сразу переходите к `/opsx:propose`, если уже всё знаете. Explore входит в профиль по умолчанию и всегда доступна.

**Расширенный путь (выбор рабочего процесса):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Глобальный профиль по умолчанию — `core`; он включает команды `propose`, `explore`, `apply`, `update`, `sync` и `archive`. Расширенные команды рабочих процессов можно включить с помощью `openspec config profile`, а затем `openspec update`.

## Что создаёт OpenSpec

После выполнения `openspec init` проект будет иметь следующую структуру:

```
openspec/
├── specs/              # Source of truth (your system's behavior)
│   └── <domain>/
│       └── spec.md
├── changes/            # Proposed updates (one folder per change)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta specs (what's changing)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Project configuration (optional)
```

**Два основных каталога:**

- **`specs/`** — источник истины. Эти спецификации описывают текущее поведение системы и сгруппированы по областям (например, `specs/auth/`, `specs/payments/`).

- **`changes/`** — предлагаемые изменения. Для каждого изменения создаётся отдельная папка со всеми его артефактами. После завершения изменения его спецификации объединяются с основным каталогом `specs/`.

## Артефакты

В каждой папке изменения есть артефакты, направляющие работу:

| Артефакт | Назначение |
|----------|---------|
| `proposal.md` | «Зачем» и «что»: цель, область работ и подход |
| `specs/` | Дельта-спецификации с требованиями ADDED/MODIFIED/REMOVED |
| `design.md` | «Как»: технический подход и архитектурные решения |
| `tasks.md` | Контрольный список реализации с флажками |

**Артефакты создаются один на основе другого:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update as you learn
```

По мере реализации можно в любой момент вернуться к предыдущим артефактам и уточнить их.

## Как работают дельта-спецификации

Дельта-спецификации — ключевое понятие OpenSpec. Они показывают, что меняется относительно текущих спецификаций.

### Формат

В дельта-спецификациях тип изменения указывается в заголовке раздела:

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### Что происходит при архивации

При архивации изменения:

1. требования **ADDED** добавляются в основную спецификацию;
2. требования **MODIFIED** заменяют существующую версию;
3. требования **REMOVED** удаляются из основной спецификации.

Папка изменения перемещается в `openspec/changes/archive/` и сохраняется для истории проверок.

## Пример: первое изменение

Рассмотрим добавление тёмной темы в приложение.

### 1. Начните изменение (профиль по умолчанию)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

Если вы включили расширенный профиль рабочих процессов, можно выполнить два шага: `/opsx:new`, а затем `/opsx:ff` (или последовательно использовать `/opsx:continue`).

### 2. Что будет создано

**proposal.md** — фиксирует цель:

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** — дельта с новыми требованиями:

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** — контрольный список реализации:

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. Реализуйте изменение

```
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

Если во время реализации выяснится, что проектное решение нужно скорректировать, просто обновите артефакт и продолжайте.

### 4. Архивируйте изменение

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

Теперь дельта-спецификации стали частью основных спецификаций и описывают поведение системы.

## Проверка и просмотр изменений

Проверить изменения можно с помощью CLI:

```bash
# List active changes
openspec list

# View change details
openspec show add-dark-mode

# Validate spec formatting
openspec validate add-dark-mode

# Interactive dashboard
openspec view
```

## Следующие шаги

- [Сначала исследуйте](/ru-RU/explore/) — используйте `/opsx:explore`, чтобы обдумать идею до принятия обязательств
- [Проверка изменения](/ru-RU/reviewing-changes/) — что проверить в плане ИИ до написания кода
- [Как писать хорошие спецификации](/ru-RU/writing-specs/) — как выглядят хорошие требования и сценарии
- [Использование OpenSpec в существующем проекте](/ru-RU/existing-projects/) — начало работы с большой кодовой базой
- [Редактирование и доработка изменения](/ru-RU/editing-changes/) — обновление артефактов, возврат к предыдущим шагам и согласование ручных правок
- [Основные понятия вкратце](/ru-RU/overview/) — вся концептуальная модель на одной странице
- [Примеры и рецепты](/ru-RU/examples/) — реальные изменения от начала до конца
- [Рабочие процессы](/ru-RU/workflows/) — типичные схемы работы и применение команд
- [Команды](/ru-RU/commands/) — полный справочник slash-команд
- [Основные понятия](/ru-RU/concepts/) — подробное описание спецификаций, изменений и схем
- [Настройка](/ru-RU/customization/) — настройте OpenSpec под себя
- [Хранилища](/ru-RU/stores-beta/user-guide/) — планируйте работу нескольких репозиториев и команд в отдельном репозитории (бета-версия)
- [FAQ](/ru-RU/faq/) и [Устранение неполадок](/ru-RU/troubleshooting/) — помощь, если возникли трудности
