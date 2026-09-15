// packages/compliance/src/security/security-artifact-state.ts

import type { SecurityDecision, SecurityDecisionStatus } from './security-decision.js';
import type { SecurityEvaluation } from './security-evaluation.js';

export interface SecurityArtifactState {
  readonly previousStatus: SecurityDecisionStatus | undefined;
  readonly evaluation: SecurityEvaluation;
  readonly decision: SecurityDecision;
}
