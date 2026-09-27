---
title: "Dépannage"
---

Des solutions concrètes à des problèmes précis. Chaque entrée décrit un symptôme, indique brièvement sa cause probable et propose une solution. Si votre problème ne figure pas ici, la [FAQ](/fr-FR/faq/) peut vous aider ; le [Discord](https://discord.gg/YctCnvvshC) est également une bonne ressource.

## Installation et configuration

### `openspec: command not found`

La CLI n'est pas installée ou votre shell ne la trouve pas. Installez-la globalement et vérifiez :

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Si l'installation a réussi mais que la commande reste introuvable, le répertoire global `bin` de npm n'est probablement pas dans votre `PATH`. Exécutez `npm prefix -g` pour connaître l'emplacement des paquets globaux : sous macOS et Linux, les exécutables sont dans le sous-répertoire `bin/` ; sous Windows, ils se trouvent directement dans ce répertoire. Vérifiez que le chemin correspondant figure dans votre `PATH`. (`npm bin -g` a été supprimé dans npm 9.)

Si vous avez utilisé l'[installation assistée par IA](/fr-FR/installation/#installer-avec-votre-assistant-ia), cet arrêt est prévu : l'instruction demande à l'assistant de vous montrer comment modifier le `PATH` sans toucher lui-même aux fichiers de démarrage du shell.

### « Requires Node.js 20.19.0 or higher »

OpenSpec nécessite Node 20.19.0 ou une version ultérieure. Vérifiez votre version et mettez-la à niveau au besoin :

```bash
node --version
```

Si vous installez OpenSpec avec bun, notez qu'il *s'exécute* toujours avec Node ; Node 20.19.0 ou une version ultérieure doit donc être disponible dans votre `PATH`. Voir [Installation](/fr-FR/installation/).

### `openspec init` n'a pas configuré mon outil d'IA

Init vous demande quels outils configurer. Si vous avez oublié le vôtre ou souhaitez en ajouter un, relancez la commande ou utilisez sa forme non interactive :

```bash
openspec init --tools claude,cursor
```

La liste complète des identifiants d'outils figure dans [Outils pris en charge](/fr-FR/supported-tools/). Utilisez `--tools all` pour tous les outils ou `--tools none` pour ignorer leur configuration.

<a id="commands-dont-show-up"></a>

## Les commandes n'apparaissent pas

Si `/opsx:propose` (ou son équivalent dans votre outil) n'apparaît pas ou ne fait rien, suivez la liste ci-dessous dans l'ordre ; les vérifications les plus rapides sont en premier.

1. **Vous n'êtes peut-être pas au bon endroit.** Les commandes slash se saisissent dans la conversation de votre assistant IA, pas dans le terminal. Si vous avez tapé `/opsx:propose` dans le shell, voilà le problème. Voir [Fonctionnement des commandes](/fr-FR/how-commands-work/).

2. **Régénérez les fichiers.** Depuis la racine du projet :

   ```bash
   openspec update
   ```

   Cette commande réécrit les fichiers de skills et de commandes pour chaque outil configuré.

   Les fichiers d'instructions sont générés par la CLI *installée*. Une CLI obsolète peut donc signaler que tout est à jour sans jamais écrire les nouveaux workflows. `openspec update` vérifie maintenant ce cas et propose une mise à niveau ; acceptez-la si l'option apparaît.

3. **Redémarrez votre assistant.** La plupart des outils recherchent les skills et commandes au démarrage ; ouvrir une nouvelle fenêtre suffit souvent.

4. **Vérifiez que les fichiers existent.** Dans Claude Code, vérifiez que `.claude/skills/` contient des dossiers `openspec-*`. Les autres outils utilisent leurs propres répertoires, répertoriés dans [Outils pris en charge](/fr-FR/supported-tools/).

5. **Vérifiez que vous avez initialisé ce projet.** Les skills sont créés pour chaque projet. Si vous avez cloné un dépôt ou changé de dossier, exécutez `openspec init` (ou `openspec update`) à cet emplacement.

6. **Vérifiez que votre outil prend en charge les fichiers de commande.** Codex, CodeArts, ForgeCode, Hermes, Kimi Code, Mistral Vibe, Zed Agent et la cible `.agents` partagée ne reçoivent pas de fichiers de commande `opsx-*` générés ; ils utilisent des skills, donc `/opsx` ne sera jamais complété automatiquement. Saisissez `$openspec-propose` dans Codex, `/skill:openspec-propose` dans Kimi Code et `/openspec-propose` dans les autres. La cible `.agents` partagée est indépendante du fournisseur ; `/openspec-propose` est la forme courante, pas une garantie. Si votre assistant n'y répond pas, consultez sa documentation sur l'appel des skills. Amazon Q reçoit des fichiers de commande, mais les charge dans sa bibliothèque de prompts au lieu du menu slash : saisissez-y `@opsx-propose`, pas `/opsx`. La forme de chaque outil figure dans [Forme à utiliser](/fr-FR/supported-tools/#forme-à-utiliser).

## Travailler sur les changements

### « Change not found »

La commande n'a pas pu déterminer de quel changement il s'agissait. Indiquez son nom explicitement ou vérifiez la liste :

```bash
openspec list                    # see active changes
/opsx:apply add-dark-mode        # name the change in chat
```

Vérifiez également que vous vous trouvez dans le bon répertoire de projet.

### « No artifacts ready »

Chaque artefact a déjà été créé ou attend une dépendance. Vérifiez ce qui bloque :

```bash
openspec status --change <name>
```

Créez ensuite d'abord la dépendance manquante. Rappel de l'ordre : la proposition permet de créer les spécifications et la conception ; les spécifications et la conception permettent ensemble de créer les tâches.

### `openspec validate` signale des avertissements ou des erreurs

La validation vérifie la structure des spécifications et des changements. Lisez le message : il indique le fichier et le problème.

```bash
openspec validate <name>           # validate one item
openspec validate --all            # validate everything
openspec validate --all --strict   # stricter checks, good for CI
openspec validate --archived       # fail if archived changes have unchecked tasks
```

Les causes fréquentes sont une section obligatoire manquante (par exemple une spécification sans scénario) ou un en-tête de delta mal formé. Corrigez le fichier et relancez la commande. La [référence CLI](/fr-FR/cli/#openspec-validate) documente le format des résultats.

Un message mérite une explication particulière :

```text
MODIFIED "<requirement>" omits scenario(s) the current spec still has: "<scenario>"
```

Une exigence `MODIFIED` remplace tout le bloc correspondant ; elle doit donc conserver chaque scénario maintenu après le changement, et pas seulement ceux que vous avez modifiés. Copiez les scénarios indiqués depuis `openspec/specs/<capability-path>/spec.md` vers le delta, en préservant les répertoires de domaine dans le chemin. Ce message apparaît souvent sur un ancien changement après qu'un autre changement a ajouté un scénario à la même exigence. L'archivage refuserait ce changement dans les deux cas ; la validation vous en informe maintenant avant l'implémentation.

### L'IA a créé des artefacts incomplets ou incorrects

L'IA ne disposait pas d'assez de contexte. Quelques options peuvent aider :

- Ajoutez du contexte de projet dans `openspec/config.yaml`, afin que votre pile technique et vos conventions soient incluses dans chaque requête. Voir [Personnalisation](/fr-FR/customization/#configuration-du-projet).
- Ajoutez des `rules:` par artefact pour les consignes qui s'appliquent uniquement, par exemple, aux spécifications.
- Fournissez une description plus détaillée lorsque vous proposez le changement.
- Utilisez `/opsx:continue` du profil étendu pour créer un artefact à la fois et relire chaque résultat plutôt que de laisser `/opsx:ff` tout créer d'un coup.

### L'archivage ne se termine pas ou signale des tâches incomplètes

L'archivage n'est pas *bloqué* par les tâches incomplètes, mais un avertissement est affiché, car archiver signifie généralement que le travail est terminé. Si les tâches restantes sont volontaires (vous archivez un changement partiel), continuez. Sinon, terminez-les d'abord. Si les spécifications différentielles n'ont pas encore été synchronisées dans les spécifications principales, l'archivage proposera également de le faire ; acceptez, sauf raison contraire.

### « User force closed the prompt with 0 null »

`openspec archive` a été exécuté dans un contexte où aucune réponse n'est possible — par exemple par un agent IA, une tâche CI ou un shell dont stdin est fermé. L'archivage pose jusqu'à trois questions de confirmation ; auparavant, une réponse impossible provoquait ce message brut.

Utilisez `--yes` pour confirmer toutes les questions à l'avance :

```bash
openspec archive <change-name> --yes
```

Conservez les éventuelles autres options déjà utilisées : `--skip-specs` et `--no-validate` modifient le comportement de l'archivage ; une nouvelle exécution avec `--yes` seul n'est donc pas équivalente. Les versions récentes indiquent le nom de l'option et affichent une ligne `Fix:` prête à coller. Si vous vouliez choisir dans une liste, indiquez explicitement le nom du changement : le sélecteur nécessite lui aussi une réponse.

Si vous avez redirigé ou capturé la sortie d'archive dans un fichier avec une ancienne version et fourni une réponse par tube (`printf 'y\n' | openspec archive …`), l'affichage de l'invite pouvait écrire des codes d'échappement du terminal dans le fichier capturé — au point parfois de le faire grossir considérablement. Les versions récentes lisent les confirmations en texte brut lorsque stdout n'est pas un terminal. De plus, `openspec archive` sans argument (qui afficherait autrement un sélecteur interactif) demande désormais un nom explicite au lieu d'afficher un menu dans la capture. Ainsi, les exécutions redirigées ou par agent restent propres ; l'option `--yes` avec le nom du changement supprime entièrement les invites.

## Configuration

### Mon `config.yaml` n'est pas appliqué

Trois causes fréquentes :

1. **Nom de fichier incorrect.** Il doit être `openspec/config.yaml`, et non `.yml`.
2. **YAML invalide.** Vérifiez-le avec un validateur YAML ; la CLI signale également les erreurs de syntaxe et leurs numéros de ligne.
3. **Vous pensez qu'un redémarrage est nécessaire.** Ce n'est pas le cas. Les modifications de configuration prennent effet immédiatement.

### « Unknown artifact ID in rules: X »

Une clé sous `rules:` ne correspond à aucun artefact du schéma. Dans le schéma `spec-driven` par défaut, les identifiants valides sont `proposal`, `specs`, `design` et `tasks`. Pour afficher les identifiants de n'importe quel schéma :

```bash
openspec schemas --json
```

### « Context too large »

Le champ `context:` est limité à 50 Ko, car il est injecté dans chaque requête. Résumez son contenu ou créez un lien vers des documents plus longs au lieu de les coller. Un contexte concis donne également des résultats meilleurs et plus rapides.

### « Schema not found »

Le schéma indiqué n'existe pas. Énumérez les schémas disponibles et vérifiez l'orthographe :

```bash
openspec schemas                    # list available schemas
openspec schema which <name>        # see where a schema resolves from
openspec schema init <name>         # create a custom one
```

Voir [Personnalisation](/fr-FR/customization/#schémas-personnalisés).

## Migration depuis l'ancien workflow

### « Legacy files detected in non-interactive mode »

Vous êtes en CI ou dans un shell non interactif. OpenSpec a trouvé d'anciens fichiers à nettoyer, mais ne peut pas vous demander confirmation. Autorisez l'opération automatiquement :

```bash
openspec init --force
```

Avec Codex, OpenSpec peut détecter d'anciens fichiers d'invite gérés dans `$CODEX_HOME/prompts` ou `~/.codex/prompts`. Le nettoyage est limité aux noms de fichiers d'invite Codex obsolètes explicitement autorisés par OpenSpec. En mode non interactif, `openspec init` ne supprime que les fichiers remplacés par des skills `.agents/skills/openspec-*` existants. En mode non interactif, `openspec update` ne touche pas aux anciens fichiers, sauf si vous lui transmettez `--force`.

### Les commandes ne sont pas apparues après la migration

Redémarrez votre IDE : les skills sont détectés au démarrage. S'ils n'apparaissent toujours pas, exécutez `openspec update` et vérifiez les emplacements de fichiers indiqués dans [Outils pris en charge](/fr-FR/supported-tools/).

### Mon ancien fichier `project.md` n'a pas été migré

C'est voulu. OpenSpec ne supprime jamais automatiquement `project.md`, car il peut contenir du contexte que vous avez écrit. Déplacez les informations utiles dans le champ `context:` de `config.yaml`, puis supprimez vous-même l'ancien fichier. Le [Guide de migration](/fr-FR/migration-guide/#migrer-projectmd-vers-configyaml) explique la marche à suivre et propose une consigne à transmettre à l'IA pour en extraire les informations utiles.

## Toujours bloqué ?

- **Discord :** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **Problèmes GitHub :** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Depuis le terminal :** `openspec feedback "description du problème"` ouvre une issue.

Lorsque vous signalez un problème, indiquez la version d'OpenSpec (`openspec --version`), celle de Node (`node --version`), votre outil IA, ainsi que la commande et sa sortie exactes. Cela accélère considérablement le diagnostic.
