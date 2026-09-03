// packages/governance/src/compliance/compliance-evaluated.ts

import type { ComplianceExecutionContext } from '../context/compliance-execution-context.js';

import type { ComplianceRuleEvaluation } from './compliance-rule-evaluation.js';

export interface ComplianceEvaluated {
  evaluate(context: ComplianceExecutionContext): ComplianceRuleEvaluation;
}
