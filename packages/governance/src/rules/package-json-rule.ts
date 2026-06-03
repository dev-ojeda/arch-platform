// packages/governance/src/rules/package-json-rule.ts

import type { GovernanceContext } from '../context/governance-context.js';
import type { Diagnostic } from '../diagnostics/diagnostic.js';

import type { GovernanceRule } from './governance-rule.js';

export class PackageJsonRule implements GovernanceRule {
  readonly name = 'package-json-rule';
  run(context: GovernanceContext): Promise<Diagnostic[]> {
    const diagnostics: Diagnostic[] = [];

    for (const pkg of context.packages) {
      if (pkg.packageJson.type !== 'module') {
        diagnostics.push({
          code: 'PACKAGE_ESM_REQUIRED',

          severity: 'error',

          source: this.name,

          message: 'package must use ESM',

          location: {
            file: pkg.manifestPath,
          },

          metadata: {
            package: pkg.name,
          },

          hint: 'Add \"type\": \"module\" to package.json',
        });
      }

      if (!pkg.packageJson.exports) {
        diagnostics.push({
          code: 'PACKAGE_EXPORTS_REQUIRED',

          severity: 'warning',

          source: this.name,

          message: 'package should define exports',

          location: {
            file: pkg.manifestPath,
          },

          metadata: {
            package: pkg.name,
          },

          hint: 'Define package exports for ESM compatibility',
        });
      }
    }

    return Promise.resolve(diagnostics);
  }
}
