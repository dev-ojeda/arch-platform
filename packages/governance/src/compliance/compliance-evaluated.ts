// packages/governance/src/compliance/compliance-evaluated.ts

import type { ComplianceRuleEvaluation } from './compliance-rule-evaluation.js';
import type { ComplianceExecutionContext } from '../context/compliance-execution-context.js';


export interface ComplianceEvaluated {
  evaluate(context: ComplianceExecutionContext): ComplianceRuleEvaluation;
}
