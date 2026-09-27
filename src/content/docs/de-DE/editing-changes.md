---
title: "Änderungen bearbeiten und iterieren"
---

**Jedes Artefakt einer Änderung ist einfach eine Markdown-Datei, die Sie jederzeit bearbeiten können.** Es gibt keine festgeschriebene „Planungsphase“, keine Freigabehürde und keinen besonderen Bearbeitungsmodus. Sie möchten den Vorschlag ändern, nachdem Sie mit der Umsetzung begonnen haben? Öffnen und bearbeiten Sie `proposal.md`. Sie merken während der Implementierung, dass der Entwurf falsch ist? Korrigieren Sie `design.md` und machen Sie weiter. Das ist die ganze Antwort – und genau so ist es gedacht.

Diese Seite ist für den Moment gedacht, in dem Sie sich fragen: „Moment, kann ich zurückgehen und das ändern?“ Ja. Hier erfahren Sie, wie das in den häufigsten Fällen geht.

## Zwei Möglichkeiten, alles zu bearbeiten

Beide Möglichkeiten stehen Ihnen jederzeit offen:

1. **Bearbeiten Sie die Datei direkt.** Artefakte sind einfache Markdown-Dateien unter `openspec/changes/<name>/`. Öffnen Sie `proposal.md`, `design.md`, `tasks.md` oder eine Delta-Spezifikation unter `specs/` in Ihrem Editor und nehmen Sie die gewünschten Änderungen vor. Mehr ist nicht erforderlich.

2. **Bitten Sie Ihre KI um eine Überarbeitung.** Sagen Sie im Chat einfach, was Sie möchten: „Entferne im Vorschlag die Cache-Idee und füge einen Abschnitt zur Ratenbegrenzung hinzu“ oder „Der Entwurf sollte eine Warteschlange statt Polling verwenden.“ Die KI bearbeitet das Artefakt anhand des übrigen Inhalts der Änderung als Kontext.

Nutzen Sie die Methode, die gerade passt. Kleine Formulierungsänderung? Bearbeiten Sie die Datei. Größere Überlegungen? Lassen Sie die KI sie mit dem vollständigen Kontext überarbeiten.

## „Wie aktualisiere ich den Vorschlag (oder die Spezifikationen), nachdem ich angefangen habe?“

Aktualisieren Sie ihn einfach. Es bleibt dieselbe Änderung – nur verbessert.

Wenn Sie die erweiterten Befehle verwenden, ist der natürliche Ablauf: Bearbeiten Sie das Artefakt und führen Sie anschließend `/opsx:continue` aus, um beim neuen Stand weiterzumachen, oder `/opsx:apply`, um den aktualisierten Plan umzusetzen. Bei den standardmäßigen `core`-Befehlen bearbeiten Sie das Artefakt und führen `/opsx:apply` aus. Der Befehl liest die aktuellen Dateien und arbeitet daher auf Grundlage ihres neuesten Inhalts.

Das passende Denkmodell: Artefakte sind der aktuelle Plan, kein unterzeichneter Vertrag. Die KI arbeitet stets mit ihrem aktuellen Inhalt. Durch ihre Bearbeitung lenken Sie also die Arbeit.

```text
You: I want to change the approach in this change.

You: [edit design.md, or tell the AI:]
     Update design.md to use a background job instead of a synchronous call.

AI:  Updated design.md. The task list still fits; want me to continue applying?

You: /opsx:apply
```

Damit ist eine häufige Frage beantwortet: Es gibt keinen eigenen Befehl „Vorschlag aktualisieren“, weil Sie keinen benötigen. Die Datei ist die maßgebliche Quelle. Sie zu bearbeiten – selbst oder mithilfe der KI – ist die Aktualisierung.

## „Wie kehre ich nach der Implementierung zur Überprüfung zurück?“

Sie müssen nicht „zurückkehren“, denn Sie haben die Überprüfung nie verlassen. Der Workflow ist flexibel: Überprüfung, Bearbeitung und Implementierung sind keine aufeinanderfolgenden Phasen, in denen Sie feststecken.

Konkret können Sie nach einer Implementierung mit `/opsx:apply` Folgendes tun:

- Möchten Sie den Plan erneut ansehen? Öffnen und lesen Sie die Artefakte oder führen Sie im Terminal `openspec show <change>` aus, um eine zusammengefasste Ansicht zu erhalten.
- Möchten Sie etwas ändern? Bearbeiten Sie das Artefakt (oder bitten Sie die KI darum) und fahren Sie dann fort.
- Möchten Sie strukturiert prüfen, ob der Code zum Plan passt? Führen Sie `/opsx:verify` (einen erweiterten Befehl) aus. Der Befehl meldet Vollständigkeit, Korrektheit und Konsistenz, ohne den Ablauf zu blockieren. Siehe [Workflows: Überprüfen](/de-DE/workflows/#verify-arbeit-überprüfen).

Es gibt keine „Überprüfungsphase“, zu der Sie zurückkehren müssten. Sie können jederzeit überprüfen, auch nach der Implementierung.

## „Ich habe den Code von Hand bearbeitet. Wie gleiche ich ihn mit OpenSpec ab?“

Das passiert ständig und ist kein Problem. Sie haben im Editor etwas angepasst, sodass Code und Artefakte nicht mehr übereinstimmen. Bringen Sie beides in die Richtung wieder in Einklang, die der Realität entspricht:

- **Der Code ist jetzt korrekt, die Spezifikation ist veraltet.** Aktualisieren Sie die Delta-Spezifikation (und gegebenenfalls die Aufgaben), damit sie das tatsächlich ausgelieferte Verhalten beschreibt. Vor dem Archivieren muss die Spezifikation der Realität entsprechen, denn dabei wird sie mit der maßgeblichen Spezifikation zusammengeführt.
- **Die Spezifikation ist korrekt, der Code ist abgewichen.** Entwickeln oder korrigieren Sie weiter, bis der Code der Spezifikation entspricht.

Mit `/opsx:verify` finden Sie Abweichungen schnell: Der Befehl liest Ihre Artefakte und den Code und meldet, wo sie auseinanderlaufen. Verwenden Sie die Ausgabe als Aufgabenliste für den Abgleich und archivieren Sie die Änderung, sobald beides übereinstimmt.

Das Prinzip: Beim Archivieren werden Ihre Spezifikationen zur maßgeblichen Dokumentation. Stellen Sie daher vorher sicher, dass sie ehrlich beschreiben, was der Code tut. Manuelle Änderungen sind willkommen – lassen Sie nur nicht zu, dass sie die Spezifikation unbemerkt vom Code entkoppeln.

## Einen unbefriedigenden Vorschlag verfeinern

Wenn ein generierter Vorschlag nicht passt, haben Sie drei gute Möglichkeiten:

- **Direkt weiter iterieren.** Sagen Sie der KI, was nicht stimmt („Der Umfang ist zu groß; lass die Admin-Funktionen weg“) und lassen Sie sie den Vorschlag überarbeiten. Das ist am einfachsten und meist die richtige Wahl.
- **Erst erkunden, dann neu vorschlagen.** Ist die Idee selbst noch unklar, gehen Sie einen Schritt zurück zu `/opsx:explore`, denken Sie sie durch und entwickeln Sie daraus einen präziseren Vorschlag. Siehe [Zuerst erkunden](/de-DE/explore/).
- **Neu anfangen.** Wenn sich die Absicht grundlegend geändert hat, ist eine neue Änderung möglicherweise klarer, als die alte auszubessern.

Für die letzte Möglichkeit folgt nun eine eigene Entscheidungshilfe.

## Wann eine Änderung aktualisieren und wann eine neue beginnen?

Kurz gesagt: **Aktualisieren Sie die Änderung, wenn dieselbe Arbeit verfeinert wird. Beginnen Sie eine neue, wenn sich die Absicht grundlegend geändert oder der Umfang sich in mehrere unterschiedliche Arbeiten aufgeteilt hat.**

- Gleiches Ziel, besserer Ansatz? Aktualisieren.
- Der Umfang wird verkleinert (jetzt das MVP ausliefern, später mehr)? Aktualisieren, archivieren und für die zweite Phase eine neue Änderung beginnen.
- Das Problem selbst hat sich geändert („Dunkelmodus hinzufügen“ wurde zu „ein vollständiges Theming-System entwickeln“)? Neue Änderung.

Ein vollständiges Flussdiagramm und ausgearbeitete Beispiele finden Sie unter [Workflows: Aktualisieren oder neu beginnen](/de-DE/workflows/#wann-aktualisieren-und-wann-neu-beginnen); eine ausführlichere Erläuterung unter [OPSX: Aktualisieren oder neu beginnen](/de-DE/opsx/#wann-aktualisieren-und-wann-neu-beginnen).

## Hinweis zu Aufgaben

`tasks.md` ist eine fortlaufend gepflegte Checkliste, kein unveränderlicher Plan. Während der Implementierung können Sie neu entdeckte Aufgaben hinzufügen, unnötige Aufgaben entfernen oder die Reihenfolge ändern. Die KI hakt Aufgaben während `/opsx:apply` ab, sobald sie erledigt sind, und setzt bei einer späteren Fortsetzung bei der ersten offenen Aufgabe an. Dass Sie die Liste währenddessen bearbeiten, ist vorgesehen.

## Wie geht es weiter?

- [Workflows](/de-DE/workflows/) – Muster und Entscheidungshilfe zum Aktualisieren oder Neuanlegen
- [Änderung überprüfen](/de-DE/reviewing-changes/) – den Plan in zwei Minuten vor der Umsetzung prüfen
- [Zuerst erkunden](/de-DE/explore/) – einen Schritt zurücktreten, wenn eine Idee überdacht werden muss
- [Befehle](/de-DE/commands/) – `/opsx:continue`, `/opsx:apply` und `/opsx:verify` im Detail
- [Konzepte: Artefakte](/de-DE/concepts/#artefakte) – wozu die einzelnen Artefakte dienen
