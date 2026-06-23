// packages/build-core/src/state/state-change-set.ts

export class StateChangeSet {
  readonly created = new Set<string>();

  readonly updated = new Set<string>();

  readonly deleted = new Set<string>();

  get isEmpty(): boolean {
    return this.created.size === 0 && this.updated.size === 0 && this.deleted.size === 0;
  }

  summary() {
    return {
      created: this.created.size,
      updated: this.updated.size,
      deleted: this.deleted.size,
    };
  }
}
