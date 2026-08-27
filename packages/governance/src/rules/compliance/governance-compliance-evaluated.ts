// packages/governance/src/rules/compliance/governance-compliance-evaluated.ts

import type { GovernanceExecutionContext } from '../../context/governance-context.js';

import type { GovernanceComplianceEvaluation } from './governance-compliance-evaluation.js';

export interface GovernanceComplianceEvaluated {
  evaluate(context: GovernanceExecutionContext): GovernanceComplianceEvaluation;
}
