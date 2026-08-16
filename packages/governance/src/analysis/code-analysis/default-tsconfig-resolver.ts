// packages/governance/src/analysis/code-analysis/default-tsconfig-resolver.ts

import type { GovernanceContext } from '../../context/governance-context.js';

import type { TsConfigResolver } from './tsconfig-resolver.js';

export class DefaultTsConfigResolver implements TsConfigResolver {
  resolve(context: GovernanceContext): string {
    const { scope, workspace, packages } = context;

    switch (scope.kind) {
      case 'package': {
        const pkg = packages.get(scope.packageName);

        if (pkg?.layout.hasTsconfig) {
          return pkg.layout.tsconfigPath;
        }

        return workspace.layout.tsconfigPath;
      }

      case 'workspace':
      case 'changed':
        return workspace.layout.tsconfigPath;

      default: {
        const exhaustive: never = scope;
        return exhaustive;
      }
    }
  }
}
