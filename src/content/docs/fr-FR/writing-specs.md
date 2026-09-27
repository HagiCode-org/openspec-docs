---
title: "Rédiger de bonnes spécifications"
---

On rédige rarement une spécification à partir d'une page blanche. Vous décrivez un changement en langage clair, `/opsx:propose` rédige une première version des exigences et des scénarios, puis vous l'améliorez. Cette page explique cette dernière étape : à quoi ressemble une bonne spécification et comment guider l'IA pour l'obtenir.

Elle complète [Revoir un changement](/fr-FR/reviewing-changes/) : la revue consiste à repérer les faiblesses d'un brouillon ; la rédaction consiste à savoir de quoi se compose une bonne spécification.

## Une spécification décrit le comportement, pas le code

Une spécification indique ce que fait votre système, d'une manière que chacun peut vérifier — et non comment il est construit. Elle se compose d'**exigences** (énoncés de comportement) et de **scénarios** (exemples concrets qui les démontrent).

```markdown
### Requirement: Session Timeout
The system SHALL expire a session after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass with no activity
- THEN the session is invalidated and the user must re-authenticate
```

Gardez le *comment* — la file d'attente, la bibliothèque, le schéma de la table — dans `design.md` ou dans le code. Si le comportement et l'implémentation sont mélangés dans une exigence, celle-ci devient difficile à tester et commence à être périmée dès que le code change.

## Les qualités d'une bonne exigence

Une bonne exigence décrit un seul comportement, si clairement qu'on pourrait la confier à quelqu'un d'autre pour la tester.

- **Un énoncé, un `SHALL`/`MUST`.** Si une exigence contient trois propositions reliées par « et aussi », il s'agit en réalité de trois exigences. Séparez-les.
- **Observable.** Une personne qui ne connaît pas le code doit pouvoir déterminer si l'exigence est respectée. « Le système SHALL afficher une bannière d'erreur lorsque le téléversement dépasse 10 Mo » est observable. « Le système SHALL gérer correctement les gros téléversements » ne l'est pas.
- **Le degré d'obligation approprié.** OpenSpec utilise les mots-clés de la RFC 2119, qui ont des sens différents :

  | Mot-clé | Signification |
  |---------|---------------|
  | `MUST` / `SHALL` | Exigence absolue, non négociable. |
  | `SHOULD` | Forte recommandation, avec possibilité d'une exception justifiée. |
  | `MAY` | Réellement facultatif. |

  Par défaut, utilisez `MUST`/`SHALL`. Réservez `SHOULD` aux cas où vous voulez vraiment dire « sauf bonne raison de ne pas le faire ».

Pour vérifier une exigence, demandez-vous : *une personne chargée des tests, qui n'a jamais vu le code, pourrait-elle dire si elle est satisfaite ?* Sinon, précisez-la.

## Les qualités d'un bon scénario

Les scénarios donnent toute sa valeur à une exigence. Chacun est un cas concret GIVEN / WHEN / THEN qui pourrait devenir un test automatisé.

- **Il met l'exigence à l'épreuve.** Un scénario qui reformule simplement l'exigence ne teste rien. Décrivez une situation précise et un résultat précis.
- **Couvrez les cas importants, pas uniquement le parcours idéal.** Une connexion valide est simple. Une saisie vide, un jeton expiré, un deuxième clic, un échec : les bogues se cachent dans ces cas, et les scénarios y sont les plus utiles.
- **Nommez le cas dans le titre.** « Scenario: Rejeter un jeton expiré » indique immédiatement à la personne qui examine ce qui est couvert ; « Scenario: Test 2 » ne le fait pas.

Bonne habitude avant d'approuver : demandez-vous *quel cas me décevrait le plus s'il était cassé ?* et vérifiez qu'un scénario le nomme.

## Choisir le bon type de delta

Un changement décrit ses modifications de spécification avec trois types de sections. Choisir le bon permet de garder les spécifications archivées fidèles à la réalité :

- **`## ADDED Requirements`** — nouveau comportement qui n'existait pas auparavant.
- **`## MODIFIED Requirements`** — comportement déjà présent qui change. Incluez sa nouvelle version complète ; une courte explication des modifications aidera la personne qui l'examine.
- **`## REMOVED Requirements`** — comportement supprimé, avec une indication de la raison.

Lors de l'archivage, les éléments ADDED sont ajoutés à la spécification principale, MODIFIED remplace l'ancienne version et REMOVED en est supprimé. Si vous retirez la dernière exigence d'une fonctionnalité, vous la retirez également : plutôt que de conserver une spécification vide, l'archivage supprime `openspec/specs/<capability>/spec.md`. Comme c'est la seule étape d'archivage qui supprime un fichier, elle doit être explicitement autorisée : ajoutez `retire_capabilities: true` au fichier `.openspec.yaml` du changement, à côté de la clé `schema:` déjà requise. Sans cette option, l'archivage s'arrête et vous l'indique. Le retrait supprime tout le fichier ; il est donc également refusé si la spécification contient autre chose que son titre, `## Purpose` et ses blocs d'exigences — par exemple une section `## Notes` ou un commentaire sous une exigence. Le message d'arrêt nomme ces lignes ; déplacez-les dans `## Purpose` ou dans une exigence, ou supprimez la spécification manuellement. Pour une spécification du dépôt courant, le résultat de l'archivage indique aussi la commande `git checkout` qui restaure un fichier validé ; les stores sélectionnés reçoivent plutôt des instructions de récupération limitées à leur checkout. Si vous classez une modification réelle comme ADDED, vous créez deux exigences concurrentes ; si vous décrivez un nouveau comportement comme MODIFIED, rien ne vient remplacer l'ancienne exigence. En cas de doute, ouvrez la spécification actuelle pour voir si l'exigence existe déjà.

Une autre section mérite d'être connue. Lorsque le delta crée une nouvelle fonctionnalité, commencez par `## Purpose` — une ou deux phrases indiquant à quoi elle sert. Lors de l'archivage, cette section devient le Purpose de la spécification principale créée ; sans elle, un texte provisoire `TBD` est généré et doit être remplacé manuellement. Une spécification existante possède déjà son Purpose : le Purpose du delta y est ignoré. Pour le modifier, éditez directement `openspec/specs/<capability-path>/spec.md`. Ici, `<capability-path>` est le chemin du répertoire relatif à `specs/`, comme `user-auth` dans un projet à plat ou `identity/user-auth` dans un projet organisé par domaine.

<a id="right-size-the-change"></a>

## Dimensionner correctement le changement

L'erreur de rédaction la plus courante n'est pas une exigence mal formulée : c'est un changement qui essaie d'en couvrir trois.

**Un bon changement a une intention qu'on peut résumer en une phrase.** « Ajouter un bouton de mode sombre. » « Limiter le débit du point de terminaison de connexion. » « Remplacer les cookies pour les sessions. » Si vous devez multiplier les « et aussi » pour décrire le changement, il faut probablement le scinder.

Signes qu'un changement est trop vaste :

- Le périmètre de la proposition ressemble à une liste de fonctionnalités sans rapport entre elles.
- Sa revue demanderait un après-midi entier — personne ne la fera.
- Deux personnes ne pourraient pas y travailler sans se gêner.
- La moitié des tâches pourrait être livrée indépendamment.

Les changements plus petits sont plus faciles à examiner, à réaliser pendant une séance ciblée et à comprendre six mois plus tard, lorsque seule l'archive subsiste. Vous pouvez toujours mener plusieurs changements en parallèle — voir [Modifier et itérer](/fr-FR/editing-changes/) et [Workflows](/fr-FR/workflows/).

L'inverse est également vrai : une faute de frappe corrigée sur une ligne ne nécessite pas trois exigences et un document de conception. Adaptez les formalités à l'enjeu.

## Guider l'IA vers un bon brouillon

Comme `/opsx:propose` rédige la première version, la qualité du résultat dépend des indications que vous fournissez. Vous n'avez pas à écrire les exigences à la main ; vous devez bien orienter l'IA :

- **Précisez l'intention et les limites.** *« Ajoute un bouton de mode sombre qui suit le réglage du système au premier chargement — ne modifie pas l'API de thème existante. »* Ce qui est hors périmètre compte autant que ce qui en fait partie.
- **Nommez les cas importants pour vous.** *« Ajoute un scénario pour les personnes qui ont déjà choisi manuellement un thème. »* L'IA couvre les cas que vous indiquez.
- **Puis modifiez le résultat.** C'est du Markdown ordinaire. Précisez un `SHALL` vague, supprimez un scénario qui ne teste rien, ajoutez le cas oublié — ou demandez-le à l'IA : *« L'exigence de délai d'expiration est vague ; fixe-la à 30 minutes. »*

Rédigez, précisez, recommencez. Quelques tours suffisent pour obtenir une spécification fiable, ce qui est tout l'objectif.

## Liste de vérification rapide

- [ ] Chaque exigence décrit un comportement observable et comporte `SHALL`/`MUST`.
- [ ] Les exigences ne contiennent aucun détail d'implémentation.
- [ ] Chaque exigence possède au moins un scénario qui la met réellement à l'épreuve.
- [ ] Les cas limites et les erreurs importantes sont couverts, pas seulement le parcours idéal.
- [ ] Les deltas utilisent ADDED / MODIFIED / REMOVED à bon escient par rapport à la spécification actuelle.
- [ ] L'intention du changement entier peut être énoncée en une phrase.

## Pour continuer

- [Revoir un changement](/fr-FR/reviewing-changes/) — la revue de deux minutes qui repère les oublis.
- [Concepts](/fr-FR/concepts/) — le modèle détaillé des spécifications, changements et deltas.
- [Exemples et recettes](/fr-FR/examples/) — des changements réels de bout en bout.
