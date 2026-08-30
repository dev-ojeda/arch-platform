// packages/governance/src/context/resolve-compliance-scope.ts

import type { ComplianceOptions } from '../public/compliance-options.js';
import type { ComplianceScope } from '../public/compliance-scope.js';

export function resolveComplianceScope(options: ComplianceOptions): ComplianceScope {
  if (options.packageName) {
    return {
      kind: 'package',
      root: options.workspaceRoot,
      packageName: options.packageName,
    };
  }

  return {
    kind: 'workspace',
    root: options.workspaceRoot,
  };
}
