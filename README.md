# ARCH Platform

**ARCH Platform** es una plataforma modular para construir, validar y
distribuir paquetes de software mediante un flujo gobernado por
metadatos, dependencias y artefactos reproducibles.

El repositorio implementa un monorepo TypeScript en el que ARCH coordina
la construcción de paquetes, administra una caché de artefactos, aplica
validaciones arquitectónicas y de seguridad, y permite empaquetar y
publicar distribuciones en un registro npm.

Además del entorno de desarrollo del monorepo, ARCH dispone de
`@arch-platform/distribution`: un paquete público que permite ejecutar
el MVP de `build` desde un workspace consumidor independiente.

> **Estado de distribución:** `@arch-platform/distribution@0.1.3` fue
> publicado en npm y verificado contra el registro. El alcance
> documentado de ese paquete sigue limitado al comando `build`.

---

## Tabla de contenidos

- [ARCH Platform](#arch-platform)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Visión general](#visión-general)
  - [Capacidades](#capacidades)
  - [Arquitectura](#arquitectura)
    - [Principios](#principios)
    - [Vista conceptual](#vista-conceptual)
  - [Paquetes del monorepo](#paquetes-del-monorepo)
  - [Metadatos de los paquetes](#metadatos-de-los-paquetes)
  - [Flujo de trabajo en el monorepo](#flujo-de-trabajo-en-el-monorepo)
    - [1. Construcción](#1-construcción)
    - [2. Compliance](#2-compliance)
    - [3. Security](#3-security)
    - [4. Versionado](#4-versionado)
    - [5. Empaquetado](#5-empaquetado)
    - [6. Inspección](#6-inspección)
    - [7. Publicación](#7-publicación)
    - [8. Sincronización del registro](#8-sincronización-del-registro)
    - [Orden general del release](#orden-general-del-release)
  - [Caché y recuperación de artefactos](#caché-y-recuperación-de-artefactos)
  - [CLI del monorepo](#cli-del-monorepo)
  - [Distribución y consumo independiente](#distribución-y-consumo-independiente)
    - [Instalar](#instalar)
    - [Ejecutar](#ejecutar)
    - [Alcance de la distribución](#alcance-de-la-distribución)
  - [Tecnologías](#tecnologías)
  - [Documentación arquitectónica](#documentación-arquitectónica)
  - [Estado y alcance actual](#estado-y-alcance-actual)
    - [Validado en el flujo de release](#validado-en-el-flujo-de-release)
    - [Validado desde un workspace consumidor independiente](#validado-desde-un-workspace-consumidor-independiente)
    - [Alcance que debe mantenerse explícito](#alcance-que-debe-mantenerse-explícito)

## Visión general

ARCH busca que la construcción y distribución de paquetes no dependan de
scripts aislados ni de decisiones implícitas repartidas por el
workspace.

Cada paquete declara metadatos de construcción en su `package.json`. A
partir de esa información, la plataforma puede identificar paquetes,
resolver relaciones de dependencia, determinar el alcance de ejecución y
gestionar los resultados de build.

El monorepo reúne capacidades que colaboran entre sí:

- **Build:** planificación y ejecución de construcciones por paquete.
- **Artifact cache:** almacenamiento, validación, reutilización y
  restauración de resultados.
- **Code analysis:** análisis de paquetes, dependencias y símbolos.
- **Governance:** validación de límites y reglas arquitectónicas.
- **Compliance:** evaluación del estado de cumplimiento de paquetes y
  dependencias.
- **Security:** evaluación de advisories y dependencias a partir del
  lockfile.
- **Distribution:** empaquetado, inspección, publicación y
  sincronización del estado del registro.

ARCH distingue entre las herramientas utilizadas para desarrollar y
distribuir la plataforma desde el monorepo y el CLI reducido que se
entrega a proyectos consumidores.

## Capacidades

---

Capacidad Propósito

---

Build orchestration Resolver el alcance de construcción
y ejecutar paquetes respetando sus
dependencias

Dependency graph Consultar dependencias,
dependientes y cierres de impacto o
ejecución

Artifact cache Reutilizar resultados válidos y
restaurar salidas ausentes

Governance Aplicar reglas sobre límites,
imports, exports y dependencias
arquitectónicas

Code analysis Analizar estructura, símbolos y
relaciones entre paquetes

Compliance Evaluar y persistir estados de
cumplimiento por entorno

Security Evaluar dependencias frente a
información de advisories

Packaging Generar artefactos de distribución
`.tgz`

Inspection Inspeccionar el contenido y la
integridad de un artefacto

Publication Publicar artefactos en un registro
npm y verificar su disponibilidad

Registry synchronization Sincronizar el estado local con la
información del registro

---

Estas capacidades no implican que todos los comandos estén incluidos en
el paquete público `@arch-platform/distribution`. La CLI interna del
monorepo y la CLI distribuida tienen contratos diferentes.

## Arquitectura

ARCH está organizado como un monorepo modular. Sus paquetes se comunican
mediante contratos y APIs públicas, y las implementaciones de
infraestructura se mantienen separadas de la lógica de coordinación.

### Principios

- **Separación de responsabilidades:** cada paquete tiene un propósito
  definido.
- **Contracts first:** los contratos compartidos permiten desacoplar
  consumidores e implementaciones.
- **Ports & Adapters:** las operaciones externas, como filesystem y
  registro, se encapsulan detrás de abstracciones.
- **Package boundaries:** los límites entre paquetes se declaran y se
  validan.
- **Dependency-driven build:** el grafo de dependencias determina el
  alcance y el orden de construcción.
- **Artifact-oriented build:** los resultados se identifican y
  gestionan como artefactos, no solo como directorios `dist`.

### Vista conceptual

```text
                         ARCH MONOREPO
                               |
                 +-------------+-------------+
                 |                           |
           CLI del monorepo             Paquetes ARCH
                 |                           |
              Tooling                 Contracts / Models
                 |                           |
        +--------+---------+          +------+------+
        |        |         |          |             |
      Build   Governance Compliance  Core     Code Analysis
        |        |         |          |             |
        +--------+---------+----------+-------------+
                               |
                         Infrastructure
                               |
                  Filesystem / Registry / Runtime
                               |
                  Artefactos y estado persistido
```

La vista representa responsabilidades generales; no sustituye los
límites y dependencias concretos declarados por cada paquete.

## Paquetes del monorepo

Los paquetes actuales se encuentran bajo `packages/`.

---

Paquete Responsabilidad

---

`@arch-platform/contracts` Contratos compartidos utilizados
entre módulos

`@arch-platform/platform-model` Modelos de dominio y estructuras de
datos de la plataforma

`@arch-platform/core` Capacidades centrales reutilizables

`@arch-platform/build-core` Motor de build, grafo de
dependencias, alcance de ejecución
y gestión de artefactos

`@arch-platform/infrastructure` Adaptadores concretos para
filesystem, persistencia, registro
y servicios externos

`@arch-platform/tooling` Composición y ejecución de
operaciones de tooling

`@arch-platform/cli` CLI interna del monorepo

`@arch-platform/code-analysis` Análisis estructural y semántico
del código

`@arch-platform/governance` Validaciones y reglas de gobierno
arquitectónico

`@arch-platform/compliance` Evaluación y gestión del estado de
cumplimiento

`@arch-platform/testing` Utilidades compartidas para pruebas

`@arch-platform/application` Casos de uso de aplicación

`@arch-platform/distribution` CLI distribuida para ejecutar el
MVP de build en workspaces
consumidores

`@arch-platform/domain-order` Paquete de dominio de ejemplo

`@arch-platform/generator-mvc` Generador MVC del ecosistema

---

Los paquetes internos del monorepo no son necesariamente paquetes
públicos publicados en npm. Su visibilidad y distribución dependen de
sus respectivos manifiestos.

## Metadatos de los paquetes

ARCH utiliza la propiedad `arch` del `package.json` para declarar
información que el sistema de build necesita.

Ejemplo ilustrativo para un paquete TypeScript:

```json
{
  "name": "@scope/package-name",
  "version": "1.0.0",
  "arch": {
    "artifactType": "runtime",
    "build": {
      "builder": "tsc",
      "outputs": ["dist"]
    },
    "kind": "tooling"
  }
}
```

Campos relevantes:

---

Campo Descripción

---

`artifactType` Clasifica el resultado, por ejemplo
`runtime` o `declaration`

`build.builder` Identifica el builder configurado
para el paquete

`build.outputs` Declara las salidas generadas por
el build

`build.tsconfig` Permite especificar el archivo de
configuración de TypeScript cuando
corresponde

`build.validateExports` Habilita la validación de exports
del paquete

`kind` Clasifica arquitectónicamente el
paquete

---

La configuración exacta depende del paquete y del builder utilizado. El
ejemplo no pretende representar todos los campos admitidos.

## Flujo de trabajo en el monorepo

La CLI interna se utiliza para operar el workspace y ejecutar el ciclo
de validación y distribución.

### 1. Construcción

```powershell
pnpm arch build --package @arch-platform/distribution
```

El sistema resuelve el paquete solicitado y sus dependencias, determina
qué trabajo debe ejecutarse y consulta la caché de artefactos.

El resumen diferencia entre:

- `Executed`: builds ejecutados.
- `Restored`: artefactos restaurados desde la caché.
- `Cached`: resultados reutilizados sin ejecutar nuevamente el build.
- `Failed`: builds fallidos.

### 2. Compliance

```powershell
pnpm arch compliance --package @arch-platform/distribution --env dev
```

Compliance evalúa el paquete dentro de un entorno y considera el estado
de sus dependencias.

La evaluación debe realizarse respetando la cadena de dependencias: una
dependencia que todavía no fue evaluada puede impedir que el paquete
consumidor alcance el estado aprobado. Por eso, la aprobación de un
paquete no debe interpretarse como aprobación automática de todos sus
consumidores.

### 3. Security

```powershell
pnpm arch security --package @arch-platform/distribution --env dev
```

La evaluación de seguridad considera el paquete, sus dependencias y el
lockfile configurado. La CLI admite especificar un lockfile:

```powershell
pnpm arch security --package @arch-platform/distribution --env dev --lockfile pnpm-lock.yaml
```

La evaluación y la decisión de permitir una operación son estados
diferenciados. Si una ejecución informa que requiere evaluación, debe
completarse el proceso indicado antes de continuar.

### 4. Versionado

```powershell
pnpm arch version --package @arch-platform/distribution --type patch
```

El comando calcula y actualiza la versión del paquete. El tipo de
incremento debe indicarse explícitamente:

- `major`
- `minor`
- `patch`
- `prerelease`
- `premajor`
- `preminor`
- `prepatch`

El comando también admite `--tag` para operaciones de versionado
prerelease. Como modifica el `package.json`, debe ejecutarse como una
decisión explícita del proceso de release.

### 5. Empaquetado

```powershell
pnpm arch pack --package @arch-platform/distribution
```

Genera el artefacto `.tgz` que será distribuido. El empaquetado utiliza
la configuración y los archivos incluidos por el paquete.

### 6. Inspección

```powershell
pnpm arch inspect --package @arch-platform/distribution
```

Inspecciona el artefacto generado y permite revisar, entre otros datos,
su versión, contenido, tamaño e integridad calculada.

La inspección previa a la publicación permite comprobar el artefacto
concreto que se pretende distribuir.

### 7. Publicación

Primero puede verificarse la elegibilidad sin publicar:

```powershell
pnpm arch publish --package @arch-platform/distribution --env dev --dry-run
```

Cuando las validaciones y la autenticación del registro están resueltas,
se ejecuta la publicación real:

```powershell
pnpm arch publish --package @arch-platform/distribution --env dev
```

La publicación utiliza el artefacto empaquetado, ejecuta el proceso de
publicación en el registro configurado y verifica posteriormente su
disponibilidad e integridad.

### 8. Sincronización del registro

```powershell
pnpm arch sync --package @arch-platform/distribution
```

Actualiza el estado local del registro a partir de la información
disponible en el registry. Esto permite reflejar versiones publicadas y
el tag `latest` en el estado administrado por ARCH.

### Orden general del release

```text
Build
  |
  v
Compliance -----> Security
  |                  |
  +--------+---------+
           |
           v
        Version
           |
           v
          Pack
           |
           v
        Inspect
           |
           v
      Publish (dry-run)
           |
           v
      Publish (live)
           |
           v
          Sync
```

Este esquema muestra las etapas que componen el flujo validado.
Compliance y security deben estar resueltos para el paquete y sus
dependencias antes de avanzar con la publicación.

## Caché y recuperación de artefactos

El sistema de build distingue entre el resultado local del paquete y el
artefacto almacenado en caché.

Los escenarios comprobados desde un workspace consumidor son:

---

Estado detectado Comportamiento Resultado

---

Entradas y salidas Reutiliza la caché `Cached`
coinciden con el
artefacto válido

La caché no coincide, Repara la caché a No recompila
pero las salidas partir de las salidas
locales son válidas locales

Faltan salidas locales Restaura las salidas `Restored`
y existe un artefacto
válido en caché

Las entradas cambiaron Ejecuta el builder `Executed`
y no existe un
resultado reutilizable

---

La verificación de fingerprints permite detectar diferencias entre el
contenido esperado y el contenido encontrado. La recuperación puede
resolverse sin recompilar cuando existe una fuente válida para
reconstruir la copia faltante o inconsistente.

En el monorepo se utilizan, entre otros, los directorios `.arch/` y
`.arch-cache/`. En el workspace consumidor validado se utilizó
`.arch-platform-cache/`. Las ubicaciones concretas dependen de la
configuración y del contexto de ejecución.

## CLI del monorepo

El paquete `@arch-platform/cli` registra los comandos internos
utilizados para operar el monorepo:

Comando Propósito

---

`build` Construir paquetes
`clean` Limpiar resultados de build
`lint` Ejecutar lint
`typecheck` Verificar tipos
`validate` Ejecutar validaciones del workspace
`compliance` Evaluar cumplimiento
`security` Evaluar seguridad
`version` Calcular y actualizar versiones
`pack` Empaquetar un paquete
`inspect` Inspeccionar un artefacto
`publish` Publicar un artefacto
`sync` Sincronizar información del registro

Ejemplos de opciones utilizadas:

- `--package`: identifica el paquete por su nombre declarado en
  `package.json`.
- `--env`: identifica el entorno de evaluación para compliance o
  security.
- `--type`: define el tipo de incremento de versión.
- `--dry-run`: ejecuta la validación de publicación sin publicar.
- `--lockfile`: permite indicar el lockfile para security.

Para consultar las opciones completas de cada comando, utiliza la ayuda
de la CLI del monorepo:

```powershell
pnpm arch --help
pnpm arch build --help
pnpm arch publish --help
```

Esta CLI es una herramienta interna del monorepo. No debe confundirse
con el ejecutable público `arch-cli` del paquete
`@arch-platform/distribution`.

## Distribución y consumo independiente

`@arch-platform/distribution` es el paquete publicado para que un
workspace externo pueda utilizar el MVP de build sin depender del CLI
interno del monorepo.

### Instalar

```powershell
pnpm add -D @arch-platform/distribution@0.1.2
```

El paquete registra el ejecutable `arch-cli`.

### Ejecutar

```powershell
pnpm exec arch-cli --help
pnpm exec arch-cli build --help
pnpm exec arch-cli build
```

Para construir un paquete específico:

```powershell
pnpm exec arch-cli build --package @scope/package-name
```

El workspace consumidor debe declarar la metadata `arch` en el
`package.json` de cada paquete que ARCH deba construir. Los requisitos
del builder, como TypeScript cuando se utiliza `tsc`, deben estar
disponibles en el workspace consumidor.

### Alcance de la distribución

La versión `0.1.2` de `@arch-platform/distribution` expone el comando
`build`. Incluye la ejecución de builds, la reutilización de caché, la
detección de inconsistencias y la restauración de artefactos.

Los comandos internos `compliance`, `security`, `version`, `pack`,
`inspect`, `publish` y `sync` no forman parte del contrato documentado
de esta distribución.

La documentación específica de instalación, configuración y uso se
encuentra en
[`packages/distribution/README.md`](packages/distribution/README.md).

## Tecnologías

El repositorio utiliza las siguientes tecnologías, según los manifiestos
y configuraciones de sus paquetes:

- **TypeScript** para implementación y generación de declaraciones.
- **Node.js** como runtime.
- **pnpm** para gestión del workspace y dependencias.
- **Turborepo** para coordinación de tareas del monorepo.
- **tsup** para empaquetado de determinados paquetes ejecutables.
- **Vitest** para pruebas.
- **ESLint** para análisis estático y reglas de calidad.
- **dependency-cruiser** para análisis de dependencias.
- **PowerShell** para automatizaciones del entorno de desarrollo.

## Documentación arquitectónica

Las decisiones y referencias arquitectónicas se mantienen en
`docs/architecture/`.

- [`docs/architecture/README.md`](docs/architecture/README.md): índice
  de ADR.
- [`docs/architecture/0001-monorepo-architecture.md`](docs/architecture/0001-monorepo-architecture.md):
  arquitectura del monorepo.
- [`docs/architecture/0002-build-pipeline.md`](docs/architecture/0002-build-pipeline.md):
  pipeline de build.
- [`docs/architecture/0003-package-boundaries.md`](docs/architecture/0003-package-boundaries.md):
  límites entre paquetes.
- [`docs/architecture/0004-runtime-tooling.md`](docs/architecture/0004-runtime-tooling.md):
  runtime y tooling.
- [`docs/architecture/0005-dependency-governance.md`](docs/architecture/0005-dependency-governance.md):
  gobierno de dependencias.
- [`docs/architecture/baseline/`](docs/architecture/baseline/): líneas
  base técnicas.

Los ADR documentan decisiones arquitectónicas; el README ofrece una
introducción operativa y una vista general del estado del proyecto.

## Estado y alcance actual

El estado documentado distingue las capacidades del monorepo de las
capacidades efectivamente distribuidas a consumidores.

### Validado en el flujo de release

Para `@arch-platform/distribution@0.1.2` se completó el siguiente ciclo:

- sincronización del estado del registro;
- incremento de versión de `0.1.1` a `0.1.2`;
- build del paquete;
- evaluación de compliance y security;
- empaquetado e inspección del `.tgz`;
- publicación real en npm;
- verificación posterior de disponibilidad e integridad;
- sincronización del estado local con el registro.

La integridad SHA-512 calculada durante la inspección coincidió con la
reportada por npm para el artefacto publicado.

### Validado desde un workspace consumidor independiente

Se instaló `@arch-platform/distribution@0.1.2` en un workspace separado
del monorepo y se ejecutó `arch-cli build`.

También se verificaron los caminos de recuperación:

- reparación de una caché inconsistente utilizando salidas locales
  válidas;
- restauración de una salida local faltante desde un artefacto válido
  en caché.

Ambos escenarios se resolvieron sin ejecutar nuevamente el builder.

### Alcance que debe mantenerse explícito

La validación del release de la plataforma y la validación del CLI
distribuido son pruebas relacionadas, pero diferentes:

- el flujo de release utiliza la CLI interna del monorepo;
- el workspace consumidor utiliza el CLI distribuido y su comando
  `build`.

No se debe asumir que todos los comandos internos están disponibles para
consumidores externos.

---

**ARCH Platform**\
_Build. Govern. Verify. Distribute._
