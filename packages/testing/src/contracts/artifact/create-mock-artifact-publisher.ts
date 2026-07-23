// packages/testing/src/contracts/artifact/create-mock-artifact-publisher.ts

import type { ArtifactPublisher } from '@arch/platform-model';
import { vi, type Mocked } from 'vitest';

export function createMockArtifactPublisher(): Mocked<ArtifactPublisher> {
  return {
    publish: vi.fn(),
  };
}
