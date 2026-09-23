// packages/compliance/src/context/resolve-compliance-security-scope.ts

import type { SecurityScope } from '@arch-platform/platform-model';

import type { SecurityOptions } from '../security/security-options.js';

export function resolveComplianceSecurityScope(options: SecurityOptions): SecurityScope {
  if (options.packageName) {
    return {
      kind: 'package',
      root: options.workspaceRoot,
      packageName: options.packageName,
      environment: options.environment,
    };
  }

  return {
    kind: 'workspace',
    root: options.workspaceRoot,
    environment: options.environment,
  };
}
