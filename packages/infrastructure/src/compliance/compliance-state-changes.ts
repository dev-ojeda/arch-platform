// packages/infrastructure/src/compliance/compliance-state-changes.ts

import type { ComplianceStateChange, ComplianceStateChanges } from '@arch/platform-model';

export class MutableComplianceStateChanges {
  private readonly changes: ComplianceStateChange[] = [];

  add(change: ComplianceStateChange): void {
    this.changes.push(change);
  }

  get isEmpty(): boolean {
    return this.changes.length === 0;
  }

  toSnapshot(): ComplianceStateChanges {
    return {
      changes: [...this.changes],
    };
  }
}
