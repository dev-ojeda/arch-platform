# Baseline 001 — Estado Actual del Sistema de Build

**Estado:** Draft

**Versión:** 0.1

**Fecha:** 2026-06-28

**Autor:** Arch Platform Team

---

## Objetivo

Documentar el estado actual del sistema de build del framework para establecer una línea base técnica sobre la cual evolucionará la nueva arquitectura de compilación.

Este documento no propone soluciones; únicamente describe la arquitectura existente, identifica sus responsabilidades, limitaciones y los problemas detectados.

---

## Contexto

Actualmente el monorepo utiliza TypeScript como compilador y `tsup` como empaquetador para la mayoría de los packages del framework.

Durante la evolución del proyecto se incorporaron herramientas de análisis semántico, gobernanza arquitectónica y resolución de dependencias entre paquetes. Estas capacidades permiten reconsiderar el diseño del sistema de build y simplificar su arquitectura.

El objetivo de esta línea base es comprender el punto de partida antes de iniciar cualquier modificación.

---

## Alcance

Esta línea base considera exclusivamente los packages que conforman el núcleo del framework.

Incluye:

- packages/\*
- Configuración TypeScript
- Scripts de compilación
- Configuración compartida
- Resolución de referencias entre packages

No incluye:

- apps/\*
- Plugin VSCode
- Ejemplos
- Benchmarks
- Publicación de paquetes

---

## Arquitectura actual

El proceso de construcción se compone de dos herramientas principales.

### TypeScript

Responsable de:

- Verificación de tipos
- Emisión de declaraciones (`.d.ts`)
- Resolución de Project References

### tsup

Responsable de:

- Generación de JavaScript ESM
- Resolución de entradas (`entry`)
- Copia de artefactos
- Orquestación parcial del proceso de build

---

## Flujo actual

```text
          Source Code
                │
                ▼
        TypeScript Compiler
                │
        (.d.ts + Type Check)
                │
                ▼
             tsup
                │
         JavaScript ESM
                │
                ▼
              dist/
```

---

## Observaciones

Durante el análisis del sistema actual se identifican los siguientes aspectos.

### Duplicación de responsabilidades

La generación del resultado final depende de dos herramientas distintas.

TypeScript participa en la generación de declaraciones mientras tsup genera el runtime.

Esto obliga a mantener configuraciones sincronizadas.

---

### Configuración distribuida

La lógica de build se encuentra repartida entre:

- tsconfig.base.json
- tsconfig.build.json
- tsup.config.ts
- configuraciones compartidas
- scripts del workspace

No existe una única fuente de verdad.

---

### Dependencia del empaquetador

Aunque los packages del framework no requieren bundling, actualmente utilizan un empaquetador para generar archivos JavaScript.

---

### Escalabilidad

Cada nuevo package requiere:

- configuración TypeScript
- configuración tsup
- exports
- scripts
- referencias

La complejidad aumenta conforme crece el workspace.

---

## Capacidades disponibles

Actualmente el framework dispone de módulos que no existían cuando se diseñó el sistema de build.

### Governance

Permite validar:

- reglas arquitectónicas
- dependencias
- capas
- restricciones

---

### Code Analysis

Permite obtener:

- grafo de dependencias
- símbolos
- referencias
- relaciones semánticas
- metadata del workspace

---

### Dependency Graph

Permite conocer el orden correcto de compilación sin depender exclusivamente de configuraciones manuales.

---

### Limitaciones detectadas

El sistema actual no aprovecha estas capacidades para construir el workspace.

El build continúa dependiendo principalmente de archivos de configuración estáticos.

---

## Hipótesis

El análisis realizado sugiere que los packages del framework no requieren un empaquetador para producir sus artefactos.

Su objetivo principal es distribuir módulos ESM y declaraciones TypeScript.

Esto abre la posibilidad de delegar completamente la compilación a TypeScript y reservar las herramientas de empaquetado para aplicaciones o productos distribuibles.

Esta hipótesis será validada en las siguientes líneas base.

---

## Métricas iniciales

Antes de modificar la arquitectura deberán registrarse:

- Tiempo de build completo
- Tiempo incremental
- Número de packages
- Número de archivos emitidos
- Tamaño de salida
- Tiempo de type-check
- Tiempo de clean build

Estas métricas permitirán comparar objetivamente la implementación futura.

---

## Riesgos

Los principales riesgos identificados son:

- Cambios en la API pública.
- Incompatibilidad con los exports actuales.
- Modificación del layout de `dist/`.
- Ruptura de herramientas consumidoras.
- Incremento del tiempo de compilación.

---

## Criterios de éxito

La siguiente arquitectura deberá:

- Mantener compatibilidad con ESM.
- Mantener compatibilidad con Project References.
- Mantener la API pública.
- Reducir la complejidad del sistema.
- Disminuir la configuración manual.
- Integrarse con Governance.
- Integrarse con Code Analysis.
- Servir como base para un Build Orchestrator propio del framework.

---

## Próxima línea base

**Baseline 002 — Arquitectura Objetivo del Build System**

En esta etapa se definirá el modelo arquitectónico que reemplazará la solución actual y se establecerán los principios de diseño que guiarán su implementación.
