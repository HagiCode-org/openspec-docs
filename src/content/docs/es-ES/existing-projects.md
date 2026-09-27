---
title: "Usar OpenSpec en un proyecto existente"
---

**No tienes que documentar toda la base de código para empezar. Solo escribes especificaciones para aquello que vas a cambiar.** Es lo más importante que debes saber para adoptar OpenSpec en un proyecto existente y la razón por la que OpenSpec está diseñado pensando primero en sistemas ya desarrollados.

Una preocupación habitual es: «Mi aplicación tiene 80 000 líneas. ¿Tengo que escribir especificaciones para todo antes de que OpenSpec me sirva?». No. A ti te resultaría odioso, y a nosotros también. OpenSpec amplía las especificaciones cambio a cambio. El primero documenta la parte que afecta, el siguiente hace lo mismo con la suya y, con el tiempo, las especificaciones se completan de forma natural alrededor del trabajo real.

Esta guía muestra cómo empezar el primer día sin intentar abarcarlo todo.

## La versión de treinta segundos

```bash
$ cd your-existing-project
$ openspec init          # adds openspec/ and your AI tool's commands
```

Después, en el chat de la IA:

```text
/opsx:explore            # optional: have the AI read the area you'll touch
/opsx:propose <a real, small change you actually need>
/opsx:apply
/opsx:archive
```

Ahora tus especificaciones describen exactamente la parte del sistema que modificó el cambio, y nada más. Así debe ser. Ya no tienes que preocuparte por las otras 80 000 líneas.

## Por qué las deltas son la clave

Los cambios de OpenSpec se expresan como **deltas**: `ADDED`, `MODIFIED`, `REMOVED`. Una delta describe qué cambia respecto al comportamiento actual, no el sistema entero.

Eso es justo lo que necesita el trabajo sobre sistemas existentes. Rara vez construyes desde cero: añades un campo, corriges una redirección o acortas un tiempo de espera. Una delta te permite especificar ese cambio con precisión sin tener que redactar primero una especificación de 40 páginas sobre todo lo que lo rodea.

Por eso, el directorio `openspec/specs/` no empieza completo. Empieza casi vacío y va creciendo. Cada cambio archivado integra su delta. La especificación de `auth/` solo se vuelve exhaustiva tras realizar varios cambios de autenticación, justo cuando necesitas que lo sea.

Para conocer más detalles, consulta [Conceptos: especificaciones delta](/es-ES/concepts/#especificaciones-delta).

## Tu primer cambio en una base de código real

Elige algo pequeño y real. Nada de ejemplos de juguete ni de reescrituras: escoge un cambio que ya pensabas hacer esta semana. Los primeros cambios pequeños te enseñan el flujo con poco riesgo.

**Paso 1: Deja que la IA lea el área pertinente.** Aquí es donde `/opsx:explore` resulta útil si la base de código es grande o desconocida. Indícale la parte que vas a modificar y deja que averigüe cómo funciona antes de proponer nada.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I need to add rate limiting to our public API, but I'm not sure
     how requests currently flow through the middleware.

AI:  Let me trace it... [reads the router, middleware stack, and config]
     Requests hit Express, pass through auth middleware, then your
     controllers. There's no rate-limiting layer today. The cleanest
     insertion point is a middleware right after auth. Want me to scope it?
```

Fíjate en que ahora la IA entiende tu estructura real, así que la propuesta que escriba encajará con el código en vez de ser una plantilla genérica. En una base de código grande, este hábito por sí solo evita muchos problemas. Consulta [Empieza por explorar](/es-ES/explore/).

**Paso 2: Propón el cambio.** La propuesta y su especificación delta describen únicamente este cambio.

```text
You: /opsx:propose add-api-rate-limiting
```

**Paso 3: Construye y archiva** con `/opsx:apply` y `/opsx:archive`, igual que cualquier otro cambio. Al archivarlo, tendrás una especificación real del comportamiento de limitación de frecuencia, creada a partir de un cambio que de todas formas necesitabas.

## ¿Prefieres un recorrido guiado? Usa onboard

Si prefieres ver cómo se desarrolla todo el ciclo con tu propio código y una explicación, el comando ampliado `/opsx:onboard` hace exactamente eso: busca una pequeña mejora segura en la base de código y te guía para proponerla, implementarla y archivarla, explicando cada paso.

Primero, habilita los comandos ampliados:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Después, en el chat:

```text
/opsx:onboard
```

Es la forma más sencilla de iniciarse en un proyecto real y te deja un cambio auténtico (y pequeño) que puedes conservar o descartar. Consulta [Comandos: `/opsx:onboard`](/es-ES/commands/#opsxonboard).

## «Pero ya tengo documentos de requisitos»

Quizá tengas un PRD, un SRS, una especificación formal o incluso modelos TLA+. Perfecto. No los importes tal cual, pero tampoco los descartes.

Trata los documentos existentes como **material de referencia para explorar**, no como especificaciones que haya que convertir. Al iniciar un cambio, pega la sección pertinente o indica a la IA dónde encontrarla y deja que redacte una delta de OpenSpec centrada en el tema. La delta recoge el comportamiento que vas a cambiar ahora en forma de requisitos y escenarios comprobables de OpenSpec. Los documentos originales permanecen en su sitio como contexto.

La razón real: las especificaciones de OpenSpec se centran deliberadamente en el comportamiento y se limitan a los cambios. Un PRD de 40 páginas es otro tipo de artefacto con otra función. Una conversión masiva de una sola vez suele producir una especificación enorme y desactualizada en la que nadie confía. Si las especificaciones crecen a partir de cambios reales, se mantienen fieles.

```text
You: /opsx:explore
You: Here's the section of our PRD about checkout. I'm implementing the
     "guest checkout" requirement next.
     [paste the relevant requirement]
AI:  [reads it, asks clarifying questions, then helps scope a change]
You: /opsx:propose add-guest-checkout
```

## Organizar especificaciones en una base de código grande

Las especificaciones viven bajo `openspec/specs/` y se agrupan por **dominio**: un área lógica que refleja cómo concibe el sistema tu equipo. No hace falta diseñar de antemano toda la taxonomía. Crea una carpeta de dominio cuando el primer cambio de esa área la necesite.

Formas habituales de dividir los dominios:

- **Por área funcional:** `auth/`, `payments/`, `search/`
- **Por componente:** `api/`, `frontend/`, `workers/`
- **Por contexto delimitado:** `ordering/`, `fulfillment/`, `inventory/`

Elige una organización que tenga sentido para quien acaba de incorporarse. Puedes perfeccionarla más adelante. Consulta [Conceptos: especificaciones](/es-ES/concepts/#especificaciones).

## Monorepos y trabajo que abarca repositorios

En un monorepo, lo más sencillo es tener un directorio `openspec/` en la raíz, con dominios que correspondan a los paquetes o servicios. Así funciona para la mayoría de los equipos.

Si el trabajo abarca de verdad **varios repositorios** (o varios paquetes que tratas como unidades separadas), OpenSpec ofrece la función beta **Stores**: la planificación reside en un repositorio independiente al que pueden hacer referencia tus repositorios de código, por lo que el plan no tiene que estar en la carpeta `openspec/` de uno de ellos. La función está en fase beta; ten en cuenta que sus comandos y su estado pueden cambiar. Empieza por la [guía de usuario de Stores](/es-ES/stores-beta/user-guide/) para conocer el modelo y el recorrido mínimo útil.

## Algunas advertencias sinceras

- **Resiste las ganas de documentarlo todo a posteriori.** Escribir especificaciones para código que no vas a cambiar parece productivo, pero por lo general no lo es. Acaban quedando desactualizadas, porque nada las obliga a reflejar la realidad. Deja que los cambios reales guíen tus especificaciones.
- **Mantén pequeños los primeros cambios.** Los primeros cambios sirven tanto para aprender el ritmo como para publicar trabajo. Un alcance acotado hace que el ciclo sea rápido y que las lecciones cuesten poco.
- **Confirma `openspec/` en Git.** Tus especificaciones y el archivo histórico deben estar bajo control de versiones junto al código que describen.
- **Proporciona contexto a la IA.** Si la base de código es grande y tiene convenciones firmes, rellena el campo `context:` de `openspec/config.yaml` para que cada propuesta respete tu pila tecnológica y tus patrones. Consulta [Personalización](/es-ES/customization/#configuración-del-proyecto).

## Dónde continuar

- [Empieza por explorar](/es-ES/explore/) — el hábito clave para comprender el código antes de cambiarlo
- [Primeros pasos](/es-ES/getting-started/) — guía completa del primer cambio
- [Editar e iterar un cambio](/es-ES/editing-changes/) — ajustar un cambio a medida que aprendes
- [Conceptos: especificaciones delta](/es-ES/concepts/#especificaciones-delta) — por qué las deltas simplifican el trabajo sobre sistemas existentes
- [Personalización](/es-ES/customization/) — enseña a OpenSpec las convenciones de tu proyecto
