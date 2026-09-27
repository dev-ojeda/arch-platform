// packages/platform-model/src/security/security-evaluation.ts
import type { SecurityEvaluationSummary } from './security-evaluation-summary.js';
import type { SecurityFinding } from './security-finding.js';

export type SecurityEvaluationStatus = 'not-evaluated' | 'stale' | 'secure' | 'review' | 'blocked';

export interface SecurityEvaluation {
  readonly status: SecurityEvaluationStatus;
  readonly artifactHash: string;
  readonly evaluatedAt: string;
  readonly summary: SecurityEvaluationSummary;
  readonly findings: readonly SecurityFinding[];
}
