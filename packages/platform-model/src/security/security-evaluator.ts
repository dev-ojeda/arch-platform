// packages/platform-model/src/security/security-evaluator.ts

import type { SecurityExecutionContext } from './security-execution-context.js';
import type { SecurityStateChanges } from './security-state-changes.js';

export interface SecurityEvaluator {
  evaluate(context: SecurityExecutionContext): Promise<SecurityStateChanges>;
}
