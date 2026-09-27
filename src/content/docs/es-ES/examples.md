---
title: "Ejemplos y recetas"
---

Cambios reales, de principio a fin. Cada receta muestra los comandos que
escribirías y la respuesta que recibirías, para que puedas identificar el patrón
que se ajusta a tu situación y copiarlo. Se usan los comandos predeterminados del
perfil **core** (`propose`, `explore`, `apply`, `update`, `sync`, `archive`); se
indica cuándo conviene usar el conjunto ampliado.

Antes de empezar, recuerda que los comandos de barra, como `/opsx:propose`, se
escriben en el **chat de tu asistente de IA**, mientras que los comandos
`openspec` se ejecutan en el **terminal**. Si es la primera vez, lee [Cómo
funcionan los comandos](/es-ES/how-commands-work/). En las transcripciones,
`You:` y `AI:` representan el chat, y las líneas que empiezan con `$` son del
terminal.

> **¿Aún no tienes claro qué vas a crear?** La mayoría de estas recetas mejoran
> si primero usas `/opsx:explore` para aclarar la idea. La [receta 3](#receta-3-explorar-antes-de-decidir)
> muestra cómo hacerlo, y la guía [Empieza por explorar](/es-ES/explore/) explica
> el enfoque en detalle.

## Receta 1: Una función pequeña, el camino rápido

**Cuándo usarla:** sabes lo que quieres y el trabajo está bien acotado. Es la
receta más habitual.

Todo se resuelve con tres comandos: proponer, implementar y archivar.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

Ahora revisa el plan. Abre la propuesta y la especificación delta. Este es el
momento para el que se creó OpenSpec: detectar una suposición equivocada cuando
aún es un párrafo y no 400 líneas de código. Si algo no encaja, edita
directamente cualquier artefacto y continúa.

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

Eso es todo. El comportamiento de cierre de sesión ya forma parte de las
especificaciones, y el cambio queda archivado junto con todo su contexto.

## Receta 2: Corregir un error

**Cuándo usarla:** algo no funciona y quieres registrar la solución como un
cambio de comportamiento deliberado, en vez de dejarla como un commit misterioso.

Las correcciones de errores funcionan igual que las nuevas funciones. La
diferencia está en cómo planteas la propuesta: describe el comportamiento
*correcto*, no te limites a decir «corregir el error».

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Como la corrección se registra como un requisito `MODIFIED` con un escenario
nuevo, la siguiente persona (o sesión de IA) no solo verá que lo corregiste, sino
también qué significa «correcto». Después, usa `/opsx:apply` y
`/opsx:archive` como de costumbre.

Consejo: en una corrección, un buen escenario describe la prueba de regresión.
«DADO un usuario que ha cerrado sesión, CUANDO envía credenciales válidas,
ENTONCES llega al panel y no se le redirige de nuevo». Escríbelo y la
implementación tendrá un objetivo claro.

## Receta 3: Explorar antes de decidir

**Cuándo usarla:** tienes un problema, pero todavía no un plan. No sabes qué
crear o cuál es el enfoque adecuado.

Empieza con `/opsx:explore`. Es un compañero para pensar sin una estructura
predefinida. Nunca escribe código ni crea otros archivos, a menos que le pidas
que registre lo que decidiste o aceptes su propuesta de hacerlo. Lee tu base de
código y te ayuda a decidir.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

La exploración aclara tus ideas *antes* de convertirlas en un cambio. Cuando la
idea ya esté definida, crea la propuesta y la IA conservará el contexto.

## Receta 4: Gestionar dos cambios a la vez

**Cuándo usarla:** estás trabajando en una función y aparece una corrección
urgente que tiene prioridad.

Cada cambio tiene su propia carpeta, así que el trabajo en paralelo no genera
conflictos. Empieza por la corrección, publícala y luego retoma la función donde
la dejaste.

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

Indicar el cambio en `/opsx:apply add-dark-mode` permite señalarle a la IA cuál
debe usar cuando hay varios activos. Como las tareas registran el progreso en
`tasks.md`, la IA sabe exactamente dónde te quedaste.

Cuando se completan varios cambios a la vez, el comando ampliado
`/opsx:bulk-archive` los archiva juntos y resuelve los conflictos entre
especificaciones comprobando qué se implementó realmente. Consulta [Flujos de
trabajo](/es-ES/workflows/#cambios-en-paralelo).

## Receta 5: Refactorizar sin cambiar el comportamiento

**Cuándo usarla:** reorganizas el código, pero el comportamiento visible desde
fuera debe permanecer igual.

Este caso es interesante porque una refactorización pura *no añade nada a las
especificaciones*. El contrato de comportamiento no cambia; solo cambia la
implementación. Por eso, el trabajo se describe en el diseño y las tareas, y la
especificación delta queda vacía o no existe.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Declara explícitamente la delta vacía estableciendo `skip_specs: true` en el
archivo `.openspec.yaml` del cambio:

```yaml
schema: spec-driven
skip_specs: true
```

Sin esta marca, `openspec validate` rechaza los cambios sin deltas (así se
detecta si se omitió por accidente la fase de especificaciones). Con ella, la
validación se completa y `openspec status` muestra que la fase de
especificaciones se omitió explícitamente, en vez de dejarla pendiente. Si la
refactorización acaba cambiando el comportamiento, elimina `skip_specs` de
`.openspec.yaml` y escribe las especificaciones delta. La validación considera
que la marca y los archivos de especificación son incompatibles, por lo que no
puede quedar olvidada sin que se note.

Para archivar un cambio marcado no hacen falta opciones adicionales (no hay
deltas que combinar). También puedes usar la opción `--skip-specs` para indicar
explícitamente al comando del terminal que omita la fase de especificaciones:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

La misma opción resulta útil para herramientas, integración continua y cambios
que solo afectan a la documentación. El principio es sencillo: las
especificaciones describen el comportamiento; si este no cambia, las
especificaciones tampoco deberían hacerlo. Consulta [Conceptos](/es-ES/concepts/#qué-es-una-especificación-y-qué-no-es).

## Receta 6: Control paso a paso (comandos ampliados)

**Cuándo usarla:** un cambio complejo o arriesgado cuyos artefactos quieres
revisar uno por uno antes de continuar.

El comando principal `/opsx:propose` redacta todo de una vez. Si prefieres
avanzar paso a paso, activa los comandos ampliados:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Ahora puedes crear la estructura y avanzar de forma incremental:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Revisa cada artefacto a medida que se crea, edítalo libremente y continúa cuando
estés conforme. Si quieres que se redacte de una vez todo lo que queda,
`/opsx:ff` avanza rápidamente por los artefactos de planificación pendientes.
Antes de archivar, `/opsx:verify` comprueba que la implementación se ajuste a las
especificaciones. Consulta [Flujos de trabajo](/es-ES/workflows/#opsxff-frente-a-opsxcontinue).

## Receta 7: Aprender el ciclo completo con la práctica

**Cuándo usarla:** ya instalaste OpenSpec y quieres *probar* el flujo de trabajo
con tu propio código, no con un ejemplo de juguete.

Activa los comandos ampliados (consulta la receta 6) y ejecuta:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` busca una mejora real y pequeña, crea un cambio para ella, la
implementa y la archiva, explicando cada paso. Tarda entre 15 y 30 minutos y te
deja un cambio real que puedes conservar o descartar. Es la forma más sencilla
de aprender. Consulta [Comandos](/es-ES/commands/#opsxonboard).

## Comprobar el trabajo desde el terminal

Puedes consultar el estado de tu trabajo en cualquier momento desde el terminal:

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

Estas herramientas solo sirven para consultar e inspeccionar. Las propuestas y
la implementación se siguen gestionando con comandos de barra en el chat. Más
detalles en la [referencia de la CLI](/es-ES/cli/).

## Próximos pasos

- [Empieza por explorar](/es-ES/explore/): la forma recomendada de empezar si tienes dudas
- [Flujos de trabajo](/es-ES/workflows/): los patrones anteriores y cuándo conviene usar cada uno
- [Comandos](/es-ES/commands/): detalles de todos los comandos de barra
- [Primeros pasos](/es-ES/getting-started/): guía canónica para crear el primer cambio
- [Conceptos](/es-ES/concepts/): cómo encajan las distintas piezas
