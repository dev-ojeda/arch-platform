import type {
  ArtifactLayout,
  ArtifactManifest,
  ArtifactPublisher,
} from '@arch-platform/platform-model';

import { createArtifactManifest } from './create-artifact-manifest.js';
import { createTestFilesystemRoot } from './create-filesystem-root.js';
import { createMockArtifactLayout } from './create-mock-artifact-layout.js';
import { createMockArtifactPublisher } from './create-mock-artifact-publisher.js';

export interface ArtifactPublisherContractContext {
  readonly publisher: ArtifactPublisher;

  readonly manifest: ArtifactManifest;

  readonly layout: ArtifactLayout;

  readonly root: string;
}

export function createFilesystemArtifactPublisherFixture(): ArtifactPublisherContractContext {
  const root = createTestFilesystemRoot();
  const layout = createMockArtifactLayout('/cache/artifact');
  const manifest = createArtifactManifest();
  const publisher = createMockArtifactPublisher();

  return {
    publisher,
    layout,
    manifest,
    root,
  };
}
