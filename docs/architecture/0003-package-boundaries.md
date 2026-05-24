# ADR-0003 - Package Boundaries

## Status

Accepted

---

## Context

El crecimiento del monorepo introduce riesgos arquitectónicos relacionados con:

- acoplamiento excesivo,
- dependencias circulares,
- imports internos no controlados,
- fuga de responsabilidades,
- degradación de encapsulamiento,
- reutilización inconsistente,
- dificultad de mantenimiento,
- impacto transversal no intencional.

Sin reglas explícitas de boundaries, los packages tienden a evolucionar hacia un grafo altamente acoplado y difícil de escalar.

Además, la plataforma requiere:

- separación clara de responsabilidades,
- APIs públicas estables,
- independencia de evolución entre packages,
- enforcement automatizable,
- capacidad de escalar equipos y dominios,
- gobernanza arquitectónica consistente.

Por esta razón se definen boundaries explícitos para todos los packages del monorepo.

---

## Decision

Se adopta una estrategia de boundaries basada en:

- encapsulamiento estricto,
- exports públicos explícitos,
- dependencia unidireccional,
- layering arquitectónico,
- prohibición de imports internos,
- ownership lógico de dominio,
- separación entre runtime y tooling.

Todos los packages deben respetar las reglas definidas en este ADR.

---

## Architectural Principles

### 1. Explicit Public APIs

Cada package debe exponer únicamente interfaces públicas definidas.

El acceso entre packages debe realizarse exclusivamente mediante:

```txt
exports públicos
```
