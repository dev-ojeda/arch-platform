// packages/governance/src/workspace/validate-package-structure.rule.ts

import { stat } from 'node:fs/promises';
import path from 'node:path';

import type { GovernanceContext } from '../context/governance-context.js';
import type { Diagnostic } from '../diagnostics/diagnostic.js';
import type { GovernanceRule } from '../engine/governance-rule.js';

export class ValidatePackageStructureRule implements GovernanceRule {
  readonly name = 'validate-package-structure';

  async run(context: GovernanceContext): Promise<Diagnostic[]> {
    const diagnostics: Diagnostic[] = [];

    for (const pkg of context.packages) {
      const srcPath = path.join(pkg.rootPath, 'src');

      try {
        await stat(srcPath);
      } catch {
        diagnostics.push({
          code: 'PACKAGE_SRC_DIRECTORY_MISSING',

          severity: 'error',

          source: this.name,

          message: `Package "${pkg.name}" ` + 'is missing a src directory.',

          location: {
            file: srcPath,
          },

          hint: 'Create a src directory for the package.',
        });
      }
    }

    return diagnostics;
  }
}
