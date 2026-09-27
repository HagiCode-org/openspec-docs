---
title: "Anpassung"
---

OpenSpec bietet drei Anpassungsebenen:

| Ebene | Funktion | Geeignet für |
|-------|--------------|----------|
| **Projektkonfiguration** | Standardeinstellungen festlegen und Kontext/Regeln einfügen | Die meisten Teams |
| **Benutzerdefinierte Schemas** | Eigene Workflow-Artefakte festlegen | Teams mit besonderen Abläufen |
| **Globale Überschreibungen** | Schemas projektübergreifend gemeinsam verwenden | Fortgeschrittene Benutzer |

---

## Projektkonfiguration

Die Datei `openspec/config.yaml` ist die einfachste Möglichkeit, OpenSpec an Ihr Team anzupassen. Mit ihr können Sie:

- **Ein Standardschema festlegen** – `--schema` bei jedem Befehl weglassen.
- **Projektkontext einfügen** – Die KI erhält Informationen zu Ihrem Technologie-Stack, Ihren Konventionen usw.
- **Regeln für einzelne Artefakte ergänzen** – Benutzerdefinierte Regeln für bestimmte Artefakte festlegen.
- **Hinweise pro Vorgang ergänzen** – Empfehlungen für die Arbeit mit apply und archive festlegen.
- **Integrationsoptionen speichern** – etwa die Zustimmung zur Einrichtung des [GitHub-Copilot-Cloud-Codieragents](/de-DE/supported-tools/#github-copilot-cloud-codieragent).

### Schnelleinrichtung

```bash
openspec init
```

Dieser Befehl führt Sie interaktiv durch das Erstellen einer Konfiguration. Sie können sie auch manuell anlegen:

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

### So funktioniert es

**Standardschema:**

```bash
# Without config
openspec new change my-feature --schema spec-driven

# With config - schema is automatic
openspec new change my-feature
```

**Kontext- und Regelinjektion:**

Beim Erstellen eines Artefakts werden Ihr Kontext und Ihre Regeln in den KI-Prompt eingefügt:

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

- **Kontext** wird in ALLEN Artefakten eingefügt.
- **Regeln** werden NUR beim jeweils passenden Artefakt eingefügt.

**Hinweise zu Vorgängen:**

`operations.apply.guidance` und `operations.archive.guidance` sind optionale Arrays
mit Hinweisen dazu, wie ein Agent diese Vorgänge ausführen sollte. Sie sind
von `rules` getrennt: Hinweise zu Vorgängen schränken den Inhalt von Artefakten nicht ein,
und Artefaktregeln werden niemals als Hinweise zu Vorgängen umgedeutet.

Apply und archive rufen diese Eingaben zur Ausführungszeit ab:

```bash
openspec instructions apply --change my-feature --json
openspec instructions archive --change my-feature --json
```

Beide Schnittstellen geben den aktuellen Projektkontext `context` und die passenden
`operationGuidance` als getrennte optionale Felder zurück. Jeder Aufruf liest einen
aktuellen Snapshot aus dem aufgelösten Stamm. Bei Auswahl von `--store <id>` stammen Änderung,
Kontext und Hinweise aus diesem Store und nicht aus dem aktuellen Repository.
Der Anweisungsbefehl für archive ist schreibgeschützt: Er prüft oder führt keine Delta-Spezifikationen
zusammen, schreibt keine Hauptspezifikationen, verschiebt die Änderung nicht und führt den statischen Archivierungs-Workflow nicht aus.

Projektkontext ist eine erforderliche Eingabe auf Prompt-Ebene. Generierte Workflows lesen ihn
und berücksichtigen relevante Projektfakten, Konventionen und Einschränkungen. Hinweise zu Vorgängen
sind optionale Ergänzungen: Workflows prüfen jeden Eintrag und befolgen Einträge, die
anwendbar und mit dem integrierten Workflow vereinbar sind.

Beide Felder bleiben getrennt von CLI-gesteuertem Status, aufgelösten Pfaden, integrierten
Schritten, ausdrücklichen Benutzerentscheidungen und Artefaktregeln. Ein Workflow meldet
Konflikte im Kontext und behält den maßgeblichen Wert bei. Er befolgt keine nicht anwendbaren
oder widersprüchlichen Hinweise und erklärt den Grund dafür. Keines der Felder ist eine erzwingbare Prüfung.
Workflows kopieren ihren Text nicht in Implementierungsdateien, Spezifikationen, Änderungsartefakte
oder Zusammenfassungen, sofern der Benutzer diesen Inhalt nicht gesondert anfordert.

**Sicherheit der Eingaben für Archivierung und Spezifikationssynchronisierung:**

Archive, bulk archive und eigenständige Sync-Aufrufe verwenden
`artifactPaths.specs.existingOutputPaths` aus `openspec status --json` als einzige Quelle für Delta-Spezifikationen. Ein Schema ohne Artefakt `specs`
oder eine Änderung mit einer leeren Liste konkreter Ausgabepfade hat nichts zu synchronisieren.
Andere Artefakte werden nicht herangezogen, um Delta-Spezifikationen abzuleiten.

Bevor eine semantische Zusammenführung eine Hauptspezifikation schreibt, verwendet der Workflow die aktuelle Ausgabe von
`openspec instructions specs --change <name> --json`. Die zurückgegebenen
`specs`-Regeln gelten nur für die durch diese Zusammenführung erzeugten Hauptspezifikationen. Eine einzelne Archivierung
übergibt diesen Snapshot an die integrierte Synchronisierung, eine eigenständige Synchronisierung ruft ihn direkt ab, und
die Stapelarchivierung erhält alle benötigten Snapshots vor dem ersten Schreiben einer Spezifikation. Eine
Anweisungsantwort für archive/specs mit einem Fehlercode ungleich null oder ungültigem JSON ist ein fehlgeschlagener Abruf
und keine leere Eingabe: Der Workflow hält vor dem betroffenen Schreibvorgang oder dem Verschieben der Änderung an
(bei der Stapelarchivierung vor jedem Schreiben oder Verschieben).

Diese Konfiguration ändert weder die Phasen der Archivierungsausführung noch Benutzereingaben,
Dateisystemoperationen, die Zuständigkeit für semantische Zusammenführungen, den direkten Befehl `openspec archive`
oder Struktur und Ausgabe der Artefakt-`rules`.

### Reihenfolge der Schemaauflösung

Wenn OpenSpec ein Schema benötigt, prüft es in dieser Reihenfolge:

1. CLI-Flag: `--schema <name>`
2. Änderungsmetadaten (`.openspec.yaml` im Änderungsordner)
3. Projektkonfiguration (`openspec/config.yaml`)
4. Standardwert (`spec-driven`)

---

## Benutzerdefinierte Schemas

Wenn die Projektkonfiguration nicht ausreicht, erstellen Sie ein eigenes Schema mit einem vollständig benutzerdefinierten Workflow. Benutzerdefinierte Schemas liegen im Verzeichnis `openspec/schemas/` Ihres Projekts und werden gemeinsam mit Ihrem Code versioniert.

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

### Ein vorhandenes Schema forken

Am schnellsten passen Sie OpenSpec an, indem Sie ein integriertes Schema forken:

```bash
openspec schema fork spec-driven my-workflow
```

Dadurch wird das gesamte Schema `spec-driven` nach `openspec/schemas/my-workflow/` kopiert, wo Sie es frei bearbeiten können.

**Das erhalten Sie:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow definition
└── templates/
    ├── proposal.md       # Template for proposal artifact
    ├── spec.md           # Template for specs
    ├── design.md         # Template for design
    └── tasks.md          # Template for tasks
```

Bearbeiten Sie anschließend `schema.yaml`, um den Workflow zu ändern, oder passen Sie die Vorlagen an, um die KI-Ausgabe zu verändern.

### Ein Schema von Grund auf erstellen

Für einen vollständig neuen Workflow:

```bash
# Interactive
openspec schema init research-first

# Non-interactive
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Schemastruktur

Ein Schema legt die Artefakte Ihres Workflows und ihre gegenseitigen Abhängigkeiten fest:

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

**Wichtige Felder:**

| Feld | Zweck |
|-------|---------|
| `id` | Eindeutige Kennung, die in Befehlen und Regeln verwendet wird |
| `generates` | Ausgabedateiname (unterstützt Globs wie `specs/**/*.md`) |
| `template` | Vorlagendatei im Verzeichnis `templates/` |
| `instruction` | Anweisungen an die KI zum Erstellen dieses Artefakts |
| `requires` | Abhängigkeiten – welche Artefakte zuerst vorhanden sein müssen |

Listen Sie Artefakte in der Reihenfolge auf, in der sie geschrieben werden sollen. `requires` legt fest, was
möglich ist; die Reihenfolge der Liste `artifacts:` bestimmt, was zuerst kommt, wenn
mehrere Artefakte gleichzeitig bereit sind.

### Vorlagen

Vorlagen sind Markdown-Dateien, die der KI als Leitfaden dienen. Beim Erstellen des entsprechenden Artefakts werden sie in den Prompt eingefügt.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

Vorlagen können Folgendes enthalten:
- Abschnittsüberschriften, die die KI ausfüllen soll
- HTML-Kommentare mit Hinweisen für die KI
- Beispielformate, die die erwartete Struktur zeigen

### Schema validieren

Validieren Sie ein benutzerdefiniertes Schema, bevor Sie es verwenden:

```bash
openspec schema validate my-workflow
```

Dabei wird geprüft, ob:
- die Syntax in `schema.yaml` korrekt ist,
- alle referenzierten Vorlagen vorhanden sind,
- keine zirkulären Abhängigkeiten vorliegen und
- die Artefakt-IDs gültig sind.

### Benutzerdefiniertes Schema verwenden

Nach dem Erstellen können Sie Ihr Schema folgendermaßen verwenden:

```bash
# Specify on command
openspec new change feature --schema my-workflow

# Or set as default in config.yaml
schema: my-workflow
```

### Schemaauflösung debuggen

Sie sind sich nicht sicher, welches Schema verwendet wird? Prüfen Sie es mit:

```bash
# See where a specific schema resolves from
openspec schema which my-workflow

# List all available schemas
openspec schema which --all
```

Die Ausgabe zeigt, ob das Schema aus Ihrem Projekt, dem Benutzerverzeichnis oder dem Paket stammt:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Hinweis:** OpenSpec unterstützt auch benutzerspezifische Schemas unter `~/.local/share/openspec/schemas/`, die projektübergreifend verwendet werden können. Empfohlen werden jedoch Projektschemas unter `openspec/schemas/`, da sie gemeinsam mit Ihrem Code versioniert werden.

---

## Beispiele

### Workflow für schnelle Iterationen

Ein minimaler Workflow für schnelle Iterationen:

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

### Ein Prüfungsartefakt hinzufügen

Forken Sie das Standardschema und fügen Sie einen Prüfschritt hinzu:

```bash
openspec schema fork spec-driven with-review
```

Bearbeiten Sie dann `schema.yaml` und fügen Sie Folgendes hinzu:

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

## Community-Schemas

OpenSpec unterstützt auch von der Community gepflegte Schemas, die über eigenständige Repositories verteilt werden. Sie bieten klar definierte Workflows, die OpenSpec mit anderen Tools oder Systemen integrieren – ähnlich dem [Katalog für Community-Erweiterungen von github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) für spec-kit.

Community-Schemas werden nicht in OpenSpec Core eingebunden. Sie liegen in eigenen Repositories und haben ihren eigenen Veröffentlichungsrhythmus. Um eines zu verwenden, kopieren Sie das Schema-Paket in das Verzeichnis `openspec/schemas/<schema-name>/` Ihres Projekts (die README-Datei jedes Repositorys enthält Installationsanweisungen).

| Schema | Maintainer | Repository | Beschreibung |
|--------|-----------|-----------|-------------|
| `intent-driven` | @harikrishnan83 | [intent-driven-dev/openspec-schemas](https://github.com/intent-driven-dev/openspec-schemas/tree/main/openspec/schemas/intent-driven) | Hält vor der Implementierung Änderungsabsicht, beobachtbares Verhalten, technischen Entwurf und dauerhafte Architekturentscheidungen fest. Ergänzt ein änderungsspezifisches ADR-Prüfmanifest und speichert geeignete langfristige Entscheidungen als unveränderliche, durch neuere ADRs ersetzbare Einträge. |
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Verknüpft die Artefaktverwaltung von OpenSpec mit den Ausführungsskills von [obra/superpowers](https://github.com/obra/superpowers) (Ideenfindung, Planerstellung, TDD über Subagents, Codeüberprüfung und Abschluss). Ergänzt ein evidenzbasiertes Artefakt `retrospective`, das eine Lücke schließt, die Superpowers selbst nicht abdeckt. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | Produktmanagement-orientierter Workflow. Führt die Planungspipeline von [nanopm](https://github.com/nmrtn/nanopm) (Audit → Strategie → Roadmap → PRD) vor der Implementierung aus. Verbindet Produktplanung mit dem spezifikationsgesteuerten Entwicklungsworkflow von OpenSpec. Falls vorhanden, werden Artefakte aus `.nanopm/` gelesen: Der Vorschlag basiert auf dem Audit, der Entwurf auf der Strategie und die Aufgaben auf der PRD-Aufschlüsselung. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | Runbooks für End-to-End-Tests auf Funktionsebene. Jede Funktion erhält eine unveränderliche Spezifikation, eine unveränderliche Aufgabenvorlage und pro Ausführung einen mit Zeitstempel versehenen Laufdatensatz. Zusicherungen betreffen ausschließlich beobachtbares Verhalten (HTTP-Status, Antworttext, gespeicherter Zustand – niemals Teilzeichenfolgen aus Logs). Für jeden Lauf werden Start und Ende in UTC, Dauer und geschätzter LLM-Tokenverbrauch festgehalten. |
| `anvil` | @jikkujoyce | [jikkujoyce/openspec-schemas](https://github.com/jikkujoyce/openspec-schemas/tree/main/schemas/anvil) | Spezifikationsgesteuerter Workflow mit TDD-Disziplin und einem kritischen Prüfschritt. Ablauf: `proposal` → `specs` → `design` → `review` → `test-plan` → `tasks` → `apply` → `verify`. `review` wird von einer Person erstellt, die den Kontext neu erhält und ausschließlich lesend prüft (wenn verfügbar mit einem zweiten Modell). Es wird eine Zeile `VERDICT:` ausgegeben, die dem Agent vorgibt, `test-plan`, `tasks` und `apply` zu sperren. OpenSpec prüft nur, ob Artefakte vorhanden sind; erzwingen Sie die Sperre daher mit Ihrer eigenen CI oder einem Hook. `test-plan` ordnet jedes Spezifikationsszenario einem benannten Test zu und dient zugleich als Rot-Grün-Protokoll, das `verify` prüft. |

> Möchten Sie ein Community-Schema beisteuern? Eröffnen Sie ein Issue mit einem Link zu Ihrem Repository oder senden Sie einen PR, der dieser Tabelle eine Zeile hinzufügt.

---

## Siehe auch

- [CLI-Referenz: Schema-Befehle](/de-DE/cli/#schema-befehle) – vollständige Befehlsdokumentation
