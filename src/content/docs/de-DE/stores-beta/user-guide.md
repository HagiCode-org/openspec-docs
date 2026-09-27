---
title: "Stores: In einem eigenen Repository planen"
---

> **Beta.** Stores, Referenzen, Arbeitskontext und Worksets sind neu.
> Befehlsnamen, Flags, Dateiformate und JSON-Ausgaben können sich zwischen
> Versionen noch ändern. Alle folgenden Anleitungen wurden mit dem
> aktuellen Build ausgeführt. Lesen Sie diesen Leitfaden nach einem Upgrade erneut.

## Welches Problem damit gelöst wird

OpenSpec befindet sich normalerweise innerhalb eines Code-Repositorys: Ein Ordner `openspec/` liegt neben
Ihrem Code und enthält die Spezifikationen und Änderungen für dieses Repository.

Das passt nicht mehr, sobald Ihre Planung größer ist als ein einzelnes Repository:

- Ihre Arbeit umfasst mehrere Repositories – eine Funktion betrifft den API-Server,
  die Web-App und eine gemeinsame Bibliothek. In welchem `openspec/`-Ordner
  liegt dann der Plan?
- Ihr Team plant, bevor Code vorhanden ist, oder plant Dinge, die niemals zu
  Code in *diesem* Repository werden.
- Ein Team verantwortet Anforderungen, die andere Teams verwenden. Die
  Wiki-Version weicht ab, und Ihr Codieragent kann sie ohnehin nicht lesen.

Ein **Store** ist die Lösung: ein eigenständiges Repository, dessen einziger Zweck die Planung ist.
Es hat den Ihnen bereits bekannten Aufbau mit `openspec/` – Spezifikationen und Änderungen –
plus eine kleine Identitätsdatei. Sie registrieren es auf Ihrem Rechner einmal unter einem Namen.
Danach kann jeder normale OpenSpec-Befehl von überall darin arbeiten.

## Der Aufbau

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

Zwei Regeln halten das Ganze einfach:

1. **Ein Store ist einfach ein Git-Repository.** Sie committen, pushen, pullen und überprüfen es
   selbst. OpenSpec klont, synchronisiert oder pusht niemals eigenständig etwas.
2. **Deklarationen statt Mechanismen.** Repositories können *deklarieren*, wie sie mit
   Stores zusammenhängen (siehe unten). Deklarationen ändern, was OpenSpec Ihnen mitteilen kann –
   niemals, wo Ihre Befehle ausgeführt werden.

## In fünf Minuten zum ersten Store

Mit zwei Befehlen kommen Sie von null zu einer funktionierenden, Store-bezogenen Änderung:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

Das ist das ganze Modell. Der Lebenszyklus entspricht nun genau dem, was Sie bereits kennen –
`status`, `instructions`, `validate`, `archive` –, wobei jeder Befehl `--store team-plans`
verwendet und jeder ausgegebene Hinweis das Flag für Sie enthält. Die Zeile
`Using OpenSpec root:` zeigt immer an, wo ein Befehl ausgeführt wird.

## Beispiel: Ein Team, ein Planungs-Repository

Ein Team hält seine Spezifikationen und Änderungen in `team-plans`, statt
sie über mehrere Code-Repositories zu verteilen.

**Am ersten Tag (wer auch immer es einrichtet):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Wenn Sie `--remote` übergeben, wird die Klon-URL im ersten Commit in der Identitätsdatei
des Stores (`.openspec-store/store.yaml`) gespeichert. Jeder spätere
Klon weiß damit, woher er stammt. Gesundheitsprüfungen und Fehlermeldungen
können so für Teammitglieder, die ihn noch nicht besitzen, eine vollständige, kopierbare Lösung ausgeben.

**Jedes Teammitglied (einmal pro Rechner):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

Von da an arbeitet jeder über den Namen mit demselben Planungs-Repository:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Arbeit wird absichtlich über Git geteilt.** Eine Änderung, die Sie erstellen, ist nur in
Ihrem Checkout vorhanden, bis Sie sie committen und pushen – wie Code. Pläne erhalten
kostenlos Branches, Pull Requests und Reviews, da ein Store ein
gewöhnliches Repository ist.

**Code-Repositories des Teams verbinden.** Ein Code-Repository, dessen Planung vollständig
ausgelagert ist, benötigt nur eine Zeile in `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Von nun an arbeitet jeder OpenSpec-Befehl, der in `web-app` ausgeführt wird, ohne
zusätzliche Flags mit `team-plans`:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

Der Verweis ist ein Fallback und überschreibt niemals andere Angaben: Ein ausdrücklich angegebenes `--store` hat
immer Vorrang. Wenn das Repository eigene echte Planungsordner erhält, haben diese Vorrang
(mit einer Warnung, den veralteten Verweis zu entfernen).

**Ein Standard für alle Repositories auf Ihrem Rechner.** Wenn Sie mit mehreren
Code-Repositories arbeiten, die alle denselben Store für die Planung verwenden, legen Sie den Wert einmal global fest,
statt jedem Repository die Zeile `store:` hinzuzufügen:

```bash
openspec config set defaultStore team-plans
```

Von nun an wird jeder Befehl, der außerhalb eines Planungsstamms und ohne `--store` oder
Projektverweis ausgeführt wird, auf `team-plans` aufgelöst. Dieser Wert steht ganz unten in der
Prioritätsliste, sodass `--store`, ein lokaler Stamm und ein `store:`-Verweis im Projekt
weiterhin Vorrang haben. Das Stamm-Banner und der JSON-Block `root` melden
`source: "global_default"` mit der Store-ID. So können Sie einen rechnerweiten Standardwert stets von
einem Verweis aus einem Repository unterscheiden. Entfernen Sie ihn mit
`openspec config unset defaultStore`. Wenn die ID nicht registriert ist, geben Befehle
einen Fehler aus und weisen Sie an, den Store zu registrieren oder den veralteten Standardwert zu entfernen.

## Beispiel: Eine Funktion, zwei Komponenten-Repositories

Angenommen, `add-checkout-promo` ändert sowohl `checkout-api` als auch
`checkout-web`. Das Team möchte einen gemeinsamen Produktvertrag, während jedes Code-
Repository weiterhin eigene Implementierungsaufgaben, Branches und Reviews benötigt.

Verwenden Sie zwei Ebenen:

1. Halten Sie das gemeinsame Verhalten in `team-plans` fest.
2. Bewahren Sie die Implementierungspläne in den jeweiligen Komponenten-Repositories auf und referenzieren Sie den Store
   als schreibgeschützten Upstream-Kontext.

Planen Sie zunächst den gemeinsamen Vertrag im Store:

```bash
openspec new change add-checkout-promo --store team-plans
openspec status --change add-checkout-promo --store team-plans
```

Der Vorschlag und die Spezifikationen sollten das Verhalten an der Schnittstelle zwischen
den Komponenten beschreiben – beispielsweise die vom Service zurückgegebenen Werbeaktionsfelder
und den Umgang des Frontends mit einem nicht berechtigten Checkout. Überprüfen Sie diese Änderung
im Store-Repository wie jeden anderen Branch und Pull Request.

### Welchen Kontext sieht die Planung?

Durch die Auswahl eines Stores ändert sich der OpenSpec-Stamm. Dabei werden nicht automatisch
alle Code-Repositories erkannt oder gelesen, die diesen Store verwenden. Store-Anweisungen sehen die Artefakte
und den konfigurierten Kontext im Store. Der Code der Komponenten ist nur sichtbar, wenn diese
Ordner ebenfalls im Agent oder Editor verfügbar sind und der Agent sie liest.

Mit einem Workset können Sie den Planungs-Store und beide Code-Repositories
bequem gemeinsam öffnen:

```bash
openspec workset create checkout-promo \
  --member ~/openspec/team-plans \
  --member ~/src/checkout-api \
  --member ~/src/checkout-web \
  --tool code
openspec workset open checkout-promo
```

Dadurch werden die Ordner in einem IDE-Arbeitsbereich sichtbar. Es kopiert keinen
Quellkontext in den Store, wählt keine betroffenen Repositories aus und erteilt einem Agent
keine Berechtigung, sie zu bearbeiten. Halten Sie dauerhafte, komponentenübergreifende Fakten in den gemeinsamen Spezifikationen fest.
Verlassen Sie sich nicht darauf, dass sich ein Planungsagent zufällig gelesenen Quellcode merkt.

### Wie beginnt die Implementierung in den einzelnen Repositories?

Wenn weder ein ausdrückliches `--store` noch ein näherer Stamm `openspec/` greift, leitet ein
Verweis `store: team-plans` Befehle an diesen Store weiter. Er teilt eine einzelne Aufgabenliste im Store
nicht anhand des Verzeichnisses auf, aus dem `apply` aufgerufen wurde. OpenSpec leitet derzeit
keine Aufgaben an einzelne Repositories weiter.

Wenn jede Komponente einen unabhängig abgegrenzten Apply-/Review-Zyklus benötigt, geben Sie ihr
einen lokalen OpenSpec-Stamm und referenzieren Sie den zentralen Store, statt mit einem Zeiger auf ihn umzuleiten:

```yaml
# checkout-api/openspec/config.yaml (and likewise in checkout-web)
schema: spec-driven
references:
  - team-plans
```

Nachdem der gemeinsame Vertrag freigegeben und in den Hauptspezifikationen des Stores verfügbar ist,
erstellen Sie eine kleine lokale Änderung für den jeweiligen Teil der Komponente:

```bash
cd ~/src/checkout-api
openspec new change implement-checkout-promo-api

cd ~/src/checkout-web
openspec new change implement-checkout-promo-ui
```

Der Referenzindex in den Anweisungen jedes Repositorys enthält eine Zusammenfassung der
Store-Spezifikation und den genauen Abrufbefehl `openspec show ... --store team-plans`. Jeder
lokale Vorschlag verweist auf diesen gemeinsamen Vertrag, und seine Aufgaben beschreiben nur die Arbeit
in der jeweiligen Komponente. Führen Sie `/opsx:apply` anschließend in jedem Repository separat aus. Die Auflösung des Stamms
stellt sicher, dass Artefakte und Implementierungsänderungen auf das jeweilige Repository beschränkt bleiben.
Die Änderungen am Service und am Frontend können nun unabhängig voneinander getestet, überprüft, zusammengeführt und
archiviert werden.

Wenn die Implementierung beginnen muss, während die gemeinsame Store-Änderung noch aktiv ist,
rufen Sie sie ausdrücklich mit
`openspec show add-checkout-promo --store team-plans` ab. Referenzindizes listen
kanonische Store-Spezifikationen, keine aktiven Store-Änderungen. Verknüpfen Sie den Store-Branch und
die Komponenten-Branches in ihren Pull-Request-Beschreibungen, damit prüfende Personen
sehen können, welcher Vertragsversion die jeweilige Implementierung folgt.

## Beispiel: Anforderungen über Teamgrenzen hinweg

Ein Plattformteam besitzt die Anforderungen. Produktteams entwickeln in ihren eigenen
Repositories und mit ihren eigenen Entwürfen darauf aufbauend. Eine Referenz beschreibt diese
Beziehung, ohne die Arbeit eines Teams zu verschieben.

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**Das Produktteam deklariert die verwendeten Grundlagen** in seinem Repository unter
`openspec/config.yaml`:

```yaml
references:
  - platform-reqs
```

Referenzen bieten schreibgeschützten Kontext. Das Repository behält seinen eigenen Stamm `openspec/`;
die Arbeit bleibt dort. Es ändert sich Folgendes: `openspec instructions` enthält in diesem Repository nun
einen Index der Spezifikationen des referenzierten Stores – jeweils mit einer einzeiligen
Zusammenfassung und dem genauen Abrufbefehl (`openspec show <spec-id> --type spec
--store platform-reqs`). Ein Agent, der in `api-server` arbeitet, kann die
Upstream-Zahlungsanforderungen finden, darauf verweisen und den detaillierten Entwurf im
eigenen Repository erstellen – ohne dass jemand den Kontext einfügen muss.

Eine Referenz kann die Quelle des Klons enthalten. So erhalten Teammitglieder, die den
Store noch nicht haben, eine vollständige Lösung statt einer Sackgasse:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Wenn Sie Plan und Code gemeinsam öffnen möchten, erstellen Sie ein Workset.** Es ist
persönlich und ausdrücklich festgelegt: Jede Person wählt die Ordner aus, mit denen sie
auf dem eigenen Rechner tatsächlich arbeitet. Keiner dieser lokalen Checkout-Pfade wird
in das gemeinsam genutzte Planungs-Repository committet.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Zwei Fragen, die Sie jederzeit stellen können

**„Ist meine Einrichtung in Ordnung?“** – `openspec doctor` prüft schreibgeschützt den aktuellen Stamm und
die referenzierten Stores. Für jeden Befund wird ein kopierbarer Lösungsvorschlag ausgegeben:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**„Womit arbeite ich?“** – `openspec context` stellt den Arbeitsbestand anhand
der OpenSpec-Deklarationen zusammen: dem Stamm und den darin referenzierten Stores.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Beide Befehle unterstützen `--json` für Agents. `openspec context --code-workspace
<path>` schreibt zusätzlich eine VS-Code-Arbeitsbereichsdatei mit dem gesamten
Bestand – dies ist der einzige Schreibvorgang dieses Befehls.

## Worksets: Gemeinsam verwendete Ordner erneut öffnen

Unabhängig von allem bisher Beschriebenen öffnen die meisten Personen in jeder Sitzung dieselben Ordner
gemeinsam – das Planungs-Repository und zwei oder drei Code-Repositories.
Ein **Workset** ist eine persönliche, benannte Ansicht dieser Ordner, die Sie mit einem
Befehl in Ihrem bevorzugten Tool erneut öffnen können.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` startet anschließend das gespeicherte Tool: Editoren
(VS Code, Cursor) öffnen ein Fenster mit allen Einträgen und kehren dann zurück. Der erste
Eintrag ist der primäre. Mit `--tool <id>` können Sie das Tool jederzeit überschreiben.

Worksets sind ausdrücklich *kein* gemeinsam genutzter Zustand. Sie liegen auf Ihrem Rechner,
werden niemals committet und enthalten keine Angaben zur Arbeit – sie halten nur fest,
welche Ordner Sie gerne gemeinsam geöffnet haben. Wenn Sie ein Workset entfernen, bleiben dessen
Ordner unberührt. Neue Tools werden über die Konfiguration hinzugefügt, nicht über Code:
Alles, was sich über eine Arbeitsbereichsdatei oder ordnerspezifische Attach-Flags starten lässt,
kann unter dem Schlüssel `openers` in der globalen Konfiguration ergänzt werden (`openspec config edit`).

## Wie Befehle ihren Ausführungsort bestimmen

Jeder normale Befehl löst seinen Stamm auf dieselbe Weise und in folgender Reihenfolge auf:

```
1. --store <id>          you said so explicitly        → that store
2. nearest openspec/     a real planning root here     → this repo
   (walking up from cwd)
3. store: pointer        config.yaml declares a store  → that store
4. defaultStore          global config sets a machine  → that store
                         default
5. none of the above     stores registered on this     → error with a
                         machine?                        selection hint
                         no stores registered?         → the current
                                                          directory
                                                          (classic behavior)
```

Die Zeile `Using OpenSpec root:` (und der Block `root` in der Ausgabe von `--json`)
zeigt an, welcher Fall zutrifft.

## Bekannte Einschränkungen

- **Beta-Version.** Alle Inhalte dieser Seite können sich zwischen Versionen ändern –
  Namen, Flags, Dateiformate und JSON-Schlüssel.
- **Ein Checkout pro Store-ID und Rechner.** Wenn Sie einen zweiten Checkout
  unter derselben ID registrieren, schlägt dies fehl und weist darauf hin, zuerst `store unregister` auszuführen.
- **Absichtlich niemals synchronisieren.** OpenSpec klont, pullt oder pusht niemals.
  Ein veralteter Checkout zeigt alte Spezifikationen, bis *Sie* sie abrufen; Referenzen werden
  fortlaufend anhand der vorhandenen Dateien indiziert.
- **Leere Planungsordner können fehlen.** In einem neuen Store sind `openspec/changes/`,
  `openspec/specs/` oder `openspec/changes/archive/` möglicherweise noch nicht in Git vorhanden.
  Das ist während der Beta zulässig. Die Ordner werden angelegt, sobald normale
  Befehle Dateien darin erstellen.
- **Repository-Verweise bleiben Verweise.** Ein Repository, das nur eine Konfiguration mit
  `store: <id>` in `openspec/config.yaml` enthält, gilt als ausgelagerte
  Planung und nicht als zu registrierender Store-Checkout. Entfernen Sie zuerst die Zeile `store:`,
  wenn Sie das Repository absichtlich in einen lokalen Store-Stamm umwandeln möchten.
- **Einige Befehle bleiben an ihrem Ort.** `templates` und die
  veralteten Substantivformen (`openspec change show` usw.) wirken nur im aktuellen
  Verzeichnis – ohne `--store`. `schemas` verwendet die kanonische Reihenfolge der Stammdatenauswahl
  und akzeptiert `--store <id>`, wobei die erfolgreiche JSON-Arraystruktur
  unverändert bleibt.
- **Der Zustand pro Rechner bleibt lokal.** Store-Registrierung und Worksets
  sind lokale Einstellungen. Angaben zum Verzeichnislayout Ihres Rechners werden
  niemals in die gemeinsam genutzte Planung committet.
- **Zwei Startarten für Worksets.** Ein Tool, das sich nicht mit einer
  Arbeitsbereichsdatei oder ordnerspezifischen Attach-Flags starten lässt, kann nicht als Opener hinzugefügt werden.
- **Die Groß-/Kleinschreibung der Agent-JSON-Schlüssel ist uneinheitlich** (Schlüssel der Store-Familie verwenden
  `snake_case`, der Workflow-Familie `camelCase`). Dies ist im
  [Agentvertrag](/de-DE/agent-contract/) dokumentiert; eine Vereinheitlichung ist auf eine
  versionierte Veröffentlichung verschoben.

## Wo die einzelnen Dinge liegen

| Inhalt | Speicherort | Gemeinsam genutzt? |
|---|---|---|
| Planung eines Stores | `<store>/openspec/` (Spezifikationen, Änderungen) | Ja – committen und pushen |
| Identität eines Stores | `<store>/.openspec-store/store.yaml` | Ja – wird mit dem Store committet |
| Store-Registrierung | `<data dir>/openspec/stores/registry.yaml` | Nein – nur auf diesem Rechner |
| Worksets | `<data dir>/openspec/worksets/` | Nein – nur auf diesem Rechner |

`<data dir>` lautet unter macOS und Linux `~/.local/share/openspec` (oder
`$XDG_DATA_HOME/openspec`, falls gesetzt) und unter Windows `%LOCALAPPDATA%\openspec`.

## Referenz

Die genauen Flags und JSON-Strukturen aller Befehle auf dieser Seite finden Sie in der
[CLI-Referenz](/de-DE/cli/) (Stores, Doctor, Arbeitskontext, persönliche
Worksets) und im [Agentvertrag](/de-DE/agent-contract/).
