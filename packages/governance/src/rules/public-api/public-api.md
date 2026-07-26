<!-- packages/governance/src/rules/public-api/public-api.md -->

# Public API Validation

## Objetivo

La validación de API pública garantiza que un paquete únicamente consuma símbolos expuestos por la API pública de otro paquete.

La regla no analiza TypeScript directamente.

Consume el conocimiento generado por el módulo **code-analysis**.

---

## Principio

El análisis y la validación son responsabilidades distintas.

```text
code-analysis
    │
    │ produce conocimiento
    ▼
AnalysisContext
    │
    │ consume conocimiento
    ▼
governance
```

---

## Dependencias

La regla depende de:

- SymbolGraph
- ExportedSymbolIndex
- PackageDependencyGraph

Todos estos artefactos forman parte del AnalysisContext.

```text
AnalysisContext
│
├── SymbolGraph
├── PackageDependencyGraph
└── ExportedSymbolIndex
```

---

## Flujo de ejecución

```text
          Project
             │
             ▼
     CodeAnalysisAdapter
             │
             ▼
      AnalysisContext
             │
             ▼
      OnlyPublicApiRule
             │
             ▼
        Diagnostics
```

---

## Responsabilidades

OnlyPublicApiRule únicamente debe:

- recorrer relaciones entre símbolos
- identificar dependencias entre paquetes
- consultar ExportedSymbolIndex
- emitir diagnósticos

No debe:

- recorrer SourceFiles
- inspeccionar AST
- utilizar ts-morph
- resolver exports
- conocer cómo fue construido el índice

---

## Algoritmo

Para cada relación entre símbolos:

```text
source ----imports----> target
```

Si ambos símbolos pertenecen al mismo paquete

→ continuar

Si pertenecen a paquetes distintos

→ consultar ExportedSymbolIndex

```text
exportedSymbols.has(target.id)
```

Si el símbolo no existe

↓

Generar

```ts
ARCH_ONLY_PUBLIC_API;
```

---

## Arquitectura

```text
                  AnalysisContext
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
 SymbolGraph     PackageGraph     ExportedSymbols
        │               │                │
        └───────────────┼────────────────┘
                        │
                        ▼
                OnlyPublicApiRule
                        │
                        ▼
                  Diagnostics
```

---

## Beneficios

- La regla no depende de ts-morph.
- El análisis puede evolucionar sin modificar Governance.
- Las reglas únicamente consumen modelos de dominio.
- Las validaciones son fácilmente testeables.
- El conocimiento puede reutilizarse por múltiples reglas.

---

## Diagnósticos

La regla puede producir:

## ARCH_ONLY_PUBLIC_API

Un símbolo importado no pertenece a la API pública.

Ejemplo

```ts
import { LoggerPort } from '@arch/contracts';
```

cuando `LoggerPort` no forma parte de la API pública.

---

## ARCH_PRIVATE_API_ACCESS

Un paquete importa un módulo privado.

Ejemplo

```ts
import { LoggerPort } from '@arch/contracts/src/logging/logger.port';
```

---

## ARCH_EXPORT_BOUNDARY_VIOLATION

El módulo importado no forma parte de los `exports` del paquete.

Ejemplo

```ts
import '@arch/contracts/logging/logger.port';
```

cuando dicho subpath no está declarado en `package.json`.

---

## Extensión

Nuevas reglas pueden reutilizar exactamente el mismo AnalysisContext.

Ejemplos:

- ForbiddenDependencyRule
- LayerDependencyRule
- CircularDependencyRule
- StableDependencyRule
- PublicSurfaceConsistencyRule

Sin necesidad de volver a analizar el proyecto.

---

## Principio arquitectónico

**code-analysis produce conocimiento.**

**governance consume conocimiento.**

La dependencia siempre fluye en una única dirección.

```text
code-analysis
      │
      ▼
AnalysisContext
      │
      ▼
governance
```
