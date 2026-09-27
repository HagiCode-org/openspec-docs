---
title: "Les concepts fondamentaux en bref"
---

**OpenSpec est une couche d'accord légère entre vous et votre IA.** Vous décrivez le résultat attendu d'un changement, l'IA en rédige les détails, vous consultez le même plan, puis seulement le code est écrit. Cette page résume le modèle mental en un seul écran. Pour une explication détaillée, consultez [Concepts](/fr-FR/concepts/).

L'idée tient en cinq mots : **se mettre d'accord d'abord, puis construire en confiance.**

## Les cinq idées

Tout OpenSpec repose sur cinq concepts. Apprenez-les et le reste ne sera que des détails.

**1. Les spécifications font foi.** Une spécification décrit le comportement *actuel* de votre système. Elle se trouve dans `openspec/specs/`, organisée par domaine (`auth/`, `payments/`, `ui/`). Les spécifications contiennent des exigences (« le système SHALL expirer les sessions après 30 minutes ») et des scénarios (exemples concrets au format given/when/then). Voyez-les comme la réponse convenue à la question « que fait ce logiciel ? ».

**2. Un changement est une unité de travail.** Pour ajouter, modifier ou supprimer un comportement, vous créez un changement : un dossier dans `openspec/changes/` qui rassemble tout le travail. Une proposition, une conception, une liste de tâches et les modifications des spécifications. Un changement, un dossier, une fonctionnalité.

**3. Les spécifications différentielles décrivent les modifications, pas tout le système.** Dans un changement, vous ne réécrivez pas la spécification entière. Vous rédigez un petit delta : cette exigence est `ADDED`, celle-ci `MODIFIED` et une autre `REMOVED`. C'est ce qui permet à OpenSpec de modifier efficacement des systèmes existants, et pas seulement de démarrer des projets neufs. Vous décrivez le diff, pas l'état final.

**4. Les artefacts s'appuient les uns sur les autres.** Un changement contient quelques documents, créés dans un ordre naturel, chacun alimentant le suivant :

```text
proposal ──► specs ──► design ──► tasks ──► implement
   why        what       how       steps      do it
```

Vous pouvez revenir à chacun d'eux à tout moment. Ce sont des facilitateurs, pas des barrières. (Nous y reviendrons.)

**5. L'archivage réintègre le changement à la vérité de référence.** Une fois le travail terminé, vous archivez le changement. Ses spécifications différentielles sont fusionnées dans les spécifications principales et son dossier est déplacé vers `changes/archive/` avec une date. Vos spécifications décrivent alors la nouvelle réalité ; vous pouvez passer au changement suivant. Le cycle est bouclé.

## Schéma

```text
┌─────────────────────────────────────────────────────────────────┐
│                          openspec/                              │
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────────────┐    │
│   │     specs/       │         │        changes/          │    │
│   │                  │ ◄─────  │                          │    │
│   │ source of truth  │  merge  │ one folder per change    │    │
│   │ how things work  │  on     │ proposal · design ·      │    │
│   │ today            │ archive │ tasks · delta specs      │    │
│   └──────────────────┘         └──────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Deux dossiers. `specs/` représente ce qui est vrai. `changes/`, ce que vous proposez. L'archivage transforme une proposition en vérité de référence.

## Le cycle que vous suivrez réellement

Dans la configuration par défaut, votre journée ressemble à ceci. Vous pouvez commencer par réfléchir au problème ; une commande rédige ensuite le plan, vous le lisez, la suivante le met en œuvre et la dernière l'archive.

```text
/opsx:explore                   →  (optional) think it through with the AI first
/opsx:propose add-dark-mode     →  AI drafts proposal, specs, design, tasks
        (you read and adjust the plan)
/opsx:apply                     →  AI builds it, checking off tasks
/opsx:archive                   →  specs updated, change archived
```

**En cas de doute, commencez par explorer.** `/opsx:explore` est un partenaire de réflexion sans engagement : il lit votre code, expose les options et transforme une idée vague en plan concret avant toute écriture de code. C'est le meilleur antidote à une IA qui, sans cela, construirait *quelque chose* à partir d'une demande imprécise. Vous savez déjà exactement ce que vous voulez ? Passez directement à `/opsx:propose`. Explore est inclus dans le profil par défaut et toujours disponible. Voir le [Guide Explore](/fr-FR/explore/).

Ce sont des commandes slash, saisies dans la conversation de votre assistant IA. La configuration (`openspec init`) se fait dans le terminal. Si cette distinction n'est pas claire, lisez d'abord [Fonctionnement des commandes](/fr-FR/how-commands-work/) : c'est la source de confusion la plus fréquente.

<a id="enablers-not-gates"></a>

## « Des facilitateurs, pas des barrières »

Cette expression revient souvent dans OpenSpec ; voici sa signification en termes simples.

Les processus de spécification classiques suivent un modèle en cascade : terminer le plan, *puis* avoir le droit d'implémenter, et revenir en arrière est pénible. OpenSpec refuse cette rigidité. L'ordre `proposal → specs → design → tasks` indique ce qui devient *possible* ensuite, pas ce que vous êtes *obligé* de faire.

Vous découvrez pendant l'implémentation que la conception est mauvaise ? Modifiez `design.md` et continuez. Le périmètre devrait être réduit ? Mettez à jour la proposition. Rien n'est verrouillé. Les dépendances permettent seulement à l'IA de disposer du contexte nécessaire (impossible de rédiger de bonnes tâches sans spécifications de référence) ; elles ne servent pas à vous enfermer.

L'avantage, c'est l'honnêteté : le vrai travail est désordonné et itératif, et OpenSpec l'accepte. La contrepartie est la discipline : rien ne vous oblige à avancer, donc à vous de garder un changement ciblé plutôt que de le laisser s'étendre. Le guide [Workflows](/fr-FR/workflows/) présente de bonnes habitudes à cet égard.

## Pourquoi ce léger effort en vaut la peine

Soyons francs : OpenSpec ajoute une étape. Vous rédigez un bref plan avant de construire. Qu'y gagnez-vous ?

- **Vous repérez les erreurs d'orientation avant qu'elles ne coûtent cher.** Corriger un malentendu dans une proposition d'un paragraphe ne coûte rien. Le corriger après que l'IA a écrit 400 lignes, si.
- **Le plan et le code restent dans le même dépôt.** Six mois plus tard, la spécification explique à vous et à la prochaine session d'IA pourquoi le système fonctionne ainsi.
- **Les changements peuvent être examinés.** Le dossier du changement est un ensemble clair : lire la proposition, parcourir les deltas, vérifier les tâches. Pas besoin de fouiller dans l'historique des conversations.
- **OpenSpec s'adapte aux bases de code existantes.** Grâce aux deltas, vous pouvez spécifier un changement dans une application de 50 000 lignes sans avoir à tout documenter au préalable.

La contrepartie honnête : pour une correction d'une seule ligne vraiment triviale, le formalisme peut ne pas être rentable, et ce n'est pas grave. OpenSpec est conçu pour rester léger, mais il n'est pas gratuit. Utilisez-le quand un accord est important — ce qui s'avère être le cas la plupart du temps, lorsqu'une IA peut exécuter avec assurance une demande vague.

## Pour continuer

- Vous débutez ? [Bien démarrer](/fr-FR/getting-started/) présente en détail le premier changement.
- Vous ne savez pas encore quoi construire ? Commencez par [Explorer](/fr-FR/explore/).
- Vous ne savez pas où exécuter les commandes ? [Fonctionnement des commandes](/fr-FR/how-commands-work/).
- Envie d'approfondir tout ce qui précède ? [Concepts](/fr-FR/concepts/).
- Vous préférez apprendre par l'exemple ? [Exemples et recettes](/fr-FR/examples/).
- Besoin de définir un terme ? [Glossaire](/fr-FR/glossary/).
