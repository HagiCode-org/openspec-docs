---
title: "Referencia de la CLI"
---

La CLI de OpenSpec (`openspec`) ofrece comandos de terminal para configurar el
proyecto, validarlo, inspeccionar su estado y administrarlo. Estos comandos
complementan los comandos de barra de IA (como `/opsx:propose`) que se describen
en [Comandos](/es-ES/commands/).

## Resumen

| Categoría | Comandos | Función |
|----------|----------|---------|
| **Configuración** | `init`, `update` | Inicializar y actualizar OpenSpec en el proyecto |
| **Almacenes (repositorios independientes de OpenSpec)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Administrar los almacenes independientes de OpenSpec que hayas registrado |
| **Estado** | `doctor` | Informar sobre el estado de las relaciones de la raíz resuelta |
| **Contexto de trabajo** | `context` | Reunir el conjunto de trabajo (raíz y almacenes referenciados) |
| **Conjuntos de trabajo personales** | `workset create`, `workset list`, `workset open`, `workset remove` | Guardar y abrir vistas de trabajo personales y locales en la herramienta |
| **Exploración** | `list`, `view`, `show` | Explorar cambios y especificaciones |
| **Validación** | `validate` | Buscar problemas en los cambios y las especificaciones |
| **Ciclo de vida** | `archive` | Finalizar los cambios completados |
| **Flujo de trabajo** | `new change`, `status`, `instructions`, `templates`, `schemas` | Compatibilidad con flujos de trabajo basados en artefactos |
| **Esquemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Crear y administrar flujos de trabajo personalizados |
| **Configuración** | `config` | Consultar y modificar los ajustes |
| **Utilidades** | `feedback`, `completion` | Enviar comentarios e integrar el shell |

---

## Comandos para personas y agentes

La mayoría de los comandos de la CLI están diseñados para que las personas los
usen en el terminal. Algunos también admiten el uso mediante agentes o scripts
con salida JSON.

### Comandos solo para personas

Estos comandos son interactivos y están diseñados para usarse en el terminal:

| Comando | Función |
|---------|---------|
| `openspec init` | Inicializar el proyecto (con preguntas interactivas) |
| `openspec view` | Panel interactivo |
| `openspec workset open <name>` | Abrir un conjunto de trabajo guardado (ventana del editor o sesión de agente en el terminal) |
| `openspec config edit` | Abrir la configuración en un editor |
| `openspec feedback` | Enviar comentarios mediante GitHub |
| `openspec completion install` | Instalar el autocompletado del shell |

### Comandos compatibles con agentes

Estos comandos admiten la salida `--json` para que agentes de IA y scripts los
usen de forma programática:

| Comando | Uso por personas | Uso por agentes |
|---------|-----------|-----------|
| `openspec list` | Explorar cambios y especificaciones | `--json` para obtener datos estructurados |
| `openspec show <item>` | Leer contenido | `--json` para analizarlo |
| `openspec validate` | Buscar problemas | `--all --json` para validar en lote |
| `openspec status` | Consultar el progreso de los artefactos | `--json` para obtener el estado estructurado |
| `openspec instructions` | Consultar los pasos siguientes | `--json` para obtener instrucciones dirigidas a agentes |
| `openspec templates` | Buscar las rutas de las plantillas | `--json` para resolver las rutas |
| `openspec schemas` | Enumerar los esquemas disponibles | `--json` para descubrir esquemas; `--store <id>` para seleccionar una raíz registrada |
| `openspec store setup <id>` | Crear y registrar un almacén local | `--json` con entradas explícitas para obtener una salida estructurada |
| `openspec store register <path>` | Registrar un almacén existente | `--json` para obtener el registro estructurado |
| `openspec store unregister <id>` | Olvidar el registro local de un almacén | `--json` para obtener la limpieza estructurada |
| `openspec store remove <id>` | Eliminar la carpeta de un almacén local registrado | `--yes --json` para eliminar sin interacción |
| `openspec store list` | Explorar los almacenes registrados | `--json` para obtener registros estructurados |
| `openspec store doctor` | Comprobar la configuración local de almacenes | `--json` para obtener diagnósticos estructurados |
| `openspec new change <id>` | Crear la estructura de un cambio local al repositorio | `--json` y `--store <id>` para usar un almacén registrado como raíz de OpenSpec |
| `openspec workset create [name]` | Componer una vista de trabajo personal | `--member <path> --json` para componerla sin interacción |
| `openspec workset list` | Explorar conjuntos de trabajo guardados | `--json` para obtener vistas estructuradas |
| `openspec workset remove <name>` | Eliminar una vista guardada | `--yes --json` para eliminarla sin interacción |

---

## Opciones globales

Estas opciones funcionan con todos los comandos:

| Opción | Descripción |
|--------|-------------|
| `--version`, `-V` | Mostrar el número de versión |
| `--no-color` | Desactivar los colores de salida |
| `--help`, `-h` | Mostrar la ayuda del comando |

---

## Comandos de configuración

### `openspec init`

Inicializa OpenSpec en el proyecto. Crea la estructura de carpetas y configura
las integraciones con herramientas de IA.

El comportamiento predeterminado usa la configuración global: perfil `core`,
distribución `both` y flujos de trabajo `propose, explore, apply, update, sync, archive`.

```
openspec init [path] [options]
```

Usa `--language <language>` para añadir una indicación de idioma a la
`openspec/config.yaml`. En un proyecto existente, edita el campo `context` de
la configuración para que OpenSpec nunca sobrescriba las indicaciones
específicas del proyecto.

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `path` | No | Directorio de destino (predeterminado: directorio actual) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--tools <list>` | Configurar herramientas de IA sin interacción. Usa `all`, `none` o una lista separada por comas |
| `--language <language>` | Escribir los artefactos en este idioma al crear una configuración nueva |
| `--force` | Limpiar automáticamente los archivos heredados sin preguntar |
| `--profile <profile>` | Sustituir el perfil global durante esta ejecución de init (`core` o `custom`) |
| `--no-animation` | Mostrar una pantalla de bienvenida estática en lugar de la animada |
| `--copilot-cloud` | Configurar sin preguntar los [archivos del agente de programación en la nube](/es-ES/supported-tools/#agente-de-programación-en-la-nube-de-github-copilot) de GitHub Copilot |
| `--no-copilot-cloud` | Omitir sin preguntar los archivos del agente de programación en la nube de GitHub Copilot |

`--profile custom` usa los flujos de trabajo que estén seleccionados en la
configuración global (`openspec config profile`).

La animación de bienvenida también se omite si se define la variable de entorno
`OPENSPEC_NO_ANIMATION` (con cualquier valor, incluso vacío), si `NO_COLOR`
tiene un valor no vacío o si está activada la preferencia de movimiento
reducido del sistema operativo (Reduce Motion en macOS o animaciones
desactivadas en GNOME).

**ID de herramientas compatibles (`--tools`)** — también se acepta `windsurf` como alias de `devin`: `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `command-code`, `codeartsagent`, `codex`, `devin`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `minimax-code`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `codeassistant`, `qoder`, `qwen`, `rovodev`, `roocode`, `trae`, `zed`, `zcode`, `agents`

> Esta lista refleja `AI_TOOLS` en `src/core/config.ts`. Consulta
> [Herramientas compatibles](/es-ES/supported-tools/) para conocer las rutas de
> habilidades y comandos de cada herramienta.

**Examples:**

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

**Qué crea:**

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

Actualiza los archivos de instrucciones de OpenSpec después de actualizar la CLI.
Vuelve a generar los archivos de configuración de herramientas de IA según el
perfil global, los flujos de trabajo seleccionados y el modo de distribución
actuales.

```
openspec update [path] [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `path` | No | Directorio de destino (predeterminado: directorio actual) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--force` | Forzar la actualización aunque los archivos estén al día |

**Ejemplo:**

```bash
# Update instruction files after npm upgrade
npm install -g @fission-ai/openspec@latest
openspec update
```

Primero, actualiza el paquete. La CLI instalada genera los archivos de
instrucciones, por lo que ejecutar `openspec update` con una instalación
desactualizada indica que todo está al día, sin añadir los flujos que incluyen
las versiones más recientes.

Para dejarlo claro, `openspec update` consulta el registro de npm para saber si
se publicó una CLI más reciente. Si la tuya está desactualizada, te ofrece
actualizarla:

```text
A newer OpenSpec CLI is available (v1.6.0 → v1.7.0).
  Running from: /usr/local/lib/node_modules/@fission-ai/openspec
? Upgrade to v1.7.0 now? (Y/n)
```

Si respondes que sí, ejecuta `npm install -g @fission-ai/openspec@latest` y vuelve a ejecutar la actualización con la nueva CLI, de modo que los nuevos flujos se instalen en el mismo comando. Confirma la actualización consultando la versión del binario instalado, en vez de confiar en el código de salida de npm. Así, si responde otra instalación anterior en tu `PATH`, te lo indica en vez de afirmar que todo salió bien. Si respondes que no, muestra el comando y actualiza con la CLI que ya tienes. Pulsa Ctrl-C para detener el comando.

La oferta solo aparece en un terminal interactivo y únicamente si npm administra la instalación, que es el único caso que puede resolver `npm install -g`. En los demás casos, se muestra el comando correspondiente a la forma de instalación:

| Método de instalación de OpenSpec | Resultado |
|---------------------------|--------------|
| Instalación global mediante npm | Se muestra la pregunta y, en un terminal interactivo, se ejecuta la actualización; con la salida redirigida, se muestra el comando |
| Instalación global mediante pnpm, bun, yarn o volta | El comando propio del administrador: `pnpm add -g …@latest`, `bun add -g …@latest`, `yarn global add …@latest` o `volta install …@latest` |
| Dependencia del proyecto | Una nota para actualizar la dependencia, ya que su administrador de paquetes controla el archivo de bloqueo |
| Caché de `npx` / `dlx` | `npx @fission-ai/openspec@latest update`; ese comando realiza la actualización, así que no hace falta un segundo paso |
| Clonación de Git | Ninguna: tu versión es la que indique la rama |

Cuando se muestre algo, se indicará el directorio desde el que se cargó la CLI en ejecución. Compruébalo si ya actualizaste, pero un shim desactualizado sigue ocupando tu `PATH`.

Consulta el registro indicado por `npm_config_registry` si npm la ha exportado; en caso contrario, usa `https://registry.npmjs.org`. No lee `.npmrc`: es mejor evitar que el contenido de un archivo elija el destino de una solicitud saliente, y el `.npmrc` de un proyecto se comparte con el repositorio. Si usas un espejo privado, exporta `npm_config_registry` o define `OPENSPEC_NO_UPDATE_CHECK` para omitir la comprobación. Se omite si `CI` tiene un valor distinto de los valores explícitos de desactivación (`false`, `0`, `no`, `off` o vacío), si `NODE_ENV=test`, o si se define `OPENSPEC_NO_UPDATE_CHECK` (con cualquier valor), `DO_NOT_TRACK=1` o `OPENSPEC_TELEMETRY=0`. Se ejecuta antes de la actualización y puede retrasarla un máximo de 1,5 segundos. Después, se detiene incluso si la red descarta paquetes en silencio; tampoco muestra mensajes si no puede alcanzar el registro.

**Cómo se determina si está al día:** los archivos de habilidades registran la versión que los generó, así que OpenSpec la compara con la versión de la CLI instalada. Los archivos de comandos no incluyen una marca de versión; por eso, si una herramienta tiene comandos pero no habilidades (distribución `commands`), OpenSpec compara el contenido con lo que generaría ahora. Cualquier edición se considera una divergencia y se sobrescribe. Con la distribución `skills` o `both`, solo se comprueba la versión registrada, de modo que un archivo editado manualmente cuya versión aún coincida se deja intacto; usa `--force` para volver a escribirlo. En cualquier caso, OpenSpec administra los archivos generados: guarda tus propias instrucciones en otro lugar.

---

## Almacenes (repositorios independientes de OpenSpec)

> **Beta.** Los almacenes y las funciones que se basan en ellos (referencias,
> contexto de trabajo y conjuntos de trabajo) son nuevos. Los nombres de los
> comandos, las opciones, los formatos de archivo y la salida JSON pueden
> cambiar entre versiones. Para una guía que parte del problema, consulta
> [Almacenes](/es-ES/stores-beta/user-guide/).

Un almacén es un repositorio independiente de OpenSpec que registraste en esta
máquina, por ejemplo, uno para planificación o contratos. Al registrarlo,
puedes ejecutar en él comandos normales (`list`, `show`, `status`, `validate`,
`new change`, `archive`, etc.) desde cualquier ubicación mediante
`--store <id>`.

### `openspec store setup`

Crea y registra un almacén local. Si no se indican argumentos en el terminal,
OpenSpec guía al usuario durante la configuración. Los agentes y scripts
deberían proporcionar entradas explícitas y usar `--json`.

```bash
openspec store setup [id] [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--path <path>` | Carpeta donde se guardará el almacén (por ejemplo, `~/openspec/<id>`) |
| `--remote <url>` | Registrar la URL remota canónica en `store.yaml` del nuevo almacén |
| `--init-git` | Inicializar un repositorio Git con un commit inicial (predeterminado) |
| `--no-init-git` | Omitir todas las acciones de Git: no inicializar ni crear un commit inicial |
| `--json` | Generar salida JSON |

En ejecuciones no interactivas (`--json`, scripts o agentes), hay que indicar
tanto el ID del almacén como `--path`. En un terminal interactivo, la
configuración pregunta dónde guardarlo y sugiere una ruta editable en una
ubicación visible y controlada por el usuario (por ejemplo, `~/openspec/<id>`);
nunca usa como valor predeterminado el directorio de datos administrado por
OpenSpec.

Ejemplos:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Registra una carpeta de almacén local existente. Durante la beta de almacenes,
una raíz puede registrarse antes de que existan cambios, se hayan aplicado
especificaciones o se hayan archivado cambios. En ese caso,
`openspec/changes/`, `openspec/specs/` y `openspec/changes/archive/` pueden no
existir hasta que los comandos habituales las creen. Un repositorio que solo
tiene configuración y declara `store: <id>` sigue siendo un puntero a otro
almacén y no se registra como raíz de almacén, a menos que se elimine ese
puntero.

```bash
openspec store register [path] [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--id <id>` | ID del almacén; usa de forma predeterminada los metadatos del almacén o el nombre de la carpeta |
| `--yes` | Confirmar la creación de metadatos de identidad para una raíz de OpenSpec válida |
| `--json` | Generar salida JSON |

### `openspec store unregister`

Olvida el registro de un almacén local sin eliminar archivos.

```bash
openspec store unregister <id> [--json]
```

Úsalo si se trasladó el almacén, se clonó en otra ubicación o ya no debe
aparecer en OpenSpec en esta máquina.

### `openspec store remove`

Olvida el registro de un almacén local y elimina su carpeta local.

```bash
openspec store remove <id> [--yes] [--json]
```

En un terminal interactivo, `remove` muestra la carpeta exacta antes de
eliminarla. Los agentes, scripts y clientes JSON deben pasar `--yes` para
confirmar la eliminación. OpenSpec no elimina una carpeta que no contenga los
metadatos del almacén correspondientes.

### `openspec store list`

Enumera los almacenes registrados localmente.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Comprueba el registro local del almacén, sus metadatos y la presencia de Git.

```bash
openspec store doctor [id] [--json]
```

Doctor solo realiza diagnósticos: informa si faltan raíces, si los metadatos
no coinciden o si el estado del registro local no es válido, sin modificar el
almacén.

### Referenciar almacenes desde un proyecto

Un repositorio de proyecto puede declarar en `openspec/config.yaml` de qué
almacenes depende su trabajo:

```yaml
schema: spec-driven
references:
  - team-context
```

Desde entonces, la salida de `openspec instructions` en ese repositorio (tanto
la vista por artefacto como la de `apply`, en modo JSON y para personas)
incluye un índice de las especificaciones de cada almacén referenciado: ID de
especificación, resumen de una línea tomado de la sección Purpose y comando
para consultarla (`openspec show <spec-id> --type spec --store <id>`). El
índice se genera en cada ejecución a partir de la copia registrada; el
contenido de las especificaciones nunca se copia en la salida.

Las referencias son contexto de solo lectura. Nunca cambian dónde actúan los
comandos: el trabajo permanece en la raíz del propio repositorio y escribir en
un almacén referenciado requiere indicar explícitamente `--store`. Si no se
puede resolver una referencia (por ejemplo, porque el almacén no está
registrado en esta máquina), el índice muestra una advertencia y la solución
exacta; las instrucciones se siguen generando. `openspec doctor` informa del
estado de las referencias en un solo lugar.

### Registrar el origen de clonación de un almacén

Un almacén puede registrar su origen canónico de clonación en su archivo de
identidad confirmado, para que la incorporación no termine en «registra el
almacén» sin más indicaciones:

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

La URL se guarda en `.openspec-store/store.yaml` dentro del commit inicial,
así que cada clon ya la conoce. Para un almacén existente, edita `store.yaml`
manualmente y confirma el cambio. `store doctor` muestra la URL registrada
(y el origen Git detectado en la copia local); las indicaciones para compartir
de `setup` y `register` la mencionan, y `register` guarda el origen de la copia
local en el registro de la máquina.

Una declaración de referencia también puede incluir el origen de clonación,
para que quien aún no tenga el almacén reciba una solución completa, lista
para pegar (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Registrar un origen remoto no equivale a sincronizar: OpenSpec nunca clona ni
ejecuta pull o push por su cuenta.

### Declarar un almacén predeterminado

Un repositorio cuya planificación se haya externalizado por completo —sin
`openspec/specs/` ni `openspec/changes/` locales— puede declarar el almacén una
sola vez, en lugar de pasar `--store` en cada comando:

```yaml
# openspec/config.yaml (the only file under openspec/)
store: team-context
```

Los comandos normales se resuelven automáticamente en el almacén declarado; el
encabezado de la raíz y el bloque JSON `root` indican
`source: "declared"` junto con el ID del almacén, y las sugerencias impresas
siguen incluyendo `--store <id>`. La declaración es una alternativa, nunca
una anulación: siempre prevalece un `--store` explícito, y un directorio con
carpetas de planificación reales ignora el puntero (con una advertencia). Para
convertir un repositorio con puntero en una raíz local de OpenSpec, elimina la
línea `store:` y ejecuta `openspec init`; init no crea la estructura mientras
esa declaración siga presente.

La variante global para toda la máquina se configura con
`openspec config set defaultStore <id>` (consulta Configuración). Solo se usa
si no se resuelven `--store`, una raíz local ni el puntero del proyecto; en ese
caso, el encabezado de la raíz y el bloque JSON `root` indican
`source: "global_default"`.

## Doctor (estado de las relaciones)

Una sola pregunta de solo lectura, en un solo lugar: ¿está en buen estado la
raíz de OpenSpec y están disponibles en esta máquina los almacenes a los que
hace referencia?

```bash
openspec doctor [--store <id>] [--json]
```

El informe separa el estado de la raíz, el de los metadatos del almacén
(incluidas las diferencias entre el origen remoto registrado y el observado en
la copia local, y los casos en que esta se ha quedado atrás respecto de la
referencia de seguimiento ascendente obtenida más recientemente) y el de las
referencias (los mismos diagnósticos que muestran las instrucciones, con
soluciones de clonación para las referencias sin resolver). Los problemas de
cualquier gravedad devuelven el código de salida 0 —los agentes consultan las
matrices `status`—; solo los errores del comando (sin raíz o con almacén
desconocido) devuelven 1. Doctor nunca clona, sincroniza ni repara. Para
obtener el conjunto en sí, en vez de su estado, usa `openspec context`.

## Contexto de trabajo (el conjunto reunido)

Todo lo relacionado con este trabajo según las declaraciones de OpenSpec, en
un solo conjunto: la raíz de OpenSpec y los almacenes a los que hace referencia.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

El resumen JSON está pensado para agentes (cada almacén referenciado disponible
incluye cómo consultarlo; los elementos sin resolver incluyen las mismas
soluciones que muestran las instrucciones y doctor). Además, `--code-workspace`
escribe un archivo de espacio de trabajo de VS Code con la raíz y los almacenes
referenciados disponibles (carpetas `ref:<id>`). Es la única escritura que
realiza este comando y, si el archivo existe, no se sobrescribe sin
`--force`. Se informa de los elementos no disponibles; nunca se infieren.

«Contexto de trabajo» es el conjunto reunido; el campo `context:` de
`openspec/config.yaml` contiene información del proyecto que se incorpora a
las instrucciones. Son conceptos distintos. `openspec doctor` indica si el
conjunto está en buen estado; `openspec context` muestra qué lo compone.

## Conjuntos de trabajo personales

> **Beta.** Los conjuntos de trabajo forman parte de las nuevas funciones beta;
> los comandos, las opciones y los formatos de archivo pueden cambiar entre
> versiones. Consulta la [guía de almacenes](/es-ES/stores-beta/user-guide/#conjuntos-de-trabajo-vuelve-a-abrir-juntas-las-carpetas-que-usas)
> para ver un recorrido.

Un conjunto de trabajo es una vista personal y con nombre de las carpetas que
usas juntas —una raíz de planificación y las que quieras añadir—, que se
guarda en tu máquina y se vuelve a abrir por su nombre en la herramienta. Es
estrictamente local: nunca se incluye en commits, se comparte ni se deriva de
declaraciones. Eliminarlo nunca afecta a las carpetas que contiene.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` ofrece una breve configuración guiada (o acepta opciones `--member`
sin interacción; el primer miembro es el principal y las sesiones comienzan
allí). `open` inicia la herramienta seleccionada: los editores (VS Code,
Cursor) abren una ventana con todos los miembros y devuelven el control; los
agentes de CLI (Claude Code, codex) toman el control de este terminal en una
sesión con todos los miembros adjuntos y sin instrucciones precargadas. La
sesión termina al salir. Si falta una carpeta al abrirla, se omite y se muestra
una nota; las demás se abren. La preferencia de herramienta guardada se puede
sobrescribir en cada apertura con `--tool`.

Añadir compatibilidad con otra herramienta requiere configuración, no código.
Cada herramienta usa uno de dos métodos de inicio: `workspace-file` (se inicia
con el archivo `.code-workspace` generado) o `attach-dirs` (una opción de
adjunto por miembro). La clave `openers` del `config.json` global (ábrelo con
`openspec config edit`) permite añadir herramientas o ajustar cada campo de
las integradas:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Todo el estado de los conjuntos de trabajo se guarda en la carpeta `worksets/`
del directorio global de datos (las vistas guardadas y los archivos
`<name>.code-workspace` generados, que se regeneran en cada apertura). Si
eliminas esa carpeta, se elimina todo rastro.

---

## Comandos de exploración

### `openspec list`

Enumera los cambios o las especificaciones del proyecto.

```
openspec list [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--specs` | Enumerar especificaciones en lugar de cambios |
| `--changes` | Enumerar cambios (predeterminado) |
| `--sort <order>` | Ordenar por `recent` (predeterminado) o `name` |
| `--json` | Generar salida JSON |

**Examples:**

```bash
# List all active changes
openspec list

# List all specs
openspec list --specs

# JSON output for scripts
openspec list --json
```

**Salida (texto):**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

Muestra un panel interactivo para explorar especificaciones y cambios.

```
openspec view
```

Abre una interfaz de terminal para navegar por las especificaciones y los
cambios del proyecto.

---

### `openspec show`

Muestra los detalles de un cambio o una especificación.

```
openspec show [item-name] [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `item-name` | No | Nombre del cambio o de la especificación (pregunta si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--type <type>` | Indicar el tipo: `change` o `spec` (se detecta automáticamente si no hay ambigüedad) |
| `--json` | Generar salida JSON |
| `--no-interactive` | Desactivar las preguntas |

**Opciones específicas de cambios:**

| Opción | Descripción |
|--------|-------------|
| `--deltas-only` | Mostrar solo las especificaciones delta (modo JSON) |

**Opciones específicas de especificaciones:**

| Opción | Descripción |
|--------|-------------|
| `--requirements` | Mostrar solo los requisitos, sin escenarios (modo JSON) |
| `--no-scenarios` | Excluir el contenido de los escenarios (modo JSON) |
| `-r, --requirement <id>` | Mostrar un requisito concreto por índice (a partir de 1, modo JSON) |

**Examples:**

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

## Comandos de validación

### `openspec validate`

Valida la estructura de los cambios y las especificaciones, y comprueba que
los requisitos MODIFIED de un cambio coincidan con las especificaciones
principales que reemplazarían.

```
openspec validate [item-name] [options]
```

La validación falla si un cambio no tiene especificaciones delta, a menos que
su `.openspec.yaml` declare `skip_specs: true` (para refactorizaciones puras,
herramientas o cambios de documentación; consulta la [receta 5](/es-ES/examples/#receta-5-refactorizar-sin-cambiar-el-comportamiento)).

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `item-name` | No | Elemento concreto que se validará (pregunta si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--all` | Validar todos los cambios y especificaciones |
| `--changes` | Validar todos los cambios |
| `--specs` | Validar todas las especificaciones |
| `--archived` | Comprobar que todos los cambios archivados tengan sus tareas completadas (para lint previo al commit) |
| `--type <type>` | Indicar el tipo si el nombre es ambiguo: `change` o `spec` |
| `--strict` | Activar el modo de validación estricta |
| `--json` | Generar salida JSON |
| `--concurrency <n>` | Máximo de validaciones paralelas (predeterminado: 6 o la variable `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Desactivar las preguntas |

`--archived` tiene un ámbito propio: no valida las especificaciones delta (ya
se aplicaron al archivar), sino que comprueba que todas las casillas de
`tasks.md` de cada cambio en `changes/archive/` estén marcadas. Devuelve un
código distinto de cero si hay alguna sin marcar. Así se detectan los cambios
archivados con trabajo pendiente; resulta útil en un hook pre-commit.

**Examples:**

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

**Salida (texto):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**Salida (JSON):**

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

## Comandos del ciclo de vida

### `openspec archive`

Archiva un cambio completado y combina las especificaciones delta con las
principales.

```
openspec archive [change-name] [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `change-name` | No | Cambio que se archivará (pregunta si se omite; obligatorio si no hay nadie que responda a la pregunta) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `-y, --yes` | Omitir las preguntas de confirmación. Obligatorio si no hay nadie que pueda responderlas (agente de IA, trabajo de CI o ejecución con stdin cerrado) |
| `--skip-specs` | Omitir las actualizaciones de especificaciones en un archivado. Si un cambio nunca tiene especificaciones delta, debe declarar `skip_specs: true` en `.openspec.yaml`; así se archiva sin esta opción |
| `--no-validate` | Omitir la validación (requiere confirmación). También desactiva la retirada de capacidades: sin el resultado de la validación, no se retira ninguna |

**Examples:**

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

**Retirar una capacidad:** añade la marca de retirada a los metadatos del cambio:

```yaml
# openspec/changes/retire-legacy/.openspec.yaml
schema: spec-driven
retire_capabilities: true
```

Después, archiva el cambio como de costumbre:

```bash
openspec archive retire-legacy --yes
```

Cuando el cambio elimina el último requisito de una capacidad, OpenSpec borra
su archivo `spec.md` activo. Las deltas de otras capacidades incluidas en el
mismo cambio siguen actualizando sus especificaciones principales. Si falta la
marca, el archivado se detiene antes de modificar archivos y te indica que la
añadas.

**Qué hace:**

1. Valida el cambio (salvo que se use `--no-validate`).
2. Solicita confirmación (salvo que se use `--yes`).
3. Reserva el destino del archivo antes de cambiar cualquier especificación principal.
4. Valida y combina las especificaciones delta activas con `openspec/specs/`. Retira una capacidad y elimina su especificación solo si el cambio elimina su último requisito y `.openspec.yaml` declara `retire_capabilities: true` junto a `schema:`.
5. Mueve la carpeta del cambio a `openspec/changes/archive/YYYY-MM-DD-<name>/`.
6. Si falla la modificación de una especificación o el traslado final antes de asegurar el archivo completo, restaura las especificaciones y deja o devuelve el cambio a su ruta activa.
7. Si se completa una copia alternativa verificada, pero falla la limpieza de la fuente preparada, conserva el archivo completo y el estado confirmado de las especificaciones para poder recuperarlos.

**Sin terminal:** un agente de IA, un trabajo de CI o cualquier ejecución con
stdin cerrado no puede responder al paso 2. Por eso, archive se detiene antes
de modificar nada, devuelve 1 e indica qué comando volver a ejecutar:
`openspec archive <name> --yes`, junto con las demás opciones que hayas pasado.
Indica `--yes` (y el nombre del cambio) desde el principio para evitar ese
paso adicional.

---

## Comandos de flujo de trabajo

Estos comandos admiten el flujo de trabajo OPSX basado en artefactos. Son
útiles tanto para las personas que consultan el progreso como para los agentes
que determinan los pasos siguientes.

### `openspec new change`

Crea un directorio para el cambio y, opcionalmente, metadatos bajo control de
versiones en la raíz de OpenSpec resuelta.

```bash
openspec new change <name> [options]
```

Los nombres de los cambios deben usar kebab-case en minúsculas: letras
minúsculas, números y guiones individuales. No pueden contener espacios,
guiones bajos, letras mayúsculas, guiones consecutivos ni guiones al principio
o al final. Se permiten números al principio, así que puedes prefijar los
nombres para ordenar o clasificar los cambios; por ejemplo, `100-add-feature`
o `00001-add-auth`.

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--description <text>` | Descripción que se añadirá a `README.md` |
| `--goal <text>` | Metadatos opcionales del objetivo que se guardarán con el cambio |
| `--schema <name>` | Esquema de flujo de trabajo que se usará |
| `--store <id>` | ID del almacén que se usará como raíz de OpenSpec (un almacén es un repositorio independiente de OpenSpec que hayas registrado) |
| `--json` | Generar salida JSON |

Ejemplos:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Muestra el estado de finalización de los artefactos de un cambio.

```
openspec status [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--change <id>` | Nombre del cambio (pregunta si se omite) |
| `--schema <name>` | Sustituir el esquema (se detecta automáticamente a partir de la configuración del cambio) |
| `--json` | Generar salida JSON |

**Examples:**

```bash
# Interactive status check
openspec status

# Status for specific change
openspec status --change add-dark-mode

# JSON for agent use
openspec status --change add-dark-mode --json
```

**Salida (texto):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[x] specs
[ ] design
[-] tasks (blocked by: design)
```

Si un cambio declara `skip_specs: true`, la fase de especificaciones aparece
como `[~] specs (skipped: change declares skip_specs)` y no se incluye en el
recuento del progreso.

**Salida (JSON):**

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

`isPlanningComplete` indica si existen todos los artefactos de planificación
que no se hayan omitido. Los artefactos omitidos se consideran satisfechos sin
tener que crearlos. No indica si se completaron las tareas de implementación.
`isComplete` se mantiene como alias de compatibilidad con el mismo valor.

Los artefactos aparecen ordenados por dependencias: ninguna dependencia va
después de un artefacto que la necesite. Si varios artefactos están listos a la
vez (en `spec-driven`, tanto `specs` como `design` solo requieren `proposal`),
se mantiene el orden declarado en el esquema, en vez de ordenarlos
alfabéticamente. Por tanto, la primera entrada `ready` indica qué artefacto
escribir a continuación.

---

### `openspec instructions`

Obtiene instrucciones detalladas para crear un artefacto o aplicar tareas.
Los agentes de IA las usan para determinar qué crear a continuación.

```
openspec instructions [artifact] [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `artifact` | No | ID de artefacto o superficie de entrada del flujo: `apply` o `archive` |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--change <id>` | Nombre del cambio (obligatorio en modo no interactivo) |
| `--schema <name>` | Sustituir el esquema |
| `--json` | Generar salida JSON |

**Casos especiales:** usa `apply` para obtener instrucciones de implementación
de tareas. Usa `archive` para obtener las entradas actuales de solo lectura
(`context` y `operationGuidance`) de un cambio válido; no archiva ni modifica
nada.

**Examples:**

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

**La salida incluye:**

- Contenido de la plantilla del artefacto.
- Contexto del proyecto definido en la configuración.
- Contenido de los artefactos de los que depende.
- Reglas por artefacto definidas en la configuración.
- Contexto actual del proyecto e indicaciones pertinentes para las operaciones `apply`/`archive`.

Las entradas de las operaciones se leen en cada invocación desde el repositorio
resuelto o el almacén seleccionado. El contexto del proyecto es una entrada
obligatoria para la instrucción: los agentes lo leen y aplican los datos,
convenciones y restricciones pertinentes. Las indicaciones de operación son
recomendaciones adicionales opcionales: los agentes consideran cada entrada y
solo siguen las que sean pertinentes y compatibles con el flujo integrado.
Ambos campos se mantienen separados de las opciones explícitas del usuario, el
estado controlado por la CLI, las instrucciones integradas y las reglas de los
artefactos. Los conflictos de contexto se notifican; las indicaciones
contradictorias o inaplicables no se siguen y se explica el motivo. Son
contratos de comportamiento para los agentes generados, no comprobaciones
exigibles de la CLI. `instructions archive` solo devuelve el cambio
seleccionado, las entradas opcionales y los metadatos de la raíz; no incluye el
flujo estático de archivado.

Si se omite un artefacto mediante `skip_specs: true`, la salida solo muestra
una advertencia (JSON añade los campos `skipped` y `warning`); no se debe crear
el artefacto.

---

### `openspec templates`

Muestra las rutas resueltas de las plantillas para todos los artefactos de un esquema.

```
openspec templates [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--schema <name>` | Esquema que se inspeccionará (predeterminado: `spec-driven`) |
| `--json` | Generar salida JSON |

**Examples:**

```bash
# Show template paths for default schema
openspec templates

# Show templates for custom schema
openspec templates --schema my-workflow

# JSON for programmatic use
openspec templates --json
```

**Salida (texto):**

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

Enumera los esquemas de flujo de trabajo disponibles, sus descripciones y sus
flujos de artefactos.

```
openspec schemas [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--json` | Generar salida JSON |
| `--store <id>` | Usar un almacén registrado como raíz de OpenSpec |

**Ejemplo:**

```bash
openspec schemas
```

**Salida:**

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

## Comandos de esquemas

Comandos para crear y administrar esquemas de flujos de trabajo personalizados.

### `openspec schema init`

Crea un esquema local nuevo para el proyecto.

```
openspec schema init <name> [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `name` | Sí | Nombre del esquema (kebab-case) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--description <text>` | Descripción del esquema |
| `--artifacts <list>` | ID de artefactos separados por comas (predeterminados: `proposal,specs,design,tasks`) |
| `--default` | Establecer como esquema predeterminado del proyecto |
| `--no-default` | No preguntar si se establece como predeterminado |
| `--force` | Sobrescribir el esquema existente |
| `--json` | Generar salida JSON |

**Examples:**

```bash
# Interactive schema creation
openspec schema init research-first

# Non-interactive with specific artifacts
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Qué crea:**

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

Copia un esquema existente al proyecto para personalizarlo.

```
openspec schema fork <source> [name] [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `source` | Sí | Esquema que se copiará |
| `name` | No | Nombre del nuevo esquema (predeterminado: `<source>-custom`) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--force` | Sobrescribir el destino existente |
| `--json` | Generar salida JSON |

**Ejemplo:**

```bash
# Fork the built-in spec-driven schema
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valida la estructura y las plantillas de un esquema.

```
openspec schema validate [name] [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `name` | No | Esquema que se validará (si se omite, se validan todos) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--verbose` | Mostrar pasos de validación detallados |
| `--json` | Generar salida JSON |

**Example:**

```bash
# Validate a specific schema
openspec schema validate my-workflow

# Validate all schemas
openspec schema validate
```

---

### `openspec schema which`

Muestra el origen de resolución de un esquema (útil para diagnosticar el orden
de prioridad).

```
openspec schema which [name] [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `name` | No | Nombre del esquema |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--all` | Enumerar todos los esquemas y sus orígenes |
| `--json` | Generar salida JSON |

**Example:**

```bash
# Check where a schema comes from
openspec schema which spec-driven
```

**Salida:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Prioridad de los esquemas:**

1. Proyecto: `openspec/schemas/<name>/`
2. Usuario: `~/.local/share/openspec/schemas/<name>/`
3. Package: Built-in schemas

---

## Comandos de configuración

### `openspec config`

Consulta y modifica la configuración global de OpenSpec.

```
openspec config <subcommand> [options]
```

**Subcomandos:**

| Subcomando | Descripción |
|------------|-------------|
| `path` | Mostrar la ubicación del archivo de configuración |
| `list` | Mostrar todos los ajustes actuales |
| `get <key>` | Obtener un valor concreto |
| `set <key> <value>` | Establecer un valor |
| `unset <key>` | Eliminar una clave |
| `reset` | Restablecer los valores predeterminados |
| `edit` | Abrir con `$EDITOR` |
| `profile [preset]` | Configurar el perfil de flujo de trabajo de forma interactiva o mediante un ajuste preestablecido |

**Examples:**

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

**Desactivar la telemetría:** `telemetry.enabled` está activado de forma
predeterminada si no se define (modelo de exclusión voluntaria). Establécelo en
`false` para desactivar las estadísticas de uso anónimas y la comprobación de
versiones de `openspec update`. Las variables de entorno tienen prioridad
sobre la configuración: `OPENSPEC_TELEMETRY=0`, `DO_NOT_TRACK=1` y un valor
verdadero de `CI` (por ejemplo, `true`, `1` o `yes`) siempre desactivan la
telemetría, sin importar el valor configurado.

`openspec config profile` empieza con un resumen del estado actual y luego
permite elegir:
- Cambiar el modo de distribución y los flujos de trabajo.
- Cambiar solo el modo de distribución.
- Cambiar solo los flujos de trabajo.
- Mantener los ajustes actuales (salir).

Si mantienes los ajustes actuales, no se escriben cambios ni se muestra una
pregunta de actualización. Si no se cambió la configuración, pero los archivos
del proyecto no coinciden con el perfil o el modo de distribución global,
OpenSpec muestra una advertencia y recomienda ejecutar `openspec update`.
Pulsar `Ctrl+C` también cancela correctamente el flujo (sin mostrar un
rastreo de pila) y devuelve el código `130`.
En la lista de comprobación, `[x]` indica que el flujo está seleccionado en la
configuración global. Para aplicar esas selecciones a los archivos del
proyecto, ejecuta `openspec update` (o selecciona `Apply changes to this
project now?` cuando se te pregunte dentro de un proyecto).

**Ejemplos interactivos:**

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

## Comandos de utilidades

### `openspec feedback`

Envía comentarios sobre OpenSpec. Crea una incidencia en GitHub.

```
openspec feedback <message> [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `message` | Sí | Resumen de los comentarios; si el texto es largo, se abrevia en el título de la incidencia y se conserva en el cuerpo |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--body <text>` | Detalles adicionales que se añaden después del resumen |

**Requisitos:** GitHub CLI (`gh`) debe estar instalado y autenticado.

**Ejemplo:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Administra el autocompletado de shell para la CLI de OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Subcomandos:**

| Subcomando | Descripción |
|------------|-------------|
| `generate [shell]` | Escribir el script de autocompletado en stdout |
| `install [shell]` | Instalar el autocompletado para tu shell |
| `uninstall [shell]` | Eliminar el autocompletado instalado |

**Shells compatibles:** `bash`, `zsh`, `fish`, `powershell`

**Examples:**

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

**Windows (PowerShell):** instala el autocompletado para la instancia actual de PowerShell:

```powershell
$env:PROFILE = $PROFILE
openspec completion install powershell
. $PROFILE
```

`$env:PROFILE` indica a OpenSpec qué perfil configurar en esta sesión. El
instalador crea los directorios de perfil que falten y añade un bloque
administrado que carga `OpenSpecCompletion.ps1`. Al volver a cargar el perfil,
el autocompletado queda habilitado de inmediato.

Para desinstalarlo de la instancia actual, ejecuta:

```powershell
$env:PROFILE = $PROFILE
openspec completion uninstall powershell
```

Después de desinstalar, reinicia PowerShell para borrar el autocompletado de la
sesión actual.

El autocompletado es opcional. La CLI lo menciona una sola vez en stderr, la
primera vez que ejecutas un comando en un terminal interactivo; después no
vuelve a mencionarlo. Tampoco muestra el aviso si ya está instalado. Define
`OPENSPEC_NO_COMPLETIONS=1` para ocultar por completo esa sugerencia.

---

## Códigos de salida

| Código | Significado |
|------|---------|
| `0` | Correcto |
| `1` | Error (fallo de validación, archivos faltantes, etc.) |

---

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Establecer en `0` para desactivar la telemetría y la comprobación de versión de `openspec update` (prevalece sobre `telemetry.enabled` en la configuración global) |
| `DO_NOT_TRACK` | Establecer en `1` para desactivar la telemetría y la comprobación de versión de `openspec update` (señal DNT estándar; prevalece sobre la configuración) |
| `OPENSPEC_CONCURRENCY` | Concurrencia predeterminada para la validación en lote (predeterminada: 6) |
| `EDITOR` o `VISUAL` | Editor para `openspec config edit` |
| `NO_COLOR` | Desactivar los colores de salida si se establece |
| `OPENSPEC_NO_ANIMATION` | Desactivar la animación de bienvenida de `openspec init` si se establece |
| `OPENSPEC_NO_COMPLETIONS` | Establecer en `1` para ocultar el aviso único sobre el autocompletado de shell |
| `OPENSPEC_NO_UPDATE_CHECK` | Desactivar la comprobación de una CLI publicada más reciente de `openspec update` si se establece (con cualquier valor, incluso vacío). También se omite si se define `CI` (salvo `false`/`0`/`no`/`off`) o `NODE_ENV=test` |
| `npm_config_registry` | Registro que consulta la comprobación de versiones de `openspec update`. Debe ser una URL `http(s)` o se usará `https://registry.npmjs.org`. No se lee ningún archivo `.npmrc` |

---

## Documentación relacionada

- [Comandos](/es-ES/commands/): comandos de barra de IA (`/opsx:propose`, `/opsx:apply`, etc.)
- [Flujos de trabajo](/es-ES/workflows/): patrones habituales y cuándo usar cada comando
- [Personalización](/es-ES/customization/): crear esquemas y plantillas personalizados
- [Primeros pasos](/es-ES/getting-started/): guía de configuración inicial
