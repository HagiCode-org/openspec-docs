---
title: "Foire aux questions"
---

Réponses rapides aux questions les plus fréquentes. Si votre question porte plutôt sur un problème, consultez [Dépannage](/fr-FR/troubleshooting/). Pour la définition d'un terme, consultez le [Glossaire](/fr-FR/glossary/).

## Les bases

### Qu'est-ce qu'OpenSpec, en une phrase ?

Une couche légère qui vous permet de convenir par écrit avec votre assistant de programmation IA de ce qu'il faut construire, avant toute écriture de code.

### Pourquoi en aurais-je besoin ?

Parce que les assistants IA restent sûrs d'eux même lorsqu'ils se trompent. Quand les exigences ne figurent que dans une conversation, l'IA comble les lacunes par des suppositions et vous ne découvrez le résultat qu'une fois le code écrit. OpenSpec fait intervenir cet accord plus tôt, lorsque les erreurs sont peu coûteuses à corriger. Voir [Les concepts fondamentaux en bref](/fr-FR/overview/) pour les explications détaillées.

### Dois-je l'utiliser pour tout ?

Non. Utilisez-le lorsque l'accord est important, ce qui est le cas de la plupart des travaux non triviaux. Pour corriger une faute d'une seule lettre, le formalisme n'en vaut probablement pas la peine — et c'est très bien ainsi.

### Est-ce adapté à une grande base de code existante ou seulement aux nouveaux projets ?

Les bases de code existantes sont le cas d'usage principal. OpenSpec privilégie les projets déjà établis : vous n'avez pas à documenter toute votre application d'avance. Vous rédigez des spécifications uniquement pour les éléments touchés par chaque changement ; elles s'enrichissent au fil du travail réel. Un guide est consacré à ce sujet : [Utiliser OpenSpec dans un projet existant](/fr-FR/existing-projects/).

### OpenSpec est-il lié à un seul outil d'IA ?

Non. OpenSpec fonctionne avec plus de 30 assistants, notamment Claude Code, Cursor, Devin Desktop, GitHub Copilot, Gemini CLI, Codex et d'autres. La liste complète et les détails par outil figurent dans [Outils pris en charge](/fr-FR/supported-tools/).

## Exécuter les commandes

### Où saisir `/opsx:propose` ?

Dans la conversation de votre assistant IA, pas dans le terminal. C'est la confusion la plus fréquente et elle a sa propre page : [Fonctionnement des commandes](/fr-FR/how-commands-work/). En bref : `openspec ...` s'exécute dans le terminal ; `/opsx:...` dans la conversation.

### Comment « démarrer le mode interactif » ?

Il n'y a aucun mode distinct à démarrer. Ouvrez votre assistant IA comme d'habitude et saisissez une commande slash dans sa conversation. La commande slash permet d'« entrer » dans OpenSpec. (La seule fonction vraiment interactive du terminal est `openspec view`, un tableau de bord pour parcourir les spécifications et les changements.) Consultez [Fonctionnement des commandes](/fr-FR/how-commands-work/) pour en savoir plus.

### J'ai saisi une commande slash, mais rien ne s'est passé. Pourquoi ?

Vous l'avez probablement saisie dans le terminal plutôt que dans la conversation avec votre IA, la forme utilisée n'est pas prise en charge par votre outil, ou les commandes ne sont pas encore installées. Si les fichiers sont absents — ou si l'outil n'a jamais été configuré — exécutez `openspec init` ; `openspec update` actualise uniquement les fichiers existants. Redémarrez ensuite votre assistant et utilisez la forme indiquée sous « Getting started » — voir [Forme à utiliser](/fr-FR/supported-tools/#forme-à-utiliser). [Dépannage](/fr-FR/troubleshooting/#les-commandes-napparaissent-pas) propose une liste complète de vérifications.

### Pourquoi la syntaxe est-elle `/opsx:propose` dans un outil et `/opsx-propose` dans un autre ?

Chaque outil d'IA présente les commandes personnalisées à sa façon ; OpenSpec les nomme comme l'outil charge le fichier correspondant. Un fichier nommé `opsx-propose.md` s'appelle `/opsx-propose` ; un fichier rangé dans `commands/opsx/` s'appelle `/opsx:propose`. Les outils qui utilisent des skills plutôt que des commandes reprennent le nom du skill : Codex demande `$openspec-propose`, Kimi Code `/skill:openspec-propose`. La ligne « Getting started » affichée par `openspec init` indique la bonne forme pour vos outils ; le tableau complet se trouve dans [Forme à utiliser](/fr-FR/supported-tools/#forme-à-utiliser).

### Quelle est la différence entre un skill et une commande ?

Ce sont deux types de fichiers qu'OpenSpec écrit pour que votre assistant puisse suivre le workflow. Les skills (`.../skills/openspec-*/SKILL.md`) sont la nouvelle norme multiplateforme ; les commandes (`.../commands/opsx-*`) sont les anciens fichiers slash propres à chaque outil. Vous n'avez pas à choisir : saisissez la commande slash et OpenSpec installe le format utilisé par votre outil.

## Le workflow

### Par où commencer si je ne sais pas quoi construire ?

Avec `/opsx:explore`. C'est un partenaire de réflexion sans engagement : il lit votre base de code, expose les options et transforme un problème vague en plan concret, avant toute écriture de code. Cette commande appartient au profil par défaut et reste toujours disponible. Une fois le plan clair, elle passe le relais à `/opsx:propose`. C'est la meilleure habitude à prendre : elle empêche une IA enthousiaste de construire avec assurance la mauvaise chose. Voir [Commencer par explorer](/fr-FR/explore/).

### Quel est le workflow le plus simple ?

```text
/opsx:explore (optional)   then   /opsx:propose <what you want>   then   /opsx:apply   then   /opsx:archive
```

Explore pour réfléchir, propose pour rédiger le plan, apply pour le réaliser et archive pour le classer. Omettez Explore si vous savez déjà exactement ce que vous voulez.

### Quelle différence entre `/opsx:propose` et `/opsx:new` ?

`/opsx:propose` est la commande par défaut en une étape : elle crée le changement et rédige tous les artefacts de planification d'un coup. `/opsx:new` fait partie du jeu étendu et ne crée que la structure d'un changement vide ; vous rédigez les artefacts un par un avec `/opsx:continue` (ou tous à la fois avec `/opsx:ff`). Utilisez propose, sauf si vous souhaitez avancer étape par étape. Voir [Commandes](/fr-FR/commands/).

### Que sont les profils `core` et étendu ?

Un profil détermine les commandes slash installées. Le profil **core** (par défaut) fournit `propose`, `explore`, `apply`, `update`, `sync` et `archive`. Le jeu **étendu** ajoute `new`, `continue`, `ff`, `verify`, `bulk-archive` et `onboard` pour un contrôle plus fin. Changez de profil avec `openspec config profile`, puis appliquez-le avec `openspec update`.

### Dois-je exécuter `/opsx:sync` ?

Généralement non. Sync fusionne les spécifications différentielles d'un changement dans les spécifications principales, et `/opsx:archive` vous proposera de le faire. Lancez sync manuellement uniquement si vous souhaitez fusionner les spécifications avant l'archivage, par exemple pour un changement de longue durée. Voir [Commandes](/fr-FR/commands/#opsxsync).

### Comment modifier une proposition, une spécification ou une tâche après avoir commencé ?

Modifiez simplement le fichier. Chaque artefact est du Markdown ordinaire dans `openspec/changes/<name>/` ; aucune phase n'est verrouillée et aucun mode d'édition spécial n'existe. Modifiez-le vous-même ou demandez à l'IA de le réviser (« remplace la solution par une file d'attente »), puis continuez. L'IA travaille toujours à partir du contenu actuel du fichier. Guide complet : [Modifier et faire évoluer un changement](/fr-FR/editing-changes/).

### Puis-je revenir au plan pour le modifier après avoir commencé l'implémentation ?

Oui, à tout moment. Le workflow est fluide : la revue et l'édition ne sont pas des phases dont vous pourriez être exclu. Modifiez l'artefact, puis continuez. Pour vérifier méthodiquement que le code correspond toujours au plan, lancez `/opsx:verify`. Voir [Modifier et faire évoluer un changement](/fr-FR/editing-changes/#-comment-revenir-à-la-revue-après-limplémentation--).

### J'ai modifié le code à la main. Comment le réconcilier avec la spécification ?

Rétablissez leur cohérence avant l'archivage, car vos spécifications deviennent alors la référence officielle. Si le code est correct, adaptez le delta à ce que vous avez réellement livré ; si la spécification est correcte, continuez jusqu'à ce que le code lui corresponde. `/opsx:verify` signale les écarts. Voir [Modifier et faire évoluer un changement](/fr-FR/editing-changes/#-jai-modifié-le-code-à-la-main-comment-le-réconcilier-avec-openspec--).

### Quand mettre à jour un changement existant et quand en créer un nouveau ?

Mettez-le à jour si le travail reste le même et que vous l'affinez. Recommencez avec un nouveau changement si l'intention a fondamentalement évolué ou si le périmètre s'est étendu à un travail distinct. [Workflows](/fr-FR/workflows/#mettre-à-jour-ou-repartir-de-zéro) fournit un organigramme et des exemples.

### Que faire si ma session manque de contexte ou si les exigences changent en cours d'implémentation ?

C'est là que les spécifications montrent leur utilité. Le plan étant enregistré dans des fichiers (et pas uniquement dans l'historique de la conversation), vous pouvez effacer le contexte, démarrer une nouvelle session d'IA et reprendre avec `/opsx:apply` ; la commande lit les artefacts et reprend à la première tâche non cochée. Si les exigences changent, mettez à jour les artefacts pour refléter la nouvelle réalité et continuez. Un contexte de session propre améliore aussi les résultats ; effacez-le avant l'implémentation.

<a id="should-i-commit-the-openspec-folder-to-git"></a>

### Dois-je valider le dossier `openspec/` dans git ?

Oui. Vos spécifications, changements actifs et archives font partie de l'historique du projet. Validez-les comme n'importe quel autre code source. L'archive devient notamment une trace durable des raisons pour lesquelles le système fonctionne comme il le fait.

## Spécifications et changements

### Que faut-il mettre dans une spécification plutôt que dans une conception ?

Une spécification décrit le comportement observable : ce que fait le système, ses entrées, ses sorties et ses conditions d'erreur. Une conception décrit comment le construire : approche technique, décisions d'architecture et modifications de fichiers. Si l'implémentation peut changer sans modifier le comportement visible, l'information relève de la conception, pas de la spécification. [Concepts](/fr-FR/concepts/#ce-quest-et-nest-pas-une-spécification) approfondit cette distinction.

### Qu'est-ce qu'une spécification différentielle ?

Une spécification qui décrit uniquement les changements, à l'aide des sections `ADDED`, `MODIFIED` et `REMOVED`, sans répéter toute la spécification. OpenSpec peut ainsi modifier proprement des systèmes existants. Voir [Concepts](/fr-FR/concepts/#spécifications-différentielles).

### Où vont les changements archivés ?

Dans `openspec/changes/archive/YYYY-MM-DD-<name>/`, où tous les artefacts du changement sont conservés. Le changement disparaît de la liste des changements actifs. Un changement qui déclare explicitement `retire_capabilities: true` peut aussi supprimer la spécification principale d'une fonctionnalité lorsqu'il en supprime la dernière exigence.

## Configuration et personnalisation

### Comment renseigner l'IA sur ma pile technique ?

Ajoutez ces informations sous `context:` dans `openspec/config.yaml`. Elles sont injectées dans chaque requête de planification afin que l'IA connaisse toujours votre pile et vos conventions. Voir [Personnalisation](/fr-FR/customization/#configuration-du-projet).

### Puis-je générer des spécifications dans une autre langue que l'anglais ?

Oui. Ajoutez une instruction de langue sous `context:` dans votre configuration. [Multilingue](/fr-FR/multi-language/) propose des exemples à copier-coller pour plusieurs langues.

### Puis-je modifier le workflow lui-même ?

Oui, à l'aide de schémas personnalisés. Un schéma définit les artefacts et leurs dépendances. Dupliquez le schéma par défaut avec `openspec schema fork spec-driven my-workflow`, puis modifiez-le. Voir [Personnalisation](/fr-FR/customization/#schémas-personnalisés).

## Modèles, confidentialité et mises à niveau

### Quel modèle d'IA utiliser ?

OpenSpec fonctionne mieux avec des modèles capables d'un raisonnement approfondi. Le README recommande des modèles tels que Codex 5.5 et Opus 4.7 pour la planification comme pour l'implémentation. Gardez également votre fenêtre de contexte propre : effacez-la avant l'implémentation pour obtenir les meilleurs résultats.

### OpenSpec collecte-t-il des données ?

OpenSpec collecte des statistiques d'utilisation anonymes : uniquement le nom et la version des commandes. Aucun argument, chemin, contenu ou renseignement personnel n'est recueilli ; la collecte est désactivée automatiquement dans CI. Pour vous désinscrire, utilisez `export OPENSPEC_TELEMETRY=0` ou `export DO_NOT_TRACK=1`.

### Comment effectuer une mise à niveau ?

En deux étapes : mettez à niveau le paquet (`npm install -g @fission-ai/openspec@latest`), puis exécutez `openspec update` dans chaque projet pour actualiser les skills et commandes générés.

### Comment désinstaller OpenSpec ?

Il n'y a pas de commande de désinstallation : OpenSpec se compose d'un paquet global et de fichiers dans votre projet. Supprimez le paquet (`npm uninstall -g @fission-ai/openspec`), puis, si vous le souhaitez, le répertoire `openspec/` et les fichiers générés pour vos outils. Le guide [Installation : désinstallation](/fr-FR/installation/#désinstallation) explique la procédure et indique ce qu'il est prudent de conserver.

## Obtenir de l'aide

### Où poser des questions ou signaler un bogue ?

- **Discord :** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **Problèmes GitHub :** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Depuis le terminal :** `openspec feedback "votre message"` ouvre une issue GitHub.

### Cette documentation est erronée ou confuse. Que faire ?

Signalez-le-nous ou corrigez-la vous-même. Les pull requests de documentation sont bienvenues et appréciées. Ouvrez une issue ou envoyez une pull request.
