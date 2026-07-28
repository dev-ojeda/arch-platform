import {
  createMockArtifactLayout,
  createMockArtifactPublisher,
  createTestArtifactManifest,
  createTestFilesystemRoot,
} from '@arch/testing';
import type { ArtifactPublisherContractContext } from '@arch/testing';

export function createFilesystemArtifactPublisherFixture(): ArtifactPublisherContractContext {
  const root = createTestFilesystemRoot();
  const temporaryLayout = createMockArtifactLayout('/cache/tmp');
  const manifest = createTestArtifactManifest();
  const layout = createMockArtifactLayout('/cache/artifact', temporaryLayout);

  const publisher = createMockArtifactPublisher();

  return {
    publisher,
    layout,
    manifest,
    root,
  };
}
