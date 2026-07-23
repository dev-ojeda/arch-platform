// packages/build-core/src/executor/build-step-factory.ts

import type { PackageBuildConfig } from '@arch/platform-model';

import type { BuildStep } from './build-steps.js';

export function createBuildSteps(config?: PackageBuildConfig): BuildStep[] {
  const builder = config?.builder ?? 'tsc';

  switch (builder) {
    case 'script':
      return [
        {
          name: 'build',
          command: 'pnpm',
          args: ['run', 'build'],
        },
      ];

    case 'tsup':
      return [
        {
          name: 'bundle',
          command: 'pnpm',
          args: ['exec', 'tsup'],
        },
      ];

    case 'tsc-declaration':
      return [
        {
          name: 'types',
          command: 'pnpm',
          args: ['exec', 'tsc', '-p', 'tsconfig.build.json', '--emitDeclarationOnly'],
        },
      ];

    case 'custom':
      if (!config?.command) {
        throw new Error('Custom build requires command');
      }

      return [
        {
          name: 'custom',
          command: config.command,
          args: config.args ?? [],
        },
      ];

    case 'tsc':
    default:
      return [
        {
          name: 'compile',
          command: 'pnpm',
          args: ['exec', 'tsc', '-p', 'tsconfig.build.json'],
        },
      ];
  }
}
