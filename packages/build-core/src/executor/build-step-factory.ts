// packages/build-core/src/executor/build-step-factory.ts

import type { PackageBuildConfig } from '../workspace/package-json.js';

import type { BuildStep } from './build-steps.js';

export function createBuildSteps(config?: PackageBuildConfig): BuildStep[] {
  const buildConfig: PackageBuildConfig = config ?? {};

  const mode = buildConfig.mode ?? 'tsc';

  if (mode === 'script') {
    return [
      {
        name: 'build',
        command: 'pnpm',
        args: ['run', 'build'],
      },
    ];
  }

  if (mode === 'tsup') {
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

  if (mode === 'custom') {
    if (!buildConfig.command) {
      throw new Error('Custom build requires command');
    }

    return [
      {
        name: 'custom',
        command: buildConfig.command,
        args: buildConfig.args ?? [],
      },
    ];
  }

  return [
    {
      name: 'types',
      command: 'pnpm',
      args: ['exec', 'tsc', '-b', 'tsconfig.build.json'],
    },
  ];
}
