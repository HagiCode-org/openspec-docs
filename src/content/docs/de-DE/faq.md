---
title: "Häufig gestellte Fragen"
---

Kurze Antworten auf die häufigsten Fragen. Wenn bei Ihnen etwas nicht funktioniert, ist die Seite [Fehlerbehebung](/de-DE/troubleshooting/) besser geeignet. Definitionen finden Sie im [Glossar](/de-DE/glossary/).

## Grundlagen

### Was ist OpenSpec, in einem Satz?

Eine schlanke Ebene, die Sie und Ihren KI-Codierassistenten dazu bringt, sich schriftlich darauf zu einigen, was gebaut werden soll, bevor Code geschrieben wird.

### Warum sollte ich das wollen?

Weil KI-Assistenten auch dann selbstbewusst auftreten, wenn sie falschliegen. Wenn die Anforderungen nur in einem Chatverlauf stehen, füllt die KI Lücken mit Vermutungen, und Sie erfahren erst nach dem Schreiben des Codes davon. OpenSpec verlagert die Vereinbarung nach vorn, an einen Punkt, an dem Fehler günstig zu beheben sind. Die vollständige Begründung finden Sie unter [Kernkonzepte im Überblick](/de-DE/overview/).

### Muss ich OpenSpec für alles verwenden?

Nein. Verwenden Sie es dort, wo eine Abstimmung wichtig ist – und das ist bei den meisten nicht-trivialen Aufgaben der Fall. Für die Korrektur eines einzelnen Tippfehlers lohnt sich der Aufwand wahrscheinlich nicht. Das ist in Ordnung.

### Kann ich OpenSpec in einer großen bestehenden Codebasis verwenden oder nur in neuen Projekten?

Bestehende Codebasen sind der Hauptanwendungsfall. OpenSpec ist auf Brownfield-Projekte ausgerichtet: Sie müssen nicht zuerst Ihre gesamte Anwendung dokumentieren. Sie verfassen Spezifikationen nur für die Bereiche, die von der jeweiligen Änderung betroffen sind. So vervollständigen sich die Spezifikationen im Laufe der Zeit rund um Ihre tatsächliche Arbeit. Ein eigener Leitfaden erklärt es: [OpenSpec in einem bestehenden Projekt verwenden](/de-DE/existing-projects/).

### Ist OpenSpec an ein bestimmtes KI-Tool gebunden?

Nein. OpenSpec funktioniert mit mehr als 30 Assistenten, darunter Claude Code, Cursor, Devin Desktop, GitHub Copilot, Gemini CLI, Codex und weitere. Die vollständige Liste und tool-spezifische Details finden Sie unter [Unterstützte Tools](/de-DE/supported-tools/).

## Befehle ausführen

### Wo gebe ich `/opsx:propose` ein?

Im Chat Ihres KI-Assistenten, nicht im Terminal. Das ist die häufigste Ursache für Verwirrung und wird deshalb auf einer eigenen Seite erklärt: [So funktionieren Befehle](/de-DE/how-commands-work/). Kurz gesagt: `openspec ...` wird im Terminal ausgeführt, `/opsx:...` im Chat.

### Wie „starte“ ich den interaktiven Modus?

Es gibt keinen separaten Modus, den Sie starten müssten. Öffnen Sie Ihren KI-Assistenten wie gewohnt und geben Sie in dessen Chat einen Slash-Befehl ein. Über den Slash-Befehl „steigen Sie in OpenSpec ein“. (Die tatsächlich interaktive Terminalfunktion ist `openspec view`, ein Dashboard zum Durchsuchen von Spezifikationen und Änderungen.) Die vollständige Erklärung finden Sie unter [So funktionieren Befehle](/de-DE/how-commands-work/).

### Ich habe einen Slash-Befehl eingegeben, aber nichts ist passiert. Warum?

Wahrscheinlich haben Sie den Befehl im Terminal statt im KI-Chat eingegeben, Ihr Tool erkennt diese Schreibweise nicht oder die Befehle sind noch nicht installiert. Wenn die Dateien fehlen – oder Sie das Tool noch nicht eingerichtet haben –, führen Sie `openspec init` aus. `openspec update` aktualisiert nur bereits vorhandene Dateien. Starten Sie danach Ihren Assistenten neu und verwenden Sie die unter „Erste Schritte“ ausgegebene Form. Siehe [Aufruf](/de-DE/supported-tools/#befehle-aufrufen). Die vollständige Checkliste finden Sie unter [Fehlerbehebung](/de-DE/troubleshooting/#befehle-werden-nicht-angezeigt).

### Warum lautet die Syntax bei einem Tool `/opsx:propose` und bei einem anderen `/opsx-propose`?

Jedes KI-Tool stellt benutzerdefinierte Befehle etwas anders bereit, und OpenSpec verwendet die Schreibweise, die dem Format der vom Tool geladenen Datei entspricht. Eine Befehlsdatei namens `opsx-propose.md` wird mit `/opsx-propose` aufgerufen; eine Datei unter `commands/opsx/` mit `/opsx:propose`. Tools, die Skills statt Befehlen verwenden, nutzen den Skill-Namen: Codex benötigt `$openspec-propose`, Kimi Code `/skill:openspec-propose`. Die Zeile „Erste Schritte“ von `openspec init` gibt bereits die richtige Form für die von Ihnen gewählten Tools aus. Die vollständige Tabelle finden Sie unter [Aufruf](/de-DE/supported-tools/#befehle-aufrufen).

### Was ist der Unterschied zwischen einem Skill und einem Befehl?

Beides sind Dateien, die OpenSpec schreibt, damit Ihr Assistent den Workflow ausführen kann. Skills (`.../skills/openspec-*/SKILL.md`) sind der neuere toolübergreifende Standard; Befehle (`.../commands/opsx-*`) sind die älteren Slash-Dateien für einzelne Tools. Sie müssen sich nicht entscheiden. Geben Sie einfach den Slash-Befehl ein; OpenSpec installiert das Format, das Ihr Tool verwendet.

## Der Workflow

### Wo sollte ich anfangen, wenn ich nicht sicher bin, was ich bauen soll?

Mit `/opsx:explore`. Der Befehl ist ein Denkpartner ohne Verpflichtungen, der Ihre Codebasis liest, Optionen darlegt und ein vages Problem in einen konkreten Plan umwandelt – bevor Code geschrieben wird. Er ist im Standardprofil enthalten und somit immer verfügbar. Sobald der Plan klar ist, übergibt der Befehl an `/opsx:propose`. Das ist die beste Gewohnheit, die Sie sich aneignen können: Sie hält eine übereifrige KI davon ab, selbstbewusst das Falsche zu bauen. Siehe [Zuerst erkunden](/de-DE/explore/).

### Was ist der einfachste mögliche Ablauf?

```text
/opsx:explore (optional)   then   /opsx:propose <what you want>   then   /opsx:apply   then   /opsx:archive
```

Erkunden Sie die Idee, schlagen Sie den Plan vor, setzen Sie ihn um und archivieren Sie ihn. Überspringen Sie „Explore“, wenn Sie bereits genau wissen, was Sie möchten.

### Was ist der Unterschied zwischen `/opsx:propose` und `/opsx:new`?

`/opsx:propose` ist der standardmäßige Befehl mit nur einem Schritt: Er erstellt die Änderung und entwirft alle Planungsartefakte auf einmal. `/opsx:new` gehört zum erweiterten Befehlssatz und legt nur die leere Änderung an. Die Artefakte erstellen Sie anschließend einzeln mit `/opsx:continue` (oder alle auf einmal mit `/opsx:ff`). Verwenden Sie „Propose“, sofern Sie nicht Schritt-für-Schritt-Steuerung wünschen. Siehe [Befehle](/de-DE/commands/).

### Was sind die Profile `core` und `expanded`?

Ein Profil legt fest, welche Slash-Befehle installiert werden. **Core** (Standard) umfasst `propose`, `explore`, `apply`, `update`, `sync` und `archive`. Der **erweiterte** Satz ergänzt für eine feinere Steuerung `new`, `continue`, `ff`, `verify`, `bulk-archive` und `onboard`. Wechseln Sie das Profil mit `openspec config profile` und wenden Sie es anschließend mit `openspec update` an.

### Muss ich `/opsx:sync` ausführen?

Normalerweise nicht. „Sync“ führt die Delta-Spezifikationen einer Änderung mit Ihren Hauptspezifikationen zusammen, und `/opsx:archive` bietet Ihnen das an. Führen Sie „Sync“ nur dann manuell aus, wenn Sie die Spezifikationen vor dem Archivieren zusammenführen möchten, beispielsweise bei einer lang laufenden Änderung. Siehe [Befehle](/de-DE/commands/#opsxsync).

### Wie bearbeite ich einen Vorschlag, eine Spezifikation oder eine Aufgabe nach dem Start?

Bearbeiten Sie einfach die Datei. Jedes Artefakt unter `openspec/changes/<name>/` besteht aus einfachem Markdown; es gibt keine festgeschriebene Phase und keinen speziellen Bearbeitungsmodus. Nehmen Sie die Änderung selbst vor oder bitten Sie Ihre KI um eine Überarbeitung („Ändere den Entwurf so, dass er eine Warteschlange verwendet“) und fahren Sie fort. Die KI arbeitet immer mit dem aktuellen Dateiinhalt. Vollständiger Leitfaden: [Änderungen bearbeiten und iterieren](/de-DE/editing-changes/).

### Kann ich zum Plan zurückkehren und ihn ändern, nachdem ich mit der Implementierung begonnen habe?

Ja, jederzeit. Der Workflow ist flexibel; Überprüfung und Bearbeitung sind keine Phasen, von denen Sie ausgeschlossen werden können. Bearbeiten Sie das Artefakt und machen Sie weiter. Wenn Sie strukturiert prüfen möchten, ob der Code noch zum Plan passt, führen Sie `/opsx:verify` aus. Siehe [Änderungen bearbeiten und iterieren](/de-DE/editing-changes/#wie-kehre-ich-nach-der-implementierung-zur-überprüfung-zurück).

### Ich habe den Code von Hand bearbeitet. Wie gleiche ich ihn mit der Spezifikation ab?

Bringen Sie beides vor dem Archivieren wieder in Einklang, denn beim Archivieren werden Ihre Spezifikationen zur maßgeblichen Dokumentation. Ist der Code nun korrekt, aktualisieren Sie die Delta-Spezifikation so, dass sie dem Ausgelieferten entspricht. Ist die Spezifikation korrekt, entwickeln Sie weiter, bis der Code ihr entspricht. `/opsx:verify` macht Abweichungen sichtbar. Siehe [Änderungen bearbeiten und iterieren](/de-DE/editing-changes/#ich-habe-den-code-von-hand-bearbeitet-wie-gleiche-ich-ihn-mit-openspec-ab).

### Wann sollte ich eine bestehende Änderung aktualisieren und wann eine neue beginnen?

Aktualisieren Sie die Änderung, wenn dieselbe Arbeit verfeinert wird. Beginnen Sie neu, wenn sich die Absicht grundlegend geändert oder der Umfang sich in mehrere Arbeiten aufgeteilt hat. Ein Entscheidungsdiagramm und Beispiele finden Sie unter [Workflows](/de-DE/workflows/#wann-aktualisieren-und-wann-neu-beginnen).

### Was ist, wenn der Kontext meiner Sitzung aufgebraucht ist oder sich Anforderungen während der Implementierung ändern?

Hier zeigen Spezifikationen ihren Wert. Da der Plan in Dateien (und nicht nur im Chatverlauf) gespeichert ist, können Sie den Kontext leeren, eine neue KI-Sitzung starten und mit `/opsx:apply` fortfahren. Der Befehl liest die Artefakte und setzt bei der ersten nicht abgehakten Aufgabe fort. Ändern sich die Anforderungen, passen Sie die Artefakte an die neue Realität an und machen weiter. Ein übersichtliches Kontextfenster führt außerdem zu besseren Ergebnissen; leeren Sie es vor der Implementierung.

### Sollte ich den Ordner `openspec/` in Git committen?

Ja. Ihre Spezifikationen, aktiven Änderungen und das Archiv gehören zur Geschichte Ihres Projekts. Committen Sie sie wie jeden anderen Quellcode. Insbesondere das Archiv hält dauerhaft fest, warum Ihr System so funktioniert, wie es funktioniert.

## Spezifikationen und Änderungen

### Was gehört in eine Spezifikation und was in einen Entwurf?

Eine Spezifikation beschreibt beobachtbares Verhalten: Was das System tut, welche Eingaben und Ausgaben es hat und welche Fehlerbedingungen gelten. Ein Entwurf beschreibt, wie Sie es entwickeln werden: den technischen Ansatz, Architekturentscheidungen und Dateiänderungen. Wenn sich die Implementierung ändern könnte, ohne dass sich das äußerlich sichtbare Verhalten ändert, gehört sie in den Entwurf und nicht in die Spezifikation. Weitere Details finden Sie unter [Konzepte](/de-DE/concepts/#was-eine-spezifikation-ist--und-was-nicht).

### Was ist eine Delta-Spezifikation?

Eine Spezifikation, die mit den Abschnitten `ADDED`, `MODIFIED` und `REMOVED` nur die Änderungen beschreibt, statt die gesamte Spezifikation neu zu verfassen. So kann OpenSpec bestehende Systeme sauber weiterentwickeln. Siehe [Konzepte](/de-DE/concepts/#delta-spezifikationen).

### Wohin kommen archivierte Änderungen?

Nach `openspec/changes/archive/YYYY-MM-DD-<name>/`, wobei alle Änderungsartefakte erhalten bleiben. Die Änderung wird aus der Liste aktiver Änderungen entfernt. Wenn eine Änderung ausdrücklich `retire_capabilities: true` festlegt, kann sie außerdem die Hauptspezifikation einer Funktion löschen, sobald deren letzte Anforderung entfernt wird.

## Konfiguration und Anpassung

### Wie teile ich der KI meinen Technologie-Stack mit?

Tragen Sie ihn unter `context:` in `openspec/config.yaml` ein. Dieser Text wird in jede Planungsanfrage eingefügt, sodass die KI Ihren Technologie-Stack und Ihre Konventionen kennt. Siehe [Anpassung](/de-DE/customization/#projektkonfiguration).

### Kann ich Spezifikationen in einer anderen Sprache als Englisch erstellen?

Ja. Fügen Sie `context:` in Ihrer Konfiguration eine Sprachanweisung hinzu. Unter [Mehrsprachigkeit](/de-DE/multi-language/) finden Sie Beispiele für mehrere Sprachen zum Kopieren und Einfügen.

### Kann ich den Workflow selbst ändern?

Ja, mit benutzerdefinierten Schemas. Ein Schema legt fest, welche Artefakte vorhanden sind und wie sie voneinander abhängen. Erstellen Sie mit `openspec schema fork spec-driven my-workflow` einen Fork des Standardschemas und bearbeiten Sie ihn anschließend. Siehe [Anpassung](/de-DE/customization/#benutzerdefinierte-schemas).

## Modelle, Datenschutz und Upgrades

### Welches KI-Modell sollte ich verwenden?

OpenSpec funktioniert am besten mit Modellen, die über gute Schlussfolgerungsfähigkeiten verfügen. Die README empfiehlt Modelle wie Codex 5.5 und Opus 4.7 sowohl für die Planung als auch für die Implementierung. Halten Sie außerdem das Kontextfenster übersichtlich: Leeren Sie es für die besten Ergebnisse vor der Implementierung.

### Erfasst OpenSpec Daten?

OpenSpec erfasst anonyme Nutzungsstatistiken: nur Befehlsnamen und Version. Argumente, Pfade, Inhalte und persönliche Daten werden nicht erfasst. In CI ist die Erfassung automatisch deaktiviert. Sie können sich mit `export OPENSPEC_TELEMETRY=0` oder `export DO_NOT_TRACK=1` abmelden.

### Wie führe ich ein Upgrade durch?

In zwei Schritten: Aktualisieren Sie das Paket (`npm install -g @fission-ai/openspec@latest`) und führen Sie anschließend in jedem Projekt `openspec update` aus, um die generierten Skills und Befehle zu aktualisieren.

### Wie deinstalliere ich OpenSpec?

Es gibt keinen Deinstallationsbefehl, da OpenSpec lediglich aus einem globalen Paket und Dateien in Ihrem Projekt besteht. Entfernen Sie das Paket (`npm uninstall -g @fission-ai/openspec`) und löschen Sie optional das Verzeichnis `openspec/` sowie die generierten Tool-Dateien. Eine Schritt-für-Schritt-Anleitung, einschließlich der Dateien, die Sie problemlos behalten können, finden Sie unter [Installation: Deinstallieren](/de-DE/installation/#deinstallieren).

## Hilfe erhalten

### Wo kann ich Fragen stellen oder Bugs melden?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub-Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Im Terminal:** `openspec feedback "Ihre Nachricht"` öffnet ein GitHub-Issue für Sie.

### Diese Dokumentation ist falsch oder verwirrend. Was soll ich tun?

Teilen Sie es uns mit oder korrigieren Sie es selbst. Pull Requests für die Dokumentation sind willkommen und werden geschätzt. Eröffnen Sie ein Issue oder senden Sie einen Pull Request.
