// packages/infrastructure/test/helpers/create-filesystem-artifact-cache-fixture.ts

import type { Mocked } from 'vitest';

import type {
  Artifact,
  ArtifactCache,
  ArtifactLayout,
  ArtifactOutputFingerprinterPort,
  ArtifactPublisher,
} from '@arch-platform/platform-model';

import { ArtifactOutputComparator } from '../../src/artifact/adapter/artifact-output-comparator.js';
import { FilesystemArtifactCache } from '../../src/artifact/adapter/filesystem-artifact-cache.js';

import { createMockArtifactOutputFingerprinter } from './create-artifact-output-fingerprint-fixtures.js';
import { createTestArtifact } from './create-artifact.js';
import { createMockArtifactLayoutFactory } from './create-mock-artifact-layout-factory.js';
import { createMockArtifactLayout } from './create-mock-artifact-layout.js';
import { createMockArtifactPublisher } from './create-mock-artifact-publisher.js';
import { createMockFilesystem } from './create-mock-filesystem.js';
import { createTestPathService } from './create-path-service.js';

export interface ArtifactCacheContractContext {
  readonly cache: ArtifactCache;
  readonly artifact: Artifact;
  readonly publisher: Mocked<ArtifactPublisher>;
  readonly layout: ArtifactLayout;
  readonly fingerprinter: Mocked<ArtifactOutputFingerprinterPort>;
}

export function createFilesystemArtifactCacheFixture(): ArtifactCacheContractContext {
  const artifact = createTestArtifact();
  const layout = createMockArtifactLayout('/cache/artifact');
  const filesystem = createMockFilesystem();
  const pathService = createTestPathService();
  const publisher = createMockArtifactPublisher();
  const layoutFactory = createMockArtifactLayoutFactory(layout);
  const fingerprinter = createMockArtifactOutputFingerprinter();
  const comparator = new ArtifactOutputComparator();

  const cache = new FilesystemArtifactCache(
    layoutFactory,
    publisher,
    filesystem,
    pathService,
    fingerprinter,
    comparator,
  );

  return {
    cache,
    artifact,
    publisher,
    layout,
    fingerprinter,
  };
}
