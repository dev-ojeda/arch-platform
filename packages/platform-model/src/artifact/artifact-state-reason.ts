// packages/platform-model/src/artifact/artifact-state-reason.ts

export type ArtifactStateReason =
  | 'none'
  | 'first-build'
  | 'manual'
  | 'source-changed'
  | 'config-changed'
  | 'dependency-changed'
  | 'cache-version-changed'
  | 'output-integrity-failed'
  | 'missing-output';
