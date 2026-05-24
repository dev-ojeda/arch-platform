# ADR-0001 - Monorepo Architecture

## Status

Accepted

---

## Context

La plataforma evolucionó desde una estructura desacoplada y parcialmente distribuida hacia un monorepo unificado orientado a escalabilidad, reutilización y estandarización operativa.

El crecimiento del ecosistema introdujo múltiples desafíos:

- duplicación de tooling y scripts,
- inconsistencias de configuración,
- dependencia cruzada entre componentes,
- pipelines heterogéneos,
- dificultad de mantenimiento,
- baja gobernanza arquitectónica,
- incremento de deuda técnica,
- divergencia entre entornos locales y CI/CD.

Además, la plataforma requiere:

- builds determinísticos,
- automatización estandarizada,
- integración continua consistente,
- reutilización de librerías internas,
- separación clara de responsabilidades,
- gobernanza de dependencias,
- escalabilidad organizacional futura.

Para resolver estos problemas se definió una arquitectura monorepo centralizada.

---

## Decision

Se adopta una arquitectura monorepo basada en:

- `pnpm workspaces` como gestor de paquetes y linking interno,
- `Turborepo` como sistema de orquestación y cache distribuido,
- packages internos reutilizables,
- tooling compartido centralizado,
- configuración unificada,
- boundaries arquitectónicos explícitos,
- convenciones de estructura y naming.

La plataforma se organiza bajo un modelo de capas con dependencias unidireccionales.

---

## Architectural Principles

### 1. Single Source of Truth

Toda configuración compartida debe centralizarse.

Ejemplos:

- TypeScript
- ESLint
- Prettier
- tooling de build
- pipelines
- scripts operacionales
- automatizaciones

No se permiten configuraciones divergentes sin justificación explícita.

---

### 2. Explicit Package Boundaries

Cada package debe exponer únicamente APIs públicas definidas.

No se permite:

```txt
imports desde src/*
imports internos no exportados
acceso transversal arbitrario
```
