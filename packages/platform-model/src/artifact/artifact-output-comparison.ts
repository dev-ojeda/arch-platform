// packages/platform-model/src/artifact/artifact-output-comparison.ts

import type { ArtifactOutputFingerprintDiff } from './artifact-output-fingerprint-diff.js';

export interface ArtifactOutputComparison {
  readonly isIdentical: boolean;
  readonly diff: ArtifactOutputFingerprintDiff;
}
