// 📦 Paquetes Core (Packages)/distribution/src/commands/build.scope.ts

import type { BuildScope } from '@arch-platform/build-core';

import type { BuildCommandOptions } from '../contracts/build-command-options.js';

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
