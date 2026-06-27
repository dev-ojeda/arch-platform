// packages/governance/src/rules/validate-package-structure.rule.ts

import { stat } from 'node:fs/promises';
import { join } from 'node:path';

import { GovernanceRuleId } from '../engine/governance-rule-id.js';
import type { GovernanceRule } from '../engine/governance-rule.js';
import type { Diagnostic } from '../types/diagnostic.js';
import type { GovernanceContext } from '../types/governance-context.js';

export class ValidatePackageStructureRule implements GovernanceRule {
  readonly id = GovernanceRuleId.ValidatePackageStructure;
  readonly name = 'validate-package-structure';

  async run(context: GovernanceContext): Promise<Diagnostic[]> {
    const diagnostics: Diagnostic[] = [];

    for (const pkg of context.packages) {
      const srcPath = join(pkg.rootPath, 'src');

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
