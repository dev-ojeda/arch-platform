// packages\infrastructure\test\helpers\create-filesystem-artifact-cache-fixture.ts
import type { ArtifactCacheContractContext } from '@arch/testing';
import {
  createMockArtifactLayout,
  createMockArtifactLayoutFactory,
  createMockArtifactPublisher,
  createMockFilesystem,
  createTestArtifact,
  createTestPathService,
} from '@arch/testing';

import { FilesystemArtifactCache } from '../../src/artifact/adapter/filesystem-artifact-cache.js';

export function createFilesystemArtifactCacheFixture(): ArtifactCacheContractContext {
  const artifact = createTestArtifact();
  const layout = createMockArtifactLayout('/cache/artifact');
  const filesystem = createMockFilesystem();
  const pathService = createTestPathService();
  const publisher = createMockArtifactPublisher();
  const layoutFactory = createMockArtifactLayoutFactory(layout);

  const cache = new FilesystemArtifactCache(layoutFactory, publisher, filesystem, pathService);

  return {
    cache,
    artifact,
    publisher,
    layout,
  };
}
