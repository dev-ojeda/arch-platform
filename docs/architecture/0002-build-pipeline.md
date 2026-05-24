# ADR-0002 - Build Pipeline

## Status

Accepted

---

## Context

El monorepo requiere un sistema de build unificado capaz de soportar:

- múltiples aplicaciones y packages,
- ejecución paralela,
- caching incremental,
- builds determinísticos,
- pipelines reproducibles,
- integración CI/CD consistente,
- escalabilidad futura.

Antes de la estandarización existían:

- scripts inconsistentes,
- secuencias manuales,
- tareas duplicadas,
- ejecuciones lentas,
- falta de cache compartida,
- diferencias entre local y CI,
- baja trazabilidad operacional.

Además, la plataforma necesita:

- minimizar tiempos de feedback,
- reducir trabajo redundante,
- aislar responsabilidades,
- mejorar experiencia de desarrollo,
- permitir evolución futura hacia remote caching y distributed builds.

---

## Decision

Se adopta una estrategia de build centralizada basada en:

- `Turborepo` como task orchestrator,
- `pnpm` como workspace manager,
- pipelines determinísticos,
- outputs explícitos,
- cache incremental,
- convenciones globales de tasks,
- ejecución declarativa.

Todas las tareas del monorepo deben integrarse al pipeline unificado.

---

## Build System

La plataforma utiliza:

```txt
pnpm + Turborepo
```
