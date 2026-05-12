# Arch Platform

> Plataforma modular para generación de arquitecturas, scaffolding y tooling orientado a Clean Architecture, Hexagonal Architecture y automatización de desarrollo.

---

## 📖 Descripción

`arch-platform` es un monorepo orientado a la construcción de herramientas de generación arquitectónica y automatización de proyectos modernos.

El proyecto busca proveer:

* generación de estructuras base,
* templates reutilizables,
* integración con VSCode,
* motores de generación desacoplados,
* registries de lenguajes y frameworks,
* arquitectura extensible basada en ports/adapters.

La plataforma está diseñada para evolucionar hacia:

* CLI independiente,
* VSCode Extension,
* AI-assisted scaffolding,
* remote template registries,
* MCP/LSP integrations,
* generación multi-framework y multi-language.

---

## 🏗 Arquitectura

El proyecto sigue principios de:

* Clean Architecture
* Hexagonal Architecture
* Ports & Adapters
* Modular Monorepo
* Domain-Oriented Design

---

## 📦 Estructura del Monorepo

```txt
arch-platform/
│
├─ apps/
│  └─ vscode-extension/
│
├─ packages/
│  ├─ application/
│  ├─ contracts/
│  ├─ core/
│  ├─ domain/
│  ├─ generator-core/
│  ├─ infrastructure/
│  ├─ language-registry/
│  ├─ template-engine/
│  └─ shared/
│
├─ config/
├─ scripts/
├─ turbo.json
├─ pnpm-workspace.yaml
└─ tsconfig.base.json
```

---

## 🧩 Packages

## `@arch/contracts`

Contratos compartidos entre módulos.

Incluye:

* DTOs
* interfaces
* schemas
* definiciones tipadas
* contratos de templates y generators

---

## `@arch/application`

Capa de aplicación.

Responsable de:

* use-cases
* orchestration
* ports/interfaces
* commands
* servicios de aplicación

---

## `@arch/domain`

Núcleo de dominio.

Incluye:

* entidades
* value objects
* policies
* reglas de negocio

---

## `@arch/infrastructure`

Implementaciones concretas.

Ejemplos:

* filesystem
* logging
* persistence
* registries
* adapters externos

---

## `@arch/language-registry`

Registry de lenguajes soportados.

Permite:

* metadata de lenguajes
* adapters por lenguaje
* extensibilidad futura

---

## `@arch/template-engine`

Motor de renderizado y generación de templates.

---

## `apps/vscode-extension`

Extensión de VSCode para interacción visual con la plataforma.

---

## 🔌 Arquitectura de Puertos y Adapters

```txt
VSCode UI
   ↓
Commands
   ↓
Application UseCases
   ↓
Domain
   ↓
Ports
   ↓
Infrastructure Adapters
```

---

## ⚙️ Tecnologías

* TypeScript
* Node.js 20+
* pnpm
* Turborepo
* tsup
* VSCode Extension API
* ESM / NodeNext

---

## 🚀 Requisitos

* Node.js >= 20
* pnpm >= 10

---

## 📥 Instalación

```bash
git clone <repository-url>

cd arch-platform

pnpm install
```

---

## 🛠 Scripts

## Instalar dependencias

```bash
pnpm install
```

---

## Build completo

```bash
pnpm build
```

---

## Ejecutar typecheck

```bash
pnpm typecheck
```

---

## Limpiar artefactos

```bash
pnpm clean
```

---

## 🧪 Estado Actual

Actualmente el proyecto se encuentra en proceso de consolidación arquitectónica.

## Fase actual

### Fase 1 — Fundaciones

Objetivos:

* aislamiento de infraestructura,
* ports/adapters,
* boundaries claros,
* desacoplamiento de VSCode API,
* contracts compartidos,
* composition root.

---

## 📚 Principios Arquitectónicos

## Domain First

La lógica de negocio no debe depender de:

* frameworks,
* VSCode,
* filesystem,
* infraestructura.

---

## Ports & Adapters

La aplicación depende de contratos, no de implementaciones.

---

## Modularidad

Cada package debe tener responsabilidades claras y boundaries explícitos.

---

## Reutilización

Los use-cases deben poder reutilizarse desde:

* VSCode Extension,
* CLI,
* AI services,
* MCP server,
* Web Extension.

---

## 📌 Objetivos Futuros

* [ ] CLI oficial
* [ ] AI-assisted generation
* [ ] Remote template registries
* [ ] Marketplace de templates
* [ ] MCP integration
* [ ] LSP integration
* [ ] Web Extension
* [ ] Testing architecture
* [ ] Plugin system
* [ ] Telemetry & observability

---

## 🧠 Filosofía del Proyecto

El objetivo no es únicamente generar código.

La meta es construir una plataforma extensible para:

* definición arquitectónica,
* automatización de estructuras,
* aceleración de desarrollo,
* estandarización de proyectos,
* generación desacoplada y mantenible.

---

## 🤝 Contribución

Actualmente el proyecto se encuentra en desarrollo activo.

---

## 📄 Licencia

MIT
