// packages/governance/src/rules/package-structure/validate-package-structure.rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceContext } from '../../context/governance-context.js';
import { GOVERNANCE_RULE_ID } from '../../engine/governance-rule-id.js';
import type { GovernanceRule } from '../../engine/governance-rule.js';
import type { GovernanceScope } from '../../public/governance-scope.js';

import { ValidatePackageStructureDiagnostic } from './diagnostic-factory.js';

export class ValidatePackageStructureRule implements GovernanceRule {
  readonly id = GOVERNANCE_RULE_ID.ValidatePackageStructure;
  readonly name = 'validate-package-structure';
  run(context: GovernanceContext): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    for (const pkg of context.packages.scoped(context.scope)) {
      if (context.scope.kind === 'package' && pkg.name !== context.scope.packageName) {
        continue;
      }

      if (!pkg.layout.hasSourceDirectory) {
        diagnostics.push(
          ValidatePackageStructureDiagnostic(this.id, pkg.name, pkg.layout.sourceDirectory),
        );
      }
    }

    return diagnostics;
  }
  supports(scope: GovernanceScope): boolean {
    return scope.kind === 'package';
  }
}
