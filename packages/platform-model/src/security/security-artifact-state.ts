// packages/platform-model/src/security/security-artifact-state.ts

import type { SecurityDecisionStatus } from './security-decision-status.js';
import type { SecurityDecision } from './security-decision.js';
import type { SecurityEvaluation } from './security-evaluation.js';

export interface SecurityArtifactState {
  readonly previousStatus: SecurityDecisionStatus | undefined;
  readonly evaluation: SecurityEvaluation;
  readonly decision: SecurityDecision;
}
