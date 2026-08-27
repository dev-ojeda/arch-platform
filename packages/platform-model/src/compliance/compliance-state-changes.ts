// packages/platform-model/src/compliance/compliance-state-changes.ts

import type { ComplianceStateChange } from './compliance-state-change.js';

export interface ComplianceStateChanges {
  readonly changes: readonly ComplianceStateChange[];
}
