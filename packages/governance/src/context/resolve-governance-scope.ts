// packages/governance/src/context/resolve-governance-scope.ts

import type { GovernanceOptions } from '../public/governance-options.js';
import type { GovernanceScope } from '../public/governance-scope.js';

export function resolveGovernanceScope(options: GovernanceOptions): GovernanceScope {
  if (options.packageName) {
    return {
      kind: 'package',
      root: options.workspaceRoot,
      packageName: options.packageName,
    };
  }

  if (options.changedOnly) {
    return {
      kind: 'changed',
      root: options.workspaceRoot,
    };
  }

  return {
    kind: 'workspace',
    root: options.workspaceRoot,
  };
}
