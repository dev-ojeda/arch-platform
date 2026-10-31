// packages/infrastructure/src/artifact/adapter/artifact-output-comparator.ts

import type {
  ArtifactOutputComparatorPort,
  ArtifactOutputComparison,
  OutputFingerprint,
} from '@arch-platform/platform-model';

export class ArtifactOutputComparator implements ArtifactOutputComparatorPort {
  compare(
    expected: readonly OutputFingerprint[],
    actual: readonly OutputFingerprint[],
  ): ArtifactOutputComparison {
    const expectedByPath = new Map(expected.map((fingerprint) => [fingerprint.path, fingerprint]));

    const actualByPath = new Map(actual.map((fingerprint) => [fingerprint.path, fingerprint]));

    const added: string[] = [];
    const modified: string[] = [];
    const deleted: string[] = [];

    for (const [path, actualFingerprint] of actualByPath) {
      const expectedFingerprint = expectedByPath.get(path);

      if (!expectedFingerprint) {
        added.push(path);
        continue;
      }

      if (
        expectedFingerprint.sizeInBytes !== actualFingerprint.sizeInBytes ||
        expectedFingerprint.integrity !== actualFingerprint.integrity
      ) {
        modified.push(path);
      }
    }

    for (const path of expectedByPath.keys()) {
      if (!actualByPath.has(path)) {
        deleted.push(path);
      }
    }

    added.sort();
    modified.sort();
    deleted.sort();

    const diff = {
      added,
      modified,
      deleted,
    };

    return {
      isIdentical: added.length === 0 && modified.length === 0 && deleted.length === 0,
      diff,
    };
  }
}
