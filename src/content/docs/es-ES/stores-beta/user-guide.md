---
title: "Almacenes: planifica en un repositorio propio"
---

> **Beta.** Los almacenes, las referencias, el contexto de trabajo y los
> conjuntos de trabajo son funciones nuevas. Los nombres de comandos, las
> opciones, los formatos de archivo y la salida JSON aún pueden cambiar entre
> versiones. Todos los ejemplos de esta guía se ejecutaron con la compilación
> actual, pero vuelve a leerla después de actualizar.

## El problema que resuelve

Normalmente, OpenSpec reside dentro de un repositorio de código: una carpeta
`openspec/` junto al código, que contiene las especificaciones y los cambios de
ese repositorio.

Esto deja de ser práctico cuando la planificación abarca más de un repositorio:

- El trabajo abarca varios repositorios: una función afecta al servidor de API,
  la aplicación web y una biblioteca compartida. ¿En qué carpeta `openspec/`
  debería residir el plan?
- El equipo planifica antes de que exista el código, o planifica trabajo que
  nunca se convertirá en código en *este* repositorio.
- Un equipo es responsable de los requisitos y otros los utilizan. La versión
  de la wiki acaba desactualizada y, de todos modos, el agente de programación
  no puede leerla.

La solución es un **almacén**: un repositorio independiente dedicado a la
planificación. Tiene la estructura `openspec/` que ya conoces —especificaciones
y cambios—, además de un pequeño archivo de identidad. Lo registras una vez en
tu máquina con un nombre y luego puedes usar en él cualquier comando normal de
OpenSpec desde cualquier ubicación.

## Estructura

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

Dos reglas mantienen la sencillez:

1. **Un almacén no es más que un repositorio Git.** Tú haces commit, push,
   pull y revisas los cambios. OpenSpec nunca clona, sincroniza ni sube nada
   por su cuenta.
2. **Declaraciones, no mecanismos.** Los repositorios pueden *declarar* su
   relación con los almacenes (como se muestra más adelante). Las declaraciones
   cambian lo que OpenSpec puede mostrarte, pero nunca dónde se ejecutan tus
   comandos.

## Tu primer almacén en cinco minutos

Dos comandos bastan para crear un cambio funcional en un almacén:

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

Ese es todo el modelo. A partir de aquí, el ciclo de vida es el de siempre:
`status`, `instructions`, `validate`, `archive` — with `--store team-plans`
en cada comando; todas las sugerencias impresas incluirán la opción. La línea
`Using OpenSpec root:` siempre indica dónde se ejecuta el comando.

## Ejemplo: un equipo, un repositorio de planificación

Un equipo guarda sus especificaciones y cambios en `team-plans`, en vez de
dispersarlos entre los repositorios de código.

**El primer día (quien lo configure):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Al pasar `--remote`, la URL de clonación se guarda en el archivo de identidad
del almacén (`.openspec-store/store.yaml`), dentro del commit inicial. Así,
cada clon futuro conoce su origen y las comprobaciones de estado y los mensajes
de error pueden mostrar una solución completa, lista para pegar, a quienes aún
no tengan el almacén.

**Cada integrante (una vez por máquina):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

A partir de entonces, todos trabajan en el mismo repositorio de planificación
por su nombre:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**El trabajo se comparte mediante Git, deliberadamente.** Un cambio que crees
solo existe en tu copia local hasta que hagas commit y push, igual que el
código. Como un almacén es un repositorio corriente, los planes también tienen
ramas, solicitudes de incorporación de cambios y revisiones.

**Conectar los repositorios de código del equipo.** Si toda la planificación
de un repositorio de código se externaliza, basta con añadir una línea a
`openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Ahora cualquier comando de OpenSpec ejecutado dentro de `web-app` actuará sobre
`team-plans`, sin opciones adicionales:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

Este puntero es una alternativa, no una anulación: siempre prevalece un
`--store` explícito. Si el repositorio incorpora sus propias carpetas de
planificación, estas prevalecen (y se muestra una advertencia para que elimines
el puntero obsoleto).

**Un valor predeterminado para todos los repositorios de tu máquina.** Si
trabajas con varios repositorios que planifican en el mismo almacén, configúralo
una sola vez de forma global, en lugar de añadir la línea `store:` a cada repo:

```bash
openspec config set defaultStore team-plans
```

Ahora, cualquier comando ejecutado fuera de una raíz de planificación —sin
`--store` ni puntero de proyecto— se resuelve en `team-plans`. Esta opción
ocupa el último lugar en el orden de prioridad, por lo que `--store`, una raíz
local y el puntero `store:` del proyecto siguen prevaleciendo. El encabezado
de la raíz y el bloque JSON `root` muestran `source: "global_default"` junto
con el ID del almacén, para que distingas el valor predeterminado de toda la
máquina del puntero propio de un repositorio. Elimínalo con
`openspec config unset defaultStore`. Si el ID no está registrado, los comandos
dan error e indican que debes registrarlo o borrar el valor obsoleto.

## Ejemplo: una función y dos repositorios de componentes

Supongamos que `add-checkout-promo` modifica tanto `checkout-api` como
`checkout-web`. El equipo quiere un contrato de producto compartido, pero cada
repositorio de código necesita sus propias tareas de implementación, rama y
revisión.

Usa dos capas:

1. Guarda el comportamiento compartido en `team-plans`.
2. Mantén los planes de implementación en cada repositorio de componente y
   referencia el almacén como contexto ascendente de solo lectura.

Primero, planifica el contrato compartido en el almacén:

```bash
openspec new change add-checkout-promo --store team-plans
openspec status --change add-checkout-promo --store team-plans
```

La propuesta y las especificaciones deben describir el comportamiento en el
límite entre los componentes; por ejemplo, los campos de promoción que devuelve
el servicio y cómo gestiona el frontend una compra no válida. Revisa este cambio
en el repositorio del almacén como cualquier otra rama o solicitud de
incorporación.

### ¿Qué contexto ve la planificación?

Seleccionar un almacén cambia la raíz de OpenSpec; no busca ni lee todos los
repositorios de código que lo usan. Las instrucciones del almacén ven sus
artefactos y el contexto configurado. Solo ven el código de los componentes si
esas carpetas también están disponibles para el agente o editor y este las lee.

Un conjunto de trabajo permite abrir cómodamente el almacén de planificación y
los dos repositorios de código al mismo tiempo:

```bash
openspec workset create checkout-promo \
  --member ~/openspec/team-plans \
  --member ~/src/checkout-api \
  --member ~/src/checkout-web \
  --tool code
openspec workset open checkout-promo
```

Así, las carpetas quedan visibles en un mismo espacio de trabajo del IDE. Esto
no copia al almacén el contexto de los repositorios, no selecciona los
repositorios afectados ni concede al agente permiso para editarlos. Registra en
las especificaciones compartidas los datos duraderos que afecten a varios
componentes; no confíes en que quien planifique recuerde el código que haya
inspeccionado.

### ¿Cómo se inicia la implementación en cada repositorio?

Si no se indica un `--store` explícito ni se encuentra una carpeta `openspec/`
más cercana, el puntero `store: team-plans` dirige los comandos a ese almacén.
No divide la lista de tareas del almacén según el directorio desde el que se
invoque `apply`. Actualmente, OpenSpec no distribuye tareas entre repositorios.

Si cada componente necesita un ciclo independiente de implementación y
revisión, asígnale una raíz local de OpenSpec y referencia el almacén central
en vez de apuntar a él:

```yaml
# checkout-api/openspec/config.yaml (and likewise in checkout-web)
schema: spec-driven
references:
  - team-plans
```

Una vez aprobado el contrato compartido e incorporado a las especificaciones
principales del almacén, crea un cambio local pequeño para el componente:

```bash
cd ~/src/checkout-api
openspec new change implement-checkout-promo-api

cd ~/src/checkout-web
openspec new change implement-checkout-promo-ui
```

El índice de referencias de las instrucciones de cada repositorio incluye un
resumen de la especificación del almacén y el comando exacto para consultarla:
`openspec show ... --store team-plans`. Cada propuesta local cita ese contrato
compartido y sus tareas describen únicamente el trabajo del componente.
Después, ejecuta `/opsx:apply` por separado en cada repositorio; la resolución
de la raíz mantiene los artefactos y los cambios de implementación dentro del
ámbito de cada uno. Ahora puedes probar, revisar, combinar y archivar por
separado los cambios del servicio y del frontend.

Si la implementación debe empezar mientras el cambio compartido del almacén
sigue activo, consúltalo explícitamente con
`openspec show add-checkout-promo --store team-plans`; los índices de referencias
enumeran las especificaciones canónicas del almacén, no los cambios activos.
En las descripciones de las solicitudes de incorporación, enlaza la rama del
almacén con las ramas de los componentes para que quienes revisen puedan ver
qué versión del contrato sigue cada implementación.

## Ejemplo: requisitos que atraviesan los límites de los equipos

Un equipo de plataforma es responsable de los requisitos. Los equipos de
producto los usan como base en sus propios repositorios y diseños. Una
referencia describe esa relación sin trasladar el trabajo de nadie.

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

**El equipo de producto declara de qué depende** en el archivo
`openspec/config.yaml`:

```yaml
references:
  - platform-reqs
```

Las referencias son contexto de solo lectura. El repositorio conserva su propia
raíz `openspec/`, donde permanece el trabajo. Lo que cambia es que
`openspec instructions` incluye un índice de las especificaciones del almacén
referenciado, cada una con un resumen de una línea y el comando exacto para
consultarla (`openspec show <spec-id> --type spec --store platform-reqs`). Un
agente que trabaje en `api-server` puede encontrar y citar los requisitos
ascendentes de pagos y redactar el diseño detallado en la raíz del propio
repositorio, sin que nadie tenga que copiarle el contexto.

Una referencia puede incluir la ubicación de clonación, para que quienes aún
no tengan el almacén reciban una solución completa en lugar de quedarse sin
salida:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Si quieres abrir juntos el plan y el código, crea un conjunto de trabajo.**
Es una configuración personal y explícita: cada persona elige las carpetas con
las que trabaja en su máquina. Las rutas locales de esas copias no se incluyen
en commits del repositorio de planificación compartido.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Dos preguntas que siempre puedes hacer

**«¿Está todo bien configurado?»** — `openspec doctor` comprueba la raíz
actual y los almacenes referenciados, sin modificarlos, e indica una solución
lista para pegar para cada problema:

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

**«¿Con qué estoy trabajando?»** — `openspec context` reúne el conjunto de
trabajo a partir de las declaraciones de OpenSpec: la raíz y los almacenes a
los que hace referencia.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Ambos admiten `--json` para los agentes. Además,
`openspec context --code-workspace <path>` escribe un archivo de espacio de
trabajo de VS Code que contiene todo el conjunto; es la única escritura que
realiza este comando.

## Conjuntos de trabajo: vuelve a abrir juntas las carpetas que usas

Al margen de todo lo anterior, la mayoría de las personas abre juntas las
mismas carpetas en cada sesión: el repositorio de planificación y dos o tres
repositorios de código. Un **conjunto de trabajo** es una vista personal y
nombrada de esas carpetas, que puedes volver a abrir con un comando en la
herramienta que prefieras.

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

`openspec workset open platform` inicia la herramienta guardada: los editores
(VS Code, Cursor) abren una ventana con todos los miembros y devuelven el
control. El primer miembro es el principal. Puedes sustituir la herramienta
en cualquier momento con `--tool <id>`.

Los conjuntos de trabajo, deliberadamente, *no* son información compartida.
Residen en tu máquina, nunca se incluyen en commits y no describen el trabajo:
solo registran qué carpetas te gusta abrir juntas. Eliminar uno nunca afecta a
las carpetas que contiene. Añadir herramientas nuevas requiere configuración,
no código: cualquier herramienta que pueda iniciarse mediante un archivo de
espacio de trabajo o indicadores para adjuntar carpetas puede añadirse bajo la
clave `openers` de la configuración global (`openspec config edit`).

## Cómo deciden los comandos dónde actuar

Todos los comandos normales resuelven la raíz de la misma forma y en este orden:

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

La línea `Using OpenSpec root:` (y el bloque `root` de la salida `--json`) te
indica cuál de estos casos se aplica.

## Limitaciones conocidas

- **Versión beta.** Todo lo que aparece en esta página puede cambiar entre
  versiones: nombres, opciones, formatos de archivo y claves JSON.
- **Una copia de cada ID de almacén por máquina.** Si registras una segunda
  copia con el mismo ID, se producirá un error que te indicará que primero
  ejecutes `store unregister`.
- **No se sincroniza, deliberadamente.** OpenSpec nunca clona, hace pull ni
  push. Una copia desactualizada muestra especificaciones antiguas hasta que
  *tú* hagas pull; las referencias se indexan en tiempo real a partir de lo
  que haya en el disco.
- **Pueden faltar carpetas de planificación vacías.** Es posible que un
  almacén nuevo aún no tenga en Git `openspec/changes/`, `openspec/specs/` o
  `openspec/changes/archive/`. Esto se admite durante la beta; las carpetas
  aparecerán cuando los comandos habituales creen archivos en ellas.
- **Los repositorios con puntero siguen siendo punteros.** Un repositorio que
  solo tiene configuración y cuyo `openspec/config.yaml` declara
  `store: <id>` se considera una planificación externalizada, no una copia de
  almacén que haya que registrar. Elimina primero la línea `store:` si quieres
  convertirlo deliberadamente en una raíz de almacén local.
- **Algunos comandos no cambian de ubicación.** `templates` y las formas
  nominales obsoletas (`openspec change show`, etc.) actúan únicamente en el
  directorio actual; no admiten `--store`. `schemas` sigue el orden canónico de
  selección de la raíz y acepta `--store <id>`, sin cambiar la estructura de
  la matriz JSON que devuelve si se ejecuta correctamente.
- **El estado de cada máquina es local.** El registro de almacenes y los
  conjuntos de trabajo son ajustes locales. La estructura de tu máquina nunca
  se incluye en commits de la planificación compartida.
- **Dos métodos para iniciar conjuntos de trabajo.** No se puede añadir como
  iniciador una herramienta que no admita un archivo de espacio de trabajo ni
  indicadores para adjuntar carpetas.
- **El JSON de los agentes tiene una diferencia conocida en el uso de
  mayúsculas** (las claves de la familia de almacenes usan `snake_case` y las
  de flujos de trabajo, `camelCase`). Se explica en el [contrato del agente](/es-ES/agent-contract/);
  la unificación se pospone a una versión posterior.

## Dónde se guarda cada cosa

| Elemento | Ubicación | ¿Compartido? |
|---|---|---|
| Planificación del almacén | `<store>/openspec/` (especificaciones y cambios) | Sí: haz commit y push |
| Identidad del almacén | `<store>/.openspec-store/store.yaml` | Sí: se incluye en el almacén |
| Registro de almacenes | `<data dir>/openspec/stores/registry.yaml` | No: solo en esta máquina |
| Conjuntos de trabajo | `<data dir>/openspec/worksets/` | No: solo en esta máquina |

`<data dir>` corresponde a `~/.local/share/openspec` en macOS y Linux (o
`$XDG_DATA_HOME/openspec` si está definido) y `%LOCALAPPDATA%\openspec` en
Windows.

## Referencia

Consulta las opciones exactas y la estructura JSON de todos los comandos de
esta página en la [referencia de la CLI](/es-ES/cli/) (Almacenes, Diagnóstico,
Contexto de trabajo y Conjuntos de trabajo personales) y el [contrato del
agente](/es-ES/agent-contract/).
