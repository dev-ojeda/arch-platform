// packages/governance/src/rules/package-structure/diagnostic-factory.ts

import type { Diagnostic } from '@arch/platform-model';

export function ValidatePackageStructureDiagnostic(
  id: string,
  packageName: string,
  source: string,
): Diagnostic {
  return {
    code: 'PACKAGE_SRC_DIRECTORY_MISSING',
    severity: 'error',
    source: id,
    message: `Package "${packageName}" is missing a src directory.`,
    location: {
      file: source,
    },
    hint: 'Create a src directory for the package.',
  };
}
