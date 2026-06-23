// packages/build-core/src/executor/build-step-factory.ts

import type { BuildStep } from './build-steps.js';

export function createBuildSteps(): BuildStep[] {
  return [
    {
      name: 'bundle',
      command: 'pnpm',
      args: ['exec', 'tsup'],
    },
    {
      name: 'types',
      command: 'pnpm',
      args: ['exec', 'tsc', '-b', 'tsconfig.build.json'],
    },
  ];
}
