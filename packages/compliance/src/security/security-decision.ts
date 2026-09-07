// packages/compliance/src/security/security-decision.ts

export type SecurityDecisionStatus = 'allowed' | 'review' | 'blocked';

export interface SecurityDecision {
  readonly status: SecurityDecisionStatus;

  readonly artifactHash: string;

  readonly policyId: string;

  readonly policyVersion: string;

  readonly reasons: readonly string[];
}
