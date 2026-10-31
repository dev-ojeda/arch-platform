import { vi, type Mocked } from 'vitest';

import type { ArtifactPublisher } from '@arch-platform/platform-model';

export function createMockArtifactPublisher(): Mocked<ArtifactPublisher> {
  return {
    publish: vi.fn(),
  };
}
