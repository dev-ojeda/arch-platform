# @arch-platform/generator-mvc

Generador ARCH para definir una estructura MVC orientada a TypeScript y Express.

## Instalación

```bash
npm install @arch-platform/generator-mvc @arch-platform/contracts
```

o:

```bash
pnpm add @arch-platform/generator-mvc @arch-platform/contracts
```

## Qué incluye

El paquete publica una definición de generador con:

- descriptor `mvc` (TypeScript, Express y categoría backend);
- esquema de prompts con nombre de proyecto y opción `useDocker`;
- definiciones de archivos para controller, service, repository y model;
- módulo `mvcModule`, que registra el generador en un registro compatible con los contratos ARCH.

Los nombres de salida se resuelven a partir de variables y convenciones de layout. Las plantillas se identifican mediante rutas como `frameworks/express/controller.hbs`.

## API pública

```ts
import {
  mvcDescriptor,
  mvcFiles,
  mvcGenerator,
  mvcModule,
  mvcSchema,
} from '@arch-platform/generator-mvc';

import type { MvcVariables } from '@arch-platform/generator-mvc';
```

Estas exportaciones permiten inspeccionar la definición e integrarla en una aplicación anfitriona. La ejecución real de la generación requiere un host que implemente el registro, el pipeline, la resolución/renderizado de templates y las operaciones de salida necesarias.

## Variables

El tipo `MvcVariables` declara `name`, `framework` y `language`, además de `useDocker` opcional. El esquema de prompts define `name` como obligatorio y `useDocker` con valor predeterminado `false`. La aplicación anfitriona debe asegurar que las variables y los recursos de plantilla requeridos por su pipeline estén disponibles.

## Compatibilidad

- Paquete ESM.
- Exporta JavaScript y declaraciones TypeScript desde `dist`.
- Depende de `@arch-platform/contracts` para los contratos de generadores y templates.

Este paquete no declara un ejecutable CLI propio. Para operar el generador se necesita integrarlo con el runtime/host de ARCH correspondiente.

## Desarrollo en el monorepo

El código fuente está en `packages/generators/mvc`. El build se configura mediante `tsc -p tsconfig.build.json`.

## Licencia

MIT. Consulta el archivo `LICENSE` distribuido con el paquete.
