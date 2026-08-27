// packages/platform-model/src/compliance/compliance-plan.ts

import type { CompliancePlanEntry } from './compliance-plan-entry.js';

export interface CompliancePlan {
  readonly entries: readonly CompliancePlanEntry[];
}
