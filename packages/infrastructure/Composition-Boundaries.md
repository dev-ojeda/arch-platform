# Composition Boundaries — ARCH Platform

## Concept

Un **límite de composición (_composition boundary_)** es el punto específico donde se enlazan módulos, componentes o servicios separados.

Define:

- contratos claros entre las partes;
- ocultamiento de detalles internos;
- responsabilidades explícitas;
- control sobre el flujo de datos;
- el punto donde las implementaciones concretas se ensamblan contra abstracciones.

En ARCH Platform, los límites de composición deben representar **fronteras arquitectónicas reales**, no simplemente divisiones físicas de código.

---

## Composition Boundary en ARCH Platform

```text
┌─────────────────────────────────────────────┐
│              platform-model                 │
│                                             │
│  WorkspaceProvider                          │
│  PackageProvider                            │
│  WorkspaceProjector                         │
│  PackageDescriptor                          │
└──────────────────────┬──────────────────────┘
                       │
                 CONTRATOS / MODELOS
                       │
                       ▼
┌─────────────────────────────────────────────┐
│             infrastructure                  │
│                                             │
│  NodeWorkspaceProvider                      │
│  NodePackageProvider                        │
│  WorkspacePackageProjector                  │
│  NodeFileSystem...                          │
│  NodeHashService                            │
│  FilesystemArtifactCache                    │
│                                             │
└──────────────────────┬──────────────────────┘
                       │
                COMPOSITION BOUNDARY
                       │
                       ▼
┌─────────────────────────────────────────────┐
│               consumers                     │
│                                             │
│  build-core                                 │
│  governance                                 │
│  cli                                        │
│  tooling                                    │
└─────────────────────────────────────────────┘
```

## Interpretación

### `platform-model`

Define los **contratos y modelos** que representan las capacidades del sistema.

Ejemplos:

```text
WorkspaceProvider
PackageProvider
WorkspaceProjector
PackageDescriptor
WorkspaceDescriptor
WorkspacePackage
```

`platform-model` no debería conocer detalles concretos de Node.js, filesystem, procesos o infraestructura.

---

### `infrastructure`

Implementa esos contratos mediante mecanismos concretos.

Ejemplos:

```text
NodeWorkspaceProvider
NodePackageProvider
WorkspacePackageProjector

NodeAsyncFileSystemAdapter
NodeSyncFileSystemAdapter
NodePathService

NodeHashService
NodeFileHashService
NodeDirectoryHashService

FilesystemArtifactCache
DefaultArtifactProvider
```

Infrastructure conoce los detalles técnicos necesarios para hacer funcionar el sistema.

Los consumidores no deberían necesitar conocer esos detalles internos.

---

### Consumers

Los paquetes consumidores utilizan las capacidades proporcionadas por Infrastructure mediante sus contratos y APIs públicas.

Actualmente:

```text
build-core
governance
cli
tooling
```

El consumidor debería expresar **qué necesita**, mientras Infrastructure determina **cómo se obtiene o ejecuta**.

---

# Regla arquitectónica

> **No crear una abstracción porque podamos nombrarla. Crear una abstracción cuando exista una frontera de composición real.**

Una abstracción tiene valor cuando permite separar:

```text
QUÉ
│
├── contrato
├── modelo
└── capacidad
        │
        ▼
CÓMO
│
├── implementación concreta
├── filesystem
├── Node.js
├── procesos
└── servicios externos
```

Si una abstracción únicamente introduce una clase intermedia utilizada por un único componente y no representa una frontera de composición independiente, probablemente sea una **falsa frontera**.

---

# Ejemplo: `PackageDescriptorFactory`

Una arquitectura innecesariamente fragmentada:

```text
NodePackageProvider
        │
        ▼
PackageDescriptorFactory
        │
        ▼
PackageDescriptor
```

Si `PackageDescriptorFactory` solamente existe para que `NodePackageProvider` pueda crear sus propios `PackageDescriptor`, la abstracción no representa una frontera independiente.

Puede formar parte de la implementación interna de:

```text
NodePackageProvider
```

y desaparecer como componente público.

---

# Frontera correcta

```text
WorkspaceProvider
        │
        ▼
NodeWorkspaceProvider
        │
        ▼
PackageProvider
        │
        ▼
NodePackageProvider
        │
        ├── descubre packages
        ├── construye PackageDescriptor
        ├── carga metadata
        └── resuelve dependencias internas
        │
        ▼
PackageDescriptor[]
        │
        ▼
WorkspacePackageProjector
        │
        ▼
WorkspacePackage[]
```

Aquí sí existen fronteras con responsabilidades claras:

```text
WorkspaceProvider
    → descubre el workspace

PackageProvider
    → descubre los packages

WorkspaceProjector
    → transforma el modelo rico en el modelo requerido por el consumidor
```

---

# Principio para Infrastructure

Infrastructure es una pieza central de ARCH Platform, pero **no debe convertirse en un repositorio de pequeñas abstracciones**.

Debe organizarse alrededor de **capacidades técnicas y límites de composición**:

```text
Infrastructure
│
├── Workspace capability
│   ├── NodeWorkspaceProvider
│   ├── NodePackageProvider
│   └── WorkspacePackageProjector
│
├── Filesystem capability
│   ├── NodeAsyncFileSystemAdapter
│   ├── NodeSyncFileSystemAdapter
│   └── NodePathService
│
├── Hashing capability
│   ├── NodeHashService
│   ├── NodeFileHashService
│   └── NodeDirectoryHashService
│
└── Artifact capability
    ├── FilesystemArtifactCache
    ├── DefaultArtifactProvider
    └── ArtifactPublisherAdapter
```

La organización debe reflejar **capacidades y fronteras arquitectónicas**, no solamente la cantidad de clases.

---

# Regla de diseño de ARCH

> **Una frontera arquitectónica debe justificar su existencia por el desacoplamiento que proporciona.**

Antes de crear una interfaz, factory, provider, adapter o service adicional, debemos preguntarnos:

1. ¿Existe una implementación alternativa real o prevista?
2. ¿Existe un consumidor independiente?
3. ¿Existe una frontera de composición?
4. ¿Se está ocultando una decisión técnica importante?
5. ¿El contrato permite que el consumidor ignore los detalles de implementación?
6. ¿La abstracción representa una capacidad del sistema?

Si la respuesta es mayoritariamente **no**, probablemente estamos introduciendo una abstracción innecesaria.

---

## Objetivo

ARCH Platform debe evolucionar hacia una arquitectura donde:

```text
CONTRATOS
   ↓
COMPOSITION BOUNDARY
   ↓
IMPLEMENTACIONES
   ↓
RUNTIME / INFRASTRUCTURE
```

sea explícito y verificable.

El objetivo no es tener más abstracciones.

El objetivo es tener **las abstracciones correctas en las fronteras correctas**.
