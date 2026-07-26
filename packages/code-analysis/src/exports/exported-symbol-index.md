# Exported Symbol Index

## Objetivo

El **Exported Symbol Index** representa la vista de los símbolos públicos expuestos por un proyecto TypeScript.

Su responsabilidad es responder preguntas como:

- ¿Este símbolo forma parte de la API pública?
- ¿Dónde fue exportado?
- ¿Cuál es el módulo público que lo expone?

No realiza análisis semántico ni resuelve dependencias. Únicamente mantiene un índice de consulta construido a partir del proyecto.

---

## Responsabilidades

### ExportedSymbol

Representa un símbolo perteneciente a la API pública.

Ejemplo:

```text
GenerationEvent
LoggerPort
GeneratorDefinition
```

Contiene únicamente la información necesaria para identificar el símbolo exportado.

---

## ExportedSymbolIndex

Representa una colección inmutable de símbolos exportados.

Expone operaciones de consulta.

```ts
interface ExportedSymbolIndex {
  has(symbolId: string): boolean;

  get(symbolId: string): ExportedSymbol | undefined;
}
```

No conoce cómo se construyó el índice.

---

## EmptyExportedSymbolIndex

Implementación Null Object.

Permite que los consumidores nunca tengan que comprobar si el índice existe.

```ts
analysis.exportedSymbols.has(symbolId);
```

En ausencia de datos siempre responde:

```ts
has(...) → false

get(...) → undefined
```

---

## DefaultExportedSymbolIndex

Implementación concreta basada en un

```text
ReadonlyMap<string, ExportedSymbol>
```

Responsabilidades

- almacenar símbolos
- realizar búsquedas
- mantener inmutabilidad

No analiza código fuente.

---

## ExportedSymbolIndexBuilder

Responsable de construir el índice.

Contrato:

```ts
interface ExportedSymbolIndexBuilder {
  build(project: Project): ExportedSymbolIndex;
}
```

Responsabilidades

- recorrer SourceFiles
- localizar export declarations
- resolver símbolos exportados
- construir el índice

No realiza validaciones arquitectónicas.

---

## Flujo

```text
               ts-morph Project
                      │
                      ▼
     DefaultExportedSymbolIndexBuilder
                      │
                      ▼
          DefaultExportedSymbolIndex
                      │
                      ▼
             AnalysisContext
                      │
                      ▼
             Governance Rules
                      │
                      ▼
           OnlyPublicApiRule
```

---

## Separación de responsabilidades

### code-analysis

Construye conocimiento.

Produce:

- SymbolGraph
- PackageDependencyGraph
- ExportedSymbolIndex

No genera diagnósticos.

---

## governance

Consume conocimiento.

Realiza validaciones.

Ejemplos:

- OnlyPublicApiRule
- DependencyDirectionRule
- ForbiddenDependencyRule

No analiza TypeScript directamente.

---

## Beneficios

- Separación entre análisis y validación.
- Índice reutilizable por múltiples reglas.
- Consultas O(1).
- Implementación inmutable.
- Fácil de probar.
- Extensible a otros lenguajes.

---

## Estructura

```text
symbol-graph/

├── exported-symbol.ts
├── exported-symbol-index.ts
├── empty-exported-symbol-index.ts
├── default-exported-symbol-index.ts
├── exported-symbol-index-builder.ts
└── default-exported-symbol-index-builder.ts
```

---

## Evolución futura

El índice podrá almacenar información adicional sin modificar las reglas.

Ejemplos:

- módulo público que realiza la exportación
- archivo de origen
- tipo de export (named, default, re-export)
- cadena completa de re-exportaciones
- metadatos específicos del lenguaje
