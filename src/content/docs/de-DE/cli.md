---
title: "CLI-Referenz"
---

Die OpenSpec-CLI (`openspec`) stellt Terminalbefehle zur Projekteinrichtung, Validierung, Statusprüfung und Verwaltung bereit. Diese Befehle ergänzen die in der [Befehlsreferenz](/de-DE/commands/) dokumentierten KI-Slash-Befehle (wie `/opsx:propose`).

## Zusammenfassung

| Kategorie | Befehle | Zweck |
|----------|----------|---------|
| **Einrichtung** | `init`, `update` | OpenSpec in Ihrem Projekt initialisieren und aktualisieren |
| **Stores (eigenständige OpenSpec-Repositories)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Registrierte, eigenständige OpenSpec-Repositories verwalten |
| **Gesundheitsprüfung** | `doctor` | Zustand der Beziehungen für den aufgelösten Stamm melden |
| **Arbeitskontext** | `context` | Arbeitsbestand zusammenstellen (Stamm und referenzierte Stores) |
| **Persönliche Worksets** | `workset create`, `workset list`, `workset open`, `workset remove` | Persönliche lokale Arbeitsansichten im Tool speichern und öffnen |
| **Durchsuchen** | `list`, `view`, `show` | Änderungen und Spezifikationen erkunden |
| **Validierung** | `validate` | Änderungen und Spezifikationen auf Probleme prüfen |
| **Lebenszyklus** | `archive` | Abgeschlossene Änderungen finalisieren |
| **Workflow** | `new change`, `status`, `instructions`, `templates`, `schemas` | Artefaktgesteuerte Workflows unterstützen |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Benutzerdefinierte Workflows erstellen und verwalten |
| **Konfiguration** | `config` | Einstellungen anzeigen und ändern |
| **Dienstprogramme** | `feedback`, `completion` | Feedback und Shell-Integration |

---

## Befehle für Menschen und Agents

Die meisten CLI-Befehle sind zur **Verwendung durch Menschen** im Terminal gedacht. Einige unterstützen über eine JSON-Ausgabe auch die **Verwendung durch Agents oder Skripte**.

### Nur für Menschen bestimmte Befehle

Diese Befehle sind interaktiv und für das Terminal bestimmt:

| Befehl | Zweck |
|---------|---------|
| `openspec init` | Projekt initialisieren (interaktive Eingabeaufforderungen) |
| `openspec view` | Interaktives Dashboard |
| `openspec workset open <name>` | Gespeichertes Workset öffnen (Editorfenster oder Terminal-Agent-Sitzung) |
| `openspec config edit` | Konfiguration im Editor öffnen |
| `openspec feedback` | Feedback über GitHub senden |
| `openspec completion install` | Shell-Vervollständigung installieren |

### Agent-kompatible Befehle

Diese Befehle unterstützen eine Ausgabe mit `--json` zur programmatischen Verwendung durch KI-Agents und Skripte:

| Befehl | Verwendung durch Menschen | Verwendung durch Agents |
|---------|-----------|-----------|
| `openspec list` | Änderungen/Spezifikationen durchsuchen | `--json` für strukturierte Daten |
| `openspec show <item>` | Inhalt lesen | `--json` zur Verarbeitung |
| `openspec validate` | Auf Probleme prüfen | `--all --json` für die gebündelte Validierung |
| `openspec status` | Fortschritt der Artefakte anzeigen | `--json` für einen strukturierten Status |
| `openspec instructions` | Nächste Schritte abrufen | `--json` für Anweisungen an Agents |
| `openspec templates` | Vorlagenpfade finden | `--json` zur Pfadauflösung |
| `openspec schemas` | Verfügbare Schemas auflisten | `--json` zum Erkennen von Schemas; `--store <id>` zur Auswahl eines registrierten Stamms |
| `openspec store setup <id>` | Lokalen Store erstellen und registrieren | `--json` mit ausdrücklichen Eingaben für eine strukturierte Einrichtungsausgabe |
| `openspec store register <path>` | Vorhandenen Store registrieren | `--json` für eine strukturierte Registrierungsausgabe |
| `openspec store unregister <id>` | Lokale Store-Registrierung vergessen | `--json` für eine strukturierte Bereinigungsausgabe |
| `openspec store remove <id>` | Registrierten lokalen Store-Ordner löschen | `--yes --json` zum nicht-interaktiven Löschen |
| `openspec store list` | Registrierte Stores durchsuchen | `--json` für strukturierte Registrierungen |
| `openspec store doctor` | Lokale Store-Einrichtung prüfen | `--json` für strukturierte Diagnosen |
| `openspec new change <id>` | Gerüst für eine lokale Repository-Änderung erstellen | `--json`; zusätzlich `--store <id>`, um einen registrierten Store als OpenSpec-Stamm zu verwenden |
| `openspec workset create [name]` | Persönliche Arbeitsansicht zusammenstellen | `--member <path> --json` zum nicht-interaktiven Zusammenstellen |
| `openspec workset list` | Gespeicherte Worksets durchsuchen | `--json` für strukturierte Ansichten |
| `openspec workset remove <name>` | Gespeicherte Ansicht löschen | `--yes --json` zum nicht-interaktiven Entfernen |

---

## Globale Optionen

Diese Optionen gelten für alle Befehle:

| Option | Beschreibung |
|--------|-------------|
| `--version`, `-V` | Versionsnummer anzeigen |
| `--no-color` | Farbausgabe deaktivieren |
| `--help`, `-h` | Hilfe zum Befehl anzeigen |

---

## Einrichtungsbefehle

### `openspec init`

Initialisiert OpenSpec in Ihrem Projekt. Erstellt die Ordnerstruktur und konfiguriert Integrationen für KI-Tools.

Standardmäßig werden die globalen Konfigurationswerte verwendet: Profil `core`, Bereitstellung `both`, Workflows `propose, explore, apply, update, sync, archive`.

```
openspec init [path] [options]
```

Verwenden Sie `--language <language>`, um der `openspec/config.yaml` eines neuen Projekts
eine Sprachanweisung hinzuzufügen. Bearbeiten Sie bei einem vorhandenen Projekt das Feld `context`
der Konfiguration, damit OpenSpec projektspezifische Hinweise niemals überschreibt.

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `path` | Nein | Zielverzeichnis (Standard: aktuelles Verzeichnis) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--tools <list>` | KI-Tools nicht-interaktiv konfigurieren. Verwenden Sie `all`, `none` oder eine kommagetrennte Liste. |
| `--language <language>` | Beim Erstellen einer neuen Konfiguration Artefakte in dieser Sprache verfassen. |
| `--force` | Alte Dateien ohne Rückfrage automatisch bereinigen. |
| `--profile <profile>` | Das globale Profil für diesen `init`-Aufruf überschreiben (`core` oder `custom`). |
| `--no-animation` | Einen statischen statt des animierten Begrüßungsbildschirms anzeigen. |
| `--copilot-cloud` | GitHub-Copilot-Dateien für den [Cloud-Codieragenten](/de-DE/supported-tools/#github-copilot-cloud-codieragent) ohne Rückfrage einrichten. |
| `--no-copilot-cloud` | GitHub-Copilot-Dateien für den Cloud-Codieragenten ohne Rückfrage überspringen. |

`--profile custom` verwendet die Workflows, die derzeit in der globalen Konfiguration ausgewählt sind (`openspec config profile`).

Die Begrüßungsanimation wird ebenfalls übersprungen, wenn die Umgebungsvariable `OPENSPEC_NO_ANIMATION` gesetzt ist (beliebiger Wert, auch leer), wenn `NO_COLOR` einen nicht leeren Wert hat oder wenn die Betriebssystemeinstellung für reduzierte Bewegung aktiviert ist (macOS „Bewegung reduzieren“, GNOME-Animationen deaktiviert).

**Unterstützte Tool-IDs (`--tools`)** – `windsurf` wird ebenfalls als Alias für `devin` akzeptiert: `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `command-code`, `codeartsagent`, `codex`, `devin`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `minimax-code`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `codeassistant`, `qoder`, `qwen`, `rovodev`, `roocode`, `trae`, `zed`, `zcode`, `agents`

> Diese Liste entspricht `AI_TOOLS` in `src/core/config.ts`. Die Skill- und Befehlspfade der einzelnen Tools finden Sie unter [Unterstützte Tools](/de-DE/supported-tools/).

**Beispiele:**

```bash
# Interactive initialization
openspec init

# Initialize in a specific directory
openspec init ./my-project

# Non-interactive: configure for Claude and Cursor
openspec init --tools claude,cursor

# Non-interactive: configure global MiniMax Code skills
openspec init --tools minimax-code

# Configure for all supported tools
openspec init --tools all

# Override profile for this run
openspec init --profile core

# Skip prompts and auto-cleanup legacy files
openspec init --force
```

**Erstellt Folgendes:**

```
openspec/
├── specs/              # Your specifications (source of truth)
├── changes/            # Proposed changes
└── config.yaml         # Project configuration

.claude/skills/         # Claude Code skills (if claude selected)
.cursor/skills/         # Cursor skills (if cursor selected)
.cursor/commands/       # Cursor OPSX commands (if delivery includes commands)
.agents/skills/         # Shared skills for AGENTS.md-compatible tools (if agents selected)
... (other tool configs)
```

---

### `openspec update`

Aktualisiert die OpenSpec-Anweisungsdateien nach einem CLI-Upgrade. Generiert Konfigurationsdateien für KI-Tools anhand Ihres aktuellen globalen Profils, der ausgewählten Workflows und des Bereitstellungsmodus neu.

```
openspec update [path] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `path` | Nein | Zielverzeichnis (Standard: aktuelles Verzeichnis) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--force` | Aktualisierung erzwingen, auch wenn die Dateien aktuell sind |

**Beispiel:**

```bash
# Update instruction files after npm upgrade
npm install -g @fission-ai/openspec@latest
openspec update
```

Aktualisieren Sie zuerst das Paket. Anweisungsdateien werden von der installierten CLI generiert. Wenn Sie `openspec update` mit einer veralteten Installation ausführen, meldet der Befehl daher, dass alles aktuell sei, ohne die Workflows neuerer Versionen hinzuzufügen.

Damit dies sichtbar wird, fragt `openspec update` die npm-Registry ab, ob eine neuere CLI veröffentlicht wurde. Wenn Ihre Version veraltet ist, wird ein Upgrade angeboten:

```text
A newer OpenSpec CLI is available (v1.6.0 → v1.7.0).
  Running from: /usr/local/lib/node_modules/@fission-ai/openspec
? Upgrade to v1.7.0 now? (Y/n)
```

Wenn Sie zustimmen, führt der Befehl `npm install -g @fission-ai/openspec@latest` aus und wiederholt anschließend die Aktualisierung mit der neuen CLI, sodass die neuen Workflows im selben Aufruf bereitgestellt werden. Das Upgrade wird bestätigt, indem die installierte Binärdatei nach ihrer Version gefragt wird, statt dem Exitcode von npm zu vertrauen. Wenn also noch eine andere Installation, die weiter vorne in Ihrem `PATH` steht, verwendet wird, meldet der Befehl dies, statt fälschlich Erfolg anzuzeigen. Wenn Sie ablehnen, wird der Befehl ausgegeben und mit der vorhandenen CLI aktualisiert. Mit Strg+C wird der Befehl abgebrochen.

Das Angebot erscheint nur in einem interaktiven Terminal und nur, wenn npm die Installation verwaltet – dem einzigen Fall, in dem `npm install -g` das Problem tatsächlich behebt. Für alle anderen Installationsarten wird stattdessen der passende Befehl ausgegeben:

| Installationsart von OpenSpec | Ausgabe |
|---------------------------|--------------|
| Globale npm-Installation | Die Rückfrage; in einem interaktiven Terminal wird das Upgrade für Sie ausgeführt. Bei umgeleiteter Ausgabe wird stattdessen der Befehl ausgegeben. |
| Globale Installation mit pnpm, bun, yarn oder volta | Der jeweilige Befehl des Paketmanagers: `pnpm add -g …@latest`, `bun add -g …@latest`, `yarn global add …@latest` oder `volta install …@latest` |
| Projektabhängigkeit | Ein Hinweis zum Aktualisieren der Abhängigkeit, da ihr Paketmanager die Lockdatei verwaltet |
| `npx`-/`dlx`-Cache | `npx @fission-ai/openspec@latest update` – dieser Befehl führt die Aktualisierung selbst aus, ein zweiter Schritt ist nicht erforderlich |
| Git-Klon | Keine Aktion – Ihre Version entspricht dem Stand des Branches |

Wenn etwas ausgegeben wird, enthält es das Verzeichnis, aus dem die laufende CLI geladen wurde. Prüfen Sie diesen Pfad, wenn Sie bereits ein Upgrade durchgeführt haben, aber in Ihrem `PATH` noch ein veralteter Shim verwendet wird.

Die Abfrage verwendet die Registry aus `npm_config_registry`, falls npm diese Variable exportiert, und andernfalls `https://registry.npmjs.org`. Eine `.npmrc` wird nicht gelesen: Den Inhalt einer Datei bestimmen zu lassen, wohin eine ausgehende Anfrage gesendet wird, sollte vermieden werden; außerdem wird die `.npmrc` eines Projekts zusammen mit dem Repository weitergegeben. Verwenden Sie bei einem privaten Mirror `npm_config_registry` oder setzen Sie `OPENSPEC_NO_UPDATE_CHECK`, um die Prüfung ganz zu überspringen. Die Prüfung wird übersprungen, wenn `CI` auf einen anderen als den ausdrücklich deaktivierten Wert gesetzt ist (`false`, `0`, `no`, `off` oder leer), wenn `NODE_ENV=test` gilt oder wenn `OPENSPEC_NO_UPDATE_CHECK` (beliebiger Wert), `DO_NOT_TRACK=1` oder `OPENSPEC_TELEMETRY=0` gesetzt ist. Sie läuft vor der Aktualisierung und kann sie höchstens 1,5 Sekunden verzögern. Danach wird sie abgebrochen, selbst wenn das Netzwerk Pakete unbemerkt verwirft, und bei nicht erreichbarer Registry wird keine Meldung ausgegeben.

**So wird „aktuell“ bestimmt:** Skill-Dateien enthalten die Version, mit der sie generiert
wurden. OpenSpec vergleicht sie daher mit der installierten CLI-Version. Befehlsdateien haben keinen
Versionsstempel. Bei einem Tool mit Befehlen, aber ohne Skills (Bereitstellung
`commands`), vergleicht OpenSpec den Dateiinhalt mit dem, was aktuell generiert würde. Änderungen an diesen Dateien gelten als Abweichungen und werden überschrieben. Bei der Bereitstellung
`skills` oder `both` wird nur die gespeicherte Version geprüft. Eine manuell bearbeitete Datei
mit übereinstimmender Version bleibt daher unverändert; verwenden Sie `--force`, um sie neu zu schreiben. In jedem Fall gehören generierte Dateien OpenSpec. Legen Sie Ihre eigenen Anweisungen
an anderer Stelle ab.

---

## Stores (eigenständige OpenSpec-Repositories)

> **Beta.** Stores und darauf aufbauende Funktionen (Referenzen, Arbeitskontext, Worksets) sind neu; Befehlsnamen, Flags, Dateiformate und JSON-Ausgaben können sich zwischen Versionen ändern. Eine problemorientierte Anleitung finden Sie im [Store-Leitfaden](/de-DE/stores-beta/user-guide/).

Ein Store ist ein eigenständiges OpenSpec-Repository, das Sie auf diesem Rechner registriert haben – zum Beispiel ein Planungs- oder Vertrags-Repository. Wenn Sie einen Store registriert haben, können normale Befehle (`list`, `show`, `status`, `validate`, `new change`, `archive` usw.) von überall darin ausgeführt werden, wenn Sie `--store <id>` übergeben.

### `openspec store setup`

Erstellt und registriert einen lokalen Store. Wird der Befehl im Terminal ohne Argumente ausgeführt,
führt OpenSpec durch die Einrichtung. Agents und Skripte sollten explizite Eingaben übergeben
und `--json` verwenden.

```bash
openspec store setup [id] [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--path <path>` | Ordner, in dem der Store liegen soll (z. B. `~/openspec/<id>`) |
| `--remote <url>` | Kanonischen Remote in der `store.yaml` des neuen Stores eintragen |
| `--init-git` | Ein Git-Repository mit einem ersten Commit initialisieren (Standard) |
| `--no-init-git` | Alle Git-Aktionen überspringen: keine Initialisierung, kein erster Commit |
| `--json` | JSON ausgeben |

Bei nicht-interaktiven Aufrufen (`--json`, Skripte, Agents) müssen sowohl die Store-ID als auch `--path` angegeben werden. In einem interaktiven Terminal fragt der Befehl nach dem Speicherort und schlägt einen bearbeitbaren Pfad an einem sichtbaren, benutzerverwalteten Ort vor (z. B. `~/openspec/<id>`). Das von OpenSpec verwaltete Datenverzeichnis wird niemals als Standard verwendet.

Beispiele:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Registriert einen vorhandenen lokalen Store-Ordner. Während der Store-Beta kann ein Stamm registriert werden,
bevor Änderungen vorhanden sind, Spezifikationen angewendet wurden oder Änderungen
archiviert wurden. In diesem Fall können `openspec/changes/`, `openspec/specs/` und
`openspec/changes/archive/` fehlen, bis sie von normalen Befehlen angelegt werden.
Ein Repository, das nur eine Konfiguration mit `store: <id>` enthält, bleibt ein Verweis auf einen anderen
Store und wird nicht als Store-Stamm registriert, solange dieser Verweis nicht entfernt wird.

```bash
openspec store register [path] [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--id <id>` | Store-ID; Standardwert ist der aus den Store-Metadaten oder dem Ordnernamen |
| `--yes` | Erstellen von Store-Identitätsmetadaten für einen gesunden OpenSpec-Stamm bestätigen |
| `--json` | JSON ausgeben |

### `openspec store unregister`

Hebt die lokale Store-Registrierung auf, ohne Dateien zu löschen.

```bash
openspec store unregister <id> [--json]
```

Verwenden Sie diesen Befehl, wenn ein Store verschoben, an einen anderen Ort geklont wurde oder von OpenSpec auf diesem Rechner nicht mehr angezeigt werden soll.

### `openspec store remove`

Hebt die lokale Store-Registrierung auf und löscht den lokalen Ordner.

```bash
openspec store remove <id> [--yes] [--json]
```

In einem interaktiven Terminal zeigt `remove` vor dem Löschen den genauen Ordner an.
Agents, Skripte und JSON-Aufrufer müssen `--yes` übergeben, um das Löschen zu bestätigen.
OpenSpec verweigert das Löschen eines Ordners, der keine passenden
Store-Metadaten enthält.

### `openspec store list`

Listet lokal registrierte Stores auf.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Prüft die lokale Store-Registrierung, Metadaten und das Vorhandensein von Git.

```bash
openspec store doctor [id] [--json]
```

Doctor dient ausschließlich der Diagnose. Der Befehl meldet fehlende Stämme, Abweichungen in Metadaten und einen ungültigen Zustand der lokalen Registrierung, ohne den Store zu ändern.

### Stores aus einem Projekt referenzieren

Ein Projekt-Repository kann in `openspec/config.yaml` deklarieren, auf welche Stores sich seine Arbeit stützt:

```yaml
schema: spec-driven
references:
  - team-context
```

Ab dann enthält die Ausgabe von `openspec instructions` in diesem Repository (sowohl die Artefakt- als auch die `apply`-Schnittstelle, im JSON- und menschenlesbaren Modus) einen Index der Spezifikationen jedes referenzierten Stores – Spezifikations-IDs, eine einzeilige Zusammenfassung aus dem jeweiligen Purpose-Abschnitt und den Abrufbefehl (`openspec show <spec-id> --type spec --store <id>`). Der Index wird bei jedem Aufruf live aus dem registrierten Checkout erstellt. Der Inhalt der Spezifikationen wird niemals in die Ausgabe kopiert.

Referenzen bieten schreibgeschützten Kontext. Sie ändern niemals, wo Befehle ausgeführt werden: Die Arbeit bleibt im Stamm des Repositorys. Schreibzugriffe auf einen referenzierten Store erfordern weiterhin die ausdrückliche Angabe von `--store`. Eine nicht auflösbare Referenz (etwa zu einem Store, der auf diesem Rechner nicht registriert ist) wird im Index zu einer Warnung mit der genauen Abhilfe herabgestuft. Die Anweisungen werden trotzdem generiert. `openspec doctor` meldet den Zustand aller Referenzen an einer Stelle.

### Die Klonquelle eines Stores festhalten

Ein Store kann seine kanonische Klonquelle in seiner committeten Identitätsdatei festhalten. So endet das Onboarding nicht in einer Sackgasse mit der Aufforderung „Store registrieren“:

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

Der Remote wird im ersten Commit in `.openspec-store/store.yaml` gespeichert, sodass jeder Klon diese Information von Anfang an enthält. Bearbeiten Sie bei einem vorhandenen Store `store.yaml` von Hand und committen Sie die Änderung. `store doctor` zeigt den gespeicherten Remote (und den im Checkout festgestellten Git-Ursprung) an. Hinweise zum Teilen nach `setup`/`register` nennen ihn ebenfalls, und `register` trägt den Ursprung des Checkouts in die lokale Registry des Rechners ein.

Eine Referenzdeklaration kann ebenfalls die Klonquelle enthalten. So erhält ein Teammitglied, das den Store noch nicht besitzt, eine vollständige, kopierbare Lösung (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Einen Remote zu speichern ist keine Synchronisierung: OpenSpec klont, pullt oder pusht niemals eigenständig.

### Einen Standard-Store deklarieren

Ein Repository, dessen Planung vollständig ausgelagert ist – also ohne lokales `openspec/specs/` oder `openspec/changes/` –, kann den Store einmal deklarieren, statt bei jedem Befehl `--store` zu übergeben:

```yaml
# openspec/config.yaml (the only file under openspec/)
store: team-context
```

Normale Befehle werden dann automatisch auf den deklarierten Store aufgelöst. Das Stamm-Banner und der JSON-Block `root` melden `source: "declared"` sowie die Store-ID; ausgegebene Hinweise enthalten weiterhin `--store <id>`. Die Deklaration ist ein Fallback und überschreibt niemals andere Angaben: Ein ausdrücklich angegebenes `--store` hat immer Vorrang. Ein Verzeichnis mit echten Planungsordnern ignoriert den Verweis (mit einer Warnung). Um ein Verweis-Repository in einen lokalen OpenSpec-Stamm umzuwandeln, entfernen Sie die Zeile `store:` und führen `openspec init` aus – solange die Deklaration vorhanden ist, verweigert `init` das Anlegen des Gerüsts.

Eine rechnerweite Variante gilt für alle Repositories: `openspec config set defaultStore <id>` (siehe „Konfiguration“). Sie wird erst herangezogen, wenn `--store`, ein lokaler Stamm und ein Projektverweis nicht aufgelöst werden konnten. Das Stamm-Banner und der JSON-Block `root` melden dann `source: "global_default"`.

## Doctor (Gesundheitszustand der Beziehungen)

Eine schreibgeschützte Prüfung an einer Stelle: Ist der OpenSpec-Stamm gesund und sind die referenzierten Stores auf diesem Rechner verfügbar?

```bash
openspec doctor [--store <id>] [--json]
```

Der Bericht unterscheidet zwischen dem Zustand des Stamms, dem Zustand der Store-Metadaten (einschließlich eines Hinweises, wenn der gespeicherte Remote und der Ursprung des Checkouts voneinander abweichen, sowie eines Hinweises, wenn der Store-Checkout hinter der zuletzt abgerufenen Upstream-Tracking-Referenz zurückliegt) und dem Zustand der Referenzen (dieselben Diagnosen, die auch `instructions` anzeigt, mit Klonbefehlen für nicht auflösbare Referenzen). Gesundheitsbefunde jeder Schwere führen zu Exitcode 0 – Agents lesen die `status`-Arrays. Nur Befehlsfehler (kein Stamm, unbekannter Store) führen zu Exitcode 1. Doctor klont, synchronisiert und repariert niemals. Um statt des Zustands den zusammengestellten Arbeitsbestand abzurufen, verwenden Sie `openspec context`.

## Arbeitskontext (der zusammengestellte Bestand)

Alles, was laut OpenSpec-Deklarationen zu dieser Arbeit gehört, in einem Arbeitsbestand: der OpenSpec-Stamm und die von ihm referenzierten Stores.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

Die JSON-Kurzübersicht kann von Agents verwendet werden (jeder verfügbare referenzierte Store enthält sein Abrufrezept; nicht auflösbare Elemente enthalten dieselben Lösungshinweise wie `instructions` und `doctor`). `--code-workspace` schreibt zusätzlich eine VS-Code-Arbeitsbereichsdatei mit dem Stamm und den verfügbaren referenzierten Stores (Ordner `ref:<id>`). Dies ist der einzige Schreibvorgang des Befehls. Wenn die Datei bereits vorhanden ist, wird er ohne `--force` verweigert. Nicht verfügbare Elemente werden gemeldet, nicht erraten.

Der „Arbeitskontext“ ist der zusammengestellte Bestand. Das Feld `context:` in `openspec/config.yaml` dagegen enthält Projektinformationen, die in Anweisungen eingefügt werden – es handelt sich um zwei verschiedene Dinge. `openspec doctor` beantwortet die Frage, ob der Bestand gesund ist; `openspec context` zeigt, was zu diesem Bestand gehört.

## Persönliche Worksets

> **Beta.** Worksets gehören zur neuen Beta-Oberfläche; Befehle, Flags und Dateiformate können sich zwischen Versionen ändern. Eine Anleitung finden Sie im [Store-Leitfaden](/de-DE/stores-beta/user-guide/#worksets-gemeinsam-verwendete-ordner-erneut-öffnen).

Ein Workset ist eine persönliche, benannte Ansicht der Ordner, mit denen Sie gemeinsam arbeiten – ein Planungsstamm und alle weiteren Ordner Ihrer Wahl –, die auf Ihrem Rechner gespeichert und in Ihrem Tool anhand des Namens erneut geöffnet wird. Es bleibt vollständig lokal: wird niemals committet oder geteilt, leitet sich niemals aus Deklarationen ab, und das Entfernen eines Worksets berührt keine seiner Ordner.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` führt durch einen kurzen Einrichtungsablauf (oder übernimmt nicht-interaktiv `--member`-Flags; das erste Element ist das primäre – Sitzungen beginnen dort). `open` startet das ausgewählte Tool: Editoren (VS Code, Cursor) öffnen ein Fenster mit allen Elementen und kehren zurück. CLI-Agents (Claude Code, codex) übernehmen dieses Terminal als Sitzung mit allen angehängten Elementen und ohne vorausgefüllten Prompt; die Sitzung endet, wenn Sie sie beenden. Fehlt beim Öffnen ein Ordner, wird er mit einem Hinweis übersprungen; die übrigen Ordner werden geöffnet. Die gespeicherte Tool-Auswahl kann bei jedem Aufruf mit `--tool` überschrieben werden.

Die Unterstützung eines neuen Tools erfordert Konfiguration, keinen Code. Jedes Tool verwendet eine von zwei Startarten – `workspace-file` (Start über die generierte `.code-workspace`-Datei) oder `attach-dirs` (ein Attach-Flag pro Element). Über den Schlüssel `openers` in der globalen `config.json` (öffnen Sie sie mit `openspec config edit`) können Tools hinzugefügt oder integrierte Einstellungen feldweise angepasst werden:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Der gesamte Workset-Zustand liegt im Ordner `worksets/` des globalen Datenverzeichnisses (gespeicherte Ansichten sowie generierte `<name>.code-workspace`-Dateien, die bei jedem Öffnen neu erstellt werden). Wenn Sie den Ordner löschen, werden alle Spuren entfernt.

---

## Befehle zum Durchsuchen

### `openspec list`

Listet Änderungen oder Spezifikationen in Ihrem Projekt auf.

```
openspec list [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--specs` | Spezifikationen statt Änderungen auflisten |
| `--changes` | Änderungen auflisten (Standard) |
| `--sort <order>` | Nach `recent` (Standard) oder `name` sortieren |
| `--json` | Als JSON ausgeben |

**Beispiele:**

```bash
# List all active changes
openspec list

# List all specs
openspec list --specs

# JSON output for scripts
openspec list --json
```

**Ausgabe (Text):**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

Zeigt ein interaktives Dashboard zum Durchsuchen von Spezifikationen und Änderungen an.

```
openspec view
```

Öffnet eine terminalbasierte Oberfläche zum Navigieren durch die Spezifikationen und Änderungen Ihres Projekts.

---

### `openspec show`

Zeigt Details zu einer Änderung oder Spezifikation an.

```
openspec show [item-name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `item-name` | Nein | Name der Änderung oder Spezifikation (wird abgefragt, falls nicht angegeben) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--type <type>` | Typ angeben: `change` oder `spec` (wird automatisch erkannt, wenn eindeutig) |
| `--json` | Als JSON ausgeben |
| `--no-interactive` | Rückfragen deaktivieren |

**Änderungsspezifische Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--deltas-only` | Nur Delta-Spezifikationen anzeigen (JSON-Modus) |

**Spezifikationsspezifische Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--requirements` | Nur Anforderungen anzeigen und Szenarien ausschließen (JSON-Modus) |
| `--no-scenarios` | Szenarioinhalte ausschließen (JSON-Modus) |
| `-r, --requirement <id>` | Eine bestimmte Anforderung anhand eines bei 1 beginnenden Indexes anzeigen (JSON-Modus) |

**Beispiele:**

```bash
# Interactive selection
openspec show

# Show a specific change
openspec show add-dark-mode

# Show a specific spec
openspec show auth --type spec

# JSON output for parsing
openspec show add-dark-mode --json
```

---

## Validierungsbefehle

### `openspec validate`

Prüft Änderungen und Spezifikationen auf strukturelle Probleme und vergleicht MODIFIED-Anforderungen einer Änderung mit den Hauptspezifikationen, die sie ersetzen würden.

```
openspec validate [item-name] [options]
```

Eine Änderung ohne Spezifikationsdeltas besteht die Validierung nur, wenn ihre `.openspec.yaml` `skip_specs: true` festlegt (für reine Refactorings, Tooling- oder Dokumentationsarbeiten – siehe [Rezept 5](/de-DE/examples/#rezept-5-ein-refactoring-ohne-verhaltensänderung)).

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `item-name` | Nein | Bestimmtes zu validierendes Element (wird abgefragt, falls nicht angegeben) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--all` | Alle Änderungen und Spezifikationen validieren |
| `--changes` | Alle Änderungen validieren |
| `--specs` | Alle Spezifikationen validieren |
| `--archived` | Prüfen, ob alle Aufgaben archivierter Änderungen abgeschlossen sind (für Pre-Commit-Linting) |
| `--type <type>` | Typ bei mehrdeutigem Namen angeben: `change` oder `spec` |
| `--strict` | Strikten Validierungsmodus aktivieren |
| `--json` | Als JSON ausgeben |
| `--concurrency <n>` | Maximale Anzahl paralleler Validierungen (Standard: 6 oder Umgebungsvariable `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Rückfragen deaktivieren |

`--archived` ist ein eigener Prüfbereich: Er validiert keine Spezifikationsdeltas (diese wurden beim Archivieren bereits angewendet), sondern prüft, ob bei jeder Änderung unter `changes/archive/` alle Kontrollkästchen in `tasks.md` abgehakt sind. Wenn noch eines offen ist, endet der Befehl mit einem Fehlercode ungleich null. So lassen sich archivierte Änderungen mit unvollendeter Arbeit erkennen – praktisch in einem Pre-Commit-Hook.

**Beispiele:**

```bash
# Interactive validation
openspec validate

# Validate a specific change
openspec validate add-dark-mode

# Validate all changes
openspec validate --changes

# Validate everything with JSON output (for CI/scripts)
openspec validate --all --json

# Strict validation with increased parallelism
openspec validate --all --strict --concurrency 12

# Fail if any archived change still has unchecked tasks
openspec validate --archived
```

**Ausgabe (Text):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**Ausgabe (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## Lebenszyklusbefehle

### `openspec archive`

Archiviert eine abgeschlossene Änderung und führt Delta-Spezifikationen mit den Hauptspezifikationen zusammen.

```
openspec archive [change-name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Zu archivierende Änderung (wird abgefragt, falls nicht angegeben; erforderlich, wenn niemand auf die Rückfrage antworten kann) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `-y, --yes` | Bestätigungsaufforderungen überspringen. Erforderlich, wenn niemand darauf antworten kann – bei einem KI-Agenten, CI-Job oder Aufruf mit geschlossenem stdin |
| `--skip-specs` | Spezifikationsaktualisierungen bei einem Archivierungslauf überspringen. Änderungen, die dauerhaft keine Deltas haben, sollten stattdessen `skip_specs: true` in ihrer `.openspec.yaml` deklarieren – sie werden dann ohne Flag archiviert. |
| `--no-validate` | Validierung überspringen (erfordert Bestätigung). Deaktiviert auch das Ausmustern von Funktionen – ohne Validierungsergebnis wird nichts ausgemustert. |

**Beispiele:**

```bash
# Interactive archive (asks which change, then confirms)
openspec archive

# Archive specific change
openspec archive add-dark-mode

# Archive without prompts (agents, CI, scripts)
openspec archive add-dark-mode --yes

# Archive a tooling change that doesn't affect specs
openspec archive update-ci-config --skip-specs
```

**Eine Funktion ausmustern:** Fügen Sie die Ausmusterungsmarkierung zu den Änderungsmetadaten hinzu:

```yaml
# openspec/changes/retire-legacy/.openspec.yaml
schema: spec-driven
retire_capabilities: true
```

Archivieren Sie die Änderung anschließend wie gewohnt:

```bash
openspec archive retire-legacy --yes
```

Wenn die Änderung die letzte Anforderung einer Funktion entfernt, löscht OpenSpec deren aktive `spec.md`. Deltas anderer Funktionen in derselben Änderung aktualisieren weiterhin deren Hauptspezifikationen. Ohne die Markierung hält archive an, bevor Dateien geändert werden, und fordert Sie auf, sie hinzuzufügen.

**Funktion:**

1. Validiert die Änderung (außer bei `--no-validate`).
2. Fragt nach einer Bestätigung (außer bei `--yes`).
3. Beansprucht das Archivziel, bevor eine Hauptspezifikation geändert wird.
4. Validiert und führt die aktiven Delta-Spezifikationen mit `openspec/specs/` zusammen. Eine Funktion, deren letzte Anforderung durch die Änderung entfernt wird, wird ausgemustert und ihre Spezifikationsdatei gelöscht – jedoch nur, wenn die `.openspec.yaml` der Änderung neben `schema:` auch `retire_capabilities: true` festlegt.
5. Verschiebt den Änderungsordner nach `openspec/changes/archive/YYYY-MM-DD-<name>/`.
6. Schlägt eine Änderung an Spezifikationen oder das endgültige Verschieben fehl, bevor ein vollständiges Archiv gesichert ist, werden die Spezifikationen wiederhergestellt und die Änderung bleibt an ihrem aktiven Pfad oder wird dorthin zurückverschoben.
7. Wird eine geprüfte Fallback-Kopie vollständig erstellt, aber das Bereinigen der bereitgestellten Quelle schlägt fehl, bleiben das vollständige Archiv und der committete Zustand der Spezifikationen zur Wiederherstellung erhalten.

**Ohne Terminaleingabe:** Ein KI-Agent, CI-Job oder ein Aufruf mit geschlossenem stdin kann Schritt 2 nicht beantworten. Daher hält archive an, bevor etwas geändert wird, endet mit Code 1 und nennt den erneut auszuführenden Befehl: `openspec archive <name> --yes`, einschließlich aller weiteren übergebenen Flags. Übergeben Sie `--yes` (und den Änderungsnamen) gleich zu Beginn, um die Rückfrage zu überspringen.

---

## Workflow-Befehle

Diese Befehle unterstützen den artefaktgesteuerten OPSX-Workflow. Sie sind sowohl für Menschen nützlich, die den Fortschritt prüfen, als auch für Agents, die nächste Schritte ermitteln.

### `openspec new change`

Erstellt im aufgelösten OpenSpec-Stamm ein Änderungsverzeichnis und optional committete Metadaten.

```bash
openspec new change <name> [options]
```

Änderungsnamen müssen das kleingeschriebene Kebab-Case-Format verwenden: Kleinbuchstaben, Zahlen und
einzelne Bindestriche. Leerzeichen, Unterstriche, Großbuchstaben,
aufeinanderfolgende Bindestriche sowie Bindestriche am Anfang oder Ende sind unzulässig. Eine führende Zahl ist erlaubt.
Sie können Namen also mit Zahlen versehen, um Änderungen zu ordnen oder zu staffeln, zum Beispiel `100-add-feature`
oder `00001-add-auth`.

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--description <text>` | Beschreibung, die in `README.md` eingefügt wird |
| `--goal <text>` | Optionale Zielmetadaten, die mit der Änderung gespeichert werden |
| `--schema <name>` | Zu verwendendes Workflow-Schema |
| `--store <id>` | Store-ID, die als OpenSpec-Stamm verwendet werden soll (ein Store ist ein registriertes, eigenständiges OpenSpec-Repository) |
| `--json` | JSON ausgeben |

Beispiele:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Zeigt den Abschlussstatus der Artefakte einer Änderung an.

```
openspec status [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--change <id>` | Änderungsname (wird abgefragt, falls nicht angegeben) |
| `--schema <name>` | Schema überschreiben (wird automatisch aus der Änderungskonfiguration erkannt) |
| `--json` | Als JSON ausgeben |

**Beispiele:**

```bash
# Interactive status check
openspec status

# Status for specific change
openspec status --change add-dark-mode

# JSON for agent use
openspec status --change add-dark-mode --json
```

**Ausgabe (Text):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[x] specs
[ ] design
[-] tasks (blocked by: design)
```

Eine Änderung mit `skip_specs: true` zeigt die Spezifikationsphase als `[~] specs (skipped: change declares skip_specs)` an und schließt sie aus der Fortschrittsanzeige aus.

**Ausgabe (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isPlanningComplete": false,
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

`isPlanningComplete` gibt an, ob alle nicht übersprungenen Planungsartefakte vorhanden sind.
Übersprungene Artefakte gelten als erfüllt, ohne erstellt zu werden. Der Wert sagt nicht aus,
ob die Implementierungsaufgaben abgeschlossen sind. `isComplete` bleibt als
abwärtskompatibler Alias mit demselben Wert erhalten.

Artefakte werden nach Abhängigkeiten geordnet aufgelistet – eine Abhängigkeit erscheint nie nach
dem Artefakt, das sie voraussetzt. Artefakte, die gleichzeitig bereit werden
(bei `spec-driven` benötigen sowohl `specs` als auch `design` nur `proposal`), behalten die im
Schema deklarierte Reihenfolge statt alphabetisch sortiert zu werden. Der erste Eintrag mit Status `ready`
ist somit das Artefakt, das als Nächstes geschrieben werden soll.

---

### `openspec instructions`

Ruft ergänzte Anweisungen zum Erstellen eines Artefakts oder zum Anwenden von Aufgaben ab. KI-Agents verwenden sie, um zu bestimmen, was als Nächstes erstellt werden soll.

```
openspec instructions [artifact] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `artifact` | Nein | Artefakt-ID oder Workflow-Eingabeoberfläche: `apply` oder `archive` |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--change <id>` | Änderungsname (im nicht-interaktiven Modus erforderlich) |
| `--schema <name>` | Schema überschreiben |
| `--json` | Als JSON ausgeben |

**Sonderfälle:** Verwenden Sie `apply`, um Anweisungen zur Implementierung von Aufgaben abzurufen. Verwenden Sie
`archive`, um aktuelle, schreibgeschützte Archiveingaben (`context` und
`operationGuidance`) für eine gültige Änderung abzurufen. Der Befehl archiviert oder ändert nichts.

**Beispiele:**

```bash
# Get instructions for next artifact
openspec instructions --change add-dark-mode

# Get specific artifact instructions
openspec instructions design --change add-dark-mode

# Get apply/implementation instructions
openspec instructions apply --change add-dark-mode

# Get current archive operation inputs without archiving
openspec instructions archive --change add-dark-mode --json

# JSON for agent consumption
openspec instructions design --change add-dark-mode --json
```

**Die Ausgabe enthält:**

- Vorlageninhalt für das Artefakt
- Projektkontext aus der Konfiguration
- Inhalte abhängiger Artefakte
- Regeln aus der Konfiguration, die für das jeweilige Artefakt gelten
- Aktuellen Projektkontext und passende Hinweise zu Vorgängen für `apply`/`archive`

Eingaben für Vorgänge werden bei jedem Aufruf aus dem aufgelösten Repository oder dem ausgewählten Store gelesen.
Projektkontext ist eine erforderliche Eingabe auf Prompt-Ebene: Agents lesen ihn und
berücksichtigen relevante Projektfakten, Konventionen und Einschränkungen. Hinweise zu Vorgängen sind
optionale Ergänzungen: Agents prüfen jeden Eintrag und befolgen nur anwendbare, mit dem integrierten Workflow
vereinbare Hinweise. Beide Felder bleiben getrennt von ausdrücklichen Benutzerentscheidungen, CLI-gesteuertem Zustand,
integrierten Anweisungen und Artefaktregeln. Widersprüchlicher Kontext wird gemeldet; widersprüchliche oder nicht anwendbare
Hinweise werden nicht befolgt und der Grund wird erläutert. Dies sind Verhaltensverträge für generierte Agents
und keine durchsetzbaren CLI-Prüfungen. `instructions archive` gibt nur die ausgewählte Änderung, optionale Eingaben und
Metadaten zum Stamm zurück; der statische Archivierungs-Workflow ist nicht enthalten.

Bei einem Artefakt, das durch `skip_specs: true` übersprungen wird, enthält die Ausgabe nur eine Warnung (JSON ergänzt die Felder `skipped`/`warning`) – das Artefakt darf nicht erstellt werden.

---

### `openspec templates`

Zeigt die aufgelösten Vorlagenpfade für alle Artefakte eines Schemas an.

```
openspec templates [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--schema <name>` | Zu prüfendes Schema (Standard: `spec-driven`) |
| `--json` | Als JSON ausgeben |

**Beispiele:**

```bash
# Show template paths for default schema
openspec templates

# Show templates for custom schema
openspec templates --schema my-workflow

# JSON for programmatic use
openspec templates --json
```

**Ausgabe (Text):**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Listet verfügbare Workflow-Schemas mit Beschreibungen und Artefaktabläufen auf.

```
openspec schemas [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--json` | Als JSON ausgeben |
| `--store <id>` | Registrierten Store als OpenSpec-Stamm verwenden |

**Beispiel:**

```bash
openspec schemas
```

**Ausgabe:**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## Schema-Befehle

Befehle zum Erstellen und Verwalten benutzerdefinierter Workflow-Schemas.

### `openspec schema init`

Erstellt ein neues projektspezifisches Schema.

```
openspec schema init <name> [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `name` | Ja | Schemaname (Kebab-Case) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--description <text>` | Beschreibung des Schemas |
| `--artifacts <list>` | Kommagetrennte Artefakt-IDs (Standard: `proposal,specs,design,tasks`) |
| `--default` | Als Standardschema des Projekts festlegen |
| `--no-default` | Nicht fragen, ob das Schema als Standard festgelegt werden soll |
| `--force` | Vorhandenes Schema überschreiben |
| `--json` | Als JSON ausgeben |

**Beispiele:**

```bash
# Interactive schema creation
openspec schema init research-first

# Non-interactive with specific artifacts
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Erstellt Folgendes:**

```
openspec/schemas/<name>/
├── schema.yaml           # Schema definition
└── templates/
    ├── proposal.md       # Template for each artifact
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Kopiert ein vorhandenes Schema in Ihr Projekt, damit Sie es anpassen können.

```
openspec schema fork <source> [name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `source` | Ja | Zu kopierendes Schema |
| `name` | Nein | Name des neuen Schemas (Standard: `<source>-custom`) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--force` | Vorhandenes Ziel überschreiben |
| `--json` | Als JSON ausgeben |

**Beispiel:**

```bash
# Fork the built-in spec-driven schema
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Validiert die Struktur und Vorlagen eines Schemas.

```
openspec schema validate [name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `name` | Nein | Zu validierendes Schema (wenn nicht angegeben, werden alle validiert) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--verbose` | Detaillierte Validierungsschritte anzeigen |
| `--json` | Als JSON ausgeben |

**Beispiel:**

```bash
# Validate a specific schema
openspec schema validate my-workflow

# Validate all schemas
openspec schema validate
```

---

### `openspec schema which`

Zeigt an, woher ein Schema aufgelöst wird (nützlich zum Debuggen der Prioritätsreihenfolge).

```
openspec schema which [name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `name` | Nein | Schemaname |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--all` | Alle Schemas mit ihrer Herkunft auflisten |
| `--json` | Als JSON ausgeben |

**Beispiel:**

```bash
# Check where a schema comes from
openspec schema which spec-driven
```

**Ausgabe:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Priorität der Schemas:**

1. Projekt: `openspec/schemas/<name>/`
2. Benutzer: `~/.local/share/openspec/schemas/<name>/`
3. Paket: integrierte Schemas

---

## Konfigurationsbefehle

### `openspec config`

Zeigt die globale OpenSpec-Konfiguration an und ändert sie.

```
openspec config <subcommand> [options]
```

**Unterbefehle:**

| Unterbefehl | Beschreibung |
|------------|-------------|
| `path` | Speicherort der Konfigurationsdatei anzeigen |
| `list` | Alle aktuellen Einstellungen anzeigen |
| `get <key>` | Einen bestimmten Wert abrufen |
| `set <key> <value>` | Einen Wert festlegen |
| `unset <key>` | Einen Schlüssel entfernen |
| `reset` | Auf Standardwerte zurücksetzen |
| `edit` | In `$EDITOR` öffnen |
| `profile [preset]` | Workflow-Profil interaktiv oder über eine Vorgabe konfigurieren |

**Beispiele:**

```bash
# Show config file path
openspec config path

# List all settings
openspec config list

# Get a specific value
openspec config get telemetry.enabled

# Set a value (disable anonymous usage telemetry)
openspec config set telemetry.enabled false

# Set a string value explicitly
openspec config set user.name "My Name" --string

# Remove a custom setting
openspec config unset user.name

# Set a machine-level default store (fallback root when no --store,
# local root, or project store: pointer resolves)
openspec config set defaultStore team-plans

# Reset all configuration
openspec config reset --all --yes

# Edit config in your editor
openspec config edit

# Configure profile with action-based wizard
openspec config profile

# Fast preset: switch workflows to core (keeps delivery mode)
openspec config profile core
```

**Telemetrie deaktivieren:** Wenn `telemetry.enabled` nicht gesetzt ist, lautet der Standardwert „aktiviert“ (Opt-out-Modell).
Setzen Sie den Wert auf `false`, um anonyme Nutzungsstatistiken und die Versionsprüfung von `openspec update` zu deaktivieren.
Umgebungsvariablen haben Vorrang vor der Konfiguration: `OPENSPEC_TELEMETRY=0`, `DO_NOT_TRACK=1`
und ein wahrer Wert für `CI` (z. B. `true`/`1`/`yes`) deaktivieren die Telemetrie unabhängig vom Konfigurationswert.

`openspec config profile` beginnt mit einer Zusammenfassung des aktuellen Zustands und lässt Sie anschließend auswählen:
- Bereitstellung und Workflows ändern
- Nur Bereitstellung ändern
- Nur Workflows ändern
- Aktuelle Einstellungen beibehalten (beenden)

Wenn Sie die aktuellen Einstellungen beibehalten, werden keine Änderungen geschrieben und es erscheint keine Aktualisierungsaufforderung.
Wenn sich die Konfiguration nicht ändert, die Projektdateien aber nicht mit dem globalen Profil oder der Bereitstellung übereinstimmen, zeigt OpenSpec eine Warnung an und schlägt `openspec update` vor.
Mit `Ctrl+C` wird der Vorgang sauber abgebrochen (ohne Stacktrace) und mit Code `130` beendet.
In der Workflow-Checkliste bedeutet `[x]`, dass der Workflow in der globalen Konfiguration ausgewählt ist. Um diese Auswahl auf Projektdateien anzuwenden, führen Sie `openspec update` aus (oder wählen Sie innerhalb eines Projekts bei der entsprechenden Rückfrage `Apply changes to this project now?`).

**Interaktive Beispiele:**

```bash
# Delivery-only update
openspec config profile
# choose: Change delivery only
# choose delivery: Skills only

# Workflows-only update
openspec config profile
# choose: Change workflows only
# toggle workflows in the checklist, then confirm
```

---

## Dienstprogramme

### `openspec feedback`

Sendet Feedback zu OpenSpec und erstellt dafür ein GitHub-Issue.

```
openspec feedback <message> [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `message` | Ja | Zusammenfassung des Feedbacks; längerer Text wird im Issue-Titel gekürzt und im Textkörper vollständig übernommen |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--body <text>` | Zusätzliche Details, die nach der Zusammenfassung eingefügt werden |

**Voraussetzungen:** GitHub CLI (`gh`) muss installiert und authentifiziert sein.

**Beispiel:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Verwaltet die Shell-Vervollständigung für die OpenSpec-CLI.

```
openspec completion <subcommand> [shell]
```

**Unterbefehle:**

| Unterbefehl | Beschreibung |
|------------|-------------|
| `generate [shell]` | Vervollständigungsskript nach stdout ausgeben |
| `install [shell]` | Vervollständigung für Ihre Shell installieren |
| `uninstall [shell]` | Installierte Vervollständigungen entfernen |

**Unterstützte Shells:** `bash`, `zsh`, `fish`, `powershell`

**Beispiele:**

```bash
# Install completions (auto-detects shell)
openspec completion install

# Install for specific shell
openspec completion install zsh

# Generate script for manual installation (bash)
openspec completion generate bash > ~/.bash_completion.d/openspec

# Uninstall
openspec completion uninstall
```

**Windows (PowerShell):** Installieren Sie Vervollständigungen für die aktuelle PowerShell-Instanz:

```powershell
$env:PROFILE = $PROFILE
openspec completion install powershell
. $PROFILE
```

`$env:PROFILE` teilt OpenSpec mit, welches Profil in dieser Sitzung konfiguriert werden soll. Das
Installationsprogramm erstellt fehlende Profilverzeichnisse und fügt einen verwalteten Block hinzu, der
`OpenSpecCompletion.ps1` lädt. Durch erneutes Laden des Profils wird die Vervollständigung sofort aktiviert.

Um die Vervollständigung für die aktuelle Instanz zu deinstallieren, führen Sie Folgendes aus:

```powershell
$env:PROFILE = $PROFILE
openspec completion uninstall powershell
```

Starten Sie PowerShell nach der Deinstallation neu, um Vervollständigungen aus der aktuellen Sitzung zu entfernen.

Vervollständigungen sind optional. Die CLI weist beim ersten Befehlsaufruf in einem interaktiven Terminal einmalig
über stderr darauf hin und danach nie wieder. Der Hinweis wird auch unterdrückt,
wenn bereits Vervollständigungen installiert sind. Setzen Sie `OPENSPEC_NO_COMPLETIONS=1`, um
den Hinweis vollständig zu unterdrücken.

---

## Exitcodes

| Code | Bedeutung |
|------|---------|
| `0` | Erfolg |
| `1` | Fehler (fehlgeschlagene Validierung, fehlende Dateien usw.) |

---

## Umgebungsvariablen

| Variable | Beschreibung |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Auf `0` setzen, um Telemetrie und Versionsprüfung von `openspec update` zu deaktivieren (überschreibt `telemetry.enabled` in der globalen Konfiguration) |
| `DO_NOT_TRACK` | Auf `1` setzen, um Telemetrie und Versionsprüfung von `openspec update` zu deaktivieren (Standard-DNT-Signal; überschreibt die Konfiguration) |
| `OPENSPEC_CONCURRENCY` | Standardanzahl paralleler Validierungen (Standard: 6) |
| `EDITOR` oder `VISUAL` | Editor für `openspec config edit` |
| `NO_COLOR` | Farbausgabe deaktivieren, wenn gesetzt |
| `OPENSPEC_NO_ANIMATION` | Begrüßungsanimation von `openspec init` deaktivieren, wenn gesetzt |
| `OPENSPEC_NO_COMPLETIONS` | Auf `1` setzen, um den einmaligen Hinweis zu Shell-Vervollständigungen zu unterdrücken |
| `OPENSPEC_NO_UPDATE_CHECK` | Bei beliebigem gesetztem Wert (auch leer) die Prüfung von `openspec update` auf eine neuere veröffentlichte CLI deaktivieren. Wird auch übersprungen, wenn `CI` gesetzt ist (außer bei `false`/`0`/`no`/`off`) oder `NODE_ENV=test` gilt |
| `npm_config_registry` | Registry, die von der Versionsprüfung in `openspec update` abgefragt wird. Muss eine `http(s)`-URL sein, andernfalls wird auf `https://registry.npmjs.org` zurückgegriffen. Eine `.npmrc`-Datei wird nicht gelesen |

---

## Weiterführende Dokumentation

- [Befehle](/de-DE/commands/) – KI-Slash-Befehle (`/opsx:propose`, `/opsx:apply` usw.)
- [Workflows](/de-DE/workflows/) – Häufige Muster und Einsatz der einzelnen Befehle
- [Anpassung](/de-DE/customization/) – Benutzerdefinierte Schemas und Vorlagen erstellen
- [Erste Schritte](/de-DE/getting-started/) – Anleitung zur Ersteinrichtung
