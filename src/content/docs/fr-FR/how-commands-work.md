---
title: "Fonctionnement des commandes"
---

**À retenir : OpenSpec propose deux types de commandes, qui s'exécutent à deux endroits différents.**

- Les commandes `openspec ...` s'exécutent dans votre **terminal**. (Exemple : `openspec init`.)
- Les commandes `/opsx:...` s'exécutent dans la **conversation avec votre assistant IA**. (Exemple : `/opsx:propose`.)

Si vous saisissez `/opsx:propose` dans le terminal et qu'il ne se passe rien, vous comprendrez pourquoi en lisant cette page : vous vous adressez à la mauvaise moitié d'OpenSpec. Les commandes slash ne sont pas des commandes de terminal. Ce sont des instructions données à votre assistant de programmation IA dans la même zone de conversation où vous écririez normalement « ajoute un formulaire de connexion ».

Cette distinction est le principal obstacle rencontré par les personnes qui découvrent OpenSpec. Clarifions-la sans ambiguïté.

## Les deux moitiés

OpenSpec est un seul projet qui remplit deux rôles.

**La CLI (côté terminal).** Programme nommé `openspec`, que vous installez et lancez depuis votre shell. Il configure votre projet, répertorie et valide les changements, affiche un tableau de bord et archive les travaux terminés. Saisissez ces commandes dans iTerm, le terminal VS Code, PowerShell ou n'importe quel endroit où vous utiliseriez `git` ou `npm`.

```bash
openspec init        # set up OpenSpec in this project
openspec list        # see active changes
openspec view        # open the interactive dashboard
```

**Les commandes slash (côté conversation).** Commandes courtes comme `/opsx:propose` et `/opsx:apply`, que vous saisissez dans la conversation de votre assistant IA. Elles lui demandent de suivre le workflow OpenSpec : rédiger une proposition, écrire des spécifications, réaliser le travail à partir de la liste de tâches et archiver une fois terminé. Saisissez-les dans Claude Code, Cursor, Devin Desktop, Copilot ou l'assistant de votre choix.

```text
/opsx:propose add-dark-mode    (typed in your AI chat)
/opsx:apply                    (typed in your AI chat)
/opsx:archive                  (typed in your AI chat)
```

Voici le modèle mental en un seul schéma :

```text
        YOUR TERMINAL                         YOUR AI ASSISTANT'S CHAT
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   installs    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   commands    │  /opsx:archive                │
   └──────────────────────┘    & skills   └──────────────────────────────┘
        run openspec here                       run /opsx:* here
```

Notez la flèche. C'est l'exécution de `openspec init` dans le terminal qui *installe* les commandes slash dans votre outil d'IA. La moitié terminal configure la moitié conversation. Ensuite, le travail quotidien se fait principalement dans la conversation.

## « Comment démarrer le mode interactif ? »

**Il n'y a pas de mode interactif distinct à démarrer.** Cette question revient souvent ; voici une réponse directe.

Vous n'entrez pas dans un mode OpenSpec spécial. Ouvrez votre assistant de programmation IA comme d'habitude et saisissez une commande slash dans la conversation. La commande slash *est* la façon d'« entrer » dans OpenSpec. Votre assistant la reconnaît, charge le skill OpenSpec correspondant et commence à suivre le workflow.

En pratique :

1. Ouvrez votre assistant IA (Claude Code, Cursor, Devin Desktop, etc.) dans votre projet.
2. Saisissez `/opsx:propose` dans sa conversation, à l'endroit où vous taperiez n'importe quelle autre demande.
3. Observez la complétion automatique : si OpenSpec est installé, `/opsx:propose`, `/opsx:apply` et les autres options apparaîtront lorsque vous saisirez la barre oblique.

C'est tout. Aucun mode à activer, aucun démon à lancer, aucune fenêtre séparée.

Il existe bien une fonction interactive dans le terminal : `openspec view`. Elle ouvre un tableau de bord pour parcourir vos spécifications et changements. Mais c'est un outil de consultation, pas celui qui sert à proposer et réaliser des changements. Leur réalisation se fait à l'aide des commandes slash dans la conversation.

## Pourquoi cette séparation ?

C'est utile de le comprendre : cela explique pourquoi OpenSpec fonctionne avec plus de 30 outils d'IA.

La CLI est le **moteur**. Elle connaît les règles : structure des dossiers de changement, dépendances entre les artefacts, fusion d'une spécification différentielle dans la source de vérité. Elle fonctionne de la même manière partout.

Les commandes slash sont le **volant**, différent pour chaque outil d'IA. Claude Code les appelle des commandes. Cursor et Devin Desktop ont leurs propres formats. Certains outils utilisent des skills. Quand vous exécutez `openspec init`, OpenSpec génère le type de fichier adapté à chaque outil sélectionné ; la même intention `/opsx:propose` fonctionne donc avec l'assistant de votre choix.

Avantage : vous apprenez le workflow une fois et l'emportez d'un outil à l'autre. Contrepartie : la syntaxe exacte d'une commande peut varier légèrement selon l'outil, comme l'explique la section suivante.

## Syntaxe des commandes slash selon l'outil

L'intention est partout identique. L'orthographe dépend du fichier chargé par votre outil.

| Fichier de commande de l'outil | Forme à saisir | Exemples d'outils |
|-------------------------------|----------------|------------------|
| `.../commands/opsx/<id>.*` | `/opsx:propose` | Claude Code, Gemini CLI, Crush |
| `.../opsx-<id>.*` | `/opsx-propose` | Cursor, GitHub Copilot (IDE), Devin Desktop, Trae, Oh My Pi |
| `.amazonq/prompts/opsx-<id>.md` | `@opsx-propose` | Amazon Q Developer |
| aucun — skills uniquement | `/openspec-propose` | CodeArts, ForgeCode, Hermes, Mistral Vibe, Zed Agent, `.agents` partagé |
| aucun — Kimi Code | `/skill:openspec-propose` | Kimi Code |
| aucun — Codex CLI | `$openspec-propose` | Codex |

Devin est le seul outil présent sur deux lignes. Devin Desktop lit `.devin/workflows/` : `/opsx-propose` y fonctionne. [Devin Local ne le fait pas](https://docs.devin.ai/desktop/devin-local) ; utilisez plutôt le skill `/openspec-propose`. Les skills qu'OpenSpec écrit dans `.devin/skills/` fonctionnent avec les deux agents, d'où leurs renvois réciproques par nom de skill.

Chaque outil figure dans le tableau [Forme à utiliser](/fr-FR/supported-tools/#forme-à-utiliser), qui fait autorité. Deux lignes ne correspondent pas à des commandes slash : Amazon Q charge ses fichiers dans une bibliothèque de prompts appelée avec `@`, et les trois dernières lignes utilisent le nom du *skill*, qui n'est pas l'identifiant de commande (`/opsx:apply` correspond au skill `openspec-apply-change`).

En cas de doute, lisez la ligne « Getting started » affichée par `openspec init` : elle utilise déjà la forme enregistrée par votre outil. Vous pouvez également commencer à saisir une barre oblique et observer la complétion automatique, pour les outils qui proposent des commandes slash.

## Origine des commandes : skills et fichiers de commande

Lorsque vous exécutez `openspec init` (ou `openspec update`), OpenSpec écrit de petits fichiers dans votre projet pour que votre outil d'IA puisse trouver le workflow. Selon l'outil et les paramètres, ce sont des **skills**, des **commandes**, ou les deux.

- Les **skills** se trouvent dans des dossiers tels que `.claude/skills/openspec-*/SKILL.md`. Ils constituent la nouvelle norme multiplateforme : un ensemble d'instructions détecté automatiquement par l'assistant.
- Les **commandes** se trouvent dans des dossiers tels que `.cursor/commands/opsx-<id>.md` ou `.claude/commands/opsx/<id>.md` ; leur structure dépend de l'outil et détermine la forme de la commande. Il s'agit des anciens fichiers de commande slash propres à chaque outil. Codex ne reçoit pas de fichiers de commande générés : utilisez `.agents/skills/openspec-*`.

Vous n'avez pas besoin de savoir lequel votre outil utilise. Saisissez simplement la commande slash et elle fonctionnera. Mais savoir que ces fichiers existent aide au diagnostic : si les commandes disparaissent, ces fichiers sont généralement absents ou périmés ; `openspec update` les régénère.

Consultez [Outils pris en charge](/fr-FR/supported-tools/) pour connaître les chemins exacts de chaque outil et le [Guide de migration](/fr-FR/migration-guide/) pour savoir comment les skills ont remplacé l'ancienne approche exclusivement fondée sur les commandes.

## Vérifier l'installation

Quelques vérifications rapides, de la plus simple à la plus complète :

1. **Saisissez une barre oblique dans la conversation avec votre IA.** Commencez par `/opsx` et observez les suggestions. Si elles apparaissent, tout est prêt. Avec un outil n'utilisant que des skills (Codex, Kimi Code, CodeArts, ForgeCode, Hermes, Mistral Vibe, Zed Agent ou la cible `.agents` partagée), `/opsx` ne sera jamais complété, même si l'installation fonctionne : essayez plutôt le nom de skill indiqué dans le tableau ci-dessus.
2. **Vérifiez les fichiers.** Avec Claude Code, vérifiez que `.claude/skills/` contient des dossiers `openspec-*`. Les autres outils utilisent leurs propres répertoires, indiqués dans [Outils pris en charge](/fr-FR/supported-tools/).
3. **Relancez la configuration.** À la racine du projet, exécutez `openspec update`. Cette commande régénère les fichiers de skills et de commandes pour les outils configurés.
4. **Redémarrez votre assistant.** De nombreux outils recherchent les skills et les commandes au démarrage ; ouvrir une nouvelle fenêtre peut suffire.

## Quelles commandes sont disponibles ?

Par défaut, OpenSpec installe le jeu de commandes slash **core** :

- `/opsx:explore` : réfléchir à une idée avec l'IA avant de s'engager dans un changement (excellent premier pas en cas d'incertitude)
- `/opsx:propose` : créer un changement et rédiger tous ses artefacts de planification en une étape
- `/opsx:apply` : réaliser le changement en parcourant sa liste de tâches
- `/opsx:update` : réviser les artefacts de planification et les garder cohérents
- `/opsx:sync` : fusionner les mises à jour de spécifications dans les spécifications principales (généralement automatique)
- `/opsx:archive` : terminer un changement et l'archiver

Rythme par défaut recommandé : `explore` pour réfléchir à la tâche, puis `propose`, `apply` et `archive`. Le guide [Commencer par explorer](/fr-FR/explore/) explique l'intérêt de cette première étape.

Il existe également un jeu **étendu** pour les personnes qui souhaitent un contrôle plus fin (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Activez-le avec `openspec config profile`, puis appliquez-le avec `openspec update`.

Vous découvrez tout cela ? `/opsx:onboard` (dans le jeu étendu) vous accompagne dans un changement complet de votre propre base de code en commentant chaque étape. C'est l'introduction la plus accessible possible.

Pour le détail de chaque commande, consultez [Commandes](/fr-FR/commands/). Pour savoir laquelle choisir selon la situation, consultez [Workflows](/fr-FR/workflows/).

## Un premier parcours sans détour

Voici la séquence complète, chaque étape étant indiquée avec son emplacement :

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (installs slash commands into your AI tool)

AI CHAT      /opsx:explore
              (optional: think the idea through with the AI first)

AI CHAT      /opsx:propose add-dark-mode
              (AI drafts proposal, specs, design, tasks)

AI CHAT      /opsx:apply
              (AI builds it, checking off tasks)

AI CHAT      /opsx:archive
              (change is merged into your specs and filed away)
```

Deux étapes dans le terminal pour configurer le tout, puis le travail se fait dans la conversation. Voilà le rythme.

## Documentation associée

- [Bien démarrer](/fr-FR/getting-started/) : parcours complet du premier changement
- [Commandes](/fr-FR/commands/) : détail de chaque commande slash
- [CLI](/fr-FR/cli/) : détail de chaque commande de terminal
- [Outils pris en charge](/fr-FR/supported-tools/) : syntaxe et emplacement des fichiers pour chaque outil
- [FAQ](/fr-FR/faq/) : réponses rapides supplémentaires
- [Dépannage](/fr-FR/troubleshooting/) : résoudre les problèmes d'affichage des commandes
