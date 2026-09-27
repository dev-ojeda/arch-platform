// packages/compliance/src/public/security-result.ts

import type {
  SecurityDecisionStatus,
  SecurityEvaluationStatus,
} from '@arch-platform/platform-model';

import type { SecurityAction } from './security-action.js';

export interface SecurityResult {
  readonly success: boolean;
  readonly durationMs: number;
  readonly changes: number;
  readonly artifact: string;
  readonly previousStatus: SecurityDecisionStatus | undefined;
  readonly evaluationStatus: SecurityEvaluationStatus;
  readonly decisionStatus: SecurityDecisionStatus;
  readonly securityAction?: SecurityAction;
}
