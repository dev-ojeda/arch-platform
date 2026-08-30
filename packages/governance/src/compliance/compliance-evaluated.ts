// packages/governance/src/compliance/compliance-evaluated.ts

import type { ComplianceExecutionContext } from '../context/compliance-execution-context.js';

import type { ComplianceEvaluation } from './compliance-evaluation.js';

export interface ComplianceEvaluated {
  evaluate(context: ComplianceExecutionContext): ComplianceEvaluation;
}
