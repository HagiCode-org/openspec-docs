---
title: "Référence CLI"
---

La CLI OpenSpec (`openspec`) fournit des commandes de terminal pour configurer les projets, les valider, consulter leur état et les gérer. Elles complètent les commandes slash IA (comme `/opsx:propose`) décrites dans [Commandes](/fr-FR/commands/).

## Résumé

| Catégorie | Commandes | Fonction |
|----------|----------|---------|
| **Configuration** | `init`, `update` | Initialiser et actualiser OpenSpec dans le projet |
| **Stores (dépôts OpenSpec autonomes)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Gérer les stores — dépôts OpenSpec autonomes enregistrés |
| **Santé** | `doctor` | Indiquer l’état des relations de la racine résolue |
| **Contexte de travail** | `context` | Rassembler l’ensemble de travail (racine + stores référencés) |
| **Ensembles de travail personnels** | `workset create`, `workset list`, `workset open`, `workset remove` | Enregistrer et ouvrir dans votre outil des vues de travail locales et personnelles |
| **Consultation** | `list`, `view`, `show` | Parcourir les changements et spécifications |
| **Validation** | `validate` | Vérifier que les changements et spécifications ne présentent pas de problèmes |
| **Cycle de vie** | `archive` | Finaliser les changements terminés |
| **Workflow** | `new change`, `status`, `instructions`, `templates`, `schemas` | Prise en charge des workflows pilotés par des artefacts |
| **Schémas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Créer et gérer des workflows personnalisés |
| **Configuration** | `config` | Consulter et modifier les paramètres |
| **Utilitaires** | `feedback`, `completion` | Commentaires et intégration au shell |

---

## Commandes pour les personnes et les agents

La plupart des commandes CLI sont conçues pour être utilisées par des **personnes** dans un terminal. Certaines prennent également en charge l’utilisation par des **agents/scripts** grâce à leur sortie JSON.

### Commandes réservées aux personnes

Ces commandes sont interactives et conçues pour le terminal :

| Commande | Fonction |
|---------|---------|
| `openspec init` | Initialiser le projet (invite interactive) |
| `openspec view` | Tableau de bord interactif |
| `openspec workset open <name>` | Ouvrir un ensemble de travail enregistré (fenêtre d’éditeur ou session d’agent dans le terminal) |
| `openspec config edit` | Ouvrir la configuration dans un éditeur |
| `openspec feedback` | Envoyer un commentaire via GitHub |
| `openspec completion install` | Installer la complétion du shell |

### Commandes compatibles avec les agents

Ces commandes proposent `--json` pour être utilisées par des agents IA et des scripts :

| Commande | Utilisation humaine | Utilisation par un agent |
|---------|-----------|-----------|
| `openspec list` | Parcourir les changements/spécifications | `--json` pour des données structurées |
| `openspec show <item>` | Lire le contenu | `--json` pour l’analyse |
| `openspec validate` | Rechercher des problèmes | `--all --json` pour une validation groupée |
| `openspec status` | Voir l’avancement des artefacts | `--json` pour un état structuré |
| `openspec instructions` | Obtenir les étapes suivantes | `--json` pour les instructions destinées à l’agent |
| `openspec templates` | Trouver les chemins des modèles | `--json` pour résoudre les chemins |
| `openspec schemas` | Lister les schémas disponibles | `--json` pour les découvrir ; `--store <id>` pour sélectionner une racine enregistrée |
| `openspec store setup <id>` | Créer et enregistrer un store local | `--json` et paramètres explicites pour une sortie structurée |
| `openspec store register <path>` | Enregistrer un store existant | `--json` pour une sortie structurée |
| `openspec store unregister <id>` | Oublier l’enregistrement local d’un store | `--json` pour une sortie de nettoyage structurée |
| `openspec store remove <id>` | Supprimer le dossier local d’un store enregistré | `--yes --json` pour une suppression non interactive |
| `openspec store list` | Parcourir les stores enregistrés | `--json` pour obtenir la liste structurée |
| `openspec store doctor` | Vérifier la configuration locale des stores | `--json` pour des diagnostics structurés |
| `openspec new change <id>` | Créer la structure d’un changement local au dépôt | `--json`, plus `--store <id>` pour utiliser un store enregistré comme racine OpenSpec |
| `openspec workset create [name]` | Composer une vue de travail personnelle | `--member <path> --json` pour une composition non interactive |
| `openspec workset list` | Parcourir les ensembles enregistrés | `--json` pour des vues structurées |
| `openspec workset remove <name>` | Supprimer une vue enregistrée | `--yes --json` pour une suppression non interactive |

---

## Options globales

Ces options fonctionnent avec toutes les commandes :

| Option | Description |
|--------|-------------|
| `--version`, `-V` | Afficher le numéro de version |
| `--no-color` | Désactiver les couleurs |
| `--help`, `-h` | Afficher l’aide de la commande |

---

## Commandes de configuration

### `openspec init`

Initialiser OpenSpec dans votre projet. Crée la structure des dossiers et configure les intégrations des outils IA.

Par défaut, la commande utilise la configuration globale : profil `core`, distribution `both` et workflows `propose, explore, apply, update, sync, archive`.

```
openspec init [path] [options]
```

Utilisez `--language <language>` pour ajouter une instruction de langue au fichier
`openspec/config.yaml` d’un nouveau projet. Pour un projet existant, modifiez le champ `context`
de la configuration afin qu’OpenSpec n’écrase jamais les consignes propres au projet.

**Arguments :**

| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `path` | Non | Répertoire cible (par défaut : répertoire courant) |

**Options :**

| Option | Description |
|--------|-------------|
| `--tools <list>` | Configurer les outils IA sans interaction. Utiliser `all`, `none` ou une liste séparée par des virgules |
| `--language <language>` | Rédiger les artefacts dans cette langue lors de la création d’une configuration |
| `--force` | Nettoyer automatiquement les anciens fichiers sans demander confirmation |
| `--profile <profile>` | Remplacer le profil global pour cette initialisation (`core` ou `custom`) |
| `--no-animation` | Afficher un écran d’accueil statique au lieu de l’animation |
| `--copilot-cloud` | Configurer sans invite les [fichiers de l’agent de codage cloud](/fr-FR/supported-tools/#agent-de-codage-cloud-github-copilot) GitHub Copilot |
| `--no-copilot-cloud` | Ignorer sans invite les fichiers de l’agent de codage cloud GitHub Copilot |

`--profile custom` utilise les workflows actuellement sélectionnés dans la configuration globale (`openspec config profile`).

L’animation d’accueil est également ignorée si la variable d’environnement `OPENSPEC_NO_ANIMATION` est définie (quelle que soit sa valeur, même vide), si `NO_COLOR` contient une valeur non vide ou si le système active la réduction des animations (Réduire les animations sous macOS, animations désactivées sous GNOME).

**Identifiants d’outils pris en charge (`--tools`)** — `windsurf` est également accepté comme alias de `devin` : `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `command-code`, `codeartsagent`, `codex`, `devin`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `minimax-code`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `codeassistant`, `qoder`, `qwen`, `rovodev`, `roocode`, `trae`, `zed`, `zcode`, `agents`

> Cette liste reprend `AI_TOOLS` dans `src/core/config.ts`. Consultez [Outils pris en charge](/fr-FR/supported-tools/) pour connaître les chemins des skills et commandes de chaque outil.

**Exemples :**

```bash
# Interactive initialization
openspec init

# Initialize in a specific directory
openspec init ./my-project

# Non-interactive: configure for Claude and Cursor
openspec init --tools claude,cursor

# Non-interactive: configure global MiniMax Code skills
openspec init --tools minimax-code

# Configure for all supported tools
openspec init --tools all

# Override profile for this run
openspec init --profile core

# Skip prompts and auto-cleanup legacy files
openspec init --force
```

**Éléments créés :**

```
openspec/
├── specs/              # Your specifications (source of truth)
├── changes/            # Proposed changes
└── config.yaml         # Project configuration

.claude/skills/         # Claude Code skills (if claude selected)
.cursor/skills/         # Cursor skills (if cursor selected)
.cursor/commands/       # Cursor OPSX commands (if delivery includes commands)
.agents/skills/         # Shared skills for AGENTS.md-compatible tools (if agents selected)
... (other tool configs)
```

---

### `openspec update`

Actualiser les fichiers d’instructions OpenSpec après la mise à niveau de la CLI. Régénère les fichiers de configuration des outils IA selon le profil global, les workflows sélectionnés et le mode de distribution actuels.

```
openspec update [path] [options]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `path` | Non | Répertoire cible (par défaut : répertoire courant) |

**Options :**

| Option | Description |
|--------|-------------|
| `--force` | Forcer la mise à jour même si les fichiers sont à jour |

**Exemple :**

```bash
# Update instruction files after npm upgrade
npm install -g @fission-ai/openspec@latest
openspec update
```

Mettez d’abord le paquet à niveau. Les fichiers d’instructions sont générés par la CLI installée ; si celle-ci est obsolète, `openspec update` peut donc tout déclarer à jour sans ajouter les workflows des versions plus récentes.

Pour le signaler, `openspec update` vérifie dans le registre npm si une CLI plus récente a été publiée. Si la vôtre est en retard, la commande propose une mise à niveau :

```text
A newer OpenSpec CLI is available (v1.6.0 → v1.7.0).
  Running from: /usr/local/lib/node_modules/@fission-ai/openspec
? Upgrade to v1.7.0 now? (Y/n)
```

Répondez oui pour exécuter `npm install -g @fission-ai/openspec@latest`, puis relancer la mise à jour avec la nouvelle CLI afin que les nouveaux workflows soient installés dans la même commande. La version est vérifiée en interrogeant le binaire installé plutôt qu’en se fiant au code de sortie de npm ; si une autre installation antérieure dans votre `PATH` répond encore, la commande vous le signale au lieu de prétendre avoir réussi. Répondez non pour afficher la commande sans mise à niveau et continuer avec la CLI actuelle. Ctrl-C interrompt la commande.

Cette proposition n’apparaît que dans un terminal interactif et lorsque l’installation est gérée par npm — le seul cas où `npm install -g` résout le problème. Pour les autres modes d’installation, la commande adaptée est affichée :

| Mode d’installation d’OpenSpec | Résultat |
|---------------------------|--------------|
| Installation npm globale | Invite et mise à niveau automatiques dans un terminal interactif ; la commande est affichée si la sortie est redirigée |
| Installation globale pnpm, bun, yarn ou volta | Commande du gestionnaire correspondant : `pnpm add -g …@latest`, `bun add -g …@latest`, `yarn global add …@latest` ou `volta install …@latest` |
| Dépendance du projet | Indication de mettre à jour la dépendance, car son gestionnaire de paquets contrôle le fichier de verrouillage |
| Cache `npx` / `dlx` | `npx @fission-ai/openspec@latest update` — cette commande effectue la mise à jour directement, sans seconde étape |
| Clone git | Rien — la version utilisée est celle indiquée par la branche |

Lorsqu’un message est affiché, il indique le répertoire depuis lequel la CLI en cours a été chargée. Vérifiez ce chemin si vous avez effectué une mise à niveau, mais qu’un shim obsolète est toujours prioritaire dans votre `PATH`.

La vérification interroge le registre indiqué par `npm_config_registry` si npm l’exporte, sinon `https://registry.npmjs.org`. Aucun fichier `.npmrc` n’est lu : il vaut mieux éviter qu’un fichier détermine la destination d’une requête sortante, et le `.npmrc` du projet est versionné avec le dépôt. Pour utiliser un miroir privé, exportez `npm_config_registry` ou définissez `OPENSPEC_NO_UPDATE_CHECK` pour ignorer entièrement la vérification. Celle-ci est ignorée si `CI` contient une valeur autre que `false`, `0`, `no`, `off` ou vide, si `NODE_ENV=test`, ou si `OPENSPEC_NO_UPDATE_CHECK` (quelle que soit sa valeur), `DO_NOT_TRACK=1` ou `OPENSPEC_TELEMETRY=0` est défini. Elle s’effectue avant la mise à jour et peut la retarder de 1,5 seconde au maximum ; elle abandonne ensuite, même si le réseau perd silencieusement des paquets, et reste silencieuse si le registre est inaccessible.

**Détermination de l’état « à jour » :** les fichiers de skills enregistrent la version qui les a générés,
qu’OpenSpec compare à la CLI installée. Les fichiers de commande ne contiennent pas
d’indication de version ; pour un outil qui utilise des commandes sans skills (distribution
`commands`), OpenSpec compare donc leur contenu à celui qu’il générerait
maintenant : toute modification est considérée comme une dérive et écrasée. Avec une distribution
`skills` ou `both`, seule la version enregistrée est vérifiée ; un fichier modifié à la main
dont la version correspond toujours est conservé ; utilisez `--force` pour le réécrire. Dans tous les cas,
OpenSpec est responsable des fichiers générés. Gardez vos propres instructions
ailleurs.

---

## Stores (dépôts OpenSpec autonomes)

> **Bêta.** Les stores et les fonctionnalités qui s’appuient dessus (références, contexte de travail, ensembles de travail) sont nouveaux ; les noms de commandes, options, formats de fichiers et sorties JSON peuvent évoluer d’une version à l’autre. Pour une présentation organisée autour des problèmes, consultez le [guide des stores](/fr-FR/stores-beta/user-guide/).

Un store est un dépôt OpenSpec autonome enregistré sur cette machine — par exemple un dépôt de planification ou de contrats. Une fois enregistré, les commandes habituelles (`list`, `show`, `status`, `validate`, `new change`, `archive`, etc.) peuvent y agir depuis n’importe où grâce à `--store <id>`.

### `openspec store setup`

Créer et enregistrer un store local. Sans argument dans un terminal,
OpenSpec guide la personne dans la configuration. Les agents et les scripts doivent fournir explicitement
les paramètres et utiliser `--json`.

```bash
openspec store setup [id] [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--path <path>` | Dossier d’installation du store (par ex. `~/openspec/<id>`) |
| `--remote <url>` | Enregistrer le dépôt distant canonique dans le `store.yaml` du nouveau store |
| `--init-git` | Initialiser un dépôt Git avec une première validation (par défaut) |
| `--no-init-git` | Ignorer toutes les opérations Git : ni initialisation ni validation initiale |
| `--json` | Produire une sortie JSON |

Les exécutions non interactives (`--json`, scripts, agents) doivent fournir l’identifiant du store et `--path`. Dans un terminal interactif, setup demande l’emplacement et propose un chemin modifiable dans un emplacement visible appartenant à l’utilisateur (par ex. `~/openspec/<id>`). Il ne choisit jamais par défaut le répertoire de données géré par OpenSpec.

Exemples :

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Enregistrer un dossier de store local existant. Pendant la bêta des stores, une racine peut être
enregistrée avant que des changements existent, que des spécifications aient été appliquées ou que des changements aient
été archivés ; dans ce cas, `openspec/changes/`, `openspec/specs/` et
`openspec/changes/archive/` peuvent être absents jusqu’à ce que les commandes habituelles les créent.
Un dépôt ne contenant que la configuration et déclarant `store: <id>` reste un pointeur vers un autre
store ; il n’est pas enregistré comme racine de store tant que ce pointeur n’est pas supprimé.

```bash
openspec store register [path] [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--id <id>` | Identifiant du store ; par défaut, métadonnées du store ou nom du dossier |
| `--yes` | Confirmer la création des métadonnées d’identité pour une racine OpenSpec saine |
| `--json` | Produire une sortie JSON |

### `openspec store unregister`

Supprimer l’enregistrement local d’un store sans effacer ses fichiers.

```bash
openspec store unregister <id> [--json]
```

Utilisez cette commande si un store a été déplacé ou cloné ailleurs, ou s’il ne doit plus apparaître
dans OpenSpec sur cette machine.

### `openspec store remove`

Supprimer l’enregistrement local d’un store et son dossier.

```bash
openspec store remove <id> [--yes] [--json]
```

Dans un terminal interactif, `remove` affiche le dossier exact avant sa suppression.
Les agents, scripts et appels JSON doivent fournir `--yes` pour confirmer la suppression.
OpenSpec refuse de supprimer un dossier qui ne contient pas les métadonnées
de store correspondantes.

### `openspec store list`

Lister les stores enregistrés localement.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Vérifier l’enregistrement local des stores, leurs métadonnées et la présence de Git.

```bash
openspec store doctor [id] [--json]
```

Doctor est uniquement un outil de diagnostic : il signale les racines manquantes, les incohérences de métadonnées et l’état invalide du registre local sans modifier le store.

### Référencer des stores depuis un projet

Un dépôt de projet peut déclarer les stores dont dépend son travail dans `openspec/config.yaml` :

```yaml
schema: spec-driven
references:
  - team-context
```

Dès lors, la sortie de `openspec instructions` dans ce dépôt (pour les artefacts individuels et la surface `apply`, en mode humain ou JSON) contient un index des spécifications de chaque store référencé : identifiants, résumé d’une ligne issu de la section Purpose et commande de récupération (`openspec show <spec-id> --type spec --store <id>`). L’index est généré à chaque exécution à partir du checkout enregistré ; le contenu des spécifications n’est jamais copié dans la sortie.

Les références fournissent un contexte en lecture seule. Elles ne changent jamais la cible des commandes : le travail reste dans la racine du dépôt, et l’écriture dans un store référencé nécessite toujours l’option explicite `--store`. Une référence impossible à résoudre (par exemple, store non enregistré sur cette machine) devient un avertissement accompagné de la correction exacte ; les instructions sont tout de même générées. `openspec doctor` rassemble les diagnostics des références.

### Enregistrer la source de clonage d’un store

Un store peut consigner sa source de clonage canonique dans son fichier d’identité versionné afin que son intégration ne s’arrête jamais à « enregistrer le store » :

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

Le dépôt distant est inscrit dans `.openspec-store/store.yaml` lors de la première validation ; tous les clones en connaissent donc la source. Pour un store existant, modifiez `store.yaml` manuellement et validez-le. `store doctor` affiche le dépôt distant enregistré (ainsi que l’origine Git constatée dans le checkout) ; les instructions de partage de setup/register le mentionnent ; register inscrit l’origine du checkout dans le registre local à la machine.

Une déclaration de référence peut aussi indiquer la source de clonage ; un collègue qui ne possède pas encore le store obtient ainsi une solution complète à copier-coller (`git clone <remote> <path> && openspec store register <path> --id <id>`) :

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Enregistrer un dépôt distant ne constitue pas une synchronisation : OpenSpec ne clone, ne récupère et ne pousse jamais de son propre chef.

### Déclarer un store par défaut

Un dépôt dont la planification est entièrement externalisée (aucun `openspec/specs/` ni `openspec/changes/` local) peut déclarer son store une fois au lieu de fournir `--store` à chaque commande :

```yaml
# openspec/config.yaml (the only file under openspec/)
store: team-context
```

Les commandes habituelles utilisent alors automatiquement le store déclaré ; la bannière de racine et le bloc JSON `root` indiquent `source: "declared"` et l’identifiant du store, tandis que les indications affichées conservent `--store <id>`. La déclaration est une solution de repli, jamais une surcharge : `--store` explicite est prioritaire et un répertoire contenant de vrais dossiers de planification ignore le pointeur (avec un avertissement). Pour convertir un dépôt pointeur en racine OpenSpec locale, supprimez la ligne `store:` et exécutez `openspec init` — init refuse de créer la structure tant que la déclaration est présente.

Une option au niveau machine s’applique à tous les dépôts : `openspec config set defaultStore <id>` (voir Configuration). Elle n’est prise en compte qu’après l’échec de `--store`, d’une racine locale et d’un pointeur de projet ; la bannière de racine et le bloc JSON `root` indiquent alors `source: "global_default"`.

## Doctor (état des relations)

Une seule question en lecture seule, au même endroit : la racine OpenSpec est-elle saine et les stores qu’elle référence sont-ils disponibles sur cette machine ?

```bash
openspec doctor [--store <id>] [--json]
```

Le rapport distingue l’état de la racine, celui des métadonnées des stores (notamment si le dépôt distant déclaré diffère de l’origine du checkout ou si le checkout est en retard sur sa référence amont récupérée) et celui des références (les mêmes diagnostics que dans les instructions, avec les commandes de clonage pour les références non résolues). Un diagnostic, quel que soit son niveau, renvoie le code 0 — les agents lisent les tableaux `status` ; seuls les échecs de commande (aucune racine, store inconnu) renvoient 1. Doctor ne clone, ne synchronise et ne répare rien. Pour obtenir l’ensemble assemblé plutôt que son état, utilisez `openspec context`.

## Contexte de travail (ensemble assemblé)

Tout ce que le travail relie au moyen des déclarations OpenSpec, regroupé en un ensemble : la racine OpenSpec et les stores référencés.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

Le résumé JSON est destiné aux agents (chaque store référencé disponible fournit sa commande de récupération ; les éléments non résolus donnent les mêmes corrections que `instructions` et `doctor`). `--code-workspace` écrit en outre un fichier d’espace de travail VS Code contenant la racine et les stores référencés disponibles (dossiers `ref:<id>`) — c’est la seule écriture effectuée par cette commande ; si le fichier existe, l’écriture est refusée sans `--force`. Les éléments indisponibles sont signalés, jamais devinés.

Le « contexte de travail » désigne l’ensemble assemblé ; le champ `context:` de `openspec/config.yaml` contient le contexte du projet injecté dans les instructions. Ce sont deux choses différentes. `openspec doctor` indique si l’ensemble est sain ; `openspec context` indique de quoi il se compose.

## Ensembles de travail personnels

> **Bêta.** Les ensembles de travail font partie de la nouvelle surface bêta ; les commandes, options et formats de fichiers peuvent évoluer entre les versions. Pour un guide pratique, consultez le [guide des stores](/fr-FR/stores-beta/user-guide/#ensembles-de-travail--rouvrir-les-dossiers-associés).

Un ensemble de travail est une vue personnelle, nommée, des dossiers que vous utilisez ensemble — une racine de planification et tout autre dossier de votre choix — enregistrée sur votre machine et rouverte par son nom dans votre outil. Elle est entièrement locale : jamais validée, jamais partagée, jamais dérivée de déclarations ; sa suppression ne touche jamais aux dossiers membres.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` propose un bref parcours guidé (ou accepte des options `--member` sans interaction ; le premier membre est principal et les sessions démarrent à cet endroit). `open` lance l’outil sélectionné : les éditeurs (VS Code, Cursor) ouvrent une fenêtre avec tous les membres puis rendent la main ; les agents CLI (Claude Code, codex) prennent le contrôle du terminal dans une session où tous les membres sont attachés, sans prompt prérempli, et se terminent lorsque vous quittez. Tout dossier membre manquant à l’ouverture est ignoré avec un avertissement ; les autres sont ouverts. La préférence d’outil enregistrée peut être remplacée à chaque ouverture avec `--tool`.

La prise en charge d’un nouvel outil relève de la configuration, pas du code. Chaque outil utilise l’un de deux modes de lancement — `workspace-file` (lancement avec le fichier `.code-workspace` généré) ou `attach-dirs` (option d’attachement pour chaque membre). La clé `openers` de `config.json` global (ouvrez-la avec `openspec config edit`) permet d’ajouter des outils ou de régler individuellement les outils intégrés :

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

L’état des ensembles de travail se trouve dans `worksets/`, sous le répertoire global de données (vues enregistrées et fichiers `<name>.code-workspace` générés, régénérés à chaque ouverture). Supprimer ce dossier efface toutes les traces.

---

## Commandes de consultation

### `openspec list`

Lister les changements ou les spécifications du projet.

```
openspec list [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--specs` | Lister les spécifications au lieu des changements |
| `--changes` | Lister les changements (par défaut) |
| `--sort <order>` | Trier selon `recent` (par défaut) ou `name` |
| `--json` | Produire une sortie JSON |

**Exemples :**

```bash
# List all active changes
openspec list

# List all specs
openspec list --specs

# JSON output for scripts
openspec list --json
```

**Sortie (texte) :**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

Afficher un tableau de bord interactif pour parcourir les spécifications et changements.

```
openspec view
```

Ouvre une interface dans le terminal pour parcourir les spécifications et changements du projet.

---

### `openspec show`

Afficher les détails d’un changement ou d’une spécification.

```
openspec show [item-name] [options]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `item-name` | Non | Nom du changement ou de la spécification (demandé si omis) |

**Options :**

| Option | Description |
|--------|-------------|
| `--type <type>` | Préciser le type : `change` ou `spec` (détecté automatiquement si non ambigu) |
| `--json` | Produire une sortie JSON |
| `--no-interactive` | Désactiver les invites |

**Options propres aux changements :**

| Option | Description |
|--------|-------------|
| `--deltas-only` | Afficher uniquement les spécifications différentielles (mode JSON) |

**Options propres aux spécifications :**

| Option | Description |
|--------|-------------|
| `--requirements` | Afficher uniquement les exigences, sans les scénarios (mode JSON) |
| `--no-scenarios` | Exclure les scénarios (mode JSON) |
| `-r, --requirement <id>` | Afficher l’exigence correspondant à cet index (à partir de 1, mode JSON) |

**Exemples :**

```bash
# Interactive selection
openspec show

# Show a specific change
openspec show add-dark-mode

# Show a specific spec
openspec show auth --type spec

# JSON output for parsing
openspec show add-dark-mode --json
```

---

## Commandes de validation

### `openspec validate`

Valider la structure des changements et spécifications, et comparer les exigences MODIFIED d’un changement aux spécifications principales qu’elles remplaceraient.

```
openspec validate [item-name] [options]
```

Un changement sans delta de spécification échoue à la validation, sauf si son `.openspec.yaml` déclare `skip_specs: true` (pour une refactorisation pure, de l’outillage ou de la documentation ; voir [Recette 5](/fr-FR/examples/#recette-5--refactorisation-sans-changement-de-comportement)).

**Arguments :**

| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `item-name` | Non | Élément à valider (demandé si omis) |

**Options :**

| Option | Description |
|--------|-------------|
| `--all` | Valider tous les changements et toutes les spécifications |
| `--changes` | Valider tous les changements |
| `--specs` | Valider toutes les spécifications |
| `--archived` | Vérifier que les tâches de tous les changements archivés sont terminées (pour un contrôle pré-commit) |
| `--type <type>` | Préciser le type si le nom est ambigu : `change` ou `spec` |
| `--strict` | Activer le mode de validation strict |
| `--json` | Produire une sortie JSON |
| `--concurrency <n>` | Nombre maximal de validations parallèles (par défaut : 6, ou variable `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Désactiver les invites |

`--archived` constitue une vérification distincte : elle ne valide pas les deltas (déjà appliqués lors de l’archivage), mais vérifie que toutes les cases de `tasks.md` sont cochées pour chaque changement sous `changes/archive/`. Le code de sortie est non nul si une case ne l’est pas. Cette option repère les changements archivés avec du travail inachevé ; elle est pratique dans un hook pre-commit.

**Exemples :**

```bash
# Interactive validation
openspec validate

# Validate a specific change
openspec validate add-dark-mode

# Validate all changes
openspec validate --changes

# Validate everything with JSON output (for CI/scripts)
openspec validate --all --json

# Strict validation with increased parallelism
openspec validate --all --strict --concurrency 12

# Fail if any archived change still has unchecked tasks
openspec validate --archived
```

**Sortie (texte) :**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**Sortie (JSON) :**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## Commandes du cycle de vie

### `openspec archive`

Archiver un changement terminé et fusionner ses spécifications différentielles dans les spécifications principales.

```
openspec archive [change-name] [options]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `change-name` | Non | Changement à archiver (demandé si omis ; obligatoire lorsqu’aucune réponse à l’invite n’est possible) |

**Options :**

| Option | Description |
|--------|-------------|
| `-y, --yes` | Ignorer les confirmations. Obligatoire si aucune réponse n’est possible (agent IA, tâche CI ou stdin fermé) |
| `--skip-specs` | Ignorer la mise à jour des spécifications pour cet archivage. Un changement sans delta permanent doit plutôt déclarer `skip_specs: true` dans `.openspec.yaml` — l’archivage ne nécessite alors aucune option |
| `--no-validate` | Ignorer la validation (confirmation requise). Désactive également le retrait des fonctionnalités : sans résultat de validation, aucun retrait n’est effectué |

**Exemples :**

```bash
# Interactive archive (asks which change, then confirms)
openspec archive

# Archive specific change
openspec archive add-dark-mode

# Archive without prompts (agents, CI, scripts)
openspec archive add-dark-mode --yes

# Archive a tooling change that doesn't affect specs
openspec archive update-ci-config --skip-specs
```

**Retirer une fonctionnalité :** ajoutez le marqueur de retrait aux métadonnées du changement :

```yaml
# openspec/changes/retire-legacy/.openspec.yaml
schema: spec-driven
retire_capabilities: true
```

Archivez ensuite le changement normalement :

```bash
openspec archive retire-legacy --yes
```

Lorsque le changement supprime la dernière exigence d’une fonctionnalité, OpenSpec supprime
son `spec.md` actif. Les autres deltas de fonctionnalités de ce changement actualisent toujours leurs
spécifications principales. Sans ce marqueur, archive s’arrête avant de modifier les fichiers et
vous demande de l’ajouter.

**Fonctionnement :**

1. Valide le changement (sauf avec `--no-validate`).
2. Demande confirmation (sauf avec `--yes`).
3. Réserve la destination d’archive avant de modifier une spécification principale.
4. Valide et fusionne les spécifications différentielles actives dans `openspec/specs/` — une fonctionnalité dont la dernière exigence est supprimée est retirée et son fichier est supprimé uniquement si `.openspec.yaml` du changement déclare `retire_capabilities: true` à côté de `schema:`.
5. Déplace le dossier vers `openspec/changes/archive/YYYY-MM-DD-<name>/`.
6. Si la modification d’une spécification ou le déplacement final échoue avant que l’archive soit complète, restaure les spécifications et laisse ou remet le changement à son emplacement actif.
7. Si une copie de repli vérifiée est terminée mais que le nettoyage de la source préparée échoue, conserve l’archive complète et l’état des spécifications validé afin de permettre la récupération.

**Sans terminal :** un agent IA, une tâche CI ou une exécution avec stdin fermé ne peut pas
répondre à l’étape 2. Archive s’arrête donc sans rien modifier, renvoie 1 et indique la
commande à relancer — `openspec archive <name> --yes`, avec les autres options
éventuellement fournies. Passez `--yes` (et le nom du changement) dès le départ pour éviter ce détour.

---

## Commandes de workflow

Ces commandes prennent en charge le workflow OPSX piloté par les artefacts. Elles aident les personnes à suivre l’avancement et les agents à déterminer les prochaines étapes.

### `openspec new change`

Créer un dossier de changement et, facultativement, ses métadonnées versionnées dans la racine OpenSpec résolue.

```bash
openspec new change <name> [options]
```

Les noms de changement doivent être en kebab-case minuscule : lettres minuscules, chiffres et
traits d’union simples. Ils ne peuvent contenir d’espaces, tirets bas, lettres majuscules,
traits d’union consécutifs, ni trait d’union en début ou fin. Un chiffre initial est autorisé,
pour numéroter ou catégoriser les changements, par exemple `100-add-feature`
ou `00001-add-auth`.

**Options :**

| Option | Description |
|--------|-------------|
| `--description <text>` | Description à ajouter à `README.md` |
| `--goal <text>` | Métadonnée d’objectif facultative à enregistrer avec le changement |
| `--schema <name>` | Schéma de workflow à utiliser |
| `--store <id>` | Identifiant du store à utiliser comme racine OpenSpec (dépôt OpenSpec autonome enregistré) |
| `--json` | Produire une sortie JSON |

Exemples :

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Afficher l’état d’achèvement des artefacts d’un changement.

```
openspec status [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--change <id>` | Nom du changement (demandé si omis) |
| `--schema <name>` | Remplacer le schéma (détecté automatiquement à partir de la configuration du changement) |
| `--json` | Produire une sortie JSON |

**Exemples :**

```bash
# Interactive status check
openspec status

# Status for specific change
openspec status --change add-dark-mode

# JSON for agent use
openspec status --change add-dark-mode --json
```

**Sortie (texte) :**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[x] specs
[ ] design
[-] tasks (blocked by: design)
```

Un changement déclarant `skip_specs: true` affiche l’étape des spécifications sous la forme `[~] specs (skipped: change declares skip_specs)` et l’exclut du décompte de progression.

**Sortie (JSON) :**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isPlanningComplete": false,
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

`isPlanningComplete` indique si tous les artefacts de planification non ignorés existent ;
les artefacts ignorés sont considérés comme satisfaits sans être créés. Cet indicateur ne dit pas
si les tâches d’implémentation sont terminées. `isComplete` est conservé comme alias
de compatibilité avec la même valeur.

Les artefacts sont listés dans l’ordre de leurs dépendances : une dépendance n’apparaît jamais après
un artefact qui en dépend. Les artefacts qui deviennent prêts simultanément
(`specs` et `design` de `spec-driven` ne dépendent que de `proposal`) gardent l’ordre défini par
le schéma plutôt qu’un ordre alphabétique. Le premier élément `ready` est donc
l’artefact à rédiger ensuite.

---

### `openspec instructions`

Obtenir des instructions enrichies pour créer un artefact ou réaliser des tâches. Les agents IA les utilisent pour savoir quoi créer ensuite.

```
openspec instructions [artifact] [options]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `artifact` | Non | Identifiant d’artefact ou surface d’entrée du workflow : `apply` ou `archive` |

**Options :**

| Option | Description |
|--------|-------------|
| `--change <id>` | Nom du changement (obligatoire en mode non interactif) |
| `--schema <name>` | Remplacer le schéma |
| `--json` | Produire une sortie JSON |

**Cas particuliers :** utilisez `apply` pour obtenir les instructions d’implémentation des tâches. Utilisez
`archive` pour récupérer les entrées d’archivage actuelles en lecture seule (`context` et
`operationGuidance`) d’un changement valide ; cette commande n’archive et ne modifie rien.

**Exemples :**

```bash
# Get instructions for next artifact
openspec instructions --change add-dark-mode

# Get specific artifact instructions
openspec instructions design --change add-dark-mode

# Get apply/implementation instructions
openspec instructions apply --change add-dark-mode

# Get current archive operation inputs without archiving
openspec instructions archive --change add-dark-mode --json

# JSON for agent consumption
openspec instructions design --change add-dark-mode --json
```

**La sortie comprend :**

- Le contenu du modèle de l’artefact.
- Le contexte du projet provenant de la configuration.
- Le contenu des artefacts dont il dépend.
- Les règles par artefact de la configuration.
- Le contexte actuel du projet et les consignes d’opération correspondantes pour `apply`/`archive`.

Les entrées d’opération sont relues à chaque invocation depuis le dépôt résolu ou le store
sélectionné. Le contexte du projet est une entrée obligatoire au niveau du prompt : les agents le lisent et
appliquent les faits, conventions et contraintes pertinents. Les consignes d’opération sont
des conseils supplémentaires facultatifs : les agents considèrent chaque entrée et ne suivent que celles
qui sont applicables et compatibles avec le workflow intégré. Les deux champs restent
distincts des choix explicites de l’utilisateur, de l’état contrôlé par la CLI, des instructions intégrées
et des règles d’artefact. Les conflits de contexte sont signalés ; les consignes incompatibles ou inapplicables
ne sont pas suivies et leur rejet est expliqué. Il s’agit de contrats comportementaux
pour les agents générés, pas de vérifications imposées par la CLI. `instructions archive`
ne renvoie que le changement sélectionné, les entrées facultatives et les métadonnées de la racine ; elle n’inclut pas
le workflow statique d’archivage.

Pour un artefact ignoré à cause de `skip_specs: true`, la sortie n’est qu’un avertissement (JSON ajoute les champs `skipped`/`warning`) — l’artefact ne doit pas être créé.

---

### `openspec templates`

Afficher les chemins résolus des modèles de tous les artefacts d’un schéma.

```
openspec templates [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--schema <name>` | Schéma à examiner (par défaut : `spec-driven`) |
| `--json` | Produire une sortie JSON |

**Exemples :**

```bash
# Show template paths for default schema
openspec templates

# Show templates for custom schema
openspec templates --schema my-workflow

# JSON for programmatic use
openspec templates --json
```

**Sortie (texte) :**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Lister les schémas de workflow disponibles, leur description et leur séquence d’artefacts.

```
openspec schemas [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--json` | Produire une sortie JSON |
| `--store <id>` | Utiliser un store enregistré comme racine OpenSpec |

**Exemple :**

```bash
openspec schemas
```

**Sortie :**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

<a id="schema-commands"></a>

## Commandes de schéma

Commandes de création et de gestion des schémas de workflow personnalisés.

### `openspec schema init`

Créer un schéma local au projet.

```
openspec schema init <name> [options]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `name` | Oui | Nom du schéma (kebab-case) |

**Options :**

| Option | Description |
|--------|-------------|
| `--description <text>` | Description du schéma |
| `--artifacts <list>` | Identifiants d’artefacts séparés par des virgules (par défaut : `proposal,specs,design,tasks`) |
| `--default` | Définir comme schéma par défaut du projet |
| `--no-default` | Ne pas proposer de le définir par défaut |
| `--force` | Écraser le schéma existant |
| `--json` | Produire une sortie JSON |

**Exemples :**

```bash
# Interactive schema creation
openspec schema init research-first

# Non-interactive with specific artifacts
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Éléments créés :**

```
openspec/schemas/<name>/
├── schema.yaml           # Schema definition
└── templates/
    ├── proposal.md       # Template for each artifact
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Copier dans votre projet un schéma existant afin de le personnaliser.

```
openspec schema fork <source> [name] [options]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `source` | Oui | Schéma à copier |
| `name` | Non | Nom du nouveau schéma (par défaut : `<source>-custom`) |

**Options :**

| Option | Description |
|--------|-------------|
| `--force` | Écraser la destination existante |
| `--json` | Produire une sortie JSON |

**Exemple :**

```bash
# Fork the built-in spec-driven schema
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valider la structure et les modèles d’un schéma.

```
openspec schema validate [name] [options]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `name` | Non | Schéma à valider (tous les schémas si omis) |

**Options :**

| Option | Description |
|--------|-------------|
| `--verbose` | Afficher les étapes détaillées de validation |
| `--json` | Produire une sortie JSON |

**Exemple :**

```bash
# Validate a specific schema
openspec schema validate my-workflow

# Validate all schemas
openspec schema validate
```

---

### `openspec schema which`

Afficher la source de résolution d’un schéma (utile pour diagnostiquer les priorités).

```
openspec schema which [name] [options]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `name` | Non | Nom du schéma |

**Options :**

| Option | Description |
|--------|-------------|
| `--all` | Lister tous les schémas avec leurs sources |
| `--json` | Produire une sortie JSON |

**Exemple :**

```bash
# Check where a schema comes from
openspec schema which spec-driven
```

**Sortie :**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Priorité des schémas :**

1. Projet : `openspec/schemas/<name>/`
2. Utilisateur : `~/.local/share/openspec/schemas/<name>/`
3. Paquet : schémas intégrés.

---

## Commandes de configuration

### `openspec config`

Consulter et modifier la configuration globale d’OpenSpec.

```
openspec config <subcommand> [options]
```

**Sous-commandes :**

| Sous-commande | Description |
|------------|-------------|
| `path` | Afficher l’emplacement du fichier de configuration |
| `list` | Afficher tous les paramètres actuels |
| `get <key>` | Obtenir une valeur précise |
| `set <key> <value>` | Définir une valeur |
| `unset <key>` | Supprimer une clé |
| `reset` | Rétablir les valeurs par défaut |
| `edit` | Ouvrir dans `$EDITOR` |
| `profile [preset]` | Configurer le profil de workflow de manière interactive ou via un préréglage |

**Exemples :**

```bash
# Show config file path
openspec config path

# List all settings
openspec config list

# Get a specific value
openspec config get telemetry.enabled

# Set a value (disable anonymous usage telemetry)
openspec config set telemetry.enabled false

# Set a string value explicitly
openspec config set user.name "My Name" --string

# Remove a custom setting
openspec config unset user.name

# Set a machine-level default store (fallback root when no --store,
# local root, or project store: pointer resolves)
openspec config set defaultStore team-plans

# Reset all configuration
openspec config reset --all --yes

# Edit config in your editor
openspec config edit

# Configure profile with action-based wizard
openspec config profile

# Fast preset: switch workflows to core (keeps delivery mode)
openspec config profile core
```

**Désactivation de la télémétrie :** `telemetry.enabled` est activé par défaut s’il n’est pas défini (désinscription facultative).
Définissez-le sur `false` pour désactiver les statistiques d’utilisation anonymes et la vérification de version de `openspec update`.
Les variables d’environnement sont prioritaires sur la configuration : `OPENSPEC_TELEMETRY=0`, `DO_NOT_TRACK=1`,
et une valeur vraie pour `CI` (par ex. `true`/`1`/`yes`) désactivent toujours la télémétrie, quelle que soit la configuration.

`openspec config profile` commence par résumer l’état actuel, puis vous permet de choisir :
- Modifier la distribution et les workflows
- Modifier uniquement la distribution
- Modifier uniquement les workflows
- Conserver les paramètres actuels (quitter)

Si vous conservez les paramètres actuels, aucune modification n’est écrite et aucune invite de mise à jour n’est affichée.
S’il n’y a aucun changement de configuration mais que les fichiers du projet ne correspondent pas au profil ou à la distribution globaux, OpenSpec affiche un avertissement et suggère `openspec update`.
`Ctrl+C` annule également le processus proprement (sans trace d’erreur) et renvoie le code `130`.
Dans la liste des workflows, `[x]` signifie que le workflow est sélectionné dans la configuration globale. Pour appliquer ces choix aux fichiers du projet, exécutez `openspec update` (ou sélectionnez `Apply changes to this project now?` lorsque l’invite apparaît dans un projet).

**Exemples interactifs :**

```bash
# Delivery-only update
openspec config profile
# choose: Change delivery only
# choose delivery: Skills only

# Workflows-only update
openspec config profile
# choose: Change workflows only
# toggle workflows in the checklist, then confirm
```

---

## Commandes utilitaires

### `openspec feedback`

Envoyer un commentaire sur OpenSpec. Crée une issue GitHub.

```
openspec feedback <message> [options]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `message` | Oui | Résumé du commentaire ; un texte long est raccourci dans le titre de l’issue et conservé dans son corps |

**Options :**

| Option | Description |
|--------|-------------|
| `--body <text>` | Détails supplémentaires ajoutés après le résumé |

**Prérequis :** GitHub CLI (`gh`) doit être installé et authentifié.

**Exemple :**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Gérer la complétion du shell pour la CLI OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Sous-commandes :**

| Sous-commande | Description |
|------------|-------------|
| `generate [shell]` | Envoyer le script de complétion sur stdout |
| `install [shell]` | Installer la complétion pour votre shell |
| `uninstall [shell]` | Supprimer les complétions installées |

**Supported shells:** `bash`, `zsh`, `fish`, `powershell`

**Exemples :**

```bash
# Install completions (auto-detects shell)
openspec completion install

# Install for specific shell
openspec completion install zsh

# Generate script for manual installation (bash)
openspec completion generate bash > ~/.bash_completion.d/openspec

# Uninstall
openspec completion uninstall
```

**Windows (PowerShell) :** installez la complétion pour l’instance PowerShell actuelle :

```powershell
$env:PROFILE = $PROFILE
openspec completion install powershell
. $PROFILE
```

`$env:PROFILE` indique à OpenSpec le profil à configurer pour cette session. Le
programme d’installation crée les répertoires de profil manquants et ajoute un bloc géré qui charge
`OpenSpecCompletion.ps1`. Rechargez le profil pour activer immédiatement la complétion.

Pour désinstaller depuis l’instance actuelle, exécutez :

```powershell
$env:PROFILE = $PROFILE
openspec completion uninstall powershell
```

Redémarrez PowerShell après la désinstallation pour supprimer la complétion de la session actuelle.

La complétion est facultative. La CLI la mentionne une seule fois sur stderr, lors de la première
exécution d’une commande dans un terminal interactif, puis reste silencieuse — elle ne signale rien non plus
si la complétion est déjà installée. Définissez `OPENSPEC_NO_COMPLETIONS=1` pour
supprimer complètement cette indication.

---

## Codes de sortie

| Code | Signification |
|------|---------|
| `0` | Réussite |
| `1` | Erreur (échec de validation, fichiers manquants, etc.) |

---

## Variables d’environnement

| Variable | Description |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Définir sur `0` pour désactiver la télémétrie et la vérification de version de `openspec update` (prioritaire sur `telemetry.enabled` dans la configuration globale) |
| `DO_NOT_TRACK` | Définir sur `1` pour désactiver la télémétrie et la vérification de version de `openspec update` (signal DNT standard, prioritaire sur la configuration) |
| `OPENSPEC_CONCURRENCY` | Nombre de validations groupées exécutées simultanément (par défaut : 6) |
| `EDITOR` ou `VISUAL` | Éditeur utilisé par `openspec config edit` |
| `NO_COLOR` | Désactiver les couleurs lorsqu’elle est définie |
| `OPENSPEC_NO_ANIMATION` | Désactiver l’animation d’accueil de `openspec init` lorsqu’elle est définie |
| `OPENSPEC_NO_COMPLETIONS` | Définir sur `1` pour supprimer l’indication unique sur la complétion du shell |
| `OPENSPEC_NO_UPDATE_CHECK` | Désactiver la recherche de nouvelles versions de la CLI par `openspec update` lorsqu’elle est définie (quelle que soit sa valeur, même vide). La vérification est aussi ignorée si `CI` est défini (sauf `false`/`0`/`no`/`off`) ou si `NODE_ENV=test` |
| `npm_config_registry` | Registre interrogé par la vérification de version `openspec update`. Doit être une URL `http(s)`, sinon `https://registry.npmjs.org` est utilisé. Aucun fichier `.npmrc` n’est lu |

---

## Documentation associée

- [Commandes](/fr-FR/commands/) — commandes slash IA (`/opsx:propose`, `/opsx:apply`, etc.)
- [Workflows](/fr-FR/workflows/) — pratiques courantes et choix des commandes
- [Personnalisation](/fr-FR/customization/) — créer des schémas et modèles personnalisés
- [Bien démarrer](/fr-FR/getting-started/) — guide de première configuration
