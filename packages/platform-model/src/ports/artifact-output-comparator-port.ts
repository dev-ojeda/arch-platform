// packages/platform-model/src/ports/artifact-output-comparator-port.ts

import type { OutputFingerprint } from '../artifact/artifact-manifest.js';
import type { ArtifactOutputComparison } from '../artifact/artifact-output-comparison.js';

export interface ArtifactOutputComparatorPort {
  compare(
    expected: readonly OutputFingerprint[],
    actual: readonly OutputFingerprint[],
  ): ArtifactOutputComparison;
}
