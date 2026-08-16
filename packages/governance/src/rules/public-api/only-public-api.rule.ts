// packages/governance/src/rules/public-api/only-public-api.rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceExecutionContext } from '../../context/governance-context.js';
import { GOVERNANCE_RULE_ID } from '../../engine/governance-rule-id.js';
import type { GovernanceRule } from '../../engine/governance-rule.js';
import type { GovernanceScope } from '../../public/governance-scope.js';

import { PublicApiScanner } from './public-api-scanner.js';

export class OnlyPublicApiRule implements GovernanceRule<GovernanceExecutionContext> {
  readonly id = GOVERNANCE_RULE_ID.OnlyPublicApi;
  readonly name = 'only-public-api';

  constructor(private readonly scanner = new PublicApiScanner()) {}

  run(context: GovernanceExecutionContext): Diagnostic[] {
    return this.scanner.scan(context);
  }

  supports(scope: GovernanceScope): boolean {
    return scope.kind === 'workspace' || scope.kind === 'package';
  }
}
