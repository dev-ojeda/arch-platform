// packages/platform-model/src/security/security-state-change.ts

import type { SecurityDecisionStatus } from './security-decision-status.js';
import type { SecurityDecision } from './security-decision.js';
import type { SecurityEvaluation } from './security-evaluation.js';

export interface SecurityStateChange {
  readonly artifact: string;

  readonly previousStatus: SecurityDecisionStatus | undefined;

  readonly evaluation: SecurityEvaluation;

  readonly decision: SecurityDecision;
}
