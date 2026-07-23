// packages/testing/src/contracts/artifact/create-test-artifact.ts

import type { Artifact } from '@arch/platform-model';

export function createTestArtifact(overrides?: Partial<Artifact>): Artifact {
  return {
    packageName: '@arch/test-package',
    id: 'artifact-id',
    ...overrides,
  };
}
