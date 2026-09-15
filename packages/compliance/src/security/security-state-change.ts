// packages/compliance/src/security/security-state-change.ts

import type { SecurityDecision, SecurityDecisionStatus } from './security-decision.js';
import type { SecurityEvaluation } from './security-evaluation.js';

export interface SecurityStateChange {
  readonly artifact: string;

  readonly previousStatus: SecurityDecisionStatus | undefined;

  readonly evaluation: SecurityEvaluation;

  readonly decision: SecurityDecision;
}
