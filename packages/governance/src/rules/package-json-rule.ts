// packages/governance/src/rules/package-json-rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceContext } from '../context/governance-context.js';

export class PackageJsonRule {
  readonly name = 'package-json-rule';

  run(context: GovernanceContext): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    for (const pkg of context.workspace.packages) {
      const isEsm = pkg.manifest.type === 'module';

      if (!isEsm) {
        diagnostics.push({
          code: 'PACKAGE_ESM_REQUIRED',
          severity: 'error',
          source: this.name,
          message: 'package must use ESM',
          location: { file: pkg.manifestPath },
          metadata: { package: pkg.name },
          hint: 'Add "type": "module" to package.json',
        });
      }

      const hasExports = pkg.manifest.exports && Object.keys(pkg.manifest.exports).length > 0;

      if (!hasExports) {
        diagnostics.push({
          code: 'PACKAGE_EXPORTS_REQUIRED',
          severity: 'warning',
          source: this.name,
          message: 'package should define exports',
          location: { file: pkg.manifestPath },
          metadata: { package: pkg.name },
          hint: 'Define package exports for ESM compatibility',
        });
      }
    }

    return diagnostics;
  }
}
