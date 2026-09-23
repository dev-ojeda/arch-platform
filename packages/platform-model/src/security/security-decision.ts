// packages/platform-model/src/security/security-decision.ts

import type { SecurityDecisionStatus } from './security-decision-status.js';

export interface SecurityDecision {
  readonly status: SecurityDecisionStatus;

  readonly artifactHash: string;

  readonly policyId: string;

  readonly policyVersion: string;

  readonly reasons: readonly string[];
}
