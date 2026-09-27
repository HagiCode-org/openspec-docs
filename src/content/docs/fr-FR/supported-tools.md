---
title: "Outils pris en charge"
---

OpenSpec fonctionne avec de nombreux assistants de programmation IA. Lorsque vous exécutez `openspec init`, OpenSpec configure les outils sélectionnés en fonction du profil/workflow actif et du mode de distribution.

## Fonctionnement

Pour chaque outil sélectionné, OpenSpec peut installer :

1. Des **skills** (si le mode de distribution les inclut) : `.../skills/openspec-*/SKILL.md`
2. Des **commandes** (si le mode de distribution les inclut) : fichiers de commande `opsx-*` propres à l'outil

Codex utilise uniquement les skills : OpenSpec y installe `.agents/skills/openspec-*/SKILL.md`, même si la distribution est configurée sur `commands`, et ne génère pas de fichiers d'invite Codex personnalisés. Les skills gérés par OpenSpec qui se trouvent dans l'ancien chemin `.codex/skills` sont rapprochés après l'écriture de leurs remplacements ; les fichiers personnalisés ou divergents sont préservés.

Par défaut, OpenSpec utilise le profil `core`, qui comprend :

- `propose`
- `explore`
- `apply`
- `update`
- `sync`
- `archive`

Vous pouvez activer les workflows étendus (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) avec `openspec config profile`, puis exécuter `openspec update`.

<a id="how-to-invoke"></a>

## Forme à utiliser

Cette documentation utilise `/opsx:propose` comme forme canonique, mais chaque outil l'écrit comme il charge le fichier créé par OpenSpec. Repérez le chemin de commande de votre outil dans la [Référence des répertoires d'outils](#tool-directory-reference) ci-dessous, puis associez sa forme à cette liste.

| Fichier de commande généré par OpenSpec | Forme à saisir | Outils |
|-----------------------------------------|----------------|--------|
| `.../commands/opsx/<id>.*` — le dossier `opsx/` indique l'espace de noms | `/opsx:<id>` | Claude Code, CodeBuddy, Crush, Gemini CLI, Lingma, Qoder, ZCode |
| `.../opsx-<id>.*` — le nom du fichier est la commande | `/opsx-<id>` | Tous les autres outils générant des fichiers de commande, sauf Amazon Q et Devin |
| `.devin/workflows/opsx-<id>.md` — lu par un seul des deux agents Devin | `/opsx-<id>` dans Devin Desktop, `/openspec-<skill>` dans Devin Local | Devin Desktop\*\*\*\* |
| `.amazonq/prompts/opsx-<id>.md` — un prompt, pas une commande | `@opsx-<id>` | Amazon Q Developer |
| aucun — skills uniquement | `/openspec-<skill>` | CodeArts, ForgeCode, Hermes, MiniMax Code, Mistral Vibe, Zed Agent, `.agents` partagé |
| aucun — Kimi Code | `/skill:openspec-<skill>` | Kimi Code |
| aucun — Codex CLI | `$openspec-<skill>` | Codex ([`/openspec-<skill>` n'est pas reconnu](https://github.com/openai/codex/issues/11817)) |

Ainsi, `/opsx:propose` s'écrit `/opsx-propose` dans Cursor, `@opsx-propose` dans Amazon Q et `$openspec-propose` dans Codex.

Deux aspects varient indépendamment, d'où les lignes distinctes :

- **Le nom.** Les deux premières lignes ne diffèrent que par le nommage du fichier. Le préfixe `opsx-<id>` / `opsx:<id>` est le même pour tous les outils qui génèrent des fichiers de commande.
- **Le mode d'appel.** Amazon Q charge les fichiers dans une bibliothèque de prompts qu'on appelle avec `@`. Les outils n'utilisant que des skills ne génèrent aucun fichier de commande ; les trois dernières lignes utilisent donc les noms de *skills* indiqués à [Noms des skills générés](#generated-skill-names), qui ne correspondent pas un à un aux identifiants de commande (`/opsx:apply` correspond au skill `openspec-apply-change`).

Les motifs de chemins de commande ci-dessus ne précisent volontairement pas d'extension (`.*`) : l'extension dépend de l'outil (`.toml` pour Gemini CLI, `.prompt` pour Continue, `.prompt.md` pour Kiro et GitHub Copilot) et certains outils affichent le nom et son extension dans le sélecteur. Choisissez la forme du répertoire, pas celle de l'extension.

Les fichiers générés par OpenSpec ainsi que l'indication « Getting started » affichée après la configuration utilisent déjà la forme adaptée aux outils sélectionnés. Le plus rapide est donc de consulter cette indication.

<a id="tool-directory-reference"></a>

## Référence des répertoires d'outils

| Outil (ID) | Motif de chemin des skills | Motif de chemin des commandes |
|------------|----------------------------|------------------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| Command Code (`command-code`) | `.commandcode/skills/openspec-*/SKILL.md` | `.commandcode/commands/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | Non générées (pas d'adaptateur de commandes ; utiliser les appels de skills `/openspec-*`) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.agents/skills/openspec-*/SKILL.md` | Non générées (skills uniquement ; utiliser `$openspec-*`) |
| Devin Desktop, anciennement Windsurf (`devin`) | `.devin/skills/openspec-*/SKILL.md` | `.devin/workflows/opsx-<id>.md`\*\*\*\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Non générées (pas d'adaptateur de commandes ; utiliser les appels de skills `/openspec-*`) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | Non générées (pas d'adaptateur de commandes ; utiliser les appels de skills `/openspec-*`) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilo/command/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | Non générées (pas d'adaptateur de commandes ; utiliser les appels de skills `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| MiniMax Code (`minimax-code`) | `~/.minimax/skills/openspec-*/SKILL.md` | Non générées (pas d'adaptateur de commandes ; utiliser les skills MiniMax Code) |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Non générées (pas d'adaptateur de commandes ; utiliser les appels de skills `/openspec-*`) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| SourceCraft Code Assistant for VS Code (`codeassistant`) | `.codeassistant/skills/openspec-*/SKILL.md` | `.codeassistant/commands/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx/<id>.md` |
| [Rovo Dev CLI](https://support.atlassian.com/rovo/docs/use-rovo-dev-cli/) (`rovodev`) | `.rovodev/skills/openspec-*/SKILL.md` | Non générées. Rovo n'a pas de surface de commandes slash ; il sélectionne automatiquement les skills ou les utilise sur demande (par ex. « utilise le skill openspec-propose »). `/skills` ne sert qu'à les gérer. Les contenus générés citent les skills par leur nom, jamais sous forme de commandes `/openspec-*`. |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| [Zed Agent](https://zed.dev/docs/ai/skills) (`zed`) | `.agents/skills/openspec-*/SKILL.md` | Non générées (skills uniquement ; utiliser `/openspec-*` ou `@openspec-*`) |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |
| Skills `.agents` partagés (`agents`) | `.agents/skills/openspec-*/SKILL.md` | Non générées (pas d'adaptateur de commandes ; utiliser les appels de skills `/openspec-*`) |

\*\* Les fichiers de prompt de GitHub Copilot sont reconnus comme commandes slash personnalisées dans les extensions IDE (VS Code, JetBrains, Visual Studio). Copilot CLI ne lit actuellement pas directement `.github/prompts/*.prompt.md`. La sélection de `github-copilot` peut aussi configurer l'**agent de codage cloud** hébergé par GitHub ; voir [Agent de codage cloud GitHub Copilot](#github-copilot-cloud-coding-agent) ci-dessous.

\*\*\* Hermes charge les skills depuis `~/.hermes/skills/` par défaut. Pour utiliser les skills OpenSpec du projet, ajoutez le répertoire `.hermes/skills/` du projet à `skills.external_dirs` dans `~/.hermes/config.yaml`. Hermes expose alors les skills par des commandes slash telles que `/openspec-propose`.

\*\*\*\* Windsurf a été [rebaptisé Devin Desktop](https://docs.devin.ai/desktop/devin-desktop-faq) le 2 juin 2026, et son répertoire de configuration a changé : `.devin/` est désormais l'emplacement privilégié en lecture et en écriture ; `.windsurf/` sert de repli historique en lecture seule. OpenSpec applique ce changement : l'identifiant de l'outil est `devin` et `--tools windsurf` continue de fonctionner comme alias afin de préserver les scripts existants. Lors du prochain `openspec update`, les anciens fichiers OpenSpec présents dans `.windsurf/` peuvent être déplacés vers le nouvel emplacement. Si vous refusez, ils restent là ; les fichiers rédigés par vos soins ne sont jamais modifiés. Les workflows sont appelés par nom de fichier : `.devin/workflows/opsx-apply.md` s'appelle donc `/opsx-apply`. [Devin Local ne prend pas en charge les workflows](https://docs.devin.ai/desktop/devin-local) — uniquement les skills, et il ne lit pas `.windsurf/`. Lorsque OpenSpec écrit des skills Devin, leur contenu et l'indication de démarrage utilisent donc les appels de skills `/openspec-*`, compatibles avec les deux agents. En mode de distribution limité aux commandes, aucun skill n'est écrit et les deux agents utilisent `/opsx-*`.

L'intégration SourceCraft Code Assistant concerne son extension VS Code. Ses [commandes personnalisées](https://sourcecraft.dev/portal/docs/en/code-assistant/operations/agent/slash-commands) et ses [skills](https://sourcecraft.dev/portal/docs/ru/code-assistant/operations/agent/skills) ne sont disponibles que dans VS Code. Cette intégration ne configure pas SourceCraft sur le Web ni dans JetBrains.

Avec la distribution uniquement par skills, demandez à Code Assistant d'utiliser le skill `openspec-propose` avec votre idée. Les skills s'activent en fonction de la requête ; OpenSpec ne génère pas de commande `/openspec-*` pour cet outil.

MiniMax Code est une intégration globale qui n'utilise que des skills. OpenSpec écrit uniquement ses répertoires `openspec-*` sous `~/.minimax/skills/` ; il ne crée pas de dossiers `.minimax` ni `.mavis` locaux au dépôt. Une distribution limitée aux commandes laisse intacts les skills globaux MiniMax Code, afin que le paramètre de distribution d'un projet ne supprime pas ceux utilisés par un autre.

<a id="github-copilot-cloud-coding-agent"></a>

### Agent de codage cloud GitHub Copilot

L'[agent de codage Copilot](https://docs.github.com/en/copilot/using-github-copilot/coding-agent) de GitHub s'exécute sur GitHub dans un environnement GitHub Actions, séparé de Copilot dans votre éditeur. OpenSpec peut le configurer pour utiliser la CLI OpenSpec en générant deux fichiers :

- `.github/workflows/copilot-setup-steps.yml` — installe `@fission-ai/openspec` dans l'environnement de l'agent.
- `.github/agents/openspec.agent.md` — explique à l'agent comment utiliser OpenSpec.

Comme cette opération écrit un workflow GitHub Actions dans votre dépôt, elle est **facultative** :

| Méthode | Comportement |
|---------|--------------|
| `openspec init` (interactif) | Demande si les fichiers cloud doivent être configurés. Valeur par défaut : **Non**. |
| `openspec init --copilot-cloud` | Les configure sans poser de question (scripts/CI). |
| `openspec init --no-copilot-cloud` | Les ignore sans poser de question et supprime ceux déjà générés. |
| `openspec update` | Ne pose jamais de question. Actualise ces fichiers uniquement si vous avez choisi cette option ou si le projet les contient déjà. En cas de refus, supprime les fichiers cloud gérés par OpenSpec. |

Votre choix est enregistré dans `openspec/config.yaml` sous `githubCopilot.cloudAgent: true|false` afin que les mises à jour non interactives le respectent. OpenSpec n'écrit ou ne supprime que les fichiers dont il a généré le contenu : si vous personnalisez `copilot-setup-steps.yml` ou `openspec.agent.md`, ou possédez déjà vos propres fichiers, il les laisse intacts (et `init`/`update` vous le signale).

### Quand sélectionner la cible `.agents` partagée

`agents` est l'option indépendante du fournisseur : elle écrit les skills dans `.agents/skills/`, répertoire commun à de nombreux outils d'agent, plutôt que dans un emplacement propre à chaque outil.

| Situation | Choix recommandé |
|-----------|------------------|
| Votre outil possède sa propre ligne ci-dessus | Son identifiant : vous bénéficiez de son intégration, dont les commandes slash lorsqu'il les prend en charge |
| Plusieurs agents utilisent `.agents/skills` dans le même dépôt | `agents` : une seule arborescence de skills plutôt qu'une par outil |
| Votre outil n'est pas encore répertorié, mais lit `.agents/skills` | `agents` |

Il est possible de sélectionner cette cible en même temps qu'un identifiant propre à un outil ; chacun écrit normalement dans son propre répertoire. Codex et Zed Agent font exception, car ils partagent le répertoire canonique `.agents`. Si Codex est sélectionné avec Zed ou `agents`, OpenSpec conserve une seule arborescence gérée par Codex. Ses indications de relais proposent `$openspec-*` pour Codex et `/openspec-*` aux autres agents ; `--tools all` et les configurations multi-agents existantes continuent ainsi de fonctionner sans que deux outils écrasent les mêmes fichiers.

OpenSpec la propose aussi automatiquement si le projet possède un répertoire `.agents/skills/` — un simple `.agents/` ne suffit pas, car des outils y rangent également des règles et des définitions de sous-agents. À noter : `.agents` n'est pas `.agent` ; le répertoire singulier appartient à Antigravity.

Deux points à connaître :

- **Skills uniquement.** Aucun adaptateur de commandes n'existe, donc aucun fichier `opsx-*` n'est écrit. Avec une distribution incluant les commandes, `openspec init` indique `agents` parmi les outils signalés sous `Commands skipped for: … (no adapter)`. Appelez les workflows par leur nom de skill. La plupart des assistants qui lisent `.agents/skills` utilisent `/openspec-propose`, forme affichée par OpenSpec ; cette cible est indépendante du fournisseur, donc consultez la documentation de votre assistant s'il emploie une autre forme.
- **Aucun `AGENTS.md` n'est créé ni modifié.** Cette cible se limite au répertoire `.agents/`. Si un ancien `AGENTS.md` à la racine contient des blocs de marqueur OpenSpec, `openspec update` les supprime ; voir le [Guide de migration](/fr-FR/migration-guide/).

La prise en charge de Zed concerne son agent intégré. Zed External Agents et Terminal Threads disposent de leurs propres intégrations. Les Agent Skills nécessitent [Zed v1.4.2](https://github.com/zed-industries/zed/releases/tag/v1.4.2) ou une version ultérieure. Les skills locaux au projet ne sont pas disponibles dans un arbre de travail non approuvé tant que vous n'avez pas [accordé votre confiance](https://zed.dev/docs/worktree-trust).

Comme `.agents/skills/` est partagé par Codex, Zed Agent et la cible indépendante des fournisseurs, voici les éléments gérés par OpenSpec : la commande écrit, actualise et supprime uniquement les répertoires de skills `openspec-*` correspondant aux workflows sélectionnés, ainsi qu'un marqueur `.openspec-target` indiquant si Codex, Zed Agent ou la cible indépendante des fournisseurs a généré cette arborescence. Tout le reste est laissé intact. Les noms `openspec-*` et le marqueur appartiennent à OpenSpec ; leurs modifications sont remplacées lors du prochain `openspec update`, comme pour tout autre outil.

Pour les projets antérieurs au marqueur, OpenSpec déduit la propriété à partir des références gérées dans les skills : `$openspec-*` désigne Codex et `/openspec-*` la cible indépendante des fournisseurs. Une arborescence canonique générique coexistant avec l'ancien `.codex/skills` est considérée comme une ancienne installation double et consolidée dans l'arborescence partagée compatible.

`openspec update` respecte également cette propriété. Si `.agents` appartient au projet en tant que cible indépendante et qu'une ancienne installation Codex n'est détectée qu'à partir de fichiers d'invite résiduels, la commande conserve l'arborescence `agents` établie au lieu de la réécrire avec la syntaxe Codex, et préserve les anciens fichiers d'invite. Pour confier l'arborescence partagée à Codex, exécutez explicitement `openspec init --tools codex`.

## Configuration non interactive

Pour une configuration CI/CD ou scriptée, utilisez `--tools` (et éventuellement `--profile`) :

```bash
# Configure specific tools
openspec init --tools claude,cursor

# Configure all supported tools
openspec init --tools all

# Skip tool configuration
openspec init --tools none

# Override profile for this init run
openspec init --profile core
```

**Identifiants d'outil disponibles (`--tools`)** — `windsurf` est également accepté comme alias de `devin` : `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `command-code`, `codeartsagent`, `codex`, `devin`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `minimax-code`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `codeassistant`, `trae`, `zed`, `zcode`, `agents`.

## Installation selon les workflows

OpenSpec installe les artefacts de workflow en fonction des workflows sélectionnés :

- **Profil core (par défaut) :** `propose`, `explore`, `apply`, `update`, `sync`, `archive`
- **Sélection personnalisée :** n'importe quel sous-ensemble des identifiants de workflow :
  `propose`, `explore`, `new`, `continue`, `apply`, `update`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Autrement dit, le nombre de skills/commandes dépend du profil et du mode de distribution ; il n'est pas fixe.

<a id="generated-skill-names"></a>

## Noms des skills générés

Selon le profil et la configuration des workflows, OpenSpec peut générer les skills suivants :

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-update-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

Voir [Commandes](/fr-FR/commands/) pour le comportement des commandes et [CLI](/fr-FR/cli/) pour les options `init`/`update`.

## Documentation associée

- [Référence CLI](/fr-FR/cli/) — commandes de terminal
- [Commandes](/fr-FR/commands/) — commandes slash et skills
- [Bien démarrer](/fr-FR/getting-started/) — première configuration
