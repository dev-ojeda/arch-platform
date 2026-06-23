// packages/build-core/src/executor/execution-types.ts

export type ExecutionReason =
  | 'scheduled'
  | 'cached'
  | 'artifact-restored'
  | 'propagated'
  | 'restored'
  | 'dependency-failed';
