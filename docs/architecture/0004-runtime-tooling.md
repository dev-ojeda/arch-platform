# ADR-0004 - Runtime Tooling

## Status

Accepted

---

## Context

El monorepo evolucionó hacia una plataforma con múltiples procesos operacionales y necesidades de automatización compartida:

- builds,
- ejecución de comandos,
- validaciones,
- generación de artefactos,
- orchestration,
- metadata resolution,
- package discovery,
- pipelines locales y CI/CD.

Inicialmente estas capacidades estaban distribuidas mediante:

- scripts aislados,
- comandos duplicados,
- lógica embebida en pipelines,
- automatizaciones específicas por package,
- wrappers inconsistentes.

Esto generó:

- baja reutilización,
- comportamiento inconsistente,
- dificultad de mantenimiento,
- debugging complejo,
- crecimiento descontrolado de scripts,
- coupling operacional.

La plataforma requiere un modelo de tooling reutilizable, desacoplado y gobernable.

---

## Decision

Se adopta una arquitectura de runtime tooling centralizada basada en:

- commands reutilizables,
- runtime engines compartidos,
- metadata resolution,
- package introspection,
- execution orchestration,
- convenciones operacionales explícitas.

Toda automatización relevante del monorepo debe construirse sobre el runtime tooling compartido.

---

## Architectural Principles

### 1. Tooling as Platform Capability

El tooling se considera parte de la plataforma.

No debe tratarse como:

```txt
scripts auxiliares temporales
```
