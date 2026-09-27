---
title: "Empieza por explorar"
---

**`/opsx:explore` es tu compañero de reflexión. Úsalo siempre que tengas un problema, pero aún no un plan.** Investiga la base de código, sopesa las opciones contigo y aclara qué quieres realmente antes de escribir una sola línea de código. Cuando todo esté claro, pasa a `/opsx:propose`.

Si adoptas un solo hábito de esta documentación, que sea este: **si tienes dudas, explora antes de proponer.**

Y esta es la razón. Los asistentes de programación con IA son entusiastas. Haz una petición imprecisa y construirán con seguridad *algo*, aunque quizá no lo que necesitabas. Explore lo evita. Es una conversación sin compromiso en la que tú y la IA determinan juntos cuál es el paso correcto; así, cuando hagas la propuesta, propondrás lo que de verdad hace falta.

## Cuándo explorar

Explore es el primer paso adecuado más a menudo de lo que la gente espera. Úsalo cuando se dé alguna de estas situaciones:

- Conoces el *problema*, pero no la *solución*. («Las páginas van lentas». «La autenticación es un caos». «Seguimos recibiendo pedidos duplicados».)
- Estás eligiendo entre varios enfoques y quieres comparar sus ventajas e inconvenientes teniendo en cuenta el código real.
- Acabas de llegar a una base de código y necesitas comprender cómo funciona algo antes de modificarlo.
- Los requisitos son imprecisos y quieres precisarlos antes de comprometerte.
- Sospechas que el trabajo es más grande o más pequeño de lo que parece y quieres delimitar su alcance con honestidad.

Omite Explore solo si ya sabes exactamente qué quieres y cómo conseguirlo. En ese caso, ve directamente a [`/opsx:propose`](/es-ES/commands/#opsxpropose).

## Qué hace (y qué no)

Explore es una **conversación**, no un generador.

**Sí hace lo siguiente:**
- Lee y busca en la base de código para responder preguntas reales.
- Compara opciones y describe las ventajas y desventajas de cada una.
- Dibuja diagramas para que un diseño sea más fácil de entender.
- Ayuda a acotar una idea imprecisa hasta convertirla en un alcance concreto que se pueda implementar.
- Registra la exploración cuando se lo pides o aceptas su oferta: crea la estructura del cambio mediante `openspec new change` y escribe los artefactos de planificación que indiques, o actualiza los artefactos de un cambio existente.
- Pasa a `/opsx:propose` cuando estés listo.

**No hace lo siguiente:**
- No escribe ni modifica código. Explore nunca escribe código, tampoco al registrar una exploración.
- No diseña ni edita esquemas o plantillas. Darles forma es un cambio, no una reflexión.
- No inicia un cambio ni escribe artefactos por su cuenta. No escribe nada a menos que se lo pidas o aceptes su oferta; en ese caso, solo hace lo acordado y los archivos de configuración necesarios para iniciar el cambio (consulta más abajo).
- No te presiona para que registres la exploración. Lo ofrece cuando la idea se concreta; tú decides.

Ese es el objetivo. Explorar no cuesta nada ni te compromete a nada hasta que lo decidas. Puedes explorar tres callejones sin salida, aprender de cada uno y proponer solo la opción que haya quedado en pie.

## Ya está instalado

Buenas noticias: `/opsx:explore` viene incluido en el perfil **core** predeterminado, junto con `propose`, `apply`, `update`, `sync` y `archive`. No tienes que habilitar nada. Si OpenSpec está configurado en el proyecto, Explore está listo para usarse en el chat de la IA. (Como ocurre con todos los comandos `/opsx:*`, se escribe en el chat del asistente, no en el terminal. Consulta [Cómo funcionan los comandos](/es-ES/how-commands-work/)).

## Un ejemplo completo

Observa cómo una preocupación imprecisa se convierte en un cambio concreto que se puede implementar.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our checkout sometimes creates duplicate orders. I don't know why
     and I don't know how to fix it safely.

AI:  Let me dig into the checkout path...
     [reads the order service, the payment webhook handler, and the
      client submit logic]

     Here's what I found. There are two ways a duplicate can happen:

     1. The client can submit twice (double-click, retry on slow network).
        Nothing debounces it.
     2. The payment webhook can fire more than once, and the handler
        creates an order each time. There's no idempotency key.

     Cause #2 is the dangerous one: it can charge and fulfill twice.

     Three ways to fix it, roughly in order of robustness:
     - Idempotency key on the order-creation endpoint (handles both causes)
     - Dedup on the webhook by payment-intent id (handles #2 only)
     - Client-side debounce (handles #1 only, papers over the real bug)

     Given your code already stores the payment-intent id, the
     idempotency-key approach is a small change with the biggest payoff.
     Want me to scope that?

You: Yes, let's do the idempotency key.

You: /opsx:propose add-order-idempotency-key

AI:  Created openspec/changes/add-order-idempotency-key/, with a proposal
     and delta spec grounded in what we just found. Ready for implementation.
```

Fíjate en lo ocurrido. El punto de partida era «algo va mal y me da miedo tocarlo». Veinte segundos de exploración lo convirtieron en una causa raíz identificada, tres opciones ordenadas, una recomendación basada en el código existente y un cambio preciso. La propuesta posterior es precisa porque primero se analizó el problema.

## Pasar a propose

Explore no archiva nada. Cuando estés listo, solo tienes que iniciar un cambio y la IA trasladará el contexto de la conversación a los artefactos.

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (think)     (agree)       (build)     (record)
```

Puedes decirlo en lenguaje sencillo («convirtamos esto en un cambio») o ejecutar directamente `/opsx:propose <name>`. En ambos casos, la exploración que acabas de hacer será la base de la propuesta, no un chat desechable.

También puedes pedirle a Explore que registre el cambio sin salir de la conversación: «inicia un cambio para esto» crea su estructura y «escribe también la propuesta» genera exactamente los artefactos que indiques. La estructura incluye los metadatos del cambio y completa los elementos que falten en el nivel superior del proyecto (`openspec/specs/`, `openspec/changes/archive/` o `config.yaml`).

El resultado es el mismo que al pasar a propose, con una diferencia: propose escribe todos los artefactos que exige el esquema para llegar a la implementación; el registro solo escribe los que indicaste.

Si usas el conjunto ampliado de comandos, Explore puede pasar a `/opsx:new` para crear los artefactos paso a paso. Consulta [Flujos de trabajo](/es-ES/workflows/).

## Consejos para explorar bien

- **Expón el problema, no la solución.** «El inicio de sesión va lento» permite que la IA investigue. «Añade una caché de Redis» te compromete de antemano con una solución que aún no has probado.
- **Pregunta explícitamente por las ventajas y desventajas.** «¿Qué inconvenientes tiene cada opción?» ayuda a obtener una comparación más honesta.
- **Deja que lea primero.** Las mejores exploraciones empiezan cuando la IA examina el código en vez de hacer suposiciones. Si te ayuda, indícale el área pertinente.
- **No pasa nada por dejarlo.** Si al explorar descubres que la idea no merece la pena, es un buen resultado: lo averiguaste a bajo coste.
- **Vuelve a explorar a mitad del cambio.** ¿Te has atascado durante `/opsx:apply`? Puedes hacer una pausa para explorar un subproblema y luego retomar el trabajo.

## Las contrapartidas reales

**Lo que ganas:** Explore detecta los desvíos en el momento menos costoso, antes de que te hayas comprometido con nada. Es especialmente eficaz cuando el código no te resulta familiar, porque la capacidad de la IA para leer y resumir el sistema puede ahorrarte una tarde de exploración.

**Lo que cuesta:** un poco de paciencia. Explore es una conversación, así que es más lento que ejecutar `/opsx:propose` y cruzar los dedos. Si ya entiendes bien el trabajo, ese paso adicional es puro trámite y deberías omitirlo.

Regla práctica: cuanto menos definido esté el trabajo, más provecho sacarás de Explore. Cuanto más claro esté, más fácil será pasar directamente a la propuesta.

## Dónde continuar

- [Comandos: `/opsx:explore`](/es-ES/commands/#opsxexplore): referencia detallada
- [Flujos de trabajo](/es-ES/workflows/): Explore como parte del ciclo diario
- [Ejemplos y recetas](/es-ES/examples/#receta-3-explorar-antes-de-decidir): recorrido completo con Explore
- [Primeros pasos](/es-ES/getting-started/): guía del primer cambio, incluida la exploración
