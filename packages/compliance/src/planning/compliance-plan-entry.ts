// packages/compliance/src/planning/compliance-plan-entry.ts

import type { ComplianceTopic } from './compliance-topic.js';

export interface CompliancePlanEntry {
  readonly package: string;
  readonly topics: readonly ComplianceTopic[];
}
