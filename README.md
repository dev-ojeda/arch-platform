# 🚀 Arch Platform — Plataforma de Generación Arquitectónica

> Monorepo modular orientado a scaffolding, automatización de arquitectura, generación de proyectos y tooling extensible basado en Clean Architecture y Ports & Adapters.

---

## 📖 Visión General

`arch-platform` es una plataforma diseñada para construir herramientas de generación de software modernas y extensibles.

El objetivo principal del proyecto es permitir:

- generación automática de estructuras de proyectos,
- scaffolding desacoplado,
- motores de templates reutilizables,
- integración con VSCode,
- soporte multi-framework y multi-lenguaje,
- automatización de procesos de desarrollo,
- arquitectura extensible mediante contratos y adapters.

La solución está evolucionando hacia una plataforma completa de generación arquitectónica que podrá operar desde:

- extensiones VSCode,
- CLI standalone,
- servicios AI-assisted,
- registries remotos,
- integraciones MCP/LSP,
- pipelines automatizados.

---

## 🏗 Principios Arquitectónicos

La plataforma adopta múltiples principios de diseño moderno:

## ✅ Clean Architecture

Separación explícita entre:

- dominio,
- aplicación,
- infraestructura,
- interfaces externas.

---

## ✅ Hexagonal Architecture

La lógica de negocio depende únicamente de contratos.

Los adapters externos implementan los puertos definidos por la aplicación.

---

## ✅ Ports & Adapters

La aplicación se desacopla de:

- VSCode API,
- filesystem,
- engines de templates,
- registries,
- frameworks.

---

## ✅ Modular Monorepo

Cada package posee:

- responsabilidades claras,
- boundaries definidos,
- aislamiento lógico,
- versionado interno consistente.

---

## ✅ Domain-Oriented Design

El dominio intenta mantenerse independiente de:

- UI,
- infraestructura,
- librerías externas,
- plataformas específicas.

---

## 🧱 Stack Tecnológico

## Core

- TypeScript
- Node.js 20+
- pnpm
- Turborepo
- tsup
- Vitest

---

## Tooling

- dependency-cruiser
- ESLint
- TypeScript Project References
- PowerShell automation scripts

---

## Integraciones

- VSCode Extension API
- ESM / CommonJS híbrido
- Tooling orientado a generación de código

---

## 📦 Estructura del Monorepo

```txt
arch-platform/
│
├── apps/
│   └── vscode-extension/
│
├── packages/
│   ├── application/
│   ├── contracts/
│   ├── core/
│   ├── infrastructure/
│   ├── shared/
│   ├── testing/
│   └── generators/
│       └── mvc/
│
├── templates/
│   ├── frameworks/
│   ├── languages/
│   └── patterns/
│
├── config/
│   ├── eslint/
│   ├── tsconfig/
│   ├── presets/
│   ├── constants/
│   └── paths/
│
├── scripts/
├── turbo.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

---

## 🧩 Packages Principales

### `@arch/contracts`

Capa de contratos compartidos.

Incluye:

- DTOs,
- interfaces,
- tipos comunes,
- definiciones de generators,
- contratos de templates,
- contratos de prompts,
- modelos compartidos.

Su propósito es mantener boundaries estables entre módulos.

---

### `@arch/application`

Capa de orquestación de casos de uso.

Responsabilidades:

- workflows de generación,
- pipelines de ejecución,
- coordinación entre servicios,
- commands,
- validaciones,
- puertos de aplicación.

Actualmente contiene lógica relacionada con:

- registries,
- resolución de templates,
- ejecución de generación,
- manejo de contexto,
- composición del engine.

---

### `@arch/core`

Núcleo principal de comportamiento reutilizable.

Objetivos:

- encapsular lógica transversal,
- centralizar componentes reutilizables,
- reducir duplicación entre módulos.

---

### `@arch/infrastructure`

Implementaciones concretas de adapters.

Ejemplos:

- filesystem adapters,
- logging,
- runtime adapters,
- persistencia,
- integración externa.

Esta capa implementa los contratos definidos por application/contracts.

---

### `@arch/testing`

Toolkit de testing compartido.

Incluye:

- memory filesystem,
- utilities de assertions,
- snapshots,
- contextos de testing,
- helpers reutilizables.

El objetivo es estandarizar pruebas entre packages.

---

### `@arch/generator-mvc`

Primer generador desacoplado del ecosistema.

Representa una implementación concreta de generación basada en patrones MVC.

Permite validar:

- registries,
- pipelines,
- contracts,
- renderizado,
- composición de generators.

---

## 🖥 Aplicación VSCode

### `apps/vscode-extension`

La extensión VSCode actúa como interfaz principal de interacción.

Responsabilidades:

- comandos UI,
- interacción con prompts,
- integración con workspace,
- ejecución de generators,
- coordinación con la capa application.

La arquitectura intenta evitar acoplamiento directo entre VSCode y dominio.

---

## 🔌 Flujo Arquitectónico

```txt
VSCode UI
   ↓
Commands
   ↓
Application Layer
   ↓
Generation Engine
   ↓
Ports / Contracts
   ↓
Infrastructure Adapters
   ↓
Filesystem / Templates / Runtime
```

---

## ⚙️ Sistema de Generación

La plataforma está evolucionando hacia un engine desacoplado basado en pipelines.

## Objetivos del Engine

- generators plug-and-play,
- validación previa,
- prompts dinámicos,
- resolución de templates,
- renderizado desacoplado,
- soporte multi-framework,
- soporte multi-language.

---

## Pipeline Esperado

```txt
Load Generator
      ↓
Validate Generator
      ↓
Resolve Prompts
      ↓
Resolve Templates
      ↓
Render Files
      ↓
Write Output
```

---

## 🧠 Diseño Modular

La plataforma busca garantizar:

## Aislamiento de Dependencias

Mediante:

- dependency-cruiser,
- project references,
- boundaries explícitos.

---

## Escalabilidad

Cada generador podrá evolucionar independientemente.

---

## Extensibilidad

Nuevos:

- frameworks,
- lenguajes,
- templates,
- adapters,
- engines,

podrán agregarse sin modificar el core.

---

## 🧪 Estrategia de Testing

El proyecto utiliza:

- Vitest,
- testing utilities compartidas,
- snapshots,
- memory filesystem,
- pruebas desacopladas de infraestructura.

Objetivos:

- estabilidad arquitectónica,
- validación de generators,
- prevención de regresiones,
- validación de boundaries.

---

## 🔍 Gobierno Arquitectónico

## Dependency Cruiser

Se utiliza para:

- detectar dependencias inválidas,
- validar boundaries,
- evitar ciclos,
- reforzar arquitectura hexagonal.

---

## TypeScript Project References

Permite:

- compilación incremental,
- aislamiento modular,
- escalabilidad del monorepo.

---

## 📜 Scripts Relevantes

## Instalación

```bash
pnpm install
```

---

## Build

```bash
pnpm build
```

---

## Typecheck

```bash
pnpm typecheck
```

---

## Testing

```bash
pnpm test
```

---

## Coverage

```bash
pnpm test:coverage
```

---

## Dependency Analysis

```bash
pnpm cruiser
```

---

## Generar gráfico de dependencias

```bash
pnpm cruiser:graph
```

---

## Limpieza del workspace

```bash
pnpm clean
```

---

## 📈 Estado Actual del Proyecto

El proyecto se encuentra en una etapa avanzada de consolidación arquitectónica.

Actualmente existen avances importantes en:

- separación por capas,
- desacoplamiento de VSCode,
- formalización de contracts,
- diseño del generation engine,
- testing reusable,
- automatización de tooling,
- control de dependencias.

---

## 🎯 Prioridades Técnicas

## PRIORIDAD 1 — Formalización del Generation Engine

Incluye:

- pipeline estable,
- contracts definitivos,
- manejo de errores,
- lifecycle hooks,
- execution context.

---

## PRIORIDAD 2 — Registry System

Objetivo:

- registry de generators,
- registry de templates,
- registry de frameworks,
- metadata versionada.

---

## PRIORIDAD 3 — Template Runtime

Incluye:

- renderizado desacoplado,
- variables dinámicas,
- engines extensibles,
- soporte condicional.

---

## PRIORIDAD 4 — CLI Independiente

Permitir ejecución fuera de VSCode.

---

## PRIORIDAD 5 — AI-Assisted Scaffolding

Futuro soporte para:

- generación asistida por IA,
- generación contextual,
- prompts inteligentes,
- templates dinámicos.

---

## 🚀 Visión de Largo Plazo

La plataforma apunta a convertirse en:

- ecosystem generator platform,
- architecture automation toolkit,
- extensible scaffolding engine,
- developer productivity framework.

Con capacidad de soportar:

- enterprise templates,
- arquitectura cloud-native,
- generators versionados,
- integración CI/CD,
- plataformas multi-runtime.

---

## 👨‍💻 Filosofía del Proyecto

## Automatizar arquitectura repetitiva

Reducir tiempo de bootstrap.

---

## Mantener boundaries fuertes

La arquitectura debe ser validable automáticamente.

---

## Facilitar evolución tecnológica

El sistema debe permitir incorporar nuevas tecnologías sin romper el core.

---

## Priorizar extensibilidad sobre rigidez

La plataforma está diseñada para crecer mediante plugins y generators desacoplados.

---

## 📌 Estado General

`arch-platform` representa una base sólida para una plataforma moderna de generación arquitectónica orientada a:

- escalabilidad,
- mantenibilidad,
- automatización,
- extensibilidad,
- developer experience.
