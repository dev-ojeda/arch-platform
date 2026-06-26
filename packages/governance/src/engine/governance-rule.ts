// packages/governance/src/engine/governance-rule.ts

import type { Diagnostic } from '../types/diagnostic.js';
import type { GovernanceExecutionContext } from '../types/governance-context.js';

import type { GovernanceRuleId } from './governance-rule-id.js';

export interface GovernanceRule {
  readonly id: GovernanceRuleId;

  readonly name: string;

  run(context: GovernanceExecutionContext): Promise<Diagnostic[]>;
}
