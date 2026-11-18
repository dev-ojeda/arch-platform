# Testing — Generation Pipeline

## 1. Objetivo

Documentar la estrategia de pruebas del paquete `@arch-platform/application`, con especial atención al pipeline de generación y a sus componentes.

La estrategia busca validar:

- El comportamiento de los casos de uso y componentes de Application.
- La ejecución de las etapas del pipeline.
- La propagación tipada del contexto de generación.
- La resolución de variables y templates.
- La interacción con los puertos y adaptadores necesarios.
- El comportamiento determinístico de los escenarios de prueba.

## 2. Principios arquitectónicos

### 2.1. Ownership de los fixtures

Los fixtures pertenecen al paquete que los utiliza.

Cada paquete mantiene sus propios helpers y datos de prueba, evitando introducir dependencias compartidas que acoplen innecesariamente los paquetes del monorepo.

En Application:

```text
packages/application/test/
├── fixtures/
│   ├── generators/
│   ├── prompt/
│   ├── pipeline/
│   └── ...
└── ...
```

La estructura concreta puede evolucionar según las necesidades de cada suite.

### 2.2. Separación entre fixtures y adaptadores

Los fixtures representan escenarios y objetos de prueba.

Los adaptadores proporcionan implementaciones de capacidades técnicas.

Por ejemplo:

| Responsabilidad           | Ubicación                             |
| ------------------------- | ------------------------------------- |
| Generadores de prueba     | `packages/application/test/fixtures/` |
| Contextos de pipeline     | `packages/application/test/fixtures/` |
| Doubles de logger         | Fixtures locales de Application       |
| Doubles de event bus      | Fixtures locales de Application       |
| Filesystem en memoria     | `@arch-platform/infrastructure`       |
| Adaptadores de filesystem | `@arch-platform/infrastructure`       |

Application reutiliza las implementaciones de Infrastructure cuando necesita capacidades de filesystem. No mantiene una segunda implementación de infraestructura para sus tests.

### 2.3. Independencia entre paquetes

No existe un paquete central de testing del que dependan los paquetes del monorepo.

Cada paquete es responsable de mantener los fixtures que necesita y de declarar las dependencias técnicas que utiliza.

Esto evita:

- Dependencias transversales innecesarias.
- Acoplamiento entre suites de pruebas.
- Cambios coordinados en múltiples paquetes por modificaciones de fixtures.
- Dependencias de testing que terminan condicionando la arquitectura de producción.

## 3. Generation Pipeline

El pipeline de generación organiza la ejecución de las operaciones necesarias para procesar un generator.

Las etapas documentadas incluyen:

```text
LoadGeneratorStep
       |
       v
ValidateGeneratorStep
       |
       v
ResolveTemplatesStep
       |
       v
[Etapas posteriores del pipeline]
```

La resolución de variables se considera parte del modelo semántico del pipeline cuando la implementación correspondiente participa en el flujo.

No se debe documentar una etapa como implementación activa únicamente porque figure en un diseño conceptual.

## 4. Contexto de ejecución

Los tests utilizan contextos de prueba para aislar la ejecución del pipeline respecto del entorno real.

El contexto puede proporcionar:

- Generator de prueba.
- Registry de generadores.
- Variables iniciales.
- Variables resueltas.
- Templates resueltos.
- Directorio de destino.
- Filesystem de prueba.
- Logger.
- Event bus.
- Configuración del stack tecnológico.

Los helpers de creación de contexto se mantienen dentro de los fixtures de Application cuando su finalidad es específica de este paquete.

## 5. Fixtures de generadores

Los generadores de prueba permiten construir escenarios controlados para validar el comportamiento del pipeline.

Un fixture puede definir:

- Descriptor del generator.
- Lenguajes y frameworks soportados.
- Variables y sus definiciones.
- Templates.
- Configuración de salida.

Los fixtures deben ser determinísticos y permitir configurar únicamente las propiedades relevantes para cada escenario.

No se debe mantener una instancia global mutable de generator compartida entre tests.

Es preferible crear instancias independientes mediante factories.

## 6. Cobertura del pipeline

### 6.1. LoadGeneratorStep

**Objetivo:** comprobar que el generator se obtiene correctamente desde el registry y se incorpora al contexto de ejecución.

Flujo:

```text
GeneratorRegistry
       |
       v
LoadGeneratorStep
       |
       v
context.generator
```

Aspectos a validar:

- Resolución del generator registrado.
- Incorporación del generator al contexto.
- Comportamiento ante generators inexistentes.
- Propagación correcta de errores.

### 6.2. ValidateGeneratorStep

**Objetivo:** validar que el generator cumpla los requisitos estructurales y contractuales necesarios para su ejecución.

Aspectos a validar:

- Descriptor.
- Definiciones de variables.
- Templates.
- Configuración requerida.
- Errores de validación.

### 6.3. ResolveTemplatesStep

**Objetivo:** comprobar la resolución del conjunto de templates que participarán en la generación.

Flujo conceptual:

```text
resolvedVariables
       |
       v
ResolveTemplatesStep
       |
       v
resolvedTemplates
```

Aspectos a validar:

- Resolución de templates.
- Asociación de variables resueltas.
- Construcción de las rutas de salida.
- Conservación de la información tipada.
- Comportamiento ante definiciones inválidas.

### 6.4. Resolución de output paths

**Objetivo:** validar la construcción de rutas de salida a partir de las variables y convenciones definidas para el generator.

Ejemplo:

```hbs
{{folderLayout.service}}/{{serviceName}}{{fileExtension}}
```

Con las variables correspondientes:

```ts
{
  serviceName: 'UserService',
  fileExtension: '.ts',
  folderLayout: {
    service: 'services',
  },
}
```

Resultado esperado:

```text
services/UserService.ts
```

Los tests deben validar tanto la interpolación como el resultado semántico de las rutas.

## 7. Propagación de tipos

El pipeline debe preservar la información genérica a través de las estructuras que participan en la generación.

Flujo conceptual:

```text
GeneratorDefinition<T>
        |
        v
FileDefinition<T>
        |
        v
ResolvedTemplate<T>
        |
        v
PipelineContext<T>
```

Esto permite:

- Type safety.
- Propagación de variables tipadas.
- Generadores especializados.
- Templates asociados a sus variables.
- Menor necesidad de conversiones inseguras de tipos.

Los cambios en los contratos deben reflejarse en los tests de las etapas afectadas.

## 8. Estrategia de aislamiento

Los tests deben utilizar implementaciones controladas de las dependencias externas.

Para filesystem, Application reutiliza los adaptadores proporcionados por Infrastructure.

Para colaboradores específicos de Application, se pueden utilizar doubles locales.

La estrategia evita:

- Acceso accidental al filesystem real.
- Dependencia de servicios externos.
- Estado mutable compartido entre pruebas.
- Acoplamiento con paquetes exclusivos de testing.

## 9. Ejecución de pruebas

Las validaciones del paquete se ejecutan mediante los scripts definidos en su `package.json`.

```powershell
pnpm --filter @arch-platform/application typecheck
pnpm --filter @arch-platform/application lint
pnpm --filter @arch-platform/application test
pnpm --filter @arch-platform/application test:integration
```

La cobertura debe evaluarse a partir de los resultados reales de Vitest y de las validaciones del paquete, no de métricas históricas copiadas en esta documentación.

## 10. Evolución de la estrategia

Las futuras pruebas deben priorizar los comportamientos reales del pipeline y sus límites arquitectónicos.

Áreas de cobertura a considerar:

- Resolución de variables.
- Rendering de templates.
- Escritura de archivos.
- Políticas de overwrite.
- Manejo de conflictos.
- Ejecución integrada del pipeline.
- Propagación de errores entre etapas.

Estas áreas representan objetivos de cobertura; su inclusión en esta lista no implica que estén implementadas.

## 11. Estado arquitectónico

La estrategia actual se basa en los siguientes criterios:

- Fixtures locales por paquete.
- Separación entre escenarios de prueba y adaptadores técnicos.
- Reutilización de Infrastructure para filesystem.
- Doubles locales para colaboradores específicos.
- Ausencia de una dependencia centralizada de testing.
- Validación del comportamiento mediante suites unitarias e integración.

**Principio rector:** los tests deben acompañar los límites arquitectónicos de los paquetes, no crear una arquitectura paralela que los acople.
