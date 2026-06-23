// packages/governance/src/rules/forbidden-dependency-rule.ts

import type { Diagnostic } from '../diagnostics/diagnostic.js';
import type { GovernanceRule } from '../engine/governance-rule.js';
import type { GovernanceContext } from '../types/governance-context.js';

export class ForbiddenDependencyRule implements GovernanceRule {
  readonly name = 'forbidden-dependency-rule';

  run(context: GovernanceContext): Promise<Diagnostic[]> {
    const diagnostics: Diagnostic[] = [];

    for (const pkg of context.packages) {
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

    return Promise.resolve(diagnostics);
  }
}
