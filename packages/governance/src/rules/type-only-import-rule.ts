// packages/governance/src/rules/type-only-import-rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { SemanticScanner } from '../analysis/index.js';
import type { GovernanceExecutionContext } from '../context/governance-context.js';
import { GOVERNANCE_RULE_ID } from '../engine/governance-rule-id.js';
import type { GovernanceRule } from '../engine/governance-rule.js';
import type { GovernanceScope } from '../public/governance-scope.js';

export class TypeOnlyImportRule implements GovernanceRule<GovernanceExecutionContext> {
  readonly id = GOVERNANCE_RULE_ID.TypeOnlyImportRule;
  readonly name = 'type-only-import';

  constructor(private readonly scanners: readonly SemanticScanner[]) {}

  run(context: GovernanceExecutionContext): Diagnostic[] {
    return this.scanners.flatMap((scanner) => scanner.scan(context));
  }

  supports(scope: GovernanceScope): boolean {
    return scope.kind === 'package';
  }
}
