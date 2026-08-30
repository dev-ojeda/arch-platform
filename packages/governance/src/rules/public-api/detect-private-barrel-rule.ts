// packages/governance/src/rules/public-api/detect-private-barrel-rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceExecutionContext } from '../../context/governance-execution-context.js';
import { GOVERNANCE_RULE_ID } from '../../engine/governance-rule-id.js';
import type { GovernanceRule } from '../../engine/governance-rule.js';
import type { GovernanceScope } from '../../public/governance-scope.js';

import { PrivateBarrelScanner } from './private-barrel-scanner.js';

export class DetectPrivateBarrelRule implements GovernanceRule<GovernanceExecutionContext> {
  readonly id = GOVERNANCE_RULE_ID.DetectPrivateBarrel;
  readonly name = 'detect-private-barrel';

  constructor(private readonly scanners: readonly PrivateBarrelScanner[]) {}

  run(context: GovernanceExecutionContext): Diagnostic[] {
    return this.scanners.flatMap((scanner) => scanner.scan(context));
  }

  supports(scope: GovernanceScope): boolean {
    return scope.kind === 'workspace' || scope.kind === 'package';
  }
}
