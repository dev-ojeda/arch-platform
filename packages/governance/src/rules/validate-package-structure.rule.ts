// packages/governance/src/rules/validate-package-structure.rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceContext } from '../context/governance-context.js';
import type { GovernanceScope } from '../context/governance-scope.js';
import { GovernanceRuleId } from '../engine/governance-rule-id.js';
import type { GovernanceRule } from '../engine/governance-rule.js';

export class ValidatePackageStructureRule implements GovernanceRule {
  readonly id = GovernanceRuleId.ValidatePackageStructure;
  readonly name = 'validate-package-structure';
  run(context: GovernanceContext): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    for (const pkg of context.workspace.packages) {
      if (context.scope.kind === 'package' && pkg.name !== context.scope.packageName) {
        continue;
      }

      if (!pkg.layout.hasSourceDirectory) {
        diagnostics.push({
          code: 'PACKAGE_SRC_DIRECTORY_MISSING',
          severity: 'error',
          source: this.name,
          message: `Package "${pkg.name}" is missing a src directory.`,
          location: {
            file: pkg.layout.sourceDirectory,
          },
          hint: 'Create a src directory for the package.',
        });
      }
    }

    return diagnostics;
  }
  supports(scope: GovernanceScope): boolean {
    return scope.kind === 'workspace' || scope.kind === 'package';
  }
}
