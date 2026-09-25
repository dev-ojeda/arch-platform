// packages\application\test\__tests__\publish-artifact.use-case.test.ts

import { describe, expect, it, vi } from 'vitest';

import { PublishArtifactUseCase } from '@arch-platform/application';
import type { ArtifactPublisher } from '@arch-platform/platform-model';
import { createMockArtifactLayout, createTestArtifactManifest } from '@arch-platform/testing';

describe('PublishArtifactUseCase', () => {
  it('publishes the artifact through the publisher', async () => {
    const publisher: ArtifactPublisher = {
      publish: vi.fn(),
    };

    const root = '/workspace';
    const manifest = createTestArtifactManifest();
    const layout = createMockArtifactLayout();

    const useCase = new PublishArtifactUseCase(publisher);

    await useCase.execute({
      root,
      manifest,
      layout,
    });

    expect(publisher.publish).toHaveBeenCalledOnce();
    expect(publisher.publish).toHaveBeenCalledWith(root, manifest, layout);
  });

  it('propagates publisher errors', async () => {
    const error = new Error('Publication failed');

    const publisher: ArtifactPublisher = {
      publish: vi.fn().mockRejectedValue(error),
    };

    const useCase = new PublishArtifactUseCase(publisher);

    await expect(
      useCase.execute({
        root: '/workspace',
        manifest: createTestArtifactManifest(),
        layout: createMockArtifactLayout(),
      }),
    ).rejects.toThrow(error);
  });
});
