---
title: "Konzepte"
---

Dieser Leitfaden erklärt die zentralen Ideen hinter OpenSpec und wie sie zusammenhängen. Praktische Anleitungen finden Sie unter [Erste Schritte](/de-DE/getting-started/) und [Workflows](/de-DE/workflows/).

## Philosophie

OpenSpec basiert auf vier Prinzipien:

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### Warum diese Prinzipien wichtig sind

**Flexibel statt starr.** Traditionelle Spezifikationssysteme sperren Sie in Phasen ein: Erst planen Sie, dann implementieren Sie und schließlich sind Sie fertig. OpenSpec ist flexibler – Sie können Artefakte in jeder für Ihre Arbeit sinnvollen Reihenfolge erstellen.

**Iterativ statt Wasserfall.** Anforderungen ändern sich. Das Verständnis vertieft sich. Ein Ansatz, der anfangs gut schien, ist möglicherweise nicht mehr sinnvoll, sobald Sie die Codebasis kennen. OpenSpec berücksichtigt diese Realität.

**Einfach statt komplex.** Manche Spezifikations-Frameworks erfordern umfangreiche Einrichtung, starre Formate oder schwerfällige Prozesse. OpenSpec steht Ihnen nicht im Weg. Initialisieren Sie es in Sekunden, beginnen Sie sofort mit der Arbeit und passen Sie es nur bei Bedarf an.

**Brownfield zuerst.** Die meiste Softwarearbeit beginnt nicht bei null, sondern verändert bestehende Systeme. Der Delta-basierte Ansatz von OpenSpec erleichtert es, Änderungen an vorhandenem Verhalten zu spezifizieren, statt nur neue Systeme zu beschreiben.

## Der große Überblick

OpenSpec organisiert Ihre Arbeit in zwei Hauptbereichen:

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

**Spezifikationen** sind die maßgebliche Quelle – sie beschreiben das aktuelle Verhalten Ihres Systems.

**Änderungen** sind vorgeschlagene Modifikationen – sie liegen in getrennten Ordnern, bis Sie bereit sind, sie zusammenzuführen.

Diese Trennung ist entscheidend. Sie können mehrere Änderungen parallel und ohne Konflikte bearbeiten. Sie können eine Änderung überprüfen, bevor sie sich auf die Hauptspezifikationen auswirkt. Beim Archivieren einer Änderung werden ihre Deltas sauber mit der maßgeblichen Quelle zusammengeführt.

## Spezifikationen

Spezifikationen beschreiben das Verhalten Ihres Systems anhand strukturierter Anforderungen und Szenarien.

### Struktur

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

Organisieren Sie Spezifikationen nach Domänen – logischen Gruppierungen, die zu Ihrem System passen. Gängige Muster:

- **Nach Funktionsbereich**: `auth/`, `payments/`, `search/`
- **Nach Komponente**: `api/`, `frontend/`, `workers/`
- **Nach abgegrenztem Kontext**: `ordering/`, `fulfillment/`, `inventory/`

### Format einer Spezifikation

Eine Spezifikation enthält Anforderungen, und jede Anforderung umfasst Szenarien:

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

**Wichtige Elemente:**

| Element | Zweck |
|---------|---------|
| `## Purpose` | Allgemeine Beschreibung der Domäne dieser Spezifikation |
| `### Requirement:` | Ein bestimmtes Verhalten, das das System aufweisen muss |
| `#### Scenario:` | Konkretes Beispiel für die Umsetzung der Anforderung |
| SHALL/MUST/SHOULD | Schlüsselwörter aus RFC 2119, die die Verbindlichkeit einer Anforderung angeben |

### Warum Spezifikationen so strukturiert sind

**Anforderungen beschreiben das „Was“** – sie legen fest, was das System tun soll, ohne die Implementierung vorzugeben.

**Szenarien beschreiben das „Wann“** – sie liefern konkrete, überprüfbare Beispiele. Gute Szenarien:
- sind testbar (Sie könnten dafür einen automatisierten Test schreiben),
- decken sowohl den Erfolgsfall als auch Randfälle ab und
- verwenden Given/When/Then oder ein ähnlich strukturiertes Format.

**Schlüsselwörter aus RFC 2119** (SHALL, MUST, SHOULD, MAY) vermitteln die Absicht:
- **MUST/SHALL** – uneingeschränkte Anforderung
- **SHOULD** – empfohlen, Ausnahmen sind jedoch möglich
- **MAY** – optional

### Was eine Spezifikation ist – und was nicht

Eine Spezifikation ist ein **Verhaltensvertrag**, kein Implementierungsplan.

Geeignete Inhalte für eine Spezifikation:
- beobachtbares Verhalten, auf das sich Benutzer oder nachgelagerte Systeme verlassen,
- Eingaben, Ausgaben und Fehlerbedingungen,
- externe Einschränkungen (Sicherheit, Datenschutz, Zuverlässigkeit, Kompatibilität),
- Szenarien, die getestet oder ausdrücklich validiert werden können.

Vermeiden Sie in Spezifikationen:
- interne Klassen- und Funktionsnamen,
- Entscheidungen über Bibliotheken oder Frameworks,
- schrittweise Implementierungsdetails,
- detaillierte Ausführungspläne (diese gehören in `design.md` oder `tasks.md`).

Kurzer Test:
- Wenn sich die Implementierung ändern kann, ohne das äußerlich sichtbare Verhalten zu ändern, gehört sie wahrscheinlich nicht in die Spezifikation.

### Schlank bleiben: schrittweise Präzisierung

OpenSpec soll Bürokratie vermeiden. Verwenden Sie den geringsten Aufwand, mit dem sich die Änderung noch überprüfen lässt.

**Lite-Spezifikation (Standard):**
- kurze, verhaltensorientierte Anforderungen,
- klarer Umfang und klare Nicht-Ziele,
- einige konkrete Abnahmekriterien.

**Vollständige Spezifikation (bei höherem Risiko):**
- Änderungen über mehrere Teams oder Repositories hinweg,
- API- oder Vertragsänderungen, Migrationen sowie Sicherheits- und Datenschutzthemen,
- Änderungen, bei denen Mehrdeutigkeit wahrscheinlich zu kostspieliger Nacharbeit führt.

Die meisten Änderungen sollten im Lite-Modus bleiben.

### Zusammenarbeit zwischen Menschen und Agents

In vielen Teams erkunden Menschen das Problem und Agents entwerfen Artefakte. Der vorgesehene Ablauf:

1. Ein Mensch liefert Absicht, Kontext und Einschränkungen.
2. Ein Agent wandelt dies in verhaltensorientierte Anforderungen und Szenarien um.
3. Der Agent hält Implementierungsdetails in `design.md` und `tasks.md` fest, nicht in `spec.md`.
4. Vor der Implementierung bestätigt die Validierung Struktur und Verständlichkeit.

So bleiben Spezifikationen für Menschen lesbar und für Agents konsistent.

## Änderungen

Eine Änderung ist eine vorgeschlagene Modifikation Ihres Systems. Sie wird als Ordner mit allem verpackt, was zum Verständnis und zur Umsetzung erforderlich ist.

### Struktur einer Änderung

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what
├── design.md             # How (technical approach)
├── tasks.md              # Implementation checklist
├── .openspec.yaml        # Change metadata (optional): schema, created, skip_specs, retire_capabilities
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # What's changing in ui/spec.md
```

Jede Änderung ist in sich abgeschlossen und umfasst:
- **Artefakte** – Dokumente, die Absicht, Entwurf und Aufgaben festhalten
- **Delta-Spezifikationen** – Spezifikationen für hinzugefügtes, geändertes oder entferntes Verhalten
- **Metadaten** – optionale Konfiguration für diese bestimmte Änderung

### Warum Änderungen als Ordner organisiert sind

Eine Änderung als Ordner zu bündeln hat mehrere Vorteile:

1. **Alles an einem Ort.** Vorschlag, Entwurf, Aufgaben und Spezifikationen liegen beisammen. Sie müssen nicht an verschiedenen Stellen danach suchen.

2. **Parallele Arbeit.** Mehrere Änderungen können gleichzeitig bestehen, ohne miteinander in Konflikt zu geraten. Bearbeiten Sie `add-dark-mode`, während auch `fix-auth-bug` in Arbeit ist.

3. **Übersichtliche Historie.** Beim Archivieren werden Änderungen mit ihrem vollständigen Kontext nach `changes/archive/` verschoben. So können Sie später nicht nur nachvollziehen, was geändert wurde, sondern auch warum.

4. **Einfach zu überprüfen.** Ein Änderungsordner lässt sich leicht prüfen: Öffnen Sie ihn, lesen Sie den Vorschlag, überprüfen Sie den Entwurf und sehen Sie sich die Delta-Spezifikationen an.

## Artefakte

Artefakte sind Dokumente innerhalb einer Änderung, die die Arbeit anleiten.

### Der Artefaktablauf

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Artefakte bauen aufeinander auf. Jedes Artefakt liefert Kontext für das nächste.

### Artefakttypen

#### Vorschlag (`proposal.md`)

Der Vorschlag hält **Absicht**, **Umfang** und **Ansatz** auf hoher Ebene fest.

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

**Wann der Vorschlag aktualisiert werden sollte:**
- wenn sich der Umfang ändert (verkleinert oder erweitert),
- wenn die Absicht klarer wird (das Problem besser verstanden wird),
- wenn sich der Ansatz grundlegend ändert.

#### Spezifikationen (Delta-Spezifikationen unter `specs/`)

Delta-Spezifikationen beschreiben **die Änderungen** im Vergleich zu den aktuellen Spezifikationen. Siehe unten [Delta-Spezifikationen](#delta-spezifikationen).

#### Entwurf (`design.md`)

Der Entwurf hält den **technischen Ansatz** und **Architekturentscheidungen** fest.

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

**Wann der Entwurf aktualisiert werden sollte:**
- wenn die Implementierung zeigt, dass der Ansatz nicht funktioniert,
- wenn eine bessere Lösung entdeckt wird,
- wenn sich Abhängigkeiten oder Einschränkungen ändern.

#### Aufgaben (`tasks.md`)

Aufgaben sind die **Implementierungs-Checkliste** – konkrete Schritte mit Kontrollkästchen.

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

**Bewährte Vorgehensweisen für Aufgaben:**
- Gruppieren Sie zusammengehörige Aufgaben unter Überschriften.
- Verwenden Sie eine hierarchische Nummerierung (1.1, 1.2 usw.).
- Halten Sie Aufgaben so klein, dass sie in einer Sitzung erledigt werden können.
- Geben Sie an, wie jede Aufgabe überprüft wird (durch einen Test, einen Befehl oder ein beobachtbares Ergebnis).
- Ergänzen Sie die von der jeweiligen Aufgabengruppe benötigten Tests und Dokumentation innerhalb dieser Gruppe, nicht in einer abschließenden Nachtragsgruppe.
- Haken Sie Aufgaben ab, sobald sie erledigt sind.

## Delta-Spezifikationen

Delta-Spezifikationen sind das zentrale Konzept, das OpenSpec für die Weiterentwicklung bestehender Systeme geeignet macht. Sie beschreiben **die Änderungen**, statt die gesamte Spezifikation erneut wiederzugeben.

### Das Format

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

### Delta-Abschnitte

| Abschnitt | Bedeutung | Was beim Archivieren geschieht |
|---------|---------|------------------------|
| `## ADDED Requirements` | Neues Verhalten | Wird an die Hauptspezifikation angehängt |
| `## MODIFIED Requirements` | Geändertes Verhalten | Ersetzt die vorhandene Anforderung |
| `## REMOVED Requirements` | Veraltetes Verhalten | Wird aus der Hauptspezifikation gelöscht. Das Entfernen der letzten Anforderung mustert die Funktion aus und löscht ihre Spezifikationsdatei, wenn die Änderung `retire_capabilities: true` festlegt. |
| `## Purpose` | Zweck einer ganz neuen Funktion | Dient als Grundlage für den Zweck der neu erstellten Hauptspezifikation; wird ignoriert, wenn die Spezifikation bereits existiert |

### Warum Deltas statt vollständiger Spezifikationen?

**Klarheit.** Ein Delta zeigt genau, was sich ändert. Bei einer vollständigen Spezifikation müssten Sie sie gedanklich mit der aktuellen Version vergleichen.

**Konfliktvermeidung.** Zwei Änderungen können dieselbe Spezifikationsdatei betreffen, ohne miteinander in Konflikt zu geraten, solange sie unterschiedliche Anforderungen bearbeiten.

**Effizientere Überprüfung.** Prüfende Personen sehen die Änderung statt unveränderten Kontext. So bleibt der Blick auf das Wesentliche gerichtet.

**Geeignet für bestehende Systeme.** Bei den meisten Arbeiten wird vorhandenes Verhalten geändert. Deltas behandeln Änderungen als erstklassigen Anwendungsfall, nicht als nachträglichen Sonderfall.

## Schemas

Schemas legen die Artefakttypen eines Workflows und ihre Abhängigkeiten fest.

### So funktionieren Schemas

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

**Artefakte bilden einen Abhängigkeitsgraphen:**

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

**Abhängigkeiten ermöglichen Schritte, statt sie zu blockieren.** Sie zeigen, was erstellt werden kann, nicht, was Sie als Nächstes erstellen müssen. Wenn Sie keinen Entwurf benötigen, können Sie ihn überspringen. Sie können Spezifikationen vor oder nach dem Entwurf erstellen – beide hängen nur vom Vorschlag ab.

### Integrierte Schemas

**spec-driven** (Standard)

Der Standard-Workflow für spezifikationsgesteuerte Entwicklung:

```
proposal → specs → design → tasks → implement
```

Am besten geeignet für: die meisten Funktionsarbeiten, bei denen Sie sich vor der Implementierung auf Spezifikationen einigen möchten.

### Benutzerdefinierte Schemas

Erstellen Sie benutzerdefinierte Schemas für den Workflow Ihres Teams:

```bash
# Create from scratch
openspec schema init research-first

# Or fork an existing one
openspec schema fork spec-driven research-first
```

**Beispiel für ein benutzerdefiniertes Schema:**

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

Ausführliche Informationen zum Erstellen und Verwenden benutzerdefinierter Schemas finden Sie unter [Anpassung](/de-DE/customization/).

## Archivierung

Beim Archivieren wird eine Änderung abgeschlossen, indem ihre Delta-Spezifikationen mit den Hauptspezifikationen zusammengeführt und die Änderung für die Historie aufbewahrt wird.

### Was beim Archivieren geschieht

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

### Der Archivierungsvorgang

1. **Deltas zusammenführen.** Jeder Abschnitt einer Delta-Spezifikation (ADDED/MODIFIED/REMOVED) wird auf die entsprechende Hauptspezifikation angewendet.

2. **Ins Archiv verschieben.** Der Änderungsordner wird mit einem Datumpräfix zur chronologischen Sortierung nach `changes/archive/` verschoben.

3. **Kontext bewahren.** Alle Artefakte bleiben im Archiv erhalten. Sie können jederzeit nachvollziehen, warum eine Änderung vorgenommen wurde.

### Warum Archivieren wichtig ist

**Übersichtlicher Zustand.** Unter den aktiven Änderungen (`changes/`) wird nur laufende Arbeit angezeigt. Abgeschlossene Arbeiten werden aus der Liste entfernt.

**Nachvollziehbarkeit.** Das Archiv bewahrt den vollständigen Kontext jeder Änderung auf – nicht nur, was geändert wurde, sondern auch den Vorschlag mit der Begründung, den Entwurf mit dem Vorgehen und die Aufgaben mit der erledigten Arbeit.

**Weiterentwicklung der Spezifikationen.** Spezifikationen wachsen organisch, während Änderungen archiviert werden. Bei jeder Archivierung werden Deltas zusammengeführt, sodass im Laufe der Zeit eine umfassende Spezifikation entsteht.

## Wie alles zusammenpasst

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

**Der positive Kreislauf:**

1. Spezifikationen beschreiben das aktuelle Verhalten.
2. Änderungen schlagen Anpassungen vor (als Deltas).
3. Die Implementierung setzt die Änderungen um.
4. Beim Archivieren werden Deltas mit den Spezifikationen zusammengeführt.
5. Die Spezifikationen beschreiben nun das neue Verhalten.
6. Die nächste Änderung baut auf den aktualisierten Spezifikationen auf.

## Glossar

| Begriff | Definition |
|------|------------|
| **Artefakt** | Ein Dokument innerhalb einer Änderung (Vorschlag, Entwurf, Aufgaben oder Delta-Spezifikationen) |
| **Archivierung** | Das Abschließen einer Änderung und Zusammenführen ihrer Deltas mit den Hauptspezifikationen |
| **Änderung** | Eine vorgeschlagene Modifikation des Systems, als Ordner mit Artefakten gebündelt |
| **Delta-Spezifikation** | Eine Spezifikation, die Änderungen (ADDED/MODIFIED/REMOVED) im Vergleich zu den aktuellen Spezifikationen beschreibt |
| **Domäne** | Eine logische Gruppierung von Spezifikationen (z. B. `auth/`, `payments/`) |
| **Anforderung** | Ein bestimmtes Verhalten, das das System aufweisen muss |
| **Szenario** | Ein konkretes Beispiel für eine Anforderung, normalerweise im Given/When/Then-Format |
| **Schema** | Eine Definition der Artefakttypen und ihrer Abhängigkeiten |
| **Spezifikation** | Ein Dokument zum Systemverhalten, das Anforderungen und Szenarien enthält |
| **Maßgebliche Quelle** | Das Verzeichnis `openspec/specs/`, das das aktuell vereinbarte Verhalten enthält |

## Nächste Schritte

- [Erste Schritte](/de-DE/getting-started/) – Praktische erste Schritte
- [Workflows](/de-DE/workflows/) – Häufige Muster und ihre passenden Einsatzgebiete
- [Befehle](/de-DE/commands/) – Vollständige Befehlsreferenz
- [Anpassung](/de-DE/customization/) – Benutzerdefinierte Schemas erstellen und Ihr Projekt konfigurieren
