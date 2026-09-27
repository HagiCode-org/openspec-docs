---
title: "Erste Schritte"
---

Dieser Leitfaden erklärt, wie OpenSpec nach der Installation und Initialisierung funktioniert. Anweisungen zur Installation finden Sie in der [README](https://github.com/Fission-AI/openspec/blob/79b6aa9c98f1e36795b2bc4ef2a8f770c6d3a777/README.md#quick-start) oder im [Installationsleitfaden](/de-DE/installation/). Ist die gesamte Dokumentation neu für Sie? Auf der [Dokumentations-Startseite](/de-DE/) finden Sie einen Überblick.

> **Wo gebe ich diese Befehle ein?** An zwei verschiedenen Orten. Diese zu verwechseln ist der häufigste Anfängerfehler.
>
> - `openspec ...`-Befehle (wie `openspec init`) werden in Ihrem **Terminal** ausgeführt.
> - `/opsx:...`-Befehle (wie `/opsx:propose`) werden im **Chat Ihres KI-Assistenten** ausgeführt, also im selben Eingabefeld, in dem Sie ihn bitten würden, Code zu schreiben.
>
> Es gibt keinen separaten „interaktiven Modus“, den Sie starten müssten. Geben Sie einfach den Slash-Befehl in den Chat ein; Ihr Assistent übernimmt dann. Eine ausführliche Erklärung finden Sie unter [So funktionieren Befehle](/de-DE/how-commands-work/).

## Ihre ersten fünf Minuten

Der gesamte Ablauf, wobei für jeden Schritt angegeben ist, wo er ausgeführt wird:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optional: think it through first)
AI CHAT      /opsx:propose add-dark-mode      (AI drafts the plan; you review it)
AI CHAT      /opsx:apply                      (AI builds it)
AI CHAT      /opsx:archive                    (specs updated, change filed away)
```

Zwei Einrichtungsschritte im Terminal, danach findet die Arbeit im Chat statt. Im Rest dieses Leitfadens erfahren Sie, was jeder Schritt tut und was Sie dabei sehen.

**Möchten Sie die Terminalschritte nicht selbst ausführen?** Fügen Sie die [Einrichtungsanweisung](/de-DE/installation/#mit-ihrem-ki-assistenten-installieren) in Ihren Assistenten ein. Er führt beide Zeilen aus und meldet anschließend, was er erstellt hat.

> **Sie sind noch nicht sicher, was Sie bauen sollen? Beginnen Sie mit `/opsx:explore`.** Der Befehl ist ein Denkpartner ohne Verpflichtungen, der Ihre Codebasis liest, Optionen abwägt und eine vage Idee in einen konkreten Plan umwandelt – bevor Code geschrieben wird. Sobald das Bild klar ist, übergibt er an `/opsx:propose`. Das ist die beste Gewohnheit bei der Arbeit mit einer KI, die sonst selbstbewusst das Falsche bauen könnte. Siehe den [Leitfaden zum Erkunden](/de-DE/explore/).

## So funktioniert es

OpenSpec hilft Ihnen und Ihrem KI-Codierassistenten, sich vor dem Schreiben von Code darauf zu einigen, was gebaut werden soll.

**Schneller Standardablauf (Core-Profil):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

Beginnen Sie mit `/opsx:explore`, wenn Sie erst herausfinden müssen, was zu tun ist, oder wechseln Sie direkt zu `/opsx:propose`, wenn Sie es bereits wissen. „Explore“ ist im Standardprofil enthalten und daher immer verfügbar.

**Erweiterter Ablauf (benutzerdefinierte Workflow-Auswahl):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Das globale Standardprofil heißt `core` und enthält `propose`, `explore`, `apply`, `update`, `sync` und `archive`. Aktivieren Sie die erweiterten Workflow-Befehle mit `openspec config profile` und führen Sie anschließend `openspec update` aus.

## Was OpenSpec erstellt

Nach dem Ausführen von `openspec init` hat Ihr Projekt die folgende Struktur:

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

**Zwei wichtige Verzeichnisse:**

- **`specs/`** – Die maßgebliche Quelle. Diese Spezifikationen beschreiben das aktuelle Verhalten Ihres Systems und sind nach Domänen organisiert (z. B. `specs/auth/`, `specs/payments/`).

- **`changes/`** – Vorgeschlagene Änderungen. Jede Änderung erhält einen eigenen Ordner mit allen zugehörigen Artefakten. Nach Abschluss einer Änderung werden ihre Spezifikationen mit dem Hauptverzeichnis `specs/` zusammengeführt.

## Artefakte verstehen

Jeder Änderungsordner enthält Artefakte, die die Arbeit anleiten:

| Artefakt | Zweck |
|----------|---------|
| `proposal.md` | Das „Warum“ und „Was“ – hält Absicht, Umfang und Ansatz fest |
| `specs/` | Delta-Spezifikationen mit ADDED-/MODIFIED-/REMOVED-Anforderungen |
| `design.md` | Das „Wie“ – technischer Ansatz und Architekturentscheidungen |
| `tasks.md` | Implementierungs-Checkliste mit Kontrollkästchen |

**Artefakte bauen aufeinander auf:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update as you learn
```

Während der Implementierung können Sie jederzeit zurückkehren und frühere Artefakte verfeinern.

## So funktionieren Delta-Spezifikationen

Delta-Spezifikationen sind das zentrale Konzept von OpenSpec. Sie zeigen, was sich im Vergleich zu Ihren aktuellen Spezifikationen ändert.

### Das Format

Delta-Spezifikationen kennzeichnen die Art der Änderung mithilfe von Abschnitten:

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

### Was geschieht beim Archivieren?

Wenn Sie eine Änderung archivieren:

1. **ADDED**-Anforderungen werden an die Hauptspezifikation angehängt.
2. **MODIFIED**-Anforderungen ersetzen die vorhandene Fassung.
3. **REMOVED**-Anforderungen werden aus der Hauptspezifikation gelöscht.

Der Änderungsordner wird zur Nachvollziehbarkeit nach `openspec/changes/archive/` verschoben.

## Beispiel: Ihre erste Änderung

Sehen wir uns an, wie ein Dunkelmodus zu einer Anwendung hinzugefügt wird.

### 1. Änderung beginnen (Standard)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

Wenn Sie das erweiterte Workflow-Profil aktiviert haben, können Sie diesen Ablauf auch in zwei Schritten ausführen: zuerst `/opsx:new`, dann `/opsx:ff` (oder schrittweise `/opsx:continue`).

### 2. Was erstellt wird

**proposal.md** – Hält die Absicht fest:

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

**specs/ui/spec.md** – Delta mit den neuen Anforderungen:

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

**tasks.md** – Implementierungs-Checkliste:

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

### 3. Implementieren

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

Wenn Sie während der Implementierung feststellen, dass der Entwurf angepasst werden muss, aktualisieren Sie einfach das Artefakt und machen Sie weiter.

### 4. Archivieren

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

Ihre Delta-Spezifikationen sind nun Teil der Hauptspezifikationen und dokumentieren, wie Ihr System funktioniert.

## Überprüfen und validieren

Verwenden Sie die CLI, um Ihre Änderungen zu überprüfen:

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

## Nächste Schritte

- [Zuerst erkunden](/de-DE/explore/) – Denken Sie mit `/opsx:explore` über eine Idee nach, bevor Sie sich festlegen.
- [Änderungen überprüfen](/de-DE/reviewing-changes/) – Worauf Sie den von der KI entworfenen Plan vor dem Schreiben von Code prüfen sollten.
- [Gute Spezifikationen schreiben](/de-DE/writing-specs/) – So sehen gute Anforderungen und Szenarien aus.
- [OpenSpec in bestehenden Projekten verwenden](/de-DE/existing-projects/) – Beginnen Sie mit einer großen Brownfield-Codebasis.
- [Änderungen bearbeiten und iterieren](/de-DE/editing-changes/) – Artefakte aktualisieren, zurückkehren und manuelle Änderungen abgleichen.
- [Kernkonzepte im Überblick](/de-DE/overview/) – Das gesamte Denkmodell auf einer Seite.
- [Beispiele und Rezepte](/de-DE/examples/) – Konkrete Änderungen von Anfang bis Ende.
- [Workflows](/de-DE/workflows/) – Häufige Muster und der passende Einsatz der einzelnen Befehle.
- [Befehle](/de-DE/commands/) – Vollständige Referenz aller Slash-Befehle.
- [Konzepte](/de-DE/concepts/) – Vertiefendes Wissen zu Spezifikationen, Änderungen und Schemas.
- [Anpassung](/de-DE/customization/) – Passen Sie OpenSpec an Ihre Arbeitsweise an.
- [Stores](/de-DE/stores-beta/user-guide/) – Planung über Repositories oder Teams hinweg? Legen Sie sie in einem eigenen Repository ab (Beta).
- [FAQ](/de-DE/faq/) und [Fehlerbehebung](/de-DE/troubleshooting/) – Hilfe, wenn Sie nicht weiterkommen.
