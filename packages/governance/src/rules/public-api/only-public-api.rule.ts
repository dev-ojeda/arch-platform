// packages/governance/src/rules/public-api/only-public-api.rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceExecutionContext } from '../../context/governance-context.js';
import { GovernanceRuleId } from '../../engine/governance-rule-id.js';
import type { GovernanceRule } from '../../engine/governance-rule.js';

import { PublicApiScanner } from './public-api-scanner.js';

export class OnlyPublicApiRule implements GovernanceRule<GovernanceExecutionContext> {
  readonly id = GovernanceRuleId.OnlyPublicApi;
  readonly name = 'only-public-api';

  private readonly scanner = new PublicApiScanner();

  async run(context: GovernanceExecutionContext): Promise<Diagnostic[]> {
    return await this.scanner.scan(context);
  }
}
