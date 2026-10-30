---
title: "Community-Schaufenster"
---

Eine von der Community gepflegte Sammlung von Projekten und Ressourcen, die mit und für OpenSpec entwickelt wurden. Werkzeuge, Integrationen, Workflows und Lernressourcen sind willkommen. Mitglieder der Community erweitern diese Sammlung, indem sie Issues eröffnen; Maintainer fügen die Einträge hinzu.

Die aufgeführten Projekte werden unabhängig gepflegt. Ihre Aufnahme bedeutet weder offiziellen Support noch eine Empfehlung durch OpenSpec. Informationen zu Einrichtung und Support finden Sie in der Dokumentation und im Issue-Tracker des jeweiligen Projekts.

## Projekte und Ressourcen

- **[OpenSpec Workbench](https://github.com/VeryComplexAndLongName/OpenSpec-UI)**: OpenSpec-Änderungen mit Agents ausführen und überwachen.
- **[openspec-guard](https://github.com/guillaume-flambard/spec-guard)**: CLI und GitHub Action, die melden, welche OpenSpec-Szenarien von einem Vitest- oder Jest-Test abgedeckt werden, ohne die Tests auszuführen.

## Gehostete Dienste

Gehostete Produkte, die eine OpenSpec-Funktion ergänzen, die die CLI nicht bietet. Jeder Eintrag nennt Konto-, Zahlungs- und Datenverarbeitungsbedingungen.

- **[MySpec](https://myspec.dev)**: Cloud-Beta (Konto erforderlich; kostenloser Tarif, keine Kreditkarte), die geführte Spezifikationsinterviews durchführt und Pakete mit vier Dateien oder mit OpenSpec kompatible Änderungen exportiert. Der MCP-Server (`@myspec/mcp-server`) und die [Claude-Code-Plugins](https://github.com/myspecs/claude-plugins) ermöglichen es Coding-Agents, diese Spezifikationen zu lesen, OpenSpec-Änderungen zu schreiben und sie Aufgabe für Aufgabe umzusetzen. Der Dienst sendet übermittelte Inhalte an Drittanbieter von KI-Modellen und ist nicht für sensible Daten ausgelegt.
- **[Entalpa](https://entalpa.com/en/openspec)**: Importiert die `openspec/specs/` eines öffentlichen GitHub-Repositorys (bis zu 300 Anforderungen) in ein durchsuchbares Projekt, ergänzt Stakeholder, Stories und offene Fragen, die als inferred gekennzeichnet sind, und exportiert das Ergebnis als `openspec/specs/`-Baum; das Repository wird nie verändert. Zum Importieren und Lesen ist kein Konto nötig, zum Speichern oder Bearbeiten schon, und KI-Funktionen verbrauchen bezahlte Credits. Importierte Inhalte werden an Drittanbieter von KI-Modellen gesendet.
- **[OpenSpec Review](https://skillgild.dev/skills/openspec-review) und [OpenSpec Compact](https://skillgild.dev/skills/openspec-compact)**: Gehostete Skills von SkillGild für Claude Code, Codex, Cursor, Gemini CLI oder jeden MCP-Client. Review veröffentlicht eine Änderung als Link, über den jede Person mit dem Link ohne Konto pro Anforderung genehmigen, Änderungen anfordern oder kommentieren kann; außerdem zeigt Review die Hauptspezifikation so, wie `openspec archive` sie schreiben würde, und markiert Anforderungen, die auch andere offene Änderungen berühren. Compact findet lexikalisch ähnliche Anforderungen und wiederholte Szenarien über die Hauptspezifikationen hinweg und schreibt die Bereinigung als OpenSpec-Änderung. Erforderlich sind die SkillGild-CLI und ein kostenloses Konto (25 Läufe pro Monat und Skill). Beide senden Spezifikationsinhalte an die Server von SkillGild, die proprietären Code ausführen und keinen Aufruf eines KI-Modells durchführen; Review sendet außerdem den Proposal, das Design und die Tasks und bewahrt die Änderung 30 Tage auf.

## Eigenes Projekt hinzufügen

Eröffnen Sie ein Issue mit der einen Zeile, die Sie aufgenommen haben möchten: Projektname, direkter Link und eine kurze Beschreibung des Bezugs zu OpenSpec. Ein Maintainer fügt sie dieser Datei hinzu.

- Beschränken Sie Einträge auf Projekte, die mit OpenSpec erstellt wurden oder dessen Verwendung unterstützen, statt allgemeine Produktwerbung aufzunehmen.
- Beschreiben Sie, wofür das Angebot genutzt werden kann. Vermeiden Sie Werbeversprechen, Empfehlungs- und Tracking-Links.
- Weisen Sie im Eintrag auf kostenpflichtige Funktionen oder erforderliche Konten hin.
- Gehostete oder kostenpflichtige Dienste werden nur unter Gehostete Dienste aufgeführt, wenn sie eine OpenSpec-Funktion ergänzen, die die CLI nicht bereits bietet, und eine kostenlose Testmöglichkeit haben. Ein Dienst, der die eigenen Skills oder Befehle von OpenSpec neu verpackt, wird nicht aufgeführt.

Auch Korrekturen und Aktualisierungen bestehender Einträge sind willkommen.
