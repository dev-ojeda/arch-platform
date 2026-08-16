// packages/governance/src/rules/forbidden-dependency-rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceContext } from '../context/governance-context.js';
import { GOVERNANCE_RULE_ID } from '../engine/governance-rule-id.js';
import type { GovernanceRule } from '../engine/governance-rule.js';
import type { GovernanceScope } from '../public/governance-scope.js';

export class ForbiddenDependencyRule implements GovernanceRule {
  readonly id = GOVERNANCE_RULE_ID.ForbiddenDependency;
  readonly name = 'forbidden-dependency-rule';

  run(context: GovernanceContext): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    for (const pkg of context.packages.scoped(context.scope)) {
      const forbidden = pkg.boundaries?.forbiddenDependencies ?? [];

      for (const dependency of pkg.internalDependencies ?? []) {
        if (!forbidden.includes(dependency)) {
          continue;
        }

        diagnostics.push({
          code: 'FORBIDDEN_DEPENDENCY',

          severity: 'error',

          source: this.name,

          message: `Package "${pkg.name}" depends on forbidden package "${dependency}".`,

          location: {
            file: pkg.manifestPath,
          },

          metadata: {
            package: pkg.name,
            dependency,
          },

          hint: 'Remove the dependency or update the package boundaries.',
        });
      }
    }

    return diagnostics;
  }
  supports(scope: GovernanceScope): boolean {
    return scope.kind === 'workspace' || scope.kind === 'package';
  }
}
