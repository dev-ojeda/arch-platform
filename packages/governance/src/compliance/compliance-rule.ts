// packages/governance/src/compliance/compliance-rule.ts

import type { MaybePromise } from '@arch-platform/platform-model';

import type { ComplianceRuleId } from './compliance-rule-id.js';
import type { ComplianceRuleResult } from './compliance-rule-result.js';
import type { ComplianceExecutionContext } from '../context/compliance-execution-context.js';
import type { ComplianceScope } from '../public/compliance-scope.js';


export interface ComplianceRule {
  readonly id: ComplianceRuleId;
  readonly name: string;

  supports(scope: ComplianceScope): boolean;

  run(
    context: ComplianceExecutionContext,
  ): ComplianceRuleResult | MaybePromise<ComplianceRuleResult>;
}
