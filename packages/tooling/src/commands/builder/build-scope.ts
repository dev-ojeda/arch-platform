// packages/tooling/src/commands/builder/build-scope.ts

import type { BuildScope } from '@arch/build-core';

import type { BuildCommandOptions } from '../common/command-options.js';

export function createBuildScope(options: BuildCommandOptions): BuildScope {
  if (options.packageName) {
    return {
      mode: 'package',
      packageName: options.packageName,
    };
  }

  return {
    mode: 'workspace',
  };
}
