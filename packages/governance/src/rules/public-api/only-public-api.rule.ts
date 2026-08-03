// packages/governance/src/rules/public-api/only-public-api.rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceExecutionContext } from '../../context/governance-context.js';
import { GovernanceRuleId } from '../../engine/governance-rule-id.js';
import type { GovernanceRule } from '../../engine/governance-rule.js';
import type { GovernanceScope } from '../../public/governance-scope.js';

import type { PublicApiScanner } from './public-api-scanner.js';

export class OnlyPublicApiRule implements GovernanceRule<GovernanceExecutionContext> {
  readonly id = GovernanceRuleId.OnlyPublicApi;
  readonly name = 'only-public-api';

  constructor(private readonly scanner: PublicApiScanner) {}

  run(context: GovernanceExecutionContext): Diagnostic[] {
    return this.scanner.scan(context);
  }

  supports(scope: GovernanceScope): boolean {
    return scope.kind === 'workspace' || scope.kind === 'package';
  }
}
