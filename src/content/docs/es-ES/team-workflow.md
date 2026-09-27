---
title: "OpenSpec en equipo"
---

Todo lo descrito en las demás guías funciona igual si trabajas a solas o en un equipo de veinte personas. En equipo, cambian las preguntas periféricas: dónde se guardan las especificaciones, cómo revisan los compañeros un plan y cómo encaja todo esto en el flujo de pull requests que ya usáis.

La respuesta breve: un cambio no es más que un conjunto de archivos y OpenSpec nunca toca Git. Por eso se integra en tu flujo de trabajo actual en vez de sustituirlo. Esta página describe las convenciones que suelen funcionar bien.

## Una regla: OpenSpec no toca Git

OpenSpec lee y escribe archivos Markdown sin formato bajo `openspec/`. Nunca confirma cambios, crea ramas, hace push o pull en tu proyecto; tampoco clona ni sincroniza un [Store](/es-ES/stores-beta/user-guide/) por su cuenta. Esto significa que:

- **Confirmas `openspec/` como cualquier otro código fuente.** Las especificaciones, los cambios activos y el archivo histórico forman parte del historial del proyecto. (Sí, confirma toda la carpeta; consulta las [preguntas frecuentes](/es-ES/faq/#debo-confirmar-la-carpeta-openspec-en-git).)
- **Versionas una carpeta de cambio igual que el código.** `openspec/changes/add-dark-mode/` no es más que un conjunto de archivos en una rama.
- **Todo lo que sigue son convenciones, no imposiciones.** OpenSpec no te obliga a seguir este método; simplemente se integra sin problemas.

## El ciclo de trabajo diario

El flujo que suele funcionar bien vincula un cambio con una rama y un pull request:

```
git switch -c add-dark-mode        start a branch, as usual
   │
/opsx:propose add-dark-mode        draft the plan (proposal + specs + tasks)
   │
REVIEW THE PLAN                    you read it before any code — see Reviewing a Change
   │
/opsx:apply                        build it; artifacts + code change together
   │
git commit && open a PR            the PR contains the spec delta AND the code
   │
teammate reviews, merges
   │
/opsx:archive                      fold the delta into specs/, move the change to archive/
```

El plan y el código conviven en la misma rama, así que los compañeros revisan ambos a la vez. Y seis meses después, la especificación archivada aún explica por qué el código tiene ese aspecto.

## Revisar especificaciones en un pull request

Aquí es donde el equipo nota los beneficios. Cuando un PR incluye la especificación delta del cambio, quien lo revisa obtiene algo que un diff sin más no ofrece: **una descripción en lenguaje sencillo de lo que debe hacer el cambio**, antes de leer una sola línea de código.

Un buen orden para revisar:

1. **Lee `proposal.md`**: ¿es el problema y el alcance adecuados?
2. **Lee la delta dentro de `specs/`**: ¿está bien definido qué significa «terminado»? (Es la revisión de dos minutos de [Revisar un cambio](/es-ES/reviewing-changes/), ahora en el PR).
3. **Después lee el diff del código**: ¿cumple exactamente esos requisitos?

Si quien revisa no está de acuerdo con el *enfoque*, puede señalarlo en la propuesta de forma sencilla, en lugar de discutirlo línea por línea entre 300 líneas de código. Pon la especificación delta cerca del principio de la descripción del PR o dirige a los revisores a la carpeta del cambio para que empiecen por ahí.

## Cuándo archivar

Al archivar, las deltas del cambio se integran en `openspec/specs/` y la carpeta se traslada a `openspec/changes/archive/YYYY-MM-DD-<name>/`. Como `specs/` es la **fuente de verdad compartida**, el momento importa en un equipo. Hay dos convenciones viables:

- **Archivar después de que se integre el PR (recomendado).** La rama conserva el cambio activo; una vez que se integra en la rama principal, archívalo allí (a menudo en un pequeño commit de seguimiento o durante una limpieza programada). Así, las `specs/` compartidas solo avanzan cuando el trabajo realmente se ha publicado.
- **Archivar dentro del PR.** Es más sencillo para equipos pequeños: el mismo PR que añade el código también sincroniza y archiva. La contrapartida es que los cambios de `specs/` y de código se integran juntos, lo que puede hacer que el PR sea más ruidoso.

Elige una opción y sé constante. En ambos casos, `/opsx:archive` comprueba que las tareas estén terminadas y ofrece sincronizar antes, para evitar integrar cambios incompletos por accidente.

## Dos personas, cambios en paralelo

Como cada cambio tiene su propia carpeta, no entran en conflicto:

- **Personas distintas, cambios distintos: ningún problema.** `add-dark-mode` y `rate-limit-login` son carpetas diferentes en ramas diferentes; no se afectan entre sí hasta archivarlas.
- **Una persona responsable por cambio.** Si dos personas editan la misma carpeta, entran en conflicto como si editaran el mismo archivo. Asigna un único autor al cambio o divídelo en dos cambios (otra razón para [ajustar el tamaño](/es-ES/writing-specs/#ajusta-el-tamaño-del-cambio)).
- **El único lugar donde aparecen conflictos es `specs/`.** Si dos cambios modifican el *mismo* requisito, al archivar el segundo habrá un conflicto en `openspec/specs/…/spec.md`. Resuélvelo como cualquier conflicto de fusión, conservando el requisito que refleje la realidad. Es poco habitual y, de hecho, es una ventaja: Git te está avisando de que dos cambios discrepan sobre el comportamiento del sistema.

## Cuando la planificación excede un repositorio

Todo lo anterior presupone que el plan está en la carpeta `openspec/` del propio repositorio de código, que es la opción predeterminada adecuada. Si la planificación abarca de verdad varios repositorios o equipos (por ejemplo, una función que modifica tres servicios o requisitos que un equipo mantiene y otros consumen), para eso existe la función beta **Stores**: la planificación tiene su propio repositorio al que pueden apuntar varios repositorios de código. Empieza con la [guía de usuario de Stores](/es-ES/stores-beta/user-guide/).

## Dónde continuar

- [Revisar un cambio](/es-ES/reviewing-changes/) — revisión dentro del PR.
- [Escribir buenas especificaciones](/es-ES/writing-specs/) — incluye cómo ajustar el tamaño de un cambio para que quepa en una rama.
- [Guía de usuario de Stores](/es-ES/stores-beta/user-guide/) — planificación que abarca repositorios y equipos.
