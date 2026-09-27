// packages/platform-model/src/security/security-evaluation-summary.ts

import type { SecurityVulnerabilitySummary } from './security-vulnerability-summary.js';

export interface SecurityEvaluationSummary {
  readonly totalFindings: number;
  readonly blockingFindings: number;
  readonly vulnerabilities: readonly SecurityVulnerabilitySummary[];
}
