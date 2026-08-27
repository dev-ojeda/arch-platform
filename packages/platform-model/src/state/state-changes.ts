// packages/platform-model/src/state/state-changes.ts

export interface StateChanges {
  readonly created: ReadonlySet<string>;
  readonly updated: ReadonlySet<string>;
  readonly deleted: ReadonlySet<string>;
}
