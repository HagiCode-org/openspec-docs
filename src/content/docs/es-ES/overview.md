---
title: "Conceptos básicos de un vistazo"
---

**OpenSpec es una capa ligera de acuerdos entre tú y tu IA.** Describes qué debe hacer un cambio, la IA redacta los detalles, ambos revisan el mismo plan y solo entonces se escribe el código. Esta página resume todo el modelo mental en una sola vista. Para una explicación más extensa, consulta [Conceptos](/es-ES/concepts/).

La idea completa en cinco palabras: **primero acordar, luego construir con confianza.**

## Las cinco ideas

Todo OpenSpec se basa en cinco conceptos. Apréndelos y lo demás serán detalles.

**1. Las especificaciones son la verdad.** Una especificación describe cómo se comporta *ahora mismo* tu sistema. Vive en `openspec/specs/`, organizada por dominio (`auth/`, `payments/`, `ui/`). Las especificaciones constan de requisitos («el sistema DEBE caducar las sesiones tras 30 minutos») y escenarios (ejemplos concretos de dado/cuando/entonces). Piensa en ellas como la única respuesta acordada a «¿qué hace este software?».

**2. Un cambio es una unidad de trabajo.** Cuando quieres añadir, modificar o eliminar un comportamiento, creas un cambio: una carpeta en `openspec/changes/` que reúne en un solo lugar todo lo relacionado con ese trabajo. Una propuesta, un diseño, una lista de tareas y las modificaciones de las especificaciones. Un cambio, una carpeta, una función.

**3. Las especificaciones delta describen qué cambia, no todo el sistema.** Dentro de un cambio no vuelves a escribir la especificación completa. Escribes una delta pequeña: este requisito `ADDED` (añadido), aquel `MODIFIED` (modificado), este otro `REMOVED` (eliminado). Este es el mecanismo que hace que OpenSpec sirva para editar sistemas existentes, no solo para proyectos nuevos. Describes la diferencia, no el destino.

**4. Los artefactos se apoyan unos en otros.** Un cambio contiene unos cuantos documentos, creados en un orden natural, donde cada uno alimenta al siguiente:

```text
proposal ──► specs ──► design ──► tasks ──► implement
   why        what       how       steps      do it
```

Puedes volver a cualquiera de ellos cuando quieras. Son facilitadores, no barreras. (Más adelante se explica.)

**5. Archivar reincorpora el cambio a la verdad.** Cuando terminas el trabajo, archivas el cambio. Sus especificaciones delta se integran en las especificaciones principales y la carpeta del cambio se traslada a `changes/archive/` con una fecha. Ahora tus especificaciones describen la nueva realidad y estás listo para el siguiente cambio. El ciclo se cierra.

## El esquema

```text
┌─────────────────────────────────────────────────────────────────┐
│                          openspec/                              │
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────────────┐    │
│   │     specs/       │         │        changes/          │    │
│   │                  │ ◄─────  │                          │    │
│   │ source of truth  │  merge  │ one folder per change    │    │
│   │ how things work  │  on     │ proposal · design ·      │    │
│   │ today            │ archive │ tasks · delta specs      │    │
│   └──────────────────┘         └──────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Dos carpetas. `specs/` contiene lo que es verdad. `changes/` contiene lo que propones. Archivar convierte una propuesta en parte de la verdad.

## El ciclo que realmente seguirás

En la configuración predeterminada, tu jornada se parece a esto. Si quieres, primero puedes pensar el problema; después, un comando redacta el plan, tú lo lees, el siguiente lo construye y el último lo archiva.

```text
/opsx:explore                   →  (optional) think it through with the AI first
/opsx:propose add-dark-mode     →  AI drafts proposal, specs, design, tasks
        (you read and adjust the plan)
/opsx:apply                     →  AI builds it, checking off tasks
/opsx:archive                   →  specs updated, change archived
```

**Si tienes dudas, empieza explorando.** `/opsx:explore` es un compañero de reflexión sin compromiso: lee tu código, presenta opciones y convierte una idea imprecisa en un plan concreto antes de escribir código. Es el mejor antídoto contra una IA que, de otro modo, construirá *algo* a partir de una petición vaga. ¿Ya sabes exactamente lo que quieres? Ve directamente a `/opsx:propose`. En cualquier caso, explore está incluido en el perfil predeterminado y siempre está disponible. Consulta la [guía de Explore](/es-ES/explore/).

Esos son comandos de barra, que se escriben en el chat de tu asistente de IA. La configuración (`openspec init`) se hace en el terminal. Si no conocías esa distinción, lee primero [Cómo funcionan los comandos](/es-ES/how-commands-work/); es el punto que suele causar más confusión.

## «Facilitadores, no barreras»

Esta frase aparece en todo OpenSpec; aquí se explica en términos sencillos.

Los procesos tradicionales de especificación siguen un modelo en cascada: terminas la planificación y *entonces* puedes implementar, y volver atrás es difícil. OpenSpec rechaza ese modelo. El orden `proposal → specs → design → tasks` indica qué se vuelve *posible* hacer a continuación, no qué estás *obligado* a hacer.

¿Descubres durante la implementación que el diseño estaba equivocado? Edita `design.md` y sigue. ¿Te das cuenta de que debes reducir el alcance? Actualiza la propuesta. Nada queda bloqueado. Las dependencias solo existen para que la IA tenga el contexto que necesita (no puedes crear buenas tareas sin especificaciones que las fundamenten), no para limitarte.

La fortaleza de este enfoque es su honestidad: el trabajo real es desordenado e iterativo, y OpenSpec lo permite. La contrapartida es la disciplina: como nada te obliga a avanzar, te corresponde mantener el enfoque de un cambio y evitar que se desborde. La guía de [Flujos de trabajo](/es-ES/workflows/) ofrece buenos hábitos para conseguirlo.

## Por qué merece la pequeña inversión

La verdad es sencilla: OpenSpec añade un paso. Escribes un plan breve antes de construir. ¿Qué obtienes a cambio?

- **Detectas los desvíos antes de que cuesten caro.** Corregir un malentendido en una propuesta de un párrafo no cuesta nada. Corregirlo después de que la IA haya escrito 400 líneas sí.
- **El plan y el código permanecen en el mismo repositorio.** Seis meses después, la especificación te explica a ti (y a la siguiente sesión de IA) por qué el sistema funciona como funciona.
- **Los cambios se pueden revisar.** Una carpeta de cambio es un paquete ordenado: lee la propuesta, revisa las deltas y comprueba las tareas. No hay que excavar en el historial del chat.
- **Se adapta a las bases de código existentes.** Gracias a las deltas, puedes especificar un cambio para una aplicación de 50 000 líneas sin documentarla primero entera.

Y la contrapartida honesta: para una corrección realmente trivial de una línea, quizá no compense el proceso, y no pasa nada. OpenSpec está diseñado para ser ligero, pero no es gratuito. Úsalo cuando sea importante llegar a un acuerdo; una vez que trabajas con una IA que construirá con seguridad lo que sea que le hayas pedido vagamente, resulta que eso ocurre la mayor parte del tiempo.

## Dónde continuar

- ¿Acabas de llegar? [Primeros pasos](/es-ES/getting-started/) recorre el primer cambio de principio a fin.
- ¿Aún no sabes qué construir? [Empieza por explorar](/es-ES/explore/) es el punto de partida.
- ¿No tienes claro dónde se ejecutan los comandos? [Cómo funcionan los comandos](/es-ES/how-commands-work/).
- ¿Quieres una explicación a fondo de lo anterior? [Conceptos](/es-ES/concepts/).
- ¿Prefieres aprender con ejemplos? [Ejemplos y recetas](/es-ES/examples/).
- ¿Necesitas definir un término? [Glosario](/es-ES/glossary/).
