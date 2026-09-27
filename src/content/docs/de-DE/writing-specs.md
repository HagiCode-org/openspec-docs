---
title: "Gute Spezifikationen schreiben"
---

Nur selten schreiben Sie eine Spezifikation von einem leeren Blatt aus. Sie beschreiben eine Änderung in verständlicher Sprache, `/opsx:propose` entwirft Anforderungen und Szenarien, und anschließend verbessern Sie diese. Auf dieser Seite geht es um den letzten Schritt: woran man „gut“ erkennt und wie Sie die KI dorthin lenken.

Diese Seite ergänzt [Änderungen überprüfen](/de-DE/reviewing-changes/): Bei der Überprüfung erkennen Sie die Schwachstellen eines Entwurfs, beim Schreiben wissen Sie, was einen guten Entwurf ausmacht.

## Eine Spezifikation beschreibt Verhalten, keinen Code

Eine Spezifikation beschreibt, was Ihr System *tut*, und zwar so, dass es jeder überprüfen kann – nicht, wie es implementiert ist. Sie besteht aus **Anforderungen** (Verhaltensaussagen) und **Szenarien** (konkreten Beispielen, die sie belegen).

```markdown
### Requirement: Session Timeout
The system SHALL expire a session after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass with no activity
- THEN the session is invalidated and the user must re-authenticate
```

Das *Wie* – Warteschlange, Bibliothek oder Tabellenschema – gehört in `design.md` oder in den Code. Werden Verhalten und Implementierung in einer Anforderung vermischt, lässt sie sich nicht mehr sinnvoll testen und ist veraltet, sobald sich der Code ändert.

## Was eine gute Anforderung ausmacht

Eine gute Anforderung beschreibt ein einzelnes Verhalten so klar, dass Sie jemand anderem ihre Überprüfung übertragen könnten.

- **Eine Aussage, ein `SHALL`/`MUST`.** Enthält eine Anforderung drei Zusätze nach dem Muster „und außerdem“, handelt es sich in Wirklichkeit um drei Anforderungen. Teilen Sie sie auf.
- **Beobachtbar.** Auch Personen außerhalb des Codes müssen feststellen können, ob die Anforderung erfüllt ist. „Das System SHALL ein Fehlerbanner anzeigen, wenn der Upload 10 MB überschreitet“ ist beobachtbar. „Das System SHALL große Uploads zuverlässig verarbeiten“ ist es nicht.
- **Die passende Verbindlichkeit.** OpenSpec verwendet die Schlüsselwörter aus RFC 2119; sie haben unterschiedliche Bedeutungen:

  | Schlüsselwort | Bedeutung |
  |---------------|-----------|
  | `MUST` / `SHALL` | Verbindliche Anforderung, über die nicht verhandelt wird. |
  | `SHOULD` | Dringende Empfehlung, von der begründet abgewichen werden kann. |
  | `MAY` | Tatsächlich optional. |

  Verwenden Sie standardmäßig `MUST`/`SHALL`. Wählen Sie `SHOULD` nur, wenn Sie wirklich „außer es gibt einen guten Grund dagegen“ meinen.

Die Probe für eine Anforderung: *Könnte eine Person, die den Code noch nie gesehen hat, feststellen, ob die Anforderung erfüllt ist?* Falls nicht, muss sie präziser formuliert werden.

## Was ein gutes Szenario ausmacht

Szenarien zeigen, ob eine Anforderung ihren Zweck erfüllt. Jedes ist ein konkretes GIVEN / WHEN / THEN, aus dem ein automatisierter Test werden könnte.

- **Es prüft die zugehörige Anforderung.** Ein Szenario, das sie lediglich mit anderen Worten wiederholt, testet nichts. Beschreiben Sie eine konkrete Situation mit einem konkreten Ergebnis.
- **Decken Sie wichtige Fälle ab, nicht nur den Erfolgsfall.** Eine gültige Anmeldung ist einfach. Leere Eingaben, abgelaufene Tokens, ein zweiter Klick und Fehlerfälle – dort verbergen sich die Bugs und dort ist ein Szenario besonders wertvoll.
- **Benennen Sie den Fall im Titel.** „Scenario: Rejects an expired token“ zeigt einer prüfenden Person auf einen Blick, was abgedeckt wird; „Scenario: Test 2“ dagegen nicht.

Eine hilfreiche Gewohnheit: Fragen Sie vor der Freigabe: *Welcher einzelne Fall würde mich besonders ärgern, wenn er kaputt wäre?* Stellen Sie sicher, dass ein Szenario genau diesen Fall benennt.

## Den richtigen Delta-Typ wählen

Eine Änderung beschreibt ihre Anpassungen an den Spezifikationen mit drei Abschnittstypen. Wenn Sie den passenden Typ verwenden, bleiben die archivierten Spezifikationen korrekt:

- **`## ADDED Requirements`** – neues Verhalten, das es zuvor nicht gab.
- **`## MODIFIED Requirements`** – vorhandenes Verhalten, das geändert wird. Fügen Sie die vollständige neue Fassung ein; ein kurzer Hinweis zu den Änderungen hilft bei der Prüfung.
- **`## REMOVED Requirements`** – Verhalten, das entfällt, mit einer kurzen Begründung.

Beim Archivieren werden ADDED-Anforderungen an die Hauptspezifikation angehängt, MODIFIED-Anforderungen ersetzen die bisherige Fassung und REMOVED-Anforderungen werden daraus entfernt. Entfernen Sie die letzte Anforderung einer Funktion, wird diese ausgemustert: Statt eine leere Spezifikation zurückzulassen, löscht das Archivieren `openspec/specs/<capability>/spec.md`. Da dies der einzige Archivierungsschritt ist, der eine Datei löscht, muss er ausdrücklich angefordert werden. Fügen Sie dazu `retire_capabilities: true` in die `.openspec.yaml` der Änderung ein, zusätzlich zum dort bereits erforderlichen Schlüssel `schema:`. Andernfalls wird das Archivieren abgebrochen und erklärt warum. Da beim Ausmustern die gesamte Datei gelöscht wird, wird der Vorgang außerdem verweigert, wenn die Spezifikation Inhalte außerhalb des Titels, `## Purpose` und der Anforderungsblöcke enthält – etwa einen Abschnitt `## Notes` oder einen Kommentar unter einer Anforderung. Der Abbruch nennt die betreffenden Zeilen. Verschieben Sie sie nach `## Purpose` oder in eine Anforderung oder löschen Sie die Spezifikation von Hand. Bei einer Spezifikation im Checkout des Aufrufers nennt die Archivierungsausgabe auch den `git checkout`-Befehl, mit dem eine committete Datei wiederhergestellt werden kann; für ausgewählte Stores werden stattdessen Anweisungen zur Wiederherstellung im jeweiligen Checkout ausgegeben. Markieren Sie eine tatsächliche Änderung als ADDED, erhalten Sie zwei konkurrierende Anforderungen. Beschreiben Sie neues Verhalten als MODIFIED, gibt es nichts zu ersetzen. Öffnen Sie im Zweifel die aktuelle Spezifikation und prüfen Sie, ob die Anforderung bereits vorhanden ist.

Ein weiterer Abschnitt ist erwähnenswert. Wenn Ihr Delta eine noch nicht vorhandene Funktion einführt, beginnen Sie mit `## Purpose` und beschreiben Sie in ein oder zwei Sätzen, wozu sie dient. Beim Archivieren wird dieser Text zum Purpose der neu angelegten Hauptspezifikation. Fehlt er, wird ein Platzhalter `TBD` eingefügt, den Sie von Hand ausfüllen müssen. Eine bestehende Spezifikation hat bereits einen Purpose, daher wird der entsprechende Abschnitt im Delta ignoriert. Bearbeiten Sie `openspec/specs/<capability-path>/spec.md` direkt, um ihn zu ändern. `<capability-path>` bezeichnet das Verzeichnis relativ zu `specs/`, zum Beispiel `user-auth` in einem flachen Projekt oder `identity/user-auth` in einem nach Domänen gegliederten Projekt.

## Den Umfang der Änderung passend bemessen

Der häufigste Fehler beim Verfassen ist keine schlecht formulierte Anforderung, sondern eine Änderung, die versucht, drei Änderungen auf einmal zu sein.

**Eine gute Änderung verfolgt eine Absicht, die sich in einem Satz ausdrücken lässt.** „Einen Schalter für den Dunkelmodus hinzufügen.“ „Den Anmelde-Endpunkt ratenbegrenzen.“ „Sitzungen von Cookies weg migrieren.“ Wenn Sie die Änderung mit vielen „und außerdem“ beschreiben müssen, ist das ein Zeichen, dass Sie sie aufteilen sollten.

Anzeichen dafür, dass eine Änderung zu groß ist:

- Der Umfang des Vorschlags liest sich wie eine Liste voneinander unabhängiger Funktionen.
- Die Überprüfung würde einen ganzen Nachmittag dauern – deshalb wird sie niemand machen.
- Zwei Personen könnten nicht daran arbeiten, ohne einander in die Quere zu kommen.
- Die Hälfte der Aufgaben könnte unabhängig ausgeliefert werden.

Kleinere Änderungen lassen sich leichter überprüfen und in einer konzentrierten Sitzung umsetzen. Auch sechs Monate später, wenn nur noch das Archiv übrig ist, kann man sie leichter nachvollziehen. Sie können jederzeit mehrere Änderungen parallel bearbeiten – siehe [Änderungen bearbeiten und iterieren](/de-DE/editing-changes/) und [Workflows](/de-DE/workflows/).

Auch das Gegenteil kommt vor: Für die Korrektur eines Tippfehlers in einer Zeile braucht es keine drei Anforderungen und kein Designdokument. Passen Sie den Aufwand an die Tragweite an.

## Die KI zu einem guten Entwurf lenken

Da `/opsx:propose` den ersten Entwurf erstellt, hängt dessen Qualität davon ab, wie gut Ihre Eingabe ist. Sie müssen Anforderungen nicht von Hand verfassen – Sie müssen die KI richtig anleiten:

- **Nennen Sie die Absicht und ihre Grenzen.** *„Füge einen Schalter für den Dunkelmodus hinzu, der sich beim ersten Laden nach der Betriebssystemeinstellung richtet – ändere die vorhandene Theme-API nicht.“* Der Teil zum ausgeschlossenen Umfang ist genauso wichtig wie der zum eingeschlossenen.
- **Nennen Sie die Fälle, die Ihnen wichtig sind.** *„Stelle sicher, dass es ein Szenario für Personen gibt, die bereits manuell ein Theme gewählt haben.“* Die KI deckt die Fälle ab, auf die Sie hinweisen.
- **Bearbeiten Sie anschließend den Entwurf.** Er besteht aus einfachem Markdown. Präzisieren Sie ein vages `SHALL`, löschen Sie ein Szenario, das nichts testet, ergänzen Sie den fehlenden Fall – oder bitten Sie die KI darum: *„Die Anforderung zur Zeitüberschreitung ist ungenau; lege sie auf 30 Minuten fest.“*

Entwerfen, präzisieren, wiederholen. Nach wenigen Durchläufen erhalten Sie eine Spezifikation, der Sie vertrauen können – genau darum geht es.

## Kurze Checkliste

- [ ] Jede Anforderung beschreibt ein beobachtbares Verhalten mit einem `SHALL`/`MUST`.
- [ ] Die Anforderungen enthalten keine Implementierungsdetails.
- [ ] Für jede Anforderung gibt es mindestens ein Szenario, das sie tatsächlich prüft.
- [ ] Wichtige Rand- und Fehlerfälle sind durch Szenarien abgedeckt, nicht nur der Erfolgsfall.
- [ ] Deltas verwenden ADDED / MODIFIED / REMOVED passend zur aktuellen Spezifikation.
- [ ] Die gesamte Änderung verfolgt eine einzige Absicht, die sich in einem Satz ausdrücken lässt.

## Wie geht es weiter?

- [Änderungen überprüfen](/de-DE/reviewing-changes/) – der zweiminütige Durchlauf, bei dem Übersehenes auffällt.
- [Konzepte](/de-DE/concepts/) – das zugrunde liegende Modell für Spezifikationen, Änderungen und Deltas.
- [Beispiele und Rezepte](/de-DE/examples/) – konkrete Änderungen von Anfang bis Ende.
