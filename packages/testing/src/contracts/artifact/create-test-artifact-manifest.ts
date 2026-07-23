// packages/testing/src/contracts/artifact/create-test-artifact-manifest.ts

import type { ArtifactManifest } from '@arch/platform-model';

import { createTestArtifact } from './create-test-artifact.js';

export function createTestArtifactManifest(
  overrides?: Partial<ArtifactManifest>,
): ArtifactManifest {
  return {
    artifact: createTestArtifact(),
    outputs: ['dist/index.js', 'dist/index.d.ts'],
    createdAt: 1,
    schemaVersion: 1,
    ...overrides,
  };
}
