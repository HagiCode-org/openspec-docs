---
title: "Glossar"
---

Alle OpenSpec-Begriffe an einem Ort, einfach erklärt. Lesen Sie das Glossar einmal durch, dann wird die restliche Dokumentation leichter verständlich.

Die Begriffe sind thematisch gruppiert und innerhalb jeder Gruppe alphabetisch geordnet.

## Die wichtigsten Begriffe

**Spezifikation.** Ein Dokument, das beschreibt, wie sich ein Teil Ihres Systems verhält. Spezifikationen liegen unter `openspec/specs/`, sind nach Domänen organisiert und bestehen aus Anforderungen und Szenarien. Die Spezifikation ist die gemeinsam vereinbarte Antwort auf die Frage: „Was tut diese Software?“ Siehe [Konzepte](/de-DE/concepts/#spezifikationen).

**Maßgebliche Quelle.** Das gesamte Verzeichnis `openspec/specs/`. Es enthält das aktuelle, gemeinsam vereinbarte Verhalten Ihres Systems. Änderungen schlagen Anpassungen daran vor; beim Archivieren werden sie übernommen.

**Änderung.** Eine Arbeitseinheit, die als Ordner unter `openspec/changes/<name>/` abgelegt wird. Eine Änderung enthält alles zu dieser Arbeit: den Vorschlag, den Entwurf, die Aufgaben und die dadurch eingeführten Änderungen an den Spezifikationen. Eine Änderung, eine Funktion oder Fehlerbehebung.

**Artefakt.** Ein Dokument innerhalb einer Änderung. Zu den Standardartefakten gehören der Vorschlag, die Delta-Spezifikationen, der Entwurf und die Aufgaben. Sie werden in Abhängigkeitsreihenfolge erstellt und bauen aufeinander auf.

**Delta-Spezifikation.** Eine Spezifikation innerhalb einer Änderung, die nur die Änderungen mit den Abschnitten `ADDED`, `MODIFIED` und `REMOVED` beschreibt, statt die gesamte Spezifikation neu zu formulieren. Dadurch kann OpenSpec bestehende Systeme sauber weiterentwickeln. Siehe [Konzepte](/de-DE/concepts/#delta-spezifikationen).

**Domäne.** Eine logische Gruppierung von Spezifikationen wie `auth/`, `payments/` oder `ui/`. Wählen Sie Domänen, die Ihrer Denkweise über das System entsprechen.

## Bestandteile einer Spezifikation

**Anforderung.** Ein einzelnes Verhalten, das das System aufweisen muss. Üblicherweise wird dafür ein Schlüsselwort aus RFC 2119 verwendet: „Das System SHALL Sitzungen nach 30 Minuten ablaufen lassen.“ Anforderungen legen fest, *was* geschieht, nicht *wie*.

**Szenario.** Ein konkretes, testbares Beispiel für die Umsetzung einer Anforderung, üblicherweise in der Form Given/When/Then. Szenarien machen Anforderungen überprüfbar: Aus ihnen lässt sich ein automatisierter Test erstellen.

**Schlüsselwörter aus RFC 2119.** Die Wörter MUST, SHALL, SHOULD und MAY haben eine standardisierte Bedeutung für die Verbindlichkeit einer Anforderung. MUST und SHALL sind uneingeschränkt verpflichtend. SHOULD ist eine Empfehlung mit Raum für Ausnahmen. MAY bedeutet optional. Der Name stammt aus dem Internet-Standarddokument, in dem die Begriffe festgelegt wurden.

## Die Artefakte

**Vorschlag (`proposal.md`).** Das *Warum* und *Was* einer Änderung: ihre Absicht, ihr Umfang und ihr grundlegender Ansatz. Das erste Artefakt, das Sie erstellen.

**Entwurf (`design.md`).** Das *Wie*: technischer Ansatz, Architekturentscheidungen und die voraussichtlich zu bearbeitenden Dateien. Bei einfachen Änderungen optional.

**Aufgaben (`tasks.md`).** Die Implementierungs-Checkliste mit Kontrollkästchen. Die KI arbeitet sie während `/opsx:apply` ab und hakt die erledigten Punkte ab.

## Der Lebenszyklus

**Archivieren.** Das Abschließen einer Änderung. Ihre Delta-Spezifikationen werden mit den Hauptspezifikationen zusammengeführt, und der Änderungsordner wird nach `openspec/changes/archive/YYYY-MM-DD-<name>/` verschoben. Nach dem Archivieren beschreiben Ihre Spezifikationen die neue Realität. Siehe [Konzepte](/de-DE/concepts/#archivierung).

**Synchronisieren.** Die Delta-Spezifikationen einer Änderung mit den Hauptspezifikationen zusammenführen, *ohne* die Änderung zu archivieren. Normalerweise automatisch (beim Archivieren wird die Synchronisierung angeboten), bei lang laufenden Änderungen aber auch separat mit `/opsx:sync` möglich. Siehe [Befehle](/de-DE/commands/#opsxsync).

## Workflows und Befehle

**OPSX.** Der aktuelle standardmäßige OpenSpec-Workflow, der auf flexiblen Aktionen statt auf starren Phasen basiert. Alle seine Slash-Befehle beginnen mit `/opsx:`. Siehe [OPSX-Workflow](/de-DE/opsx/).

**Slash-Befehl.** Ein Befehl, den Sie in den Chat Ihres KI-Assistenten eingeben, zum Beispiel `/opsx:propose`. Slash-Befehle steuern den Workflow. Es handelt sich nicht um Terminalbefehle. Siehe [So funktionieren Befehle](/de-DE/how-commands-work/).

**Erkunden (`/opsx:explore`).** Der Befehl, der als Denkpartner dient. Er liest Ihre Codebasis, vergleicht Optionen und macht aus einer vagen Idee einen konkreten Plan. Er schreibt niemals Code und sonst nichts, sofern Sie ihn nicht bitten, die Erkundung als Änderung festzuhalten, oder sein Angebot annehmen. Empfohlener Ausgangspunkt, wenn Sie ein Problem, aber noch keinen Plan haben. Siehe [Zuerst erkunden](/de-DE/explore/).

**CLI.** Das Programm `openspec`, das Sie im Terminal ausführen. Es richtet Projekte ein, listet Änderungen auf, validiert sie, öffnet das Dashboard und archiviert Änderungen. Der Terminalteil von OpenSpec. Siehe [CLI](/de-DE/cli/).

**Skill.** Ein Ordner mit Anweisungen (`.../skills/openspec-*/SKILL.md`), den Ihr KI-Assistent automatisch erkennt und befolgt. Skills entwickeln sich zum toolübergreifenden Standard, um Ihrem Assistenten den OpenSpec-Workflow bereitzustellen.

**Befehlsdatei.** Eine Slash-Befehlsdatei für ein bestimmtes Tool (`.../commands/opsx-*`). Dies ist der ältere Bereitstellungsmechanismus, der neben Skills weiterhin unterstützt wird. Normalerweise müssen Sie diese Dateien nicht direkt bearbeiten.

**Profil.** Die Gruppe der in Ihrem Projekt installierten Slash-Befehle. **Core** (Standard) umfasst `propose`, `explore`, `apply`, `update`, `sync` und `archive`. Der **erweiterte** Satz ergänzt `new`, `continue`, `ff`, `verify`, `bulk-archive` und `onboard`. Ändern Sie das Profil mit `openspec config profile`.

**Bereitstellung.** Gibt an, ob OpenSpec für Ihre Tools Skills, Befehlsdateien oder beides installiert. Die Bereitstellung wird global konfiguriert und mit `openspec update` angewendet.

## Anpassung

**Schema.** Die Definition, welche Artefakte ein Workflow enthält und wie sie voneinander abhängen. Das integrierte Standardschema heißt `spec-driven` (Vorschlag → Spezifikationen → Entwurf → Aufgaben). Sie können es forken oder ein eigenes verfassen. Siehe [Anpassung](/de-DE/customization/#benutzerdefinierte-schemas).

**Vorlage.** Eine Markdown-Datei innerhalb eines Schemas, die festlegt, was die KI für ein bestimmtes Artefakt generiert. Wenn Sie eine Vorlage bearbeiten, ändert sich die Ausgabe der KI sofort und ohne erneuten Build.

**Projektkonfiguration (`openspec/config.yaml`).** Projekteinstellungen: das Standardschema, der bei jeder Planungsanfrage eingefügte `context:` und Regeln (`rules:`) für einzelne Artefakte. Der einfachste Weg, OpenSpec Ihren Technologie-Stack und Ihre Konventionen mitzuteilen. Siehe [Anpassung](/de-DE/customization/#projektkonfiguration).

**Kontextinjektion.** Projektinformationen in das Feld `context:` der `config.yaml` eintragen, damit sie automatisch jedem von der KI erstellten Artefakt hinzugefügt werden. Zuverlässiger, als darauf zu hoffen, dass die KI eine separate Datei liest.

**Abhängigkeitsgraph.** Der gerichtete Graph, der aus den `requires:`-Beziehungen zwischen Artefakten entsteht. Es ist ein DAG (gerichteter azyklischer Graph: Die Pfeile weisen nur nach vorn und bilden keine Schleife). OpenSpec verwendet ihn, um festzustellen, was Sie als Nächstes erstellen können.

**Ermöglicher statt Schranken.** Das Prinzip, dass Artefaktabhängigkeiten zeigen, was als Nächstes *möglich* wird und nicht, was als Nächstes *erforderlich* ist. Sie können jederzeit zu jedem Artefakt zurückkehren und es bearbeiten. Siehe [Kernkonzepte im Überblick](/de-DE/overview/#ermöglicher-statt-schranken).

## Koordination über mehrere Repositories hinweg (Beta)

Diese Begriffe gelten nur, wenn Ihre Planung mehr als ein Repository umfasst. Die Funktion befindet sich in der Beta; die meisten Benutzer können diesen Abschnitt überspringen. Siehe das [Store-Benutzerhandbuch](/de-DE/stores-beta/user-guide/).

**Store.** Ein eigenständiges Repository, dessen einziger Zweck die Planung ist. Es hat denselben bekannten Aufbau mit `openspec/` (Spezifikationen und Änderungen) sowie eine kleine Identitätsdatei. Sie registrieren es einmal unter einem Namen auf Ihrem Rechner. Danach kann jeder OpenSpec-Befehl von überall darin arbeiten.

**Referenz.** Ein Eintrag in `openspec/config.yaml` eines Code-Repositorys, der angibt, auf welchen Store dieses Repository zugreift. Referenzen sind schreibgeschützt: Das Repository behält seinen eigenen Stamm, und `openspec instructions` erhält einen Index der Spezifikationen des referenzierten Stores samt dem genauen Befehl zum Abrufen.

**Arbeitskontext.** Das, was `openspec context` für das aktuelle Repository zusammenstellt: sein OpenSpec-Stamm sowie alle referenzierten Stores und die jeweiligen Abrufbefehle. Die Antwort auf die Frage: „Womit arbeite ich?“

**Workset.** Eine persönliche, nur auf diesem Rechner gespeicherte Gruppe von Ordnern, die Sie gemeinsam öffnen (einen Store zusammen mit den Code-Repositories, an denen Sie arbeiten). Wird ausdrücklich mit `openspec workset create` erstellt. Die lokalen Pfade werden nicht in das gemeinsam genutzte Planungs-Repository committet.

## Siehe auch

- [Kernkonzepte im Überblick](/de-DE/overview/): die fünf Grundgedanken auf einer Seite
- [Konzepte](/de-DE/concepts/): die ausführliche Erläuterung
- [So funktionieren Befehle](/de-DE/how-commands-work/): Slash-Befehle im Vergleich zur CLI
