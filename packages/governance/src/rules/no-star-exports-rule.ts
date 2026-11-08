import type { Diagnostic } from '@arch-platform/platform-model';

import type { GovernanceExecutionContext } from '../context/governance-execution-context.js';
import { GOVERNANCE_RULE_ID } from '../engine/governance-rule-id.js';
import type { GovernanceRule } from '../engine/governance-rule.js';
import type { GovernanceScope } from '../public/governance-scope.js';

export class NoStarExportsRule implements GovernanceRule<GovernanceExecutionContext> {
  readonly id = GOVERNANCE_RULE_ID.NoStarExports;
  readonly name = 'no-star-exports';

  run(context: GovernanceExecutionContext): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    for (const { packageName, analysis } of context.analyses) {
      for (const module of analysis.modules) {
        for (const declaration of module.exportDeclarations) {
          if (declaration.kind !== 'star' && declaration.kind !== 'namespace') {
            continue;
          }

          diagnostics.push({
            code: 'ARCH_STAR_EXPORT_FORBIDDEN',
            severity: 'error',
            source: 'governance',
            message: `Package ${packageName} uses a prohibited export * declaration`,
            hint: 'Replace export * with explicit named exports',
            location: {
              file: declaration.sourceFile,
            },
            metadata: {
              rule: this.name,
              package: packageName,
              moduleSpecifier: declaration.moduleSpecifier,
            },
          });
        }
      }
    }

    return diagnostics;
  }

  supports(scope: GovernanceScope): boolean {
    return scope.kind === 'workspace' || scope.kind === 'package';
  }
}
