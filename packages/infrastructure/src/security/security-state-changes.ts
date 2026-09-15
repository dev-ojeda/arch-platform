// packages/infrastructure/src/security/security-state-changes.ts

import type { SecurityStateChange, SecurityStateChanges } from '@arch-platform/compliance';

export class MutableSecurityStateChanges {
  private readonly changes: SecurityStateChange[] = [];

  add(change: SecurityStateChange): void {
    this.changes.push(change);
  }

  get isEmpty(): boolean {
    return this.changes.length === 0;
  }

  toSnapshot(): SecurityStateChanges {
    return {
      changes: [...this.changes],
    };
  }
}
