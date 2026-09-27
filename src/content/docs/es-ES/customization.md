---
title: "Personalización"
---

OpenSpec ofrece tres niveles de personalización:

| Nivel | Función | Ideal para |
|-------|--------------|----------|
| **Configuración del proyecto** | Establecer valores predeterminados e incorporar contexto y reglas | La mayoría de los equipos |
| **Esquemas personalizados** | Definir artefactos propios para el flujo de trabajo | Equipos con procesos particulares |
| **Anulaciones globales** | Compartir esquemas entre proyectos | Usuarios avanzados |

---

## Configuración del proyecto

El archivo `openspec/config.yaml` es la forma más sencilla de adaptar OpenSpec a tu equipo. Permite:

- **Establecer un esquema predeterminado**: omitir `--schema` en cada comando.
- **Incorporar contexto del proyecto**: la IA conoce tu pila tecnológica, convenciones, etc.
- **Añadir reglas por artefacto**: reglas personalizadas para artefactos concretos.
- **Añadir indicaciones por operación**: preferencias orientativas para las operaciones de aplicación y archivado.
- **Recordar las opciones de integración**: por ejemplo, la activación del [agente de programación en la nube de GitHub Copilot](/es-ES/supported-tools/#agente-de-programación-en-la-nube-de-github-copilot).

### Configuración rápida

```bash
openspec init
```

El asistente te guía de forma interactiva para crear la configuración. También puedes crearla manualmente:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones

operations:
  apply:
    guidance:
      - Run focused tests before the full suite
  archive:
    guidance:
      - Keep the completion summary concise

# Set by `openspec init` when you choose (or decline) the GitHub Copilot
# cloud coding agent; controls whether `init`/`update` generate its files.
githubCopilot:
  cloudAgent: false
```

### Cómo funciona

**Esquema predeterminado:**

```bash
# Without config
openspec new change my-feature --schema spec-driven

# With config - schema is automatic
openspec new change my-feature
```

**Incorporación de contexto y reglas:**

Al generar un artefacto, el contexto y las reglas se incorporan a la instrucción de la IA:

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- El **contexto** aparece en TODOS los artefactos.
- Las **reglas** aparecen SOLO en el artefacto correspondiente.

**Indicaciones para las operaciones:**

`operations.apply.guidance` y `operations.archive.guidance` son listas opcionales
de recomendaciones sobre cómo debe realizar un agente esas operaciones. Son
independientes de `rules`: las indicaciones de operación no restringen el contenido
de los artefactos, y las reglas de artefacto nunca se convierten en indicaciones de operación.

Las operaciones de aplicación y archivado obtienen estos datos en el momento de ejecutarse:

```bash
openspec instructions apply --change my-feature --json
openspec instructions archive --change my-feature --json
```

Ambos comandos devuelven el `context` actual del proyecto y el `operationGuidance`
correspondiente en campos opcionales e independientes. Cada invocación lee una
instantánea nueva desde la raíz resuelta. Si se selecciona `--store <id>`, el
cambio, el contexto y las indicaciones proceden de ese almacén, no del repositorio
actual. El comando de instrucciones para archivar es de solo lectura: no inspecciona
ni combina especificaciones delta, no escribe las especificaciones principales,
no mueve el cambio ni ejecuta el flujo estático de archivado.

El contexto del proyecto es un dato obligatorio para la instrucción. Los flujos
generados lo leen y aplican los datos, convenciones y restricciones pertinentes.
Las indicaciones de operación son recomendaciones adicionales opcionales: los
flujos consideran cada entrada y siguen las que sean aplicables y compatibles con
el flujo integrado.

Ambos campos se mantienen separados del estado controlado por la CLI, las rutas
resueltas, los pasos integrados, las opciones explícitas del usuario y las reglas
de los artefactos. Si hay conflictos con el contexto, el flujo los señala y
conserva el valor que prevalece. No sigue las indicaciones que sean inaplicables
o contradictorias, y explica el motivo. Ninguno de los campos constituye una
comprobación obligatoria, y los flujos no copian su texto en archivos de
implementación, especificaciones, artefactos de cambios ni resúmenes, salvo que
el usuario solicite ese contenido por separado.

**Seguridad de las entradas de archivado y sincronización de especificaciones:**

El archivado, el archivado en lote y la sincronización independiente usan
`artifactPaths.specs.existingOutputPaths` from `openspec status --json` como única fuente de especificaciones delta. Si un esquema no tiene un artefacto
`specs` o la lista concreta de resultados de un cambio está vacía, no hay nada
que sincronizar; no se deducen especificaciones delta a partir de otros artefactos.

Antes de que una combinación semántica escriba una especificación principal, el flujo usa la salida actual de
`openspec instructions specs --change <name> --json` La salida `specs` devuelta restringe únicamente las especificaciones principales
producidas por esa combinación. El archivado individual pasa esa instantánea a la
sincronización integrada; la sincronización independiente la obtiene directamente,
y el archivado en lote reúne todas las instantáneas necesarias antes de escribir
la primera especificación. Una respuesta de instrucciones de archivado o
especificaciones con código distinto de cero o JSON no válido es un error de
consulta, no una entrada vacía: el flujo se detiene antes de escribir la
especificación afectada o mover el cambio (en el archivado en lote, antes de
cualquier escritura o movimiento del lote).

Esta configuración no modifica las fases de ejecución del archivado, las
indicaciones al usuario, las operaciones del sistema de archivos, la gestión de
las combinaciones semánticas, el comando directo `openspec archive` ni la
estructura y salida de `rules` de los artefactos.

### Orden de resolución del esquema

Cuando OpenSpec necesita un esquema, lo busca en este orden:

1. Opción de la CLI: `--schema <name>`
2. Metadatos del cambio (`.openspec.yaml` en la carpeta del cambio)
3. Configuración del proyecto (`openspec/config.yaml`)
4. Valor predeterminado (`spec-driven`)

---

## Esquemas personalizados

Si la configuración del proyecto no basta, crea un esquema propio con un flujo
de trabajo totalmente personalizado. Los esquemas personalizados se guardan en
`openspec/schemas/` y se versionan junto con el código del proyecto.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Project config
│   ├── schemas/           # Custom schemas live here
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Your changes
└── src/
```

### Crear una variante de un esquema existente

La forma más rápida de personalizar consiste en crear una variante de un esquema integrado:

```bash
openspec schema fork spec-driven my-workflow
```

Esto copia todo el esquema `spec-driven` en `openspec/schemas/my-workflow/`, donde puedes editarlo libremente.

**Qué incluye:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow definition
└── templates/
    ├── proposal.md       # Template for proposal artifact
    ├── spec.md           # Template for specs
    ├── design.md         # Template for design
    └── tasks.md          # Template for tasks
```

Edita `schema.yaml` para cambiar el flujo de trabajo, o modifica las plantillas para cambiar lo que genera la IA.

### Crear un esquema desde cero

Para crear un flujo de trabajo completamente nuevo:

```bash
# Interactive
openspec schema init research-first

# Non-interactive
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Estructura del esquema

Un esquema define los artefactos del flujo de trabajo y sus dependencias:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # Can't create design until proposal exists

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Campos principales:**

| Campo | Función |
|-------|---------|
| `id` | Identificador único que se usa en comandos y reglas |
| `generates` | Nombre del archivo de salida (admite patrones como `specs/**/*.md`) |
| `template` | Archivo de plantilla del directorio `templates/` |
| `instruction` | Instrucciones para que la IA cree este artefacto |
| `requires` | Dependencias: artefactos que deben existir previamente |

Enumera los artefactos en el orden en que quieras que se generen. `requires`
determina qué es posible; el orden de la lista `artifacts:` determina cuál se
genera primero cuando hay varios artefactos disponibles.

### Plantillas

Las plantillas son archivos Markdown que orientan a la IA. Se incorporan a la
instrucción al crear el artefacto correspondiente.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

Las plantillas pueden incluir:
- Encabezados de sección que la IA debe completar
- Comentarios HTML con indicaciones para la IA
- Ejemplos del formato y la estructura esperados

### Validar el esquema

Valida el esquema personalizado antes de usarlo:

```bash
openspec schema validate my-workflow
```

La validación comprueba que:
- La sintaxis de `schema.yaml` sea correcta
- Existan todas las plantillas mencionadas
- No haya dependencias circulares
- Los identificadores de los artefactos sean válidos

### Usar el esquema personalizado

Una vez creado, puedes usar el esquema así:

```bash
# Specify on command
openspec new change feature --schema my-workflow

# Or set as default in config.yaml
schema: my-workflow
```

### Diagnosticar la resolución del esquema

¿No sabes qué esquema se está usando? Compruébalo con:

```bash
# See where a specific schema resolves from
openspec schema which my-workflow

# List all available schemas
openspec schema which --all
```

La salida indica si procede del proyecto, del directorio del usuario o del paquete:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Nota:** OpenSpec también admite esquemas de usuario en
> `~/.local/share/openspec/schemas/` para compartirlos entre proyectos. Sin
> embargo, se recomiendan los esquemas de proyecto de `openspec/schemas/`, ya que
> se versionan junto con el código.

---

## Ejemplos

### Flujo de trabajo de iteración rápida

Un flujo de trabajo mínimo para iteraciones rápidas:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Añadir un artefacto de revisión

Crea una variante del esquema predeterminado y añade un paso de revisión:

```bash
openspec schema fork spec-driven with-review
```

Después, edita `schema.yaml` para añadir:

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # Now tasks require review too
```

---

## Esquemas de la comunidad

OpenSpec también admite esquemas mantenidos por la comunidad y distribuidos en
repositorios independientes. Ofrecen flujos de trabajo con criterios definidos
que integran OpenSpec con otras herramientas o sistemas, de forma similar al
[catálogo de extensiones comunitarias de github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions).

Los esquemas comunitarios no se incluyen en el núcleo de OpenSpec: residen en
sus propios repositorios y siguen su propio calendario de versiones. Para usar
uno, copia el paquete del esquema en `openspec/schemas/<schema-name>/` del
proyecto (el README de cada repositorio contiene las instrucciones de instalación).

| Esquema | Mantenedor | Repositorio | Descripción |
|--------|-----------|-----------|-------------|
| `intent-driven` | @harikrishnan83 | [intent-driven-dev/openspec-schemas](https://github.com/intent-driven-dev/openspec-schemas/tree/main/openspec/schemas/intent-driven) | Registra la intención del cambio, el comportamiento observable, el diseño técnico y las decisiones arquitectónicas duraderas antes de implementar. Añade un manifiesto de revisión ADR específico del cambio y registra como ADR inmutables y reemplazables las decisiones que deban perdurar. |
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Integra la gobernanza de artefactos de OpenSpec con las habilidades de ejecución de [obra/superpowers](https://github.com/obra/superpowers) (lluvia de ideas, planes, TDD mediante subagentes, revisión de código y finalización). Añade un artefacto `retrospective` que parte de la evidencia y cubre una carencia que Superpowers no aborda de forma nativa. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | Flujo de trabajo centrado primero en la gestión de productos. Ejecuta la canalización de planificación de [nanopm](https://github.com/nmrtn/nanopm) (auditoría → estrategia → hoja de ruta → PRD) antes de la implementación. Conecta la planificación de producto con el flujo de ingeniería basado en especificaciones de OpenSpec. Si existe `.nanopm/`, los artefactos obtienen información de allí: la propuesta, de la auditoría; el diseño, de la estrategia; y las tareas, del desglose del PRD. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | Guías de pruebas integrales de extremo a extremo para cada capacidad. Cada capacidad tiene una especificación inmutable, una plantilla inmutable de tareas y un registro de ejecución con marca de tiempo por cada ejecución. Las aserciones se limitan al comportamiento observable (estado HTTP, cuerpo de la respuesta y estado persistido; nunca fragmentos de registros). Cada ejecución registra el inicio y el fin en UTC, la duración y una estimación del consumo de tokens del LLM. |
| `anvil` | @jikkujoyce | [jikkujoyce/openspec-schemas](https://github.com/jikkujoyce/openspec-schemas/tree/main/schemas/anvil) | Flujo basado en especificaciones con disciplina TDD y una etapa de revisión adversarial. Secuencia: `proposal` → `specs` → `design` → `review` → `test-plan` → `tasks` → `apply` → `verify`. Un revisor de solo lectura con contexto nuevo (un segundo modelo, si hay alguno disponible) redacta `review` y emite una línea `VERDICT:` que indica al agente si debe habilitar `test-plan`, `tasks` y `apply`. OpenSpec solo comprueba que existan los artefactos, así que debes aplicar esta condición en tu propio CI o hook. `test-plan` asigna una prueba con nombre a cada escenario de las especificaciones y también sirve de registro rojo/verde que audita `verify`. |

> ¿Quieres contribuir con un esquema comunitario? Abre una incidencia con un
> enlace a tu repositorio o envía un PR que añada una fila a esta tabla.

---

## Véase también

- [Referencia de la CLI: comandos de esquemas](/es-ES/cli/#comandos-de-esquemas): documentación completa de los comandos
