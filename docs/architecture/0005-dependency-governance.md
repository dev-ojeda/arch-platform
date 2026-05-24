# ADR-0005 - Dependency Governance

## Status

Accepted

---

## Context

El monorepo depende de un ecosistema creciente de dependencias internas y externas necesarias para:

- desarrollo,
- build pipelines,
- testing,
- tooling,
- observabilidad,
- automatización,
- runtime applications.

Sin governance explícita, las dependencias tienden a generar:

- version drift,
- duplicación de librerías,
- incompatibilidades,
- vulnerabilidades,
- aumento de bundle size,
- degradación de performance,
- conflictos de runtime,
- coupling innecesario,
- deuda técnica incremental.

Además, la plataforma requiere:

- builds reproducibles,
- seguridad operacional,
- trazabilidad,
- maintainability,
- actualización controlada,
- estabilidad de runtime,
- compliance futuro.

Por esta razón se establece una política formal de governance de dependencias.

---

## Decision

Se adopta una estrategia centralizada de dependency governance basada en:

- lockfile único,
- versionado consistente,
- ownership explícito,
- actualización controlada,
- validación automatizada,
- minimización de dependencias,
- separación entre runtime y tooling dependencies,
- enforcement mediante CI.

Toda dependencia introducida al monorepo debe cumplir las reglas definidas en este ADR.

---

## Architectural Principles

### 1. Minimal Dependency Philosophy

Toda dependencia agrega:

- complejidad,
- superficie de ataque,
- costo de mantenimiento,
- riesgo operacional.

Por defecto:

```txt
menos dependencias es mejor
```
