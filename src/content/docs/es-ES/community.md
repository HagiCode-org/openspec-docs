---
title: "Proyectos de la comunidad"
---

Una lista de proyectos y recursos de la comunidad creados con OpenSpec y para OpenSpec. Se admiten herramientas, integraciones, flujos de trabajo y recursos de aprendizaje. Los miembros de la comunidad amplían esta muestra abriendo incidencias; quienes mantienen OpenSpec añaden las entradas.

Los proyectos incluidos se mantienen de forma independiente. Su inclusión no implica que OpenSpec los respalde ni los recomiende oficialmente. Consulta la documentación y el rastreador de incidencias de cada proyecto para obtener información sobre configuración y soporte.

## Proyectos y recursos

- **[OpenSpec Workbench](https://github.com/VeryComplexAndLongName/OpenSpec-UI)**: Ejecuta y supervisa agentes que trabajan en cambios de OpenSpec.
- **[openspec-guard](https://github.com/guillaume-flambard/spec-guard)**: CLI y GitHub Action que informa qué escenarios de OpenSpec cubre una prueba de Vitest o Jest, sin ejecutar las pruebas.

## Servicios alojados

Productos alojados que añaden una capacidad de OpenSpec que la CLI no ofrece. Cada entrada indica las condiciones de cuenta, pago y tratamiento de datos.

- **[MySpec](https://myspec.dev)**: Beta en la nube (requiere cuenta; nivel gratuito, sin tarjeta de crédito) que realiza entrevistas guiadas para definir especificaciones y exporta paquetes de cuatro archivos o cambios compatibles con OpenSpec. Su servidor MCP (`@myspec/mcp-server`) y los [plugins de Claude Code](https://github.com/myspecs/claude-plugins) permiten que los agentes de programación lean esas especificaciones, escriban cambios de OpenSpec y los implementen tarea por tarea. El servicio envía a proveedores externos de IA el contenido que se le proporciona y no está diseñado para datos sensibles.
- **[Entalpa](https://entalpa.com/en/openspec)**: Importa `openspec/specs/` de un repositorio público de GitHub (hasta 300 requisitos) a un proyecto navegable, añade partes interesadas, historias y preguntas abiertas etiquetadas como inferidas, y exporta el resultado como un árbol `openspec/specs/`; nunca escribe en el repositorio. Importar y leer no requiere cuenta; guardar o editar sí, y las funciones de IA usan créditos de pago. El contenido importado se envía a proveedores externos de IA.
- **[OpenSpec Review](https://skillgild.dev/skills/openspec-review) y [OpenSpec Compact](https://skillgild.dev/skills/openspec-compact)**: Habilidades alojadas de SkillGild para Claude Code, Codex, Cursor, Gemini CLI o cualquier cliente MCP. Review publica un cambio como un enlace que cualquiera que lo tenga puede usar para aprobarlo, pedir cambios o comentar requisito por requisito sin cuenta; muestra la especificación principal tal como la escribiría `openspec archive` y marca los requisitos que también tocan otros cambios abiertos. Compact busca requisitos léxicamente similares y escenarios repetidos en las especificaciones principales y escribe la limpieza como un cambio de OpenSpec. Requiere la CLI de SkillGild y una cuenta gratuita (25 ejecuciones al mes por habilidad). Ambas envían el contenido de las especificaciones a los servidores de SkillGild, que ejecutan código cerrado y no hacen ninguna llamada a un modelo de IA; Review, además, envía la propuesta, el diseño y las tareas, y conserva el cambio durante 30 días.

## Añade tu proyecto

Abre una incidencia con la línea que quieras añadir: el nombre de tu proyecto, un enlace directo y una breve descripción de su relación con OpenSpec. Quien mantiene el proyecto la añadirá a este archivo.

- Céntrate en proyectos creados con OpenSpec o que faciliten su uso, no en publicidad general de productos.
- Describe lo que las personas pueden usar. Evita afirmaciones promocionales y enlaces de referencia o seguimiento.
- Si corresponde, indica en la entrada qué funciones son de pago o qué cuentas se requieren.
- Los servicios alojados o de pago solo se incluyen en Servicios alojados cuando añaden una capacidad de OpenSpec que la CLI no ofrece y tienen una forma gratuita de probarlos. No se incluye un servicio que solo reempaqueta las habilidades o los comandos de OpenSpec.

También son bienvenidas las correcciones y actualizaciones de las entradas existentes.
