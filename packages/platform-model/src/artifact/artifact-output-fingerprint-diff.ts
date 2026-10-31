// packages/platform-model/src/artifact/artifact-output-fingerprint-diff.ts

export interface ArtifactOutputFingerprintDiff {
  readonly added: readonly string[];
  readonly modified: readonly string[];
  readonly deleted: readonly string[];
}
