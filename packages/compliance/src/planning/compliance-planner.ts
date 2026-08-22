// packages/compliance/src/planning/compliance-planner.ts

import type { CompliancePlan } from './compliance-plan.js';

export interface CompliancePlanner {
  createPlan(): Promise<CompliancePlan>;
}
