// packages/testing/src/contracts/artifact/create-mock-artifact-publisher.ts

import { vi, type Mocked } from 'vitest';

import type { ArtifactPublisher } from '@arch/platform-model';

export function createMockArtifactPublisher(): Mocked<ArtifactPublisher> {
  return {
    publish: vi.fn(),
  };
}
