---
title: "Herramientas compatibles"
---

OpenSpec funciona con muchos asistentes de programación con IA. Al ejecutar
`openspec init`, configura las herramientas seleccionadas de acuerdo con el
perfil o los flujos de trabajo activos y el modo de distribución.

## Cómo funciona

Para cada herramienta seleccionada, OpenSpec puede instalar:

1. **Habilidades** (si la distribución incluye habilidades): `.../skills/openspec-*/SKILL.md`
2. **Comandos** (si la distribución incluye comandos): archivos de comandos `opsx-*` específicos de cada herramienta

Codex solo admite habilidades: OpenSpec instala `.agents/skills/openspec-*/SKILL.md`
para Codex incluso si el modo de distribución es `commands`, y no genera
archivos de instrucciones personalizados para Codex. Las habilidades existentes
administradas por OpenSpec en la ruta heredada `.codex/skills` se reconcilian
después de escribir sus reemplazos; los archivos personalizados o distintos se
conservan.

De forma predeterminada, OpenSpec usa el perfil `core`, que incluye:
- `propose`
- `explore`
- `apply`
- `update`
- `sync`
- `archive`

Puedes activar flujos de trabajo ampliados (`new`, `continue`, `ff`, `verify`,
`bulk-archive`, `onboard`) con `openspec config profile` y, después, ejecutar
`openspec update`.

## Cómo invocarlos

Esta documentación usa `/opsx:propose` como nombre canónico, pero cada
herramienta lo representa según la forma en que carga el archivo generado por
OpenSpec. Busca la ruta de comandos de tu herramienta en la [Referencia de
directorios de herramientas](#referencia-de-directorios-de-herramientas) y aplica aquí el formato
correspondiente.

| Archivo de comando que escribe OpenSpec | Lo que escribes | Herramientas |
|------------------------------|----------|-------|
| `.../commands/opsx/<id>.*` — la carpeta `opsx/` indica el espacio de nombres | `/opsx:<id>` | Claude Code, CodeBuddy, Crush, Gemini CLI, Lingma, Qoder, ZCode |
| `.../opsx-<id>.*` — el nombre del archivo es el comando | `/opsx-<id>` | Todas las demás herramientas que generan archivos de comandos, salvo Amazon Q y Devin |
| `.devin/workflows/opsx-<id>.md` — solo lo lee uno de los dos agentes de Devin | `/opsx-<id>` en Devin Desktop, `/openspec-<skill>` en Devin Local | Devin Desktop\*\*\*\* |
| `.amazonq/prompts/opsx-<id>.md` — es una instrucción, no un comando | `@opsx-<id>` | Amazon Q Developer |
| ninguno — solo habilidades | `/openspec-<skill>` | CodeArts, ForgeCode, Hermes, MiniMax Code, Mistral Vibe, Zed Agent, `.agents` compartido |
| ninguno — Kimi Code | `/skill:openspec-<skill>` | Kimi Code |
| ninguno — Codex CLI | `$openspec-<skill>` | Codex ([`/openspec-<skill>` no se reconoce](https://github.com/openai/codex/issues/11817)) |

Así, `/opsx:propose` se escribe `/opsx-propose` en Cursor, `@opsx-propose` en Amazon Q y
`$openspec-propose` en Codex.

Hay dos aspectos independientes, por eso las filas no se pueden combinar:

- **El nombre.** Las filas 1 y 2 solo difieren en cómo el nombre del archivo
  representa el comando; el prefijo `opsx-<id>` / `opsx:<id>` es el mismo para
  todas las herramientas que generan archivos de comandos.
- **El envoltorio.** Amazon Q carga los archivos en una biblioteca de instrucciones que se invoca con
  `@`. Las herramientas que solo admiten habilidades no generan archivos de
  comandos, así que sus tres últimas filas usan nombres de *habilidad*,
  enumerados en [Nombres de las habilidades generadas](#nombres-de-las-habilidades-generadas),
  que no se corresponden uno a uno
  a los identificadores de comando (`/opsx:apply` corresponde a la habilidad `openspec-apply-change`).

Los patrones de rutas de comandos anteriores no especifican extensiones (`.*`)
a propósito: cada herramienta usa su propia extensión (`.toml` para Gemini CLI,
`.prompt` para Continue y `.prompt.md` para Kiro y GitHub Copilot), y algunas
muestran el nombre con su extensión en el selector. Fíjate en la estructura del
directorio, no en la extensión.

Los archivos generados por OpenSpec y la indicación «Primeros pasos» que aparece
después de la configuración ya usan el formato adecuado para las herramientas
seleccionadas; lo más rápido es consultar esa indicación.

## Referencia de directorios de herramientas

| Herramienta (ID) | Patrón de ruta de habilidades | Patrón de ruta de comandos |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| Command Code (`command-code`) | `.commandcode/skills/openspec-*/SKILL.md` | `.commandcode/commands/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | No se generan (no hay adaptador de comandos; usa invocaciones `/openspec-*` basadas en habilidades) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.agents/skills/openspec-*/SKILL.md` | No se generan (solo admite habilidades; usa `$openspec-*`) |
| Devin Desktop, anteriormente Windsurf (`devin`) | `.devin/skills/openspec-*/SKILL.md` | `.devin/workflows/opsx-<id>.md`\*\*\*\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | No se generan (no hay adaptador de comandos; usa invocaciones `/openspec-*` basadas en habilidades) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | No se generan (no hay adaptador de comandos; usa invocaciones `/openspec-*` basadas en habilidades) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilo/command/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | No se generan (no hay adaptador de comandos; usa invocaciones `/skill:openspec-*` basadas en habilidades) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| MiniMax Code (`minimax-code`) | `~/.minimax/skills/openspec-*/SKILL.md` | No se generan (no hay adaptador de comandos; usa las habilidades de MiniMax Code) |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | No se generan (no hay adaptador de comandos; usa invocaciones `/openspec-*` basadas en habilidades) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| SourceCraft Code Assistant para VS Code (`codeassistant`) | `.codeassistant/skills/openspec-*/SKILL.md` | `.codeassistant/commands/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Rovo Dev CLI](https://support.atlassian.com/rovo/docs/use-rovo-dev-cli/) (`rovodev`) | `.rovodev/skills/openspec-*/SKILL.md` | No se generan. Rovo no tiene comandos de barra: encuentra las habilidades automáticamente o mediante instrucciones (por ejemplo, «usa la habilidad openspec-propose»); `/skills` solo las administra. El contenido generado menciona las habilidades por su nombre, nunca como comandos `/openspec-*`. |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| [Zed Agent](https://zed.dev/docs/ai/skills) (`zed`) | `.agents/skills/openspec-*/SKILL.md` | No se generan (solo admite habilidades; usa `/openspec-*` o `@openspec-*`) |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |
| Habilidades compartidas de `.agents` (`agents`) | `.agents/skills/openspec-*/SKILL.md` | No se generan (no hay adaptador de comandos; usa invocaciones `/openspec-*` basadas en habilidades) |

\*\* Las extensiones de IDE (VS Code, JetBrains y Visual Studio) reconocen los
archivos de instrucciones de GitHub Copilot como comandos de barra
personalizados. Copilot CLI todavía no lee directamente
`.github/prompts/*.prompt.md`. Al seleccionar `github-copilot`, también puedes
configurar el **agente de programación en la nube** alojado en GitHub; consulta
la sección [Agente de programación en la nube de GitHub Copilot](#agente-de-programación-en-la-nube-de-github-copilot).

\*\*\* De forma predeterminada, Hermes carga las habilidades desde
`~/.hermes/skills/`. Para usar las habilidades de OpenSpec locales al proyecto,
añade el directorio `.hermes/skills/` del proyecto a `skills.external_dirs` en
`~/.hermes/config.yaml`; Hermes las mostrará mediante comandos de barra como
`/openspec-propose`.

\*\*\*\* Windsurf pasó a llamarse [Devin Desktop](https://docs.devin.ai/desktop/devin-desktop-faq)
el 2 de junio de 2026 y cambió su directorio de configuración: `.devin/` es la
ruta preferida de lectura y escritura, y `.windsurf/` queda como alternativa
heredada de solo lectura. OpenSpec adopta el nuevo nombre: el ID de la
herramienta es `devin`, y `--tools windsurf` sigue resolviendo a ese ID para que
los scripts de configuración existentes continúen funcionando. Si un proyecto
aún tiene archivos de OpenSpec en `.windsurf/`, la siguiente ejecución de
`openspec update` ofrecerá trasladarlos; si rechazas, permanecerán allí, y nunca
se modificarán tus archivos propios. Los flujos se invocan por nombre de
archivo, así que `.devin/workflows/opsx-apply.md` corresponde a `/opsx-apply`.
El [agente Devin Local no admite flujos de trabajo](https://docs.devin.ai/desktop/devin-local),
solo habilidades, y no lee `.windsurf/`. Por eso, al escribir habilidades de
Devin, OpenSpec mantiene sus instrucciones y la indicación de primeros pasos en
el formato `/openspec-*`, compatible con ambos agentes. Si la distribución solo
incluye comandos, no se escriben habilidades y ambos usan `/opsx-*`.

La compatibilidad con SourceCraft Code Assistant está dirigida a su extensión
para VS Code. Sus [comandos personalizados](https://sourcecraft.dev/portal/docs/en/code-assistant/operations/agent/slash-commands)
y [habilidades](https://sourcecraft.dev/portal/docs/ru/code-assistant/operations/agent/skills)
solo están disponibles en VS Code. Esta integración no configura SourceCraft
web ni JetBrains.

Si solo distribuyes habilidades, pide a Code Assistant que use la habilidad
`openspec-propose` con tu idea. Las habilidades se activan según la solicitud;
OpenSpec no genera comandos `/openspec-*` para esta herramienta.

MiniMax Code es una integración global que solo admite habilidades. OpenSpec
escribe únicamente sus directorios `openspec-*` en `~/.minimax/skills/`; no
crea directorios `.minimax`
ni `.mavis` dentro del repositorio. Si la distribución incluye solo comandos,
las habilidades globales existentes de MiniMax Code se dejan intactas, para que
la configuración de un proyecto no pueda eliminar habilidades que use otro.

### Agente de programación en la nube de GitHub Copilot

El [agente de programación de Copilot](https://docs.github.com/en/copilot/using-github-copilot/coding-agent)
de GitHub se ejecuta en GitHub dentro de un entorno de GitHub Actions, separado
de Copilot en tu editor. OpenSpec puede configurarlo para que use la CLI de
OpenSpec mediante la generación de dos archivos:

- `.github/workflows/copilot-setup-steps.yml`: instala `@fission-ai/openspec` en el entorno del agente.
- `.github/agents/openspec.agent.md`: indica al agente cómo usar OpenSpec.

Como esto escribe un flujo de trabajo de GitHub Actions en tu repositorio, es
una opción **voluntaria**:

| Método | Comportamiento |
|-----|----------|
| `openspec init` (interactivo) | Pregunta si se deben configurar los archivos de la nube. La respuesta predeterminada es **No**. |
| `openspec init --copilot-cloud` | Los configura sin preguntar (para scripts/CI). |
| `openspec init --no-copilot-cloud` | Los omite sin preguntar y elimina los que se hayan generado previamente. |
| `openspec update` | Nunca pregunta. Actualiza los archivos solo si aceptaste configurarlos (o si el proyecto ya los tiene). Si no aceptaste, elimina los archivos de la nube administrados por OpenSpec. |

Tu elección se guarda en `openspec/config.yaml` como
`githubCopilot.cloudAgent: true|false`, y las actualizaciones no interactivas la
respetan. OpenSpec solo escribe o elimina archivos cuyo contenido haya generado.
Si personalizas `copilot-setup-steps.yml` o `openspec.agent.md`, o ya tienes tus
propios archivos, no los modifica (y `init`/`update` te lo indican).

### Cuándo elegir el destino compartido `.agents`

`agents` es la opción independiente del proveedor: escribe las habilidades en
`.agents/skills/`, una ruta compartida que leen muchas herramientas de agentes,
en vez de usar un directorio específico de una herramienta.

| Situación | Opción |
|-----------|------|
| Tu herramienta aparece en una fila propia | Su propio ID: obtendrás la integración de esa herramienta, incluidos los comandos de barra si los admite |
| Varios agentes usan el mismo repositorio y todos leen `.agents/skills` | `agents`: un único árbol de habilidades en vez de uno por herramienta |
| Tu herramienta aún no está en la lista, pero lee `.agents/skills` | `agents` |

Puedes seleccionarla junto con el ID de una herramienta concreta; normalmente
cada una escribe en su propia raíz. Codex y Zed Agent son las excepciones,
porque comparten la misma raíz canónica `.agents`. Si seleccionas Codex junto
con Zed o `agents`, OpenSpec mantiene un único árbol dirigido por Codex. Sus
indicaciones de traspaso incluyen tanto `$openspec-*` para Codex como
`/openspec-*` para otros agentes, de modo que `--tools all` y las
configuraciones multiagente existentes siguen funcionando sin que dos
generadores sobrescriban los mismos archivos.
OpenSpec también la ofrece automáticamente cuando un proyecto tiene el
directorio `.agents/skills/`. No basta con que exista `.agents/` a secas,
porque las herramientas también usan esa raíz para reglas y definiciones de
subagentes. Ten en cuenta que `.agents` no es lo mismo que `.agent`: el
directorio singular pertenece a Antigravity.

Ten en cuenta dos cosas:

- **Solo habilidades.** No existe un adaptador de comandos, así que no se
  generan archivos `opsx-*`. Si la distribución incluye comandos, `openspec
  init` enumera `agents` bajo «Commands skipped for: … (no adapter)». Invoca
  los flujos por el nombre de la habilidad. La mayoría de los asistentes que
  leen `.agents/skills` usan `/openspec-propose`, el formato que muestra la
  indicación de configuración de OpenSpec. Este destino es independiente del
  proveedor, así que consulta la documentación de tu asistente si utiliza otro
  formato.
- **No se crea ni edita `AGENTS.md`.** El destino es el directorio `.agents/`.
  Si el archivo `AGENTS.md` de la raíz aún contiene bloques marcadores de
  OpenSpec de una versión anterior, `openspec update` los elimina; consulta la
  [guía de migración](/es-ES/migration-guide/).

La compatibilidad con Zed se refiere al Zed Agent integrado. Zed External
Agents y Terminal Threads usan sus propias integraciones. Las habilidades de
agente requieren [Zed v1.4.2](https://github.com/zed-industries/zed/releases/tag/v1.4.2)
o posterior. Las habilidades locales del proyecto no están disponibles en un
árbol de trabajo que no sea de confianza hasta que [le otorgues
confianza](https://zed.dev/docs/worktree-trust).

Como Codex, Zed Agent y el destino independiente del proveedor comparten
`.agents/skills/`, conviene saber qué administra OpenSpec en esa ruta: solo
escribe, actualiza y elimina los directorios de habilidades `openspec-*` de
los flujos seleccionados, además de una marca `.openspec-target` que indica si
Codex, Zed Agent o el destino independiente del proveedor generó ese árbol
compartido. El resto del contenido del directorio no se modifica. Los nombres
`openspec-*` y la marca pertenecen a OpenSpec; las ediciones que contengan se
reemplazan en la siguiente ejecución de `openspec update`, igual que ocurre
con cualquier otra herramienta.

En proyectos sin marca, OpenSpec deduce quién administra el directorio a partir
de las referencias a habilidades administradas:
`$openspec-*` corresponde a Codex y `/openspec-*` al destino independiente del
proveedor. Si existe un árbol canónico genérico junto con `.codex/skills`
heredado, se considera una instalación antigua dirigida a dos destinos y se
consolida en el árbol compartido compatible.

`openspec update` también respeta esta propiedad. Si un proyecto usa `.agents`
como destino independiente del proveedor y se detecta una instalación
residual de Codex únicamente a partir de archivos de instrucciones dispersos,
la actualización conserva el árbol `agents` existente en vez de volver a
escribirlo con sintaxis de Codex, y mantiene esos archivos de instrucciones
heredados en lugar de eliminarlos. Para asignar explícitamente a Codex el
árbol compartido, ejecuta `openspec init --tools codex`.

## Configuración no interactiva

Para CI/CD o una configuración mediante scripts, usa `--tools` (y, de forma
opcional, `--profile`):

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

**IDs de herramientas disponibles (`--tools`)** — también se acepta `windsurf` como alias de `devin`: `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `command-code`, `codeartsagent`, `codex`, `devin`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `minimax-code`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `codeassistant`, `trae`, `zed`, `zcode`, `agents`

## Instalación según los flujos de trabajo

OpenSpec instala artefactos de flujo de trabajo según los flujos seleccionados:

- **Perfil core (predeterminado):** `propose`, `explore`, `apply`, `update`, `sync`, `archive`
- **Selección personalizada:** cualquier subconjunto de los ID de flujo de trabajo:
  `propose`, `explore`, `new`, `continue`, `apply`, `update`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

En otras palabras, la cantidad de habilidades y comandos depende del perfil y
del modo de distribución; no es fija.

## Nombres de las habilidades generadas

Según la configuración del perfil o del flujo de trabajo, OpenSpec genera estas
habilidades:

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

Consulta [Comandos](/es-ES/commands/) para conocer el comportamiento de los
comandos y [CLI](/es-ES/cli/) para ver las opciones de `init` y `update`.

## Temas relacionados

- [Referencia de la CLI](/es-ES/cli/): comandos del terminal
- [Comandos](/es-ES/commands/): comandos de barra y habilidades
- [Primeros pasos](/es-ES/getting-started/): configuración inicial
