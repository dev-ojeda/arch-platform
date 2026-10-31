// packages/build-core/src/executor/build-step-factory.ts

import type { PackageBuildConfig } from '@arch-platform/platform-model';

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

    case 'tsup': {
      const args = ['exec', 'tsup'];

      if (config?.tsconfig) {
        args.push('--tsconfig', config.tsconfig);
      }

      return [
        {
          name: 'bundle',
          command: 'pnpm',
          args,
        },
      ];
    }

    case 'tsc-declaration':
      return [
        {
          name: 'types',
          command: 'pnpm',
          args: ['exec', 'tsc', '--build', 'tsconfig.build.json'],
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
          args: ['exec', 'tsc', '--build', 'tsconfig.build.json'],
        },
      ];
  }
}
