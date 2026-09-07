// packages/compliance/src/security/security-evaluation.ts
import type { SecurityFinding } from './security-finding.js';

export type SecurityEvaluationStatus = 'not-evaluated' | 'stale' | 'secure' | 'review' | 'blocked';

export interface SecurityEvaluation {
  readonly status: SecurityEvaluationStatus;

  readonly artifactHash: string;

  readonly evaluatedAt: string;

  readonly findings: readonly SecurityFinding[];
}
