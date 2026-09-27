---
title: "Stores : planifier dans son propre dépôt"
---

> **Bêta.** Les stores, les références, les contextes de travail et les ensembles de travail sont
> nouveaux. Les noms de commande, options, formats de fichiers et résultats JSON peuvent
> encore évoluer d’une version à l’autre. Les exemples ci-dessous ont été vérifiés avec la
> version actuelle ; relisez ce guide après une mise à niveau.

## Le problème résolu

OpenSpec se trouve généralement dans un dépôt de code, dans un dossier `openspec/` voisin
du code, qui contient les spécifications et changements propres à ce dépôt.

Ce modèle ne convient plus dès que la planification dépasse un seul dépôt :

- Votre travail s’étend sur plusieurs dépôts — une fonctionnalité touche au serveur API, à
  l’application Web et à une bibliothèque partagée. Dans quel dossier `openspec/` le plan
  doit-il résider ?
- Votre équipe planifie avant que le code existe, ou planifie des éléments qui ne deviendront
  jamais du code dans *ce* dépôt.
- Une équipe est responsable des exigences que d’autres utilisent. La version du wiki
  diverge et votre agent de programmation ne peut de toute façon pas la lire.

Un **store** est la solution : un dépôt autonome consacré à la planification. Il reprend la
structure `openspec/` que vous connaissez — spécifications et changements — et y ajoute
un petit fichier d’identité. Enregistrez-le une fois sur votre machine sous un nom ; toutes
les commandes OpenSpec habituelles pourront ensuite l’utiliser depuis n’importe où.

## Structure

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

Deux règles simplifient le modèle :

1. **Un store n’est qu’un dépôt git.** Vous le validez, poussez, récupérez et examinez
   vous-même. OpenSpec ne le clone, ne le synchronise et ne le pousse jamais de son propre chef.
2. **Des déclarations, pas de mécanisme.** Les dépôts peuvent *déclarer* leur relation avec
   des stores (voir ci-dessous). Ces déclarations enrichissent les informations d’OpenSpec,
   sans jamais changer la cible des commandes.

## Votre premier store en cinq minutes

Deux commandes suffisent pour créer un changement opérationnel dans un store :

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

C'est tout le modèle. À partir de là, le cycle de vie est celui que vous connaissez —
`status`, `instructions`, `validate`, `archive` — avec `--store team-plans` dans
chaque commande ; chaque indication affichée reprend l'option. La ligne
`Using OpenSpec root:` vous indique toujours la cible de la commande.

## Exemple : une équipe, un dépôt de planification

Une équipe regroupe ses spécifications et changements dans `team-plans` au lieu de les
disperser dans les dépôts de code.

**Premier jour (personne responsable de la configuration) :**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

L’option `--remote` inscrit l’URL de clonage dans le fichier d’identité du store
(`.openspec-store/store.yaml`) dès la première validation. Chaque futur clone sait ainsi
d’où il provient ; les contrôles de santé et messages d’erreur peuvent fournir une solution
complète à copier-coller aux collègues qui ne l’ont pas encore.

**Chaque membre de l’équipe (une fois par machine) :**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

Ensuite, toute l’équipe travaille dans le même dépôt de planification en le désignant par son nom :

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Le partage du travail passe volontairement par git.** Un changement n’existe que dans
votre checkout jusqu’à ce que vous le validiez et le poussiez, comme du code. Les plans
bénéficient de branches, pull requests et revues, car un store est un dépôt ordinaire.

**Relier les dépôts de code de l’équipe.** Un dépôt dont la planification est entièrement
externalisée ne nécessite qu’une seule ligne dans `openspec/config.yaml` :

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Désormais, toute commande OpenSpec exécutée dans `web-app` agit sur `team-plans`,
sans aucune option :

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

Le pointeur n’est qu’une solution de repli, jamais une surcharge : `--store` explicite est
toujours prioritaire et, si le dépôt acquiert ses propres dossiers de planification, ils
prennent le dessus (avec un avertissement vous invitant à supprimer le pointeur devenu inutile).

**Une valeur par défaut pour tous les dépôts de votre machine.** Si plusieurs dépôts de code
utilisent le même store pour la planification, définissez cette valeur globalement une seule
fois au lieu d’ajouter `store:` dans chaque dépôt :

```bash
openspec config set defaultStore team-plans
```

Toute commande exécutée hors d’une racine de planification, sans option `--store` ni pointeur
dans le projet, résout maintenant `team-plans`. Cette valeur est la dernière priorité :
`--store`, une racine locale et un pointeur `store:` du projet restent prioritaires. La
bannière et le bloc JSON `root` indiquent `source: "global_default"` ainsi que l’identifiant
du store, afin de distinguer la valeur par défaut globale du pointeur propre au dépôt.
Supprimez-la avec `openspec config unset defaultStore`. Si le store n’est pas enregistré, les
commandes échouent et vous invitent à l’enregistrer ou à supprimer cette valeur périmée.

## Exemple : une fonctionnalité, deux dépôts de composants

Supposons que `add-checkout-promo` modifie `checkout-api` et
`checkout-web`. L’équipe veut un contrat produit partagé, mais chaque dépôt de code doit
conserver ses tâches d’implémentation, sa branche et sa revue.

Utilisez deux niveaux :

1. Décrivez le comportement partagé dans `team-plans`.
2. Gardez les plans d’implémentation dans chaque dépôt de composant et référencez le store
   comme contexte amont en lecture seule.

Commencez par planifier le contrat partagé dans le store :

```bash
openspec new change add-checkout-promo --store team-plans
openspec status --change add-checkout-promo --store team-plans
```

La proposition et les spécifications décrivent le comportement à l’interface des composants —
par exemple, les champs de promotion renvoyés par le service et la façon dont le frontend
traite une commande non admissible. Examinez ce changement dans le dépôt du store comme
n’importe quelle branche et pull request.

### Quel contexte la planification peut-elle voir ?

La sélection d’un store change la racine OpenSpec ; elle ne détecte ni ne lit tous les dépôts
de code qui utilisent ce store. Les instructions du store accèdent à ses artefacts et à son
contexte configuré. Le code des composants n’est visible que si leurs dossiers sont aussi
accessibles à l’agent ou à l’éditeur et que l’agent les lit.

Un ensemble de travail permet d’ouvrir ensemble le store de planification et les deux dépôts :

```bash
openspec workset create checkout-promo \
  --member ~/openspec/team-plans \
  --member ~/src/checkout-api \
  --member ~/src/checkout-web \
  --tool code
openspec workset open checkout-promo
```

Les dossiers sont ainsi visibles dans le même espace de travail IDE. Cela ne copie pas le
contexte des sources dans le store, ne sélectionne pas les dépôts concernés et n’autorise pas
un agent à les modifier. Consignez les informations durables entre composants dans les
spécifications partagées ; ne supposez pas que le planificateur se souviendra de sources
qu’il a consultées par hasard.

### Comment commencer l’implémentation dans chaque dépôt ?

Lorsqu’aucune option `--store` explicite ni racine `openspec/` plus proche ne s’applique, le
pointeur `store: team-plans` redirige les commandes vers le store. Il ne répartit pas une
liste de tâches du store selon le répertoire depuis lequel `apply` a été lancé. OpenSpec ne
redirige pas actuellement les tâches vers les dépôts.

Si chaque composant doit avoir son propre cycle apply/revue, dotez-le d’une racine OpenSpec
locale et référencez le store central au lieu de le désigner comme racine :

```yaml
# checkout-api/openspec/config.yaml (and likewise in checkout-web)
schema: spec-driven
references:
  - team-plans
```

Une fois le contrat partagé approuvé et ajouté aux spécifications principales du store, créez
un petit changement local pour la partie propre au composant :

```bash
cd ~/src/checkout-api
openspec new change implement-checkout-promo-api

cd ~/src/checkout-web
openspec new change implement-checkout-promo-ui
```

L’index de références des instructions de chaque dépôt fournit le résumé de la spécification
du store et la commande exacte `openspec show ... --store team-plans` pour la récupérer.
Chaque proposition locale cite ce contrat partagé ; ses tâches ne décrivent que le travail du
composant concerné. Exécutez ensuite `/opsx:apply` séparément dans chaque dépôt : la
résolution de racine garde les artefacts et modifications d’implémentation dans le dépôt
concerné. Les changements du service et du frontend peuvent alors être testés, examinés,
fusionnés et archivés indépendamment.

Si l’implémentation doit commencer alors que le changement partagé du store est encore actif,
récupérez-le explicitement avec `openspec show add-checkout-promo --store team-plans` ;
les index de référence répertorient les spécifications principales des stores, pas leurs
changements actifs. Reliez la branche du store et celles des composants dans les descriptions
de pull request afin que les personnes chargées de la revue sachent quelle version du contrat
chaque implémentation suit.

## Exemple : exigences partagées entre équipes

Une équipe plateforme est responsable des exigences. Les équipes produit s’appuient dessus
dans leurs propres dépôts et avec leurs propres conceptions. Une référence décrit ce lien
sans déplacer le travail de quiconque.

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**L’équipe produit déclare ses sources de référence** dans le fichier
`openspec/config.yaml` de son dépôt :

```yaml
references:
  - platform-reqs
```

Les références fournissent un contexte en lecture seule. Le dépôt conserve sa propre racine
`openspec/` et le travail y reste. En revanche, `openspec instructions` y inclut maintenant
un index des spécifications du store référencé, chacune avec un résumé d'une ligne et la
commande exacte de récupération (`openspec show <spec-id> --type spec
--store platform-reqs`). Un agent travaillant dans `api-server` peut trouver et citer les
exigences de paiement amont, puis rédiger sa conception détaillée dans la racine du dépôt,
sans que personne ait à lui copier-coller le contexte.

Une référence peut indiquer la source du clone afin que les membres de l’équipe qui ne
disposent pas encore du store reçoivent une solution complète plutôt qu’une impasse :

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Pour ouvrir le plan et le code ensemble, créez un ensemble de travail.** Ce choix est
personnel et explicite : chacun sélectionne sur sa machine les dossiers qui l’intéressent.
Les chemins de checkout locaux ne sont jamais validés dans le dépôt de planification partagé.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Deux questions toujours utiles

**« Ma configuration est-elle saine ? »** — `openspec doctor` vérifie en lecture seule la racine
actuelle et les stores qu’elle référence, et propose pour chaque problème une solution prête à coller :

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**« Avec quoi est-ce que je travaille ? »** — `openspec context` rassemble le contexte de
travail déclaré dans OpenSpec : la racine et les stores référencés.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Les deux commandes proposent `--json` pour les agents. `openspec context --code-workspace
<path>` écrit en plus un fichier d’espace de travail VS Code contenant tous les dossiers :
c’est la seule opération d’écriture effectuée par cette commande.

<a id="worksets-reopen-the-folders-you-work-on-together"></a>

## Ensembles de travail : rouvrir les dossiers associés

Indépendamment de tout ce qui précède, la plupart des personnes ouvrent les mêmes dossiers
ensemble à chaque session : le dépôt de planification et deux ou trois dépôts de code. Un
**ensemble de travail** est une vue personnelle et nommée de ces dossiers, que vous rouvrez
dans l’outil de votre choix avec une seule commande.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` lance ensuite l’outil enregistré. Les éditeurs (VS Code,
Cursor) ouvrent une fenêtre contenant tous les dossiers, puis la rendent active. Le premier
dossier est le principal. Remplacez l’outil à tout moment avec `--tool <id>`.

Les ensembles de travail ne constituent délibérément *pas* un état partagé. Ils sont
enregistrés sur votre machine, ne sont jamais validés et ne définissent pas le travail : ils
notent uniquement les dossiers que vous aimez ouvrir ensemble. Leur suppression ne touche
pas aux dossiers membres. Ajouter un outil relève de la configuration, pas du code : tout
outil lancé par un fichier d’espace de travail ou des options d’attachement de dossier peut
être ajouté sous la clé `openers` de la configuration globale (`openspec config edit`).

## Comment les commandes choisissent leur cible

Toutes les commandes habituelles résolvent leur racine selon le même ordre :

```
1. --store <id>          you said so explicitly        → that store
2. nearest openspec/     a real planning root here     → this repo
   (walking up from cwd)
3. store: pointer        config.yaml declares a store  → that store
4. defaultStore          global config sets a machine  → that store
                         default
5. none of the above     stores registered on this     → error with a
                         machine?                        selection hint
                         no stores registered?         → the current
                                                          directory
                                                          (classic behavior)
```

La ligne `Using OpenSpec root:` (et le bloc `root` du résultat `--json`) indique le cas utilisé.

## Limites connues

- **Fonctionnalité bêta.** Tout ce qui figure sur cette page peut évoluer entre les versions :
  noms, options, formats de fichiers et clés JSON.
- **Un checkout par identifiant de store et par machine.** L’enregistrement d’un second
  checkout sous le même identifiant échoue et vous invite à exécuter d’abord `store unregister`.
- **Aucune synchronisation — par conception.** OpenSpec ne clone, ne récupère et ne pousse
  jamais. Un checkout périmé conserve des spécifications périmées jusqu’à ce que *vous*
  exécutiez pull ; les références sont indexées en direct à partir des fichiers présents.
- **Les dossiers de planification vides peuvent être absents.** Un nouveau store peut ne pas
  encore contenir `openspec/changes/`, `openspec/specs/` ou `openspec/changes/archive/`
  dans Git. C’est accepté pendant la bêta ; les commandes habituelles les créent au besoin.
- **Les dépôts pointeurs restent des pointeurs.** Un dépôt ne contenant que la configuration,
  dont `openspec/config.yaml` déclare `store: <id>`, est traité comme une planification
  externalisée et non comme un checkout de store à enregistrer. Supprimez d’abord la ligne
  `store:` si vous voulez volontairement transformer ce dépôt en racine de store locale.
- **Certaines commandes restent inchangées.** `templates` et les anciennes formes nominales
  (`openspec change show`, etc.) agissent uniquement dans le répertoire courant, sans
  `--store`. `schemas` respecte l'ordre canonique de résolution et accepte `--store <id>`,
  tout en conservant la forme de son tableau JSON de réussite.
- **L’état propre à une machine lui reste propre.** Le registre des stores et les ensembles de
  travail sont des paramètres locaux. L’organisation de votre machine n’est jamais validée
  dans le dépôt de planification partagé.
- **Deux modes de lancement des ensembles de travail.** Un outil qui ne peut pas être lancé
  avec un fichier d’espace de travail ou des options d’attachement par dossier ne peut pas
  être ajouté comme lanceur.
- **La casse des clés JSON de l'agent est connue pour être incohérente** (`snake_case` pour
  les clés des stores, `camelCase` pour celles des workflows). C'est décrit dans le
  [contrat de l'agent](/fr-FR/agent-contract/) ; son harmonisation est reportée à une version
  ultérieure.

## Emplacement des éléments

| Élément | Emplacement | Partagé ? |
|---|---|---|
| Planification d’un store | `<store>/openspec/` (spécifications, changements) | Oui — valider et pousser |
| Identité d’un store | `<store>/.openspec-store/store.yaml` | Oui — validée avec le store |
| Registre des stores | `<data dir>/openspec/stores/registry.yaml` | Non — cette machine uniquement |
| Ensembles de travail | `<data dir>/openspec/worksets/` | Non — cette machine uniquement |

`<data dir>` correspond à `~/.local/share/openspec` sous macOS et Linux (ou
`$XDG_DATA_HOME/openspec` si défini) et à `%LOCALAPPDATA%\openspec` sous
Windows.

## Référence

Options exactes et formes JSON de toutes les commandes de cette page :
[Référence CLI](/fr-FR/cli/) (Stores, diagnostic, contexte de travail,
ensembles personnels) et [contrat de l'agent](/fr-FR/agent-contract/).
