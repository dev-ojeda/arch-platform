// packages/platform-model/src/ports/compliance-state-writer.ts

import type { ComplianceStateChange } from '../compliance/compliance-state-change.js';
import type { ComplianceStateChanges } from '../compliance/compliance-state-changes.js';

export interface ComplianceStateWriter {
  apply(change: ComplianceStateChange): void;

  getChanges(): ComplianceStateChanges;

  write(): Promise<void>;
}
