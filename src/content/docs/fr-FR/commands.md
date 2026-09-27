---
title: "Commandes"
---

Référence des commandes slash d’OpenSpec. Elles s’exécutent dans la conversation de votre assistant de programmation IA (par ex. Claude Code, Cursor, Devin Desktop).

Pour les modèles de workflow et savoir quand utiliser chaque commande, consultez [Workflows](/fr-FR/workflows/). Pour les commandes CLI, consultez [CLI](/fr-FR/cli/).

La forme canonique utilisée ici est `/opsx:<command>`. Certains outils l’écrivent
différemment — Cursor et GitHub Copilot enregistrent `/opsx-propose`, Codex utilise
`$openspec-propose` — consultez donc [Forme à utiliser](/fr-FR/supported-tools/#how-to-invoke)
pour votre outil. Les fichiers générés par OpenSpec utilisent déjà la forme correcte.

## Référence rapide

### Parcours rapide par défaut (profil `core`)

| Commande | Rôle |
|---------|---------|
| `/opsx:propose` | Créer un changement et générer les artefacts de planification en une étape |
| `/opsx:explore` | Réfléchir à une idée avant de s’engager dans un changement |
| `/opsx:apply` | Réaliser les tâches du changement |
| `/opsx:update` | Réviser les artefacts de planification et les garder cohérents |
| `/opsx:sync` | Fusionner les spécifications différentielles dans les spécifications principales |
| `/opsx:archive` | Archiver un changement terminé |

### Commandes du workflow étendu (sélection personnalisée)

| Commande | Rôle |
|---------|---------|
| `/opsx:new` | Créer la structure d’un nouveau changement |
| `/opsx:continue` | Créer l’artefact suivant en fonction des dépendances |
| `/opsx:ff` | Avancer rapidement : créer tous les artefacts de planification en une fois |
| `/opsx:verify` | Vérifier que l’implémentation correspond aux artefacts |
| `/opsx:bulk-archive` | Archiver plusieurs changements en une fois |
| `/opsx:onboard` | Parcours guidé du workflow complet |

Le profil global par défaut est `core`. Pour activer les commandes étendues, exécutez `openspec config profile`, sélectionnez les workflows, puis lancez `openspec update` dans votre projet.

---

## Référence des commandes

### `/opsx:propose`

Créer un changement et générer ses artefacts de planification en une étape. C’est la commande de démarrage par défaut du profil `core`.

**Syntaxe :**
```text
/opsx:propose [change-name-or-description]
```

**Arguments :**
| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `change-name-or-description` | Non | Nom en kebab-case ou description du changement en langage courant |

**Fonctionnement :**
- Crée `openspec/changes/<change-name>/`
- Génère les artefacts requis avant l’implémentation (pour `spec-driven` : proposal, specs, design, tasks)
- S’arrête lorsque le changement est prêt pour `/opsx:apply`

**Exemple :**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**Conseils :**
- Utilisez cette commande pour le parcours complet le plus rapide.
- Pour contrôler les artefacts étape par étape, activez les workflows étendus et utilisez `/opsx:new` puis `/opsx:continue`.

---

### `/opsx:explore`

> **Commencez ici en cas d’incertitude.** Explore est un partenaire de réflexion sans engagement : il lit votre base de code, compare les options et transforme une idée vague en plan concret avant toute écriture de code. La commande fait partie du profil par défaut. Pour en savoir plus et voir d’autres exemples, consultez le guide [Commencer par explorer](/fr-FR/explore/).

Réfléchir à des idées, étudier des problèmes et clarifier les exigences avant de s’engager dans un changement.

**Syntaxe :**
```
/opsx:explore [topic]
```

**Arguments :**
| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `topic` | Non | Sujet que vous souhaitez explorer ou étudier |

**Fonctionnement :**
- Ouvre une conversation d’exploration sans structure imposée.
- Examine la base de code pour répondre aux questions.
- Compare les options et les approches.
- Crée des diagrammes pour clarifier la réflexion.
- Consigne l’exploration à votre demande ou si vous acceptez sa proposition : crée la structure d’un changement avec `openspec new change` et rédige les artefacts de planification nommés, ou met à jour ceux d’un changement existant.
- Peut passer à `/opsx:propose` (par défaut) ou `/opsx:new` (workflow étendu) lorsque les idées se précisent.

**Exemple :**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT.

AI:  That's a decision worth keeping. Want me to start a change called
     add-jwt-auth? Just the change folder, nothing else yet.

You: Yes.

AI:  Started openspec/changes/add-jwt-auth/. Say the word and I'll
     write the proposal, specs, and tasks from what we just worked out.
```

**Conseils :**
- À utiliser lorsque les exigences sont floues ou qu’une investigation est nécessaire.
- N’écrit jamais de code ni rien d’autre, sauf si vous le demandez ou acceptez sa proposition.
- Utile pour comparer plusieurs approches avant de décider.
- Peut lire des fichiers et parcourir la base de code.

---

### `/opsx:new`

Créer la structure d’un nouveau changement. Crée son dossier puis attend que vous génériez les artefacts avec `/opsx:continue` ou `/opsx:ff`.

Cette commande fait partie du jeu de workflows étendu (elle n’est pas incluse dans le profil `core` par défaut).

**Syntaxe :**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Arguments :**
| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `change-name` | Non | Nom du dossier de changement (demandé s’il n’est pas fourni) |
| `--schema` | Non | Schéma de workflow à utiliser (par défaut : configuration ou `spec-driven`) |

**Fonctionnement :**
- Crée le répertoire `openspec/changes/<change-name>/`.
- Crée un fichier de métadonnées `.openspec.yaml` dans le dossier du changement.
- Affiche le premier modèle d’artefact prêt à être créé.
- Demande le nom du changement et le schéma s’ils ne sont pas fournis.

**Fichiers créés :**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Change metadata (schema, created date)
```

**Exemple :**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**Conseils :**
- Utilisez des noms explicites : `add-feature`, `fix-bug`, `refactor-module`.
- Évitez les noms génériques comme `update`, `changes`, `wip`.
- Le schéma peut aussi être défini dans la configuration du projet (`openspec/config.yaml`).

---

### `/opsx:continue`

Créer l’artefact suivant dans la chaîne de dépendances. Un seul artefact est créé à la fois, pour avancer progressivement.

**Syntaxe :**
```
/opsx:continue [change-name]
```

**Arguments :**
| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `change-name` | Non | Changement à poursuivre (déduit du contexte si non précisé) |

**Fonctionnement :**
- Interroge le graphe de dépendances des artefacts.
- Indique quels artefacts sont prêts ou bloqués.
- Crée le premier artefact prêt.
- Lit les fichiers des dépendances pour disposer du contexte.
- Indique les artefacts rendus disponibles par cette création.

**Exemple :**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs, design)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: design
     Run /opsx:continue to create the next artifact.
```

**Conseils :**
- À utiliser si vous souhaitez examiner chaque artefact avant de continuer.
- Utile pour les changements complexes nécessitant un contrôle accru.
- Plusieurs artefacts peuvent être prêts simultanément.
- Vous pouvez modifier les artefacts créés avant de poursuivre.

---

### `/opsx:ff`

Avancer rapidement dans la création des artefacts. Tous les artefacts de planification sont créés en une fois.

**Syntaxe :**
```
/opsx:ff [change-name]
```

**Arguments :**
| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `change-name` | Non | Changement à compléter rapidement (déduit du contexte si non précisé) |

**Fonctionnement :**
- Crée tous les artefacts selon l’ordre de leurs dépendances.
- Suit l’avancement à l’aide d’une liste de tâches.
- S’arrête lorsque tous les artefacts `apply-required` sont terminés.
- Lit chaque dépendance avant de créer l’artefact suivant.

**Exemple :**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**Conseils :**
- À utiliser si vous savez clairement ce que vous construisez.
- Plus rapide que `/opsx:continue` pour les changements simples.
- Les artefacts restent modifiables ensuite.
- Convient aux petites et moyennes fonctionnalités.

---

### `/opsx:apply`

Réaliser les tâches du changement. Parcourt la liste, écrit le code et coche les éléments terminés.

**Syntaxe :**
```
/opsx:apply [change-name]
```

**Arguments :**
| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `change-name` | Non | Changement à implémenter (déduit du contexte si non précisé) |

**Fonctionnement :**
- Lit `tasks.md` et repère les tâches incomplètes.
- Parcourt les tâches une par une.
- Écrit du code, crée des fichiers et exécute les tests nécessaires.
- Coche les tâches terminées avec `[x]`.

**Exemple :**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**Conseils :**
- Peut reprendre là où vous vous étiez arrêté si le travail est interrompu.
- Pour travailler en parallèle, précisez le nom du changement.
- L’avancement est suivi dans les cases de `tasks.md`.

---

### `/opsx:update`

Réviser les artefacts de planification existants d’un changement et les garder cohérents entre eux. Cette commande ne touche qu’aux artefacts de planification ; elle ne modifie jamais le code.

**Syntaxe :**

```text
/opsx:update [change-name]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `change-name` | Non | Changement à mettre à jour (déduit du contexte si non précisé) |

**Fonctionnement :**

- Lit les artefacts du changement via `openspec status --change <name> --json`.
- Applique la révision demandée ou, si vous n’en avez pas précisé, recherche les contradictions entre les artefacts.
- Met en cohérence les autres artefacts existants dans toutes les directions (une modification de conception peut se répercuter sur la proposition).
- Vous demande confirmation avant chaque écriture, un artefact à la fois.
- Termine en recommandant l’étape suivante : `/opsx:continue` (artefacts non commencés), `/opsx:apply` (appliquer le plan révisé dans le code) ou `/opsx:archive` (travail terminé).

**Fichiers manquants :**

- Si un artefact glob, tel que `specs/**/*.md`, contient au moins un fichier existant, update peut proposer un fichier compagnon manquant. Il suit les instructions du schéma et demande confirmation du chemin exact avant sa création.
- Utilisez `/opsx:continue` pour les artefacts qui ne possèdent encore aucun fichier. Les artefacts volontairement ignorés restent intacts.
- Les nouveaux fichiers doivent rester dans le dossier du changement. Si un fichier apparaît au chemin confirmé avant la création, update s’arrête plutôt que de l’écraser.

**Exemple :**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**Conseils :**

- La commande ne démarre pas un artefact sans fichier existant. Activez `/opsx:continue` pour cela, ou utilisez `openspec status` et `openspec instructions` si ce workflow facultatif n’est pas installé.
- Si le changement a déjà été implémenté, poursuivez avec `/opsx:apply` pour aligner le code sur le plan révisé.
- Si votre révision change l’*intention* du changement, créez-en un nouveau (voir [Mettre à jour ou repartir de zéro](/fr-FR/opsx/#when-to-update-vs-start-fresh)).

---

### `/opsx:verify`

Vérifier que l’implémentation correspond aux artefacts du changement, en contrôlant l’exhaustivité, l’exactitude et la cohérence.

**Syntaxe :**
```
/opsx:verify [change-name]
```

**Arguments :**
| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `change-name` | Non | Changement à vérifier (déduit du contexte si non précisé) |

**Fonctionnement :**
- Vérifie la qualité de l’implémentation selon trois dimensions.
- Recherche dans la base de code les éléments prouvant l’implémentation.
- Signale les problèmes de niveau CRITICAL, WARNING ou SUGGESTION.
- N’empêche pas l’archivage, mais met en évidence les problèmes.

**Verification dimensions:**

| Dimension | Vérifications |
|-----------|-------------------|
| **Exhaustivité** | Toutes les tâches sont terminées, les exigences implémentées et les scénarios couverts |
| **Exactitude** | L’implémentation respecte l’intention des spécifications et traite les cas limites |
| **Cohérence** | Les décisions de conception apparaissent dans le code et les pratiques sont cohérentes |

**Exemple :**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**Conseils :**
- Exécutez cette commande avant l’archivage pour repérer les écarts rapidement.
- Les avertissements n’empêchent pas l’archivage, mais signalent des problèmes potentiels.
- Utile pour examiner le travail de l’IA avant de le valider.
- Peut révéler des divergences entre les artefacts et l’implémentation.

---

### `/opsx:sync`

**Commande facultative.** Fusionner les spécifications différentielles d’un changement dans les spécifications principales. Archive propose une synchronisation si nécessaire ; vous n’avez donc généralement pas à lancer cette commande manuellement.

**Syntaxe :**
```
/opsx:sync [change-name]
```

**Arguments :**
| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `change-name` | Non | Changement à synchroniser (déduit du contexte si non précisé) |

**Fonctionnement :**
- Lit les spécifications différentielles dans le dossier du changement.
- Analyse les sections ADDED/MODIFIED/REMOVED/RENAMED.
- Fusionne les modifications dans le répertoire principal `openspec/specs/`.
- Préserve le contenu existant non mentionné dans le delta.
- N’archive pas le changement (il reste actif).

**Exemple :**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**Quand l’utiliser manuellement :**

| Situation | Utiliser sync ? |
|----------|-----------|
| Changement de longue durée ; spécifications à fusionner avant l’archivage | Oui |
| Plusieurs changements parallèles nécessitent les spécifications mises à jour | Oui |
| Prévisualiser ou examiner séparément la fusion | Oui |
| Changement rapide archivé immédiatement | Non (archive s’en charge) |

**Conseils :**
- Sync réalise une fusion intelligente, pas un simple copier-coller.
- Peut ajouter des scénarios à des exigences existantes sans les dupliquer.
- Le changement reste actif après la synchronisation (il n’est pas archivé).
- La plupart des utilisateurs n’auront jamais à l’appeler directement : archive propose cette étape si nécessaire.

---

### `/opsx:archive`

Archiver un changement terminé. Le finalise et le déplace dans le dossier d’archive.

**Syntaxe :**
```
/opsx:archive [change-name]
```

**Arguments :**
| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `change-name` | Non | Changement à archiver (déduit du contexte si non précisé) |

**Fonctionnement :**
- Vérifie l’état d’achèvement des artefacts.
- Vérifie l’achèvement des tâches (avertit si certaines sont incomplètes).
- Propose de synchroniser les spécifications différentielles si nécessaire.
- Déplace le dossier vers `openspec/changes/archive/YYYY-MM-DD-<name>/`.
- Préserve tous les artefacts pour la piste d’audit.

**Exemple :**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Conseils :**
- Archive n’empêche pas l’opération si des tâches sont incomplètes, mais affiche un avertissement.
- Les spécifications différentielles peuvent être synchronisées pendant l’archivage ou avant.
- Les changements archivés sont conservés dans l’historique.
- Utilisez d’abord `/opsx:verify` pour repérer les problèmes.

---

### `/opsx:bulk-archive`

Archiver plusieurs changements terminés en une fois. Gère les conflits entre spécifications.

**Syntaxe :**
```
/opsx:bulk-archive [change-names...]
```

**Arguments :**
| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `change-names` | Non | Changements à archiver (une sélection est proposée si non précisés) |

**Fonctionnement :**
- Répertorie tous les changements terminés.
- Valide chaque changement avant de l’archiver.
- Repère les conflits de spécifications entre changements.
- Résout les conflits en vérifiant ce qui a réellement été implémenté.
- Archive les changements dans l’ordre chronologique.

**Exemple :**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Conseils :**
- Utile pour les travaux en parallèle.
- La résolution des conflits est confiée à l’agent (qui examine la base de code).
- Les changements sont archivés dans l’ordre de leur création.
- Demande confirmation avant d’écraser le contenu d’une spécification.

---

### `/opsx:onboard`

Parcours guidé du workflow OpenSpec complet. Tutoriel interactif fondé sur votre véritable base de code.

**Syntaxe :**
```
/opsx:onboard
```

**Fonctionnement :**
- Parcourt un cycle complet de workflow en commentant chaque étape.
- Recherche des possibilités d’amélioration réelles dans votre base de code.
- Crée un changement réel avec de vrais artefacts.
- Réalise un travail réel (petits changements sans risque).
- Archive le changement terminé.
- Explique chaque étape au fur et à mesure.

**Étapes :**
1. Bienvenue et analyse de la base de code
2. Recherche d’une amélioration possible
3. Création d’un changement (`/opsx:new`)
4. Rédaction de la proposition
5. Création des spécifications
6. Rédaction de la conception
7. Création des tâches
8. Réalisation des tâches (`/opsx:apply`)
9. Vérification de l’implémentation
10. Archivage du changement
11. Résumé et étapes suivantes

**Exemple :**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**Conseils :**
- Idéal pour les personnes qui découvrent le workflow.
- S’appuie sur du vrai code, pas sur des exemples artificiels.
- Crée un véritable changement à conserver ou à abandonner.
- Dure de 15 à 30 minutes.

---

## Syntaxe des commandes selon l’outil IA

Les outils IA utilisent des syntaxes de commande légèrement différentes. Choisissez la forme correspondant à votre outil :

| Fichier de commande de l’outil | Exemple de syntaxe | Exemples d’outils |
|--------------------------|----------------|---------------|
| `.../commands/opsx/<id>.*` | `/opsx:propose`, `/opsx:apply` | Claude Code, Gemini CLI, Crush |
| `.../opsx-<id>.*` | `/opsx-propose`, `/opsx-apply` | Cursor, Devin Desktop, Copilot (IDE), Trae, Oh My Pi |
| aucun — skills uniquement | `/openspec-propose`, `/openspec-apply-change` | CodeArts, ForgeCode, Hermes, MiniMax Code, Mistral Vibe, Zed Agent, `.agents` partagé |
| aucun — Kimi Code | `/skill:openspec-propose` | Kimi Code |
| aucun — Codex CLI | `$openspec-propose` | Codex |

 > **Devin Desktop et Devin Local :** les fichiers `.devin/workflows/opsx-*.md` donnent
 > Devin Desktop `/opsx-propose`. Devin Local ne prend pas en charge les workflows — utilisez les skills
 > qu’OpenSpec écrit dans `.devin/skills/`, par ex. `/openspec-propose`, qui fonctionnent avec
 > les deux agents.

L’intention est identique dans tous les outils, mais la façon de présenter les commandes dépend de l’intégration. [Forme à utiliser](/fr-FR/supported-tools/#how-to-invoke) répertorie tous les outils pris en charge ; ce tableau donne uniquement des exemples de chaque forme.

> **Remarque :** les commandes GitHub Copilot (`.github/prompts/*.prompt.md`) ne sont disponibles que dans les extensions IDE (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI ne prend actuellement pas en charge les fichiers de prompt personnalisés ; consultez [Outils pris en charge](/fr-FR/supported-tools/) pour plus de détails et des solutions de rechange.

---

## Anciennes commandes

Ces commandes utilisent l’ancien workflow « tout-en-une-fois ». Elles fonctionnent encore, mais les commandes OPSX sont recommandées.

| Commande | Fonction |
|---------|--------------|
| `/openspec:proposal` | Créer tous les artefacts d’un coup (proposition, spécifications, conception, tâches) |
| `/openspec:apply` | Implémenter le changement |
| `/openspec:archive` | Archiver le changement |

**Quand utiliser les anciennes commandes :**
- Projets existants utilisant l’ancien workflow.
- Changements simples ne nécessitant pas de création progressive des artefacts.
- Préférence pour l’approche tout ou rien.

**Migrer vers OPSX :**
Les anciens changements peuvent être poursuivis avec les commandes OPSX. La structure des artefacts est compatible.

---

## Dépannage

### « Change not found »

La commande n’a pas pu déterminer sur quel changement travailler.

**Solutions :**
- Indiquez explicitement le nom du changement : `/opsx:apply add-dark-mode`.
- Vérifiez que le dossier existe avec `openspec list`.
- Vérifiez que vous vous trouvez dans le bon répertoire de projet.

### « No artifacts ready »

Tous les artefacts sont terminés ou bloqués par des dépendances manquantes.

**Solutions :**
- Exécutez `openspec status --change <name>` pour voir ce qui bloque.
- Vérifiez que les artefacts requis existent.
- Créez d’abord les artefacts dépendants manquants.

### « Schema not found »

Le schéma indiqué n’existe pas.

**Solutions :**
- Listez les schémas disponibles avec `openspec schemas`.
- Vérifiez l’orthographe du nom du schéma.
- Créez le schéma s’il est personnalisé : `openspec schema init <name>`.

### Commandes non reconnues

L’outil IA ne reconnaît pas les commandes OpenSpec.

**Solutions :**
- Vérifiez qu’OpenSpec a été initialisé avec `openspec init`.
- Régénérez les skills avec `openspec update`.
- Vérifiez que le répertoire `.claude/skills/` existe (pour Claude Code).
- Redémarrez votre outil IA pour qu’il détecte les nouveaux skills.

### Les artefacts ne sont pas générés correctement

L’IA crée des artefacts incomplets ou incorrects.

**Solutions :**
- Ajoutez le contexte du projet dans `openspec/config.yaml`.
- Ajoutez des règles par artefact pour donner des consignes ciblées.
- Décrivez le changement plus en détail.
- Utilisez `/opsx:continue` plutôt que `/opsx:ff` pour un meilleur contrôle.

---

## Étapes suivantes

- [Workflows](/fr-FR/workflows/) — pratiques courantes et choix des commandes
- [CLI](/fr-FR/cli/) — commandes de terminal pour la gestion et la validation
- [Customization](/fr-FR/customization/) - Create custom schemas and workflows
