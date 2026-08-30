// packages/platform-model/src/artifact/artifact-state-reason.ts

export type ArtifactStateReason =
  | 'none'
  | 'dependency-changed'
  | 'source-changed'
  | 'first-build'
  | 'manual'
  | 'cache-invalidated'
  | 'missing-output';
