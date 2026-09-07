// packages/compliance/src/security/security-policy.ts

import type { SecurityDecision } from './security-decision.js';
import type { SecurityEvaluation } from './security-evaluation.js';

export interface SecurityPolicy {
  readonly id: string;
  readonly version: string;

  evaluate(evaluation: SecurityEvaluation): SecurityDecision;
}
