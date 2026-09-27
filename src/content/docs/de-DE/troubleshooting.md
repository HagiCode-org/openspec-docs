---
title: "Fehlerbehebung"
---

Konkrete Lösungen für konkrete Probleme. Jeder Eintrag benennt ein Symptom, erklärt in einem Satz die wahrscheinliche Ursache und bietet eine Lösung. Falls Ihr Problem hier nicht aufgeführt ist, hilft vielleicht die [FAQ](/de-DE/faq/); im [Discord](https://discord.gg/YctCnvvshC) erhalten Sie auf jeden Fall Unterstützung.

## Installation und Einrichtung

### `openspec: command not found`

Die CLI ist nicht installiert oder Ihre Shell kann sie nicht finden. Installieren Sie sie global und prüfen Sie die Installation:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Wenn die Installation erfolgreich war, der Befehl aber weiterhin nicht gefunden wird, fehlt wahrscheinlich das globale npm-Binärverzeichnis in Ihrem `PATH`. Führen Sie `npm prefix -g` aus, um den Speicherort globaler Pakete herauszufinden: Unter macOS und Linux liegen die ausführbaren Dateien im Unterverzeichnis `bin/`, unter Windows direkt in diesem Verzeichnis. Stellen Sie sicher, dass der Pfad in `PATH` enthalten ist. (`npm bin -g` wurde in npm 9 entfernt.)

Wenn Sie die [KI-gestützte Installation](/de-DE/installation/#mit-ihrem-ki-assistenten-installieren) verwendet haben, ist dies der erwartete Punkt für die Übergabe: Die Eingabe weist Ihren Assistenten an, Ihnen die `PATH`-Änderung zu zeigen, statt Ihre Shell-Startdateien selbst zu bearbeiten.

### „Node.js 20.19.0 oder höher erforderlich“

OpenSpec benötigt Node.js ab Version 20.19.0. Prüfen Sie Ihre Version und aktualisieren Sie Node.js bei Bedarf:

```bash
node --version
```

Beachten Sie bei einer Installation von OpenSpec mit Bun, dass OpenSpec weiterhin mit Node.js *ausgeführt* wird. Node.js 20.19.0 oder höher muss daher unabhängig davon in Ihrem `PATH` verfügbar sein. Siehe [Installation](/de-DE/installation/).

### `openspec init` hat mein KI-Tool nicht eingerichtet

Bei der Initialisierung werden Sie gefragt, welche Tools eingerichtet werden sollen. Wenn Sie Ihr Tool übersprungen haben oder ein weiteres hinzufügen möchten, führen Sie den Befehl erneut aus oder verwenden Sie die nicht-interaktive Form:

```bash
openspec init --tools claude,cursor
```

Die vollständige Liste der Tool-IDs finden Sie unter [Unterstützte Tools](/de-DE/supported-tools/). Verwenden Sie `--tools all` für alle Tools oder `--tools none`, wenn Sie die Einrichtung der Tools überspringen möchten.

## Befehle werden nicht angezeigt

Wenn `/opsx:propose` (oder der entsprechende Befehl Ihres Tools) nicht angezeigt wird oder nichts bewirkt, gehen Sie diese Liste der Reihe nach durch. Die schnellsten Prüfungen stehen zuerst.

1. **Möglicherweise sind Sie am falschen Ort.** Slash-Befehle gehören in den Chat Ihres KI-Assistenten, nicht ins Terminal. Wenn Sie `/opsx:propose` in Ihre Shell eingegeben haben, liegt das Problem hier. Siehe [So funktionieren Befehle](/de-DE/how-commands-work/).

2. **Dateien neu generieren.** Führen Sie im Stammverzeichnis Ihres Projekts Folgendes aus:

   ```bash
   openspec update
   ```

   Dadurch werden die Skill- und Befehlsdateien für jedes von Ihnen konfigurierte Tool neu geschrieben.

   Anweisungsdateien stammen aus der *installierten* CLI. Eine veraltete CLI meldet daher, alles sei aktuell, ohne jemals die neueren Workflows zu schreiben. `openspec update` prüft nun, ob dies der Fall ist, und bietet ein Upgrade an. Nehmen Sie das Angebot an, falls es angezeigt wird.

3. **Starten Sie Ihren Assistenten neu.** Die meisten Tools suchen beim Start nach Skills und Befehlen. Ein neues Fenster reicht häufig aus.

4. **Prüfen Sie, ob die Dateien vorhanden sind.** Kontrollieren Sie bei Claude Code, ob `.claude/skills/` Ordner `openspec-*` enthält. Andere Tools verwenden eigene Verzeichnisse, die alle unter [Unterstützte Tools](/de-DE/supported-tools/) aufgeführt sind.

5. **Prüfen Sie, ob Sie dieses Projekt initialisiert haben.** Skills werden für jedes Projekt einzeln geschrieben. Wenn Sie ein Repository geklont oder das Verzeichnis gewechselt haben, führen Sie dort `openspec init` (oder `openspec update`) aus.

6. **Prüfen Sie, ob Ihr Tool Befehlsdateien unterstützt.** Für Codex, CodeArts, ForgeCode, Hermes, Kimi Code, Mistral Vibe, Zed Agent und das gemeinsame Ziel `.agents` werden keine `opsx-*`-Befehlsdateien generiert. Diese Tools verwenden Skills, daher wird `/opsx` dort nie automatisch vervollständigt. Geben Sie in Codex `$openspec-propose`, in Kimi Code `/skill:openspec-propose` und in den übrigen Tools `/openspec-propose` ein. Das gemeinsame Ziel `.agents` ist herstellerneutral; `/openspec-propose` ist daher die übliche, aber nicht garantierte Form. Wenn Ihr Assistent darauf nicht reagiert, sehen Sie in seiner eigenen Dokumentation nach, wie Skills aufgerufen werden. Für Amazon Q werden zwar Befehlsdateien erstellt, sie werden jedoch in die Prompt-Bibliothek statt in das Slash-Menü geladen. Geben Sie dort `@opsx-propose` statt `/opsx` ein. Die Syntax für jedes Tool ist unter [Aufruf](/de-DE/supported-tools/#befehle-aufrufen) aufgeführt.

## Mit Änderungen arbeiten

### „Änderung nicht gefunden“

Der Befehl konnte nicht feststellen, welche Änderung Sie meinen. Geben Sie ihren Namen ausdrücklich an oder prüfen Sie, was vorhanden ist:

```bash
openspec list                    # see active changes
/opsx:apply add-dark-mode        # name the change in chat
```

Stellen Sie außerdem sicher, dass Sie sich im richtigen Projektverzeichnis befinden.

### „Keine Artefakte bereit“

Jedes Artefakt ist entweder bereits erstellt oder wartet aufgrund einer Abhängigkeit. Prüfen Sie, was den Ablauf blockiert:

```bash
openspec status --change <name>
```

Erstellen Sie anschließend zuerst die fehlende Abhängigkeit. Beachten Sie die Reihenfolge: Der Vorschlag ermöglicht Spezifikationen und Entwurf; Spezifikationen und Entwurf ermöglichen gemeinsam die Aufgaben.

### `openspec validate` meldet Warnungen oder Fehler

Die Validierung überprüft Ihre Spezifikationen und Änderungen auf strukturelle Probleme. Lesen Sie die Meldung: Sie nennt die Datei und das Problem.

```bash
openspec validate <name>           # validate one item
openspec validate --all            # validate everything
openspec validate --all --strict   # stricter checks, good for CI
openspec validate --archived       # fail if archived changes have unchecked tasks
```

Häufige Ursachen sind ein fehlender Pflichtabschnitt (etwa eine Spezifikation ohne Szenarien) oder eine fehlerhafte Delta-Überschrift. Korrigieren Sie die Datei und führen Sie den Befehl erneut aus. Das Ausgabeformat ist in der [CLI-Referenz](/de-DE/cli/#openspec-validate) dokumentiert.

Eine Meldung verdient einen eigenen Hinweis:

```text
MODIFIED "<requirement>" omits scenario(s) the current spec still has: "<scenario>"
```

Eine Anforderung vom Typ `MODIFIED` ersetzt den gesamten Anforderungsblock. Deshalb muss sie jedes Szenario enthalten, das nach der Änderung erhalten bleibt, nicht nur die von Ihnen bearbeiteten. Kopieren Sie die genannten Szenarien aus `openspec/specs/<capability-path>/spec.md` zurück in das Delta und behalten Sie dabei alle Domänenordner im Pfad bei. Diese Meldung tritt häufig bei einer älteren Änderung auf, nachdem die Änderung einer anderen Person ein Szenario zur selben Anforderung hinzugefügt hat. Das Archivieren würde diese Änderung ohnehin ablehnen; die Validierung weist nun bereits vor der Implementierung darauf hin.

### Die KI hat unvollständige oder falsche Artefakte erstellt

Der KI fehlte Kontext. Folgende Maßnahmen können helfen:

- Ergänzen Sie den Projektkontext in `openspec/config.yaml`, damit Technologie-Stack und Konventionen bei jeder Anfrage berücksichtigt werden. Siehe [Anpassung](/de-DE/customization/#projektkonfiguration).
- Fügen Sie `rules:` für einzelne Artefakte hinzu, wenn Hinweise nur für beispielsweise Spezifikationen gelten sollen.
- Beschreiben Sie die Änderung beim Vorschlagen ausführlicher.
- Verwenden Sie den erweiterten Befehl `/opsx:continue`, um jeweils ein Artefakt zu erstellen und zu prüfen, statt `/opsx:ff` alle auf einmal erstellen zu lassen.

### Das Archivieren wird nicht abgeschlossen oder warnt vor offenen Aufgaben

Das Archivieren wird durch offene Aufgaben nicht *blockiert*, warnt aber davor, denn normalerweise bedeutet Archivieren, dass die Arbeit abgeschlossen ist. Wenn Aufgaben absichtlich offen bleiben (weil Sie eine unvollständige Änderung ablegen), fahren Sie fort. Andernfalls erledigen Sie zuerst die Aufgaben. Wenn Ihre Delta-Spezifikationen noch nicht mit den Hauptspezifikationen synchronisiert wurden, bietet das Archivieren auch diese Synchronisierung an. Stimmen Sie zu, sofern kein Grund dagegenspricht.

### „User force closed the prompt with 0 null“

`openspec archive` wurde an einer Stelle ausgeführt, an der niemand eine Frage beantworten kann – etwa von einem KI-Agenten aus einem Tool, einem CI-Job oder einer Shell mit geschlossenem stdin. Beim Archivieren können bis zu drei Bestätigungen abgefragt werden. Früher schlug eine unbeantwortbare Frage mit dieser Rohmeldung fehl.

Übergeben Sie `--yes`, um die Bestätigungen vorab zu beantworten:

```bash
openspec archive <change-name> --yes
```

Behalten Sie alle Flags bei, die Sie bereits übergeben haben: `--skip-specs` und `--no-validate` ändern das Verhalten des Archivierungsbefehls. Ein erneuter Aufruf nur mit `--yes` ist also nicht derselbe Befehl. Aktuelle Versionen nennen das benötigte Flag und geben eine kopierbare Zeile `Fix:` aus. Wenn Sie aus einer Liste auswählen wollten, geben Sie den Namen der Änderung ausdrücklich an: Auch der Auswahlbildschirm benötigt eine Antwort.

Wenn Sie die Ausgabe des Archivierungsbefehls stattdessen in eine Datei umgeleitet oder von einem Tool erfasst und *eine Antwort übergeben haben* (`printf 'y\n' | openspec archive …`), schrieben ältere Versionen beim Anzeigen der Eingabe Escape-Sequenzen des Terminals in die Ausgabe. In manchen Umgebungen konnte die Datei dadurch stark anwachsen. Aktuelle Versionen lesen Bestätigungsaufforderungen als einfachen Text, wenn stdout kein Terminal ist. Bei `openspec archive` ohne Argumente (das andernfalls eine interaktive Liste der Änderungen anzeigen würde) müssen Sie den Namen der Änderung angeben, statt ein Menü in die Erfassung schreiben zu lassen. In beiden Fällen bleiben umgeleitete und agentengesteuerte Aufrufe sauber. Mit `--yes` (und einem Änderungsnamen) überspringen Sie die Aufforderungen vollständig.

## Konfiguration

### Meine `config.yaml` wird nicht angewendet

Es gibt drei häufige Ursachen:

1. **Falscher Dateiname.** Die Datei muss `openspec/config.yaml` heißen, nicht `.yml`.
2. **Ungültiges YAML.** Prüfen Sie die Datei mit einem YAML-Validator. Die CLI meldet Syntaxfehler ebenfalls mit Zeilennummern.
3. **Sie haben einen Neustart erwartet.** Ein Neustart ist nicht erforderlich. Änderungen an der Konfiguration werden sofort wirksam.

### „Unknown artifact ID in rules: X“

Ein Schlüssel unter `rules:` stimmt mit keinem Artefakt in Ihrem Schema überein. Im Standardschema `spec-driven` sind `proposal`, `specs`, `design` und `tasks` gültige IDs. So zeigen Sie die IDs eines beliebigen Schemas an:

```bash
openspec schemas --json
```

### „Context too large“

Das Feld `context:` ist absichtlich auf 50 KB begrenzt, da sein Inhalt in jede Anfrage eingefügt wird. Fassen Sie ihn zusammen oder verlinken Sie längere Dokumente, statt sie einzufügen. Ein knapper Kontext führt außerdem zu besseren und schnelleren Ergebnissen.

### „Schema not found“

Das angegebene Schema existiert nicht. Lassen Sie verfügbare Schemas auflisten und prüfen Sie die Schreibweise:

```bash
openspec schemas                    # list available schemas
openspec schema which <name>        # see where a schema resolves from
openspec schema init <name>         # create a custom one
```

Siehe [Anpassung](/de-DE/customization/#benutzerdefinierte-schemas).

## Vom bisherigen Workflow migrieren

### „Legacy files detected in non-interactive mode“

Sie arbeiten in CI oder einer nicht-interaktiven Shell. OpenSpec hat alte Dateien gefunden, die aufgeräumt werden sollten, kann Sie aber nicht um Zustimmung bitten. Bestätigen Sie die Bereinigung automatisch:

```bash
openspec init --force
```

Bei Codex kann OpenSpec alte verwaltete Prompt-Dateien unter `$CODEX_HOME/prompts` oder `~/.codex/prompts` erkennen. Diese Bereinigung beschränkt sich auf die zugelassenen alten Codex-Prompt-Dateinamen von OpenSpec. Ein nicht-interaktives `openspec init` entfernt nur Dateien, für die die entsprechenden Ersatz-Skills unter `.agents/skills/openspec-*` vorhanden sind. Ein nicht-interaktives `openspec update` lässt alle alten Dateien unangetastet, sofern Sie nicht `--force` übergeben.

### Nach der Migration wurden keine Befehle angezeigt

Starten Sie Ihre IDE neu. Skills werden beim Start erkannt. Wenn sie danach weiterhin nicht angezeigt werden, führen Sie `openspec update` aus und prüfen Sie die Dateipfade unter [Unterstützte Tools](/de-DE/supported-tools/).

### Meine alte `project.md` wurde nicht migriert

Das ist beabsichtigt. OpenSpec löscht `project.md` niemals automatisch, da die Datei von Ihnen verfassten Kontext enthalten kann. Übertragen Sie die nützlichen Teile in den Abschnitt `context:` der `config.yaml` und löschen Sie die Datei anschließend selbst. Im [Migrationsleitfaden](/de-DE/migration-guide/#projectmd-zu-configyaml-migrieren) wird dies erläutert – einschließlich einer Eingabe, mit der Sie Ihre KI mit der Zusammenfassung beauftragen können.

## Kommen Sie weiterhin nicht weiter?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub-Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Im Terminal:** `openspec feedback "was ist schiefgelaufen"` öffnet für Sie ein Issue.

Geben Sie bei der Meldung eines Problems Ihre OpenSpec-Version (`openspec --version`), Ihre Node-Version (`node --version`), Ihr KI-Tool und den genauen Befehl samt Ausgabe an. So erhalten Sie schneller Hilfe.
