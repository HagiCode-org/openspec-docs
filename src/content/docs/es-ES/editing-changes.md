---
title: "Edición e iteración de cambios"
---

**Cada artefacto de un cambio es simplemente un archivo Markdown que puedes editar en cualquier momento.** No hay una «fase de planificación» bloqueada, una instancia de aprobación ni un modo de edición especial. ¿Quieres cambiar la propuesta después de empezar a construir? Abre `proposal.md` y modifícala. ¿Te das cuenta a mitad de la implementación de que el diseño está mal? Corrige `design.md` y sigue adelante. Esa es toda la respuesta, y está pensado así.

Esta página es para ese momento en que piensas «espera, ¿puedo volver atrás y cambiarlo?». Sí. Aquí se explica cómo hacerlo en cada caso habitual.

## Dos formas de editar cualquier cosa

Siempre tienes estas dos opciones:

1. **Edita el archivo directamente.** Los artefactos son archivos Markdown sin formato en `openspec/changes/<name>/`. Abre `proposal.md`, `design.md`, `tasks.md` o una especificación delta dentro de `specs/` en tu editor y modifícala. No hace falta nada más.

2. **Pide a tu IA que lo revise.** En el chat, dile lo que quieres: «Actualiza la propuesta para descartar la idea de la caché y añadir una sección sobre límites de frecuencia» o «el diseño debería usar una cola, no sondeo». La IA editará el artefacto usando el resto del cambio como contexto.

Elige lo que mejor se adapte al momento. ¿Un pequeño ajuste de redacción? Edita el archivo. ¿Un replanteamiento sustancial? Deja que la IA lo revise con todo el contexto.

## «¿Cómo actualizo la propuesta (o las especificaciones) una vez que empecé?»

Solo tienes que actualizarla. Es el mismo cambio, refinado.

Si usas los comandos ampliados, el flujo natural es editar el artefacto y luego ejecutar `/opsx:continue` para retomar desde el nuevo estado, o `/opsx:apply` para seguir implementando según el plan actualizado. Si usas los comandos predeterminados de `core`, edita el artefacto y ejecuta `/opsx:apply`; este lee los archivos actuales y construye lo que indiquen en ese momento.

El modelo mental es este: los artefactos son el plan vigente, no un contrato firmado. La IA siempre trabaja con su contenido actual, así que editarlos orienta el trabajo.

```text
You: I want to change the approach in this change.

You: [edit design.md, or tell the AI:]
     Update design.md to use a background job instead of a synchronous call.

AI:  Updated design.md. The task list still fits; want me to continue applying?

You: /opsx:apply
```

Esto responde a una pregunta muy habitual: no hay un comando separado para «actualizar la propuesta» porque no hace falta. El archivo es la fuente de verdad y editarlo, a mano o con la IA, es actualizarlo.

## «¿Cómo vuelvo a revisar después de implementar?»

No tienes que «volver», porque nunca te fuiste. El flujo es flexible: la revisión, la edición y la implementación no son fases secuenciales que te atrapan.

En concreto, después de trabajar con `/opsx:apply`:

- ¿Quieres volver a examinar el plan? Abre y lee los artefactos, o ejecuta `openspec show <change>` en el terminal para ver una vista consolidada.
- ¿Encontraste algo que cambiar? Edita el artefacto (o pídele a la IA que lo haga) y continúa.
- ¿Quieres comprobar de forma estructurada que el código coincide con el plan? Ejecuta `/opsx:verify` (comando ampliado). Informa sobre integridad, corrección y coherencia sin bloquear nada. Consulta [Flujos de trabajo: verificar](/es-ES/workflows/#verify-comprueba-tu-trabajo).

No hay una «fase de revisión» a la que volver, porque puedes revisar en cualquier momento, incluso después de implementar.

## «He editado el código a mano. ¿Cómo lo concilio con OpenSpec?»

Pasa constantemente y no hay problema. Has retocado algo en tu editor y ahora el código y los artefactos no coinciden. Vuelve a sincronizarlos en la dirección que corresponda:

- **El código ahora es correcto y la especificación está desactualizada.** Actualiza la especificación delta (y las tareas, si corresponde) para describir el comportamiento que realmente publicaste. Antes de archivar, la especificación debe reflejar la realidad, porque al archivar se integra en la fuente de verdad.
- **La especificación es correcta y el código se desvió.** Sigue construyendo o corrigiendo hasta que el código coincida con la especificación.

Una forma rápida de detectar discrepancias es `/opsx:verify`: lee los artefactos y el código e indica dónde divergen. Toma el resultado como una lista de tareas para conciliarlos y archiva cuando coincidan.

El principio es que, al archivar, tus especificaciones se convierten en la verdad registrada. Antes de archivar, asegúrate de que describan fielmente lo que hace el código. Se permiten las ediciones manuales; solo evita que desincronicen las especificaciones sin que nadie se dé cuenta.

## Refinar una propuesta que no te convence

Si una propuesta generada no da en el blanco, tienes tres buenas opciones:

- **Itera en el mismo lugar.** Dile a la IA qué falla («el alcance es demasiado amplio; quita las funciones de administración») y deja que lo revise. Es lo más sencillo y suele ser lo adecuado.
- **Explora primero y vuelve a proponer.** Si el problema es que la idea no está clara, vuelve a `/opsx:explore`, piénsala y deja que de ahí salga una propuesta más precisa. Consulta [Empieza por explorar](/es-ES/explore/).
- **Empieza de cero.** Si la intención cambió por completo, un cambio nuevo puede ser más claro que remendar el anterior.

La última opción tiene su propia guía de decisión, que viene a continuación.

## Cuándo actualizar y cuándo empezar un cambio nuevo

En resumen: **actualiza cuando sea el mismo trabajo refinado; empieza uno nuevo cuando la intención haya cambiado por completo o el alcance se haya convertido en otro trabajo.**

- ¿El objetivo es el mismo, pero el enfoque es mejor? Actualiza.
- ¿Se reduce el alcance (publicar ahora el producto mínimo viable y dejar más para después)? Actualiza, archiva y luego crea otro cambio para la segunda fase.
- ¿Cambió el problema («añadir modo oscuro» se convirtió en «crear un sistema completo de temas»)? Crea un cambio nuevo.

Encontrarás un diagrama de flujo completo y ejemplos en [Flujos de trabajo: cuándo actualizar o empezar desde cero](/es-ES/workflows/#cuándo-actualizar-y-cuándo-empezar-de-cero), y un análisis más detallado en [OPSX: cuándo actualizar o empezar desde cero](/es-ES/opsx/#cuándo-actualizar-y-cuándo-empezar-de-cero).

## Una nota sobre las tareas

`tasks.md` es una lista de comprobación dinámica, no un plan inmutable. Durante la implementación, puedes añadir tareas que descubras, quitar las que resulten innecesarias o cambiar su orden. La IA marca las tareas a medida que las completa con `/opsx:apply` y, si vuelves más tarde, continúa desde la primera tarea sin marcar. Es normal editar la lista sobre la marcha.

## Dónde continuar

- [Flujos de trabajo](/es-ES/workflows/) — patrones y guía para decidir entre actualizar o empezar de nuevo
- [Revisar un cambio](/es-ES/reviewing-changes/) — revisión de dos minutos del plan antes de construirlo
- [Empieza por explorar](/es-ES/explore/) — el punto para volver a pensar una idea
- [Comandos](/es-ES/commands/) — detalles de `/opsx:continue`, `/opsx:apply` y `/opsx:verify`
- [Conceptos: artefactos](/es-ES/concepts/#artefactos) — para qué sirve cada artefacto
