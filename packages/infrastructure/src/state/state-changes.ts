// packages/infrastructure/src/state/state-changes.ts

import type { StateChanges } from '@arch/platform-model';

export class MutableStateChanges {
  readonly created = new Set<string>();
  readonly updated = new Set<string>();
  readonly deleted = new Set<string>();

  get isEmpty(): boolean {
    return this.created.size === 0 && this.updated.size === 0 && this.deleted.size === 0;
  }

  toSnapshot(): StateChanges {
    return {
      created: new Set(this.created),
      updated: new Set(this.updated),
      deleted: new Set(this.deleted),
    };
  }

  summary(): {
    created: number;
    updated: number;
    deleted: number;
  } {
    return {
      created: this.created.size,
      updated: this.updated.size,
      deleted: this.deleted.size,
    };
  }
}
