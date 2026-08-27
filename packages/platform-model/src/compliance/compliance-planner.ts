// packages/platform-model/src/compliance/compliance-planner.ts

import type { CompliancePlan } from './compliance-plan.js';

export interface CompliancePlanner {
  createPlan(): Promise<CompliancePlan>;
}
