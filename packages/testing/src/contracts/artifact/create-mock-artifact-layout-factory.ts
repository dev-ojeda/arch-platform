// packages/testing/src/contracts/artifact/create-mock-artifact-layout-factory.ts

import { vi, type Mocked } from 'vitest';

import type { ArtifactLayoutFactory } from '@arch/platform-model';

import { createMockArtifactLayout } from './create-mock-artifact-layout.js';

export function createMockArtifactLayoutFactory(
  layout = createMockArtifactLayout(),
): Mocked<ArtifactLayoutFactory> {
  return {
    create: vi.fn().mockReturnValue(layout),
  };
}
