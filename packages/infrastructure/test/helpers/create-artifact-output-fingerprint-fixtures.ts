import type { Mocked } from 'vitest';
import { vi } from 'vitest';

import type { ArtifactOutputFingerprinterPort } from '@arch-platform/platform-model';

export function createMockArtifactOutputFingerprinter(): Mocked<ArtifactOutputFingerprinterPort> {
  return {
    fingerprint: vi.fn(async (_root, outputs) =>
      outputs.map((path) => ({
        path,
        sizeInBytes: 10,
        integrity: `sha256:${'a'.repeat(64)}`,
      })),
    ),
  };
}
