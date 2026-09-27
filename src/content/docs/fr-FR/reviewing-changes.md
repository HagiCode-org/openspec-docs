---
title: "Revoir un changement"
---

La promesse d'OpenSpec est que vous et votre IA **vous mettez d'accord sur ce qu'il faut construire avant toute écriture de code**. Cet accord n'a de valeur que si vous lisez réellement le brouillon de l'IA. Cette page porte sur ces deux minutes de lecture : quoi ouvrir, dans quel ordre et que vérifier.

L'idée est simple : repérer une erreur d'orientation dans un plan d'un paragraphe ne coûte presque rien. La repérer dans 300 lignes de code, si. La revue est le moyen de profiter de cet avantage.

## Les deux moments de revue

Il y en a exactement deux :

```
/opsx:propose ──► REVIEW THE PLAN ──► /opsx:apply ──► REVIEW THE CODE ──► /opsx:archive
                  (before any code)                    (/opsx:verify)
```

1. **Après `/opsx:propose`** (ou `/opsx:ff`), avant `/opsx:apply` : lisez le plan tant qu'il ne s'agit que de mots.
2. **Après la réalisation**, avec `/opsx:verify` : vérifiez que le code fait bien ce qui était prévu.

La première revue est celle qui vous apporte le plus, et celle que l'on omet le plus souvent. Cette page lui est principalement consacrée.

## Lire dans cet ordre

Un changement est un dossier de fichiers Markdown ordinaires dans `openspec/changes/<name>/`. Lisez-les dans l'ordre qui permet de vous arrêter au plus vite en cas de problème :

```
openspec/changes/add-dark-mode/
├── proposal.md      1. the intent and scope   ← if this is wrong, stop here
├── specs/…/spec.md  2. the requirements       ← the heart of the review
├── design.md        (only for bigger changes) — the technical approach
└── tasks.md         3. the plan of work
```

Il n'est pas nécessaire de lire chaque ligne. Répondez à trois questions, une par fichier.

## La proposition : est-ce le bon problème ?

Commencez par ouvrir `proposal.md`. Elle décrit le « pourquoi » et le « quoi » — intention, périmètre et approche en un ou deux paragraphes.

**Une bonne proposition :** une intention claire, un périmètre que vous reconnaissez et une raison d'effectuer ce travail maintenant.

**Signaux d'alerte :**

- Elle résout un problème légèrement *différent* de celui que vous avez décrit.
- Le périmètre s'est étendu : vous avez demandé un sélecteur de thème, mais la proposition touche aussi à l'authentification « tant qu'on y est ».
- Elle est vague. « Améliorer la page des paramètres » ne définit pas un périmètre ; « ajouter un sélecteur de mode sombre qui respecte les préférences du système » en définit un.

**Question à se poser :** *Cela correspond-il réellement à ma demande, et quelque chose s'y est-il glissé en plus ?* Si ce n'est pas le cas, arrêtez-vous là ; ne lisez pas la suite, corrigez la proposition (voir [Il est facile de demander une correction](#pushing-back-is-cheap)).

## Les deltas de spécification : « terminé » est-il bien défini ?

C'est le cœur de la revue. Les spécifications différentielles sous `specs/` décrivent le comportement *attendu* une fois le changement livré — sous forme d'exigences et de scénarios qui les démontrent :

```markdown
## ADDED Requirements

### Requirement: Dark Mode Toggle
The system SHALL let a user switch between light and dark themes.

#### Scenario: Respects the OS preference on first load
- GIVEN a user who has never set a theme
- WHEN they open the app on a device set to dark mode
- THEN the app renders in dark mode
```

**Une bonne exigence :** un énoncé `SHALL`/`MUST` clair, assez précis pour être transmis à une personne chargée des tests, et au moins un scénario GIVEN/WHEN/THEN qui le met réellement à l'épreuve.

**Signaux d'alerte :**

- **Une exigence vague.** « Le système SHALL être rapide » ne peut être ni implémenté ni testé. Que signifie « rapide » ?
- **Une exigence sans scénario**, ou un scénario qui ne teste pas l'exigence correspondante.
- **L'oubli le plus important à repérer : ce qui manque.** L'IA consigne fidèlement ce que vous avez *dit*. À vous de repérer ce que vous avez *oublié* de dire. Si le cas qui vous importe le plus est la préférence du système et qu'aucun scénario ne le mentionne, la revue vient de se rentabiliser.

Lisez les deltas en vous demandant : *serais-je satisfait si le système faisait exactement — et seulement — cela ?* À ce stade, aucun code n'existe encore ; les changements restent donc peu coûteux.

## Les tâches : le plan de travail est-il raisonnable ?

Ouvrez `tasks.md` en dernier. Il s'agit de la liste de contrôle que l'IA suivra pendant l'implémentation.

**Un bon plan :** des étapes ordonnées, chacune rattachée à une exigence, sans élément mystérieux.

**Signaux d'alerte :**

- Une tâche sans exigence correspondante (d'où vient-elle ?).
- Une tâche unique et gigantesque (« implémenter la fonctionnalité ») qui cache toutes les vraies décisions.
- Une tâche qui dépasse le périmètre que vous venez d'approuver.

Il ne s'agit pas ici d'estimer le travail ni de le contrôler dans le détail ; vérifiez simplement que le plan correspond aux exigences déjà acceptées.

<a id="pushing-back-is-cheap"></a>

## Il est facile de demander une correction

Si une des trois réponses n'est pas satisfaisante, dites-le. Il n'y a pas de phases et rien n'est verrouillé : corrigez le problème et continuez. Comme pour [Modifier un changement](/fr-FR/editing-changes/) :

- **Modifiez le fichier vous-même.** C'est du Markdown ordinaire ; ajustez le périmètre, précisez une exigence ou supprimez une tâche.
- **Expliquez le problème à l'IA** et laissez-la réviser le document : *« supprime les modifications liées à l'authentification — elles sont hors périmètre »*, *« ajoute un scénario où l'utilisateur a déjà choisi un thème »*, *« sépare la tâche 3 en une tâche pour le schéma et une pour l'interface »*.

Relisez ensuite la partie modifiée. Répétez jusqu'à obtenir un plan que vous accepteriez de signer. Ces échanges sont précisément le signe que le produit fonctionne.

## Après le code : vérifier

Une fois le travail réalisé, `/opsx:verify` constitue votre seconde revue. La commande relit les artefacts et le code, puis signale les écarts sur trois axes :

| Axe | Vérifications |
|-----|---------------|
| **Exhaustivité** | Toutes les tâches sont terminées, toutes les exigences implémentées et les scénarios couverts |
| **Exactitude** | L'implémentation respecte l'intention de la spécification et traite les cas limites |
| **Cohérence** | Les décisions de conception se retrouvent effectivement dans le code |

```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Respects the OS preference on first load" has no test coverage
```

La commande signale les problèmes comme CRITICAL, WARNING ou SUGGESTION et **n'empêche pas l'archivage** : elle expose les lacunes et vous laisse décider. Voilà la différence entre « l'IA a écrit du code » et « elle a construit ce dont nous étions convenus ».

`/opsx:verify` fait partie du profil étendu. Si elle n'est pas disponible, activez ce profil avec `openspec config profile` (puis `openspec update`), ou relisez vous-même le changement et son diff.

## Adapter la revue à l'ampleur du changement

Tous les changements ne nécessitent pas une revue complète. Une correction d'une faute de frappe dans un seul fichier mérite un survol de vingt secondes. Un changement touchant à l'authentification, aux paiements ou à des données irrécupérables mérite toutes les vérifications ci-dessus. L'objectif n'est pas le formalisme : consacrez votre attention aux erreurs coûteuses et faites une lecture rapide quand elles ne le sont pas.

## La liste de vérification des deux minutes

- [ ] L'intention de la proposition correspond à ma demande.
- [ ] Aucun élément supplémentaire ne s'est glissé dans le périmètre.
- [ ] Chaque exigence est assez précise pour être testée.
- [ ] Chaque exigence possède un scénario qui la met réellement à l'épreuve.
- [ ] Le cas qui m'importe le plus est couvert.
- [ ] Les tâches correspondent aux exigences ; rien n'est mystérieux ni hors périmètre.
- [ ] Je serais à l'aise si l'IA construisait exactement ceci, et rien de plus.

Si les sept réponses sont positives, lancez `/opsx:apply` en confiance. Sinon, ce n'est pas un revers : ces deux minutes ont rempli leur rôle.

## Pour continuer

- [Rédiger de bonnes spécifications](/fr-FR/writing-specs/) — rédiger des exigences et des scénarios qui méritent d'être approuvés
- [Modifier et faire évoluer un changement](/fr-FR/editing-changes/) — modifier un plan après avoir commencé
- [Workflows](/fr-FR/workflows/) — place de la revue dans le cycle général
