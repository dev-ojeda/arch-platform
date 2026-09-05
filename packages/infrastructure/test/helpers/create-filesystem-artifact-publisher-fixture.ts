import type { ArtifactPublisherContractContext } from '@arch-platform/testing';
import {
  createMockArtifactLayout,
  createMockArtifactPublisher,
  createTestArtifactManifest,
  createTestFilesystemRoot,
} from '@arch-platform/testing';

export function createFilesystemArtifactPublisherFixture(): ArtifactPublisherContractContext {
  const root = createTestFilesystemRoot();
  const layout = createMockArtifactLayout('/cache/artifact');
  const manifest = createTestArtifactManifest();
  const publisher = createMockArtifactPublisher();

  return {
    publisher,
    layout,
    manifest,
    root,
  };
}
