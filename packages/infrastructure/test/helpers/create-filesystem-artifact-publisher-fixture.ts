import type { ArtifactPublisherContractContext } from '@arch/testing';
import {
  createMockArtifactLayout,
  createMockArtifactPublisher,
  createTestArtifactManifest,
  createTestFilesystemRoot,
} from '@arch/testing';

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
