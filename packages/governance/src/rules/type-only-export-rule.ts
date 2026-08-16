// packages/governance/src/rules/type-only-export-rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { SemanticScanner } from '../analysis/semantics/semantic-scanner.js';
import type { GovernanceExecutionContext } from '../context/governance-context.js';
import { GOVERNANCE_RULE_ID } from '../engine/governance-rule-id.js';
import type { GovernanceRule } from '../engine/governance-rule.js';
import type { GovernanceScope } from '../public/governance-scope.js';

export class TypeOnlyExportRule implements GovernanceRule<GovernanceExecutionContext> {
  readonly id = GOVERNANCE_RULE_ID.TypeOnlyExportRule;
  readonly name = 'type-only-export';

  constructor(private readonly scanners: readonly SemanticScanner[]) {}

  run(context: GovernanceExecutionContext): Diagnostic[] {
    return this.scanners.flatMap((scanner) => scanner.scan(context));
  }

  supports(scope: GovernanceScope): boolean {
    return scope.kind === 'package';
  }
}
