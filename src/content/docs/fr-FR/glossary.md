---
title: "Glossaire"
---

Tous les termes OpenSpec réunis au même endroit et définis en langage clair. Parcourez-le une fois : le reste de la documentation vous paraîtra plus facile à lire.

Les termes sont regroupés par thème, puis classés par ordre alphabétique dans chaque groupe.

## Les notions fondamentales

**Spécification (spec).** Document qui décrit le comportement d'une partie de votre système. Les spécifications se trouvent dans `openspec/specs/`, sont organisées par domaine et comprennent des exigences et des scénarios. Une spécification est la réponse convenue à la question « que fait ce logiciel ? ». Voir [Concepts](/fr-FR/concepts/#spécifications).

**Source de vérité.** L'ensemble du répertoire `openspec/specs/`. Il contient le comportement actuel et convenu de votre système. Les changements proposent de le modifier ; l'archivage applique ces modifications.

**Changement (change).** Unité de travail regroupée dans un dossier sous `openspec/changes/<name>/`. Un changement rassemble tout ce qui concerne le travail : proposition, conception, tâches et modifications de spécifications. Un changement, une fonctionnalité ou une correction.

**Artefact.** Document faisant partie d'un changement. Les artefacts habituels sont la proposition, les spécifications différentielles, la conception et les tâches. Ils sont créés dans l'ordre de leurs dépendances et s'alimentent les uns les autres.

**Spécification différentielle (delta spec).** Spécification au sein d'un changement qui décrit uniquement ce qui change, à l'aide des sections `ADDED`, `MODIFIED` et `REMOVED`, au lieu de répéter la spécification entière. C'est ce qui permet à OpenSpec de modifier proprement des systèmes existants. Voir [Concepts](/fr-FR/concepts/#spécifications-différentielles).

**Domaine.** Regroupement logique de spécifications, comme `auth/`, `payments/` ou `ui/`. Choisissez des domaines qui correspondent à votre façon de concevoir le système.

## Dans une spécification

**Exigence.** Comportement que le système doit adopter, généralement formulé avec un mot-clé RFC 2119 : « Le système SHALL expirer une session après 30 minutes. » Une exigence décrit le *quoi*, pas le *comment*.

**Scénario.** Exemple concret et vérifiable d'une exigence en action, généralement au format Étant donné/Quand/Alors. Les scénarios rendent une exigence vérifiable : ils pourraient servir à rédiger un test automatisé.

**Mots-clés RFC 2119.** Les termes MUST, SHALL, SHOULD et MAY, qui donnent une signification normalisée au degré d'obligation d'une exigence. MUST et SHALL sont absolus. SHOULD est une recommandation à laquelle des exceptions sont possibles. MAY indique une option. Leur nom vient du document de normes Internet qui les a définis.

## Les artefacts

**Proposition (`proposal.md`).** Le *pourquoi* et le *quoi* d'un changement : son intention, son périmètre et son approche générale. C'est le premier artefact créé.

**Conception (`design.md`).** Le *comment* : approche technique, décisions d'architecture et fichiers susceptibles d'être modifiés. Facultative pour les changements simples.

**Tâches (`tasks.md`).** Liste de contrôle de l'implémentation, avec des cases à cocher. L'IA la suit pendant `/opsx:apply` et coche les éléments au fur et à mesure.

## Cycle de vie

**Archivage (archive).** Opération qui termine un changement. Ses spécifications différentielles sont fusionnées dans les spécifications principales, puis le dossier est déplacé vers `openspec/changes/archive/YYYY-MM-DD-<name>/`. Après archivage, vos spécifications décrivent la nouvelle réalité. Voir [Concepts](/fr-FR/concepts/#archivage).

**Synchronisation (sync).** Fusion des spécifications différentielles d'un changement dans les spécifications principales *sans* archiver le changement. Elle est généralement proposée automatiquement pendant l'archivage, mais peut être déclenchée seule avec `/opsx:sync` pour les changements de longue durée. Voir [Commandes](/fr-FR/commands/#opsxsync).

## Workflows et commandes

**OPSX.** Workflow OpenSpec standard actuel, construit autour d'actions souples plutôt que de phases rigides. Toutes ses commandes slash commencent par `/opsx:`. Voir [Workflow OPSX](/fr-FR/opsx/).

**Commande slash.** Commande saisie dans la conversation de votre assistant IA, par exemple `/opsx:propose`. Les commandes slash pilotent le workflow ; ce ne sont pas des commandes de terminal. Voir [Fonctionnement des commandes](/fr-FR/how-commands-work/).

**Explore (`/opsx:explore`).** Commande qui sert de partenaire de réflexion. Elle lit votre base de code, compare les options et transforme une idée vague en plan concret. Elle n'écrit jamais de code ni quoi que ce soit d'autre, sauf si vous lui demandez de consigner l'exploration comme changement ou acceptez sa proposition. C'est le point de départ recommandé lorsqu'un problème est identifié mais que le plan reste à définir. Voir [Commencer par explorer](/fr-FR/explore/).

**CLI.** Programme `openspec` exécuté dans votre terminal. Il configure les projets, répertorie et valide les changements, ouvre le tableau de bord et archive les changements. C'est la partie terminal d'OpenSpec. Voir [CLI](/fr-FR/cli/).

**Skill.** Répertoire d'instructions (`.../skills/openspec-*/SKILL.md`) que votre assistant IA détecte et suit automatiquement. Les skills sont la norme multiplateforme émergente pour fournir le workflow OpenSpec aux assistants.

**Fichier de commande.** Fichier de commande slash propre à un outil (`.../commands/opsx-*`). C'est l'ancien mécanisme de distribution, toujours pris en charge avec les skills. Vous aurez rarement besoin de modifier ces fichiers directement.

**Profil.** Ensemble des commandes slash installées dans votre projet. Le profil **core** (par défaut) contient `propose`, `explore`, `apply`, `update`, `sync` et `archive`. Le profil **expanded** y ajoute `new`, `continue`, `ff`, `verify`, `bulk-archive` et `onboard`. Modifiez-le avec `openspec config profile`.

**Distribution (delivery).** Détermine si OpenSpec installe des skills, des fichiers de commande ou les deux pour vos outils. Elle se configure globalement et s'applique avec `openspec update`.

## Personnalisation

**Schéma.** Définition des artefacts d'un workflow et de leurs dépendances. Le schéma intégré par défaut est `spec-driven` (proposal → specs → design → tasks). Vous pouvez le copier pour le modifier ou en créer un. Voir [Personnalisation](/fr-FR/customization/#schémas-personnalisés).

**Modèle (template).** Fichier Markdown d'un schéma qui détermine ce que l'IA génère pour un artefact donné. Modifier un modèle change immédiatement la sortie de l'IA, sans reconstruction.

**Configuration du projet (`openspec/config.yaml`).** Paramètres propres à un projet : schéma par défaut, `context:` injecté dans chaque requête de planification et `rules:` par artefact. C'est la façon la plus simple de renseigner OpenSpec sur votre pile technique et vos conventions. Voir [Personnalisation](/fr-FR/customization/#configuration-du-projet).

**Injection du contexte.** Ajout d'informations sur le projet dans le champ `context:` de `config.yaml`, pour qu'elles soient automatiquement incluses dans chaque artefact généré par l'IA. Plus fiable que de compter sur l'IA pour lire un fichier séparé.

**Graphe de dépendances.** Graphe orienté formé par les relations `requires:` entre les artefacts. C'est un DAG (graphe orienté acyclique : les flèches vont toujours de l'avant et ne forment jamais de boucle) qu'OpenSpec utilise pour déterminer ce qui peut être créé ensuite.

**Des facilitateurs, pas des barrières (enablers, not gates).** Principe selon lequel les dépendances entre artefacts indiquent ce qui devient *possible* ensuite, pas ce qui est *obligatoire*. Vous pouvez revenir à n'importe quel artefact et le modifier à tout moment. Voir [Les concepts fondamentaux en bref](/fr-FR/overview/#-des-facilitateurs-pas-des-barrières-).

## Coordination entre dépôts (bêta)

Ces termes ne s'appliquent que si votre planification couvre plusieurs dépôts. Cette fonctionnalité est en bêta ; la plupart des utilisateurs peuvent les ignorer. Voir le [Guide de l'utilisateur des stores](/fr-FR/stores-beta/user-guide/).

**Store.** Dépôt autonome consacré à la planification. Il reprend la structure `openspec/` que vous connaissez déjà (spécifications et changements), à laquelle s'ajoute un petit fichier d'identité. Vous l'enregistrez une fois sur votre machine, sous un nom, puis n'importe quelle commande OpenSpec peut l'utiliser depuis n'importe quel emplacement.

**Référence.** Déclaration, dans le `openspec/config.yaml` d'un dépôt de code, d'un store dont ce dépôt dépend. Les références sont en lecture seule : le dépôt conserve sa propre racine, et `openspec instructions` ajoute un index des spécifications du store référencé, chacune accompagnée de la commande exacte pour la récupérer.

**Contexte de travail.** Ensemble des éléments rassemblés par `openspec context` pour le dépôt actuel : sa racine OpenSpec et chacun des stores référencés, avec les instructions permettant de les récupérer. C'est la réponse à la question « sur quoi est-ce que je travaille ? ».

**Ensemble de travail (workset).** Ensemble personnel et local à une machine de dossiers que vous ouvrez simultanément (un store avec les dépôts de code concernés). Il est créé explicitement avec `openspec workset create` ; les chemins locaux ne sont jamais validés dans le dépôt de planification partagé.

## Voir aussi

- [Les concepts fondamentaux en bref](/fr-FR/overview/) : les cinq idées sur une page
- [Concepts](/fr-FR/concepts/) : explication détaillée
- [Fonctionnement des commandes](/fr-FR/how-commands-work/) : commandes slash et CLI
