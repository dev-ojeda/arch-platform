# @arch-platform/contracts

Contratos TypeScript compartidos para los componentes del ecosistema ARCH.

## Instalación

```bash
npm install @arch-platform/contracts
```

o:

```bash
pnpm add @arch-platform/contracts
```

## Propósito

Este paquete centraliza tipos y contratos públicos para que los módulos de ARCH puedan colaborar sin acoplarse directamente a implementaciones concretas. Entre las áreas expuestas por el punto de entrada están:

- generación: solicitudes, resultados, contexto, archivos generados y pasos de pipeline;
- generadores: descriptores, definiciones, capacidades, módulos, registros y runtime;
- filesystem: puertos síncronos/asíncronos, políticas de sobrescritura y servicios de rutas;
- templates y variables;
- prompts y esquemas de campos;
- renderer, eventos, hooks y reportes;
- logging, hashing, telemetría, runtime y workspace.

La API exporta **tipos TypeScript**. El paquete publicado está configurado para distribuir declaraciones `.d.ts`, no una implementación JavaScript de runtime.

## Uso

Importa los contratos como tipos:

```ts
import type {
  GeneratorDescriptor,
  GeneratorDefinition,
  GeneratorModule,
  GenerationRequest,
  GenerationResult,
  PromptSchema,
} from '@arch-platform/contracts';
```

Los tipos concretos que necesitas dependen de la integración. Consulta `src/index.ts` y los módulos exportados para comprobar la API disponible en la versión instalada.

## Compatibilidad e integración

- Está publicado como paquete ESM con declaraciones de tipos.
- El punto de entrada declarado es `dist/index.d.ts`.
- Los consumidores deben usar los tipos de la versión instalada y proporcionar sus propias implementaciones de runtime, filesystem, renderer u otros puertos cuando sean necesarios.
- Los cambios en los contratos públicos pueden afectar a los paquetes consumidores; conviene validar el ecosistema antes de actualizar una versión.

## Desarrollo en el monorepo

Este paquete se mantiene en `packages/contracts`. En el repositorio, su build de declaraciones se configura mediante `tsc -p tsconfig.build.json`.

## Licencia

MIT. Consulta el archivo `LICENSE` distribuido con el paquete.
