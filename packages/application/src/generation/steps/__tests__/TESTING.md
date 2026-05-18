# 🧪 Documentación de Tests — Generation Pipeline

## 🎯 Objetivo

Documentar los tests implementados para validar el comportamiento del pipeline de generación dentro del paquete `@arch/application`.

---

## ✅ Cobertura Actual

Actualmente se validan los siguientes componentes:

- `LoadGeneratorStep`
- `ValidateGeneratorStep`
- `ResolveTemplatesStep`
- Resolución de `outputPath`
- Fixtures y helpers de testing

---

## 🧱 Estructura de Testing

```txt
packages/

  application/

    src/generation/steps/__tests__/

      load-generator.step.test.ts
      validate-generator.step.test.ts
      resolve-templates.step.test.ts
      resolve-template-output-path.step.test.ts

  testing/

    src/

      fixtures/
      pipeline/
      runtime/
```

---

## 🏗 Arquitectura de Testing

### 🎯 Objetivo del diseño

El sistema de testing busca:

- reutilización de fixtures
- independencia entre paquetes
- aislamiento de runtime
- generación determinística
- validación semántica del pipeline

---

## 📦 Fixtures Centralizados

Los fixtures reutilizables se centralizan en:

```txt
packages/testing/src/fixtures/
```

Ejemplo:

```txt
fixtures/

  generators/
    test-generator.ts
```

Esto evita:

- duplicación de generators
- drift entre fixtures
- inconsistencias entre tests

---

## ⚙ Pipeline Semántico Actual

El pipeline actual modela las siguientes fases:

```txt
LoadGeneratorStep
↓
ValidateGeneratorStep
↓
ResolveVariablesStep (conceptual)
↓
ResolveTemplatesStep
```

---

## 🧭 Contexto de Ejecución

Los tests utilizan:

```ts
createTestPipelineContext()
```

para generar un runtime desacoplado del entorno real.

Incluye:

- filesystem en memoria
- logger de testing
- targetDir virtual
- stack de prueba
- variables iniciales

---

## 🧪 Test: LoadGeneratorStep

### 📄 Archivo

```txt
load-generator.step.test.ts
```

### 🎯 Objetivo

Validar que el generator se cargue correctamente dentro del contexto del pipeline.

## 🔄 Flujo Validado

```txt
registry
↓
LoadGeneratorStep
↓
context.generator
```

## ✅ Assertions principales

```ts
expect(context.generator).toBeDefined()
```

```ts
expect(
  context.generator?.descriptor.id
).toBe('test-generator')
```

---

## 🧪 Test: ValidateGeneratorStep

### 📄 Archivo

```txt
validate-generator.step.test.ts
```

### 🎯 Objetivo

Validar que un generator cargado cumpla los requisitos mínimos de estructura.

## ✅ Validaciones esperadas

- descriptor válido
- schema válido
- templates definidos

## 🎯 Resultado esperado

El step no debe lanzar errores para generators válidos.

---

## 🧪 Test: ResolveTemplatesStep

### 📄 Archivo

```txt
resolve-templates.step.test.ts
```

### 🎯 Objetivo

Validar la resolución del plan de templates.

## 🔄 Flujo

```txt
resolvedVariables
↓
ResolveTemplatesStep
↓
resolvedTemplates
```

### ✅ Assertions principales

```ts
expect(
  context.resolvedTemplates
).toBeDefined()
```

```ts
expect(
  context.resolvedTemplates
).toHaveLength(
  testGenerator.templates.length
)
```

## 🧩 Validación estructural

```ts
expect.objectContaining({

  outputPath:
    expect.any(String),

  template:
    expect.any(Object)
})
```

---

## 🧪 Test: Resolve Template Output Path

### 📄 Archivo

```txt
resolve-template-output-path.step.test.ts
```

### 🎯 Objetivo

Validar interpolación semántica de paths de salida.

## 🧠 Variables derivadas

El test utiliza:

```ts
resolvedVariables
```

con propiedades derivadas como:

- `serviceName`
- `controllerName`
- `repositoryName`
- `fileExtension`
- `folderLayout`

## 🧱 Template utilizado

```hbs
{{folderLayout.service}}/{{serviceName}}{{fileExtension}}
```

### ✅ Resultado esperado

```txt
services/UserService.ts
```

## 🎯 Assertion principal

```ts
expect(
  context.resolvedTemplates?.[0]?.outputPath
).toBe(
  'services/UserService.ts'
)
```

---

## 🧠 Semantic Variable Resolution

El engine evolucionó desde:

```txt
raw variable interpolation
```

hacia:

```txt
semantic variable derivation
```

Ejemplo:

```ts
{
  name: 'user'
}
```

↓

```ts
{
  className: 'User',
  serviceName: 'UserService',
  controllerName: 'UserController'
}
```

---

## 🧩 Diseño de Tipos

El pipeline preserva propagación tipada mediante:

```txt
GeneratorDefinition<T>
↓
FileDefinition<T>
↓
ResolvedTemplate<T>
↓
PipelineContext<T>
```

Esto permite:

- type safety
- semantic propagation
- generators especializados
- templates tipados

---

## 🛠 Problemas Resueltos Durante la Implementación

### 1️⃣ Variance de genéricos

Se ajustó propagación de tipos entre:

- `NamedVariables`
- `ResolvedTemplateVariables`
- `ResolvedTemplate`

---

### 2️⃣ Duplicación de fixtures

Existían múltiples versiones de:

```txt
testGenerator
```

La solución fue centralizar fixtures dentro de:

```txt
@arch/testing
```

---

### 3️⃣ Desalineamiento entre runtime y contracts

El runtime aún no implementaba completamente:

```txt
ResolveVariablesStep
```

por lo que se refactorizó el pipeline para soportar:

```ts
resolvedVariables
```

como fase explícita.

---

## 🚀 Próximos Tests Recomendados

## 🔥 Prioridad Alta

### ⚙ ResolveVariablesStep

Validar:

- naming conventions
- folder layouts
- file extensions
- derivación semántica

---

### 🧱 RenderFilesStep

Validar:

- rendering handlebars
- variables interpoladas
- generación de contenido

---

### 💾 WriteFilesStep

Validar:

- escritura en filesystem virtual
- overwrite policies
- conflictos
- paths generados

---

### 🔄 Pipeline Integration Test

Validar el pipeline completo:

```txt
Load
↓
Validate
↓
ResolveVariables
↓
ResolveTemplates
↓
Render
↓
Write
```

---

## 📈 Estado Actual

### ✅ Resultado

```txt
Test Files  5 passed
Tests       6 passed
```

### 🏆 Estado de madurez

El engine ya posee:

- pipeline extensible
- runtime tipado
- semantic variable resolution
- fixtures reutilizables
- contracts desacoplados
- testing centralizado
- template planning
- filesystem virtual

---

## 🧭 Próximo Objetivo Arquitectónico

Formalizar completamente:

```txt
ResolveVariablesStep
```

como fase oficial del runtime de generación.
