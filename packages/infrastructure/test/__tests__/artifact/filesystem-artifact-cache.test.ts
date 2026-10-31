// packages\infrastructure\test\__tests__\artifact\filesystem-artifact-cache.test.ts

import { describe, expect, it, vi } from 'vitest';

import { ArtifactOutputComparator } from '../../../src/artifact/adapter/artifact-output-comparator.js';
import { FilesystemArtifactCache } from '../../../src/artifact/adapter/filesystem-artifact-cache.js';
import { createMockArtifactOutputFingerprinter } from '../../helpers/create-artifact-output-fingerprint-fixtures.js';
import { createTestArtifact } from '../../helpers/create-artifact.js';
import { createMockArtifactLayoutFactory } from '../../helpers/create-mock-artifact-layout-factory.js';
import { createMockArtifactLayout } from '../../helpers/create-mock-artifact-layout.js';
import { createMockArtifactPublisher } from '../../helpers/create-mock-artifact-publisher.js';
import { createMockFilesystem } from '../../helpers/create-mock-filesystem.js';
import { createTestPathService } from '../../helpers/create-path-service.js';

describe('FilesystemArtifactCache', () => {
  it('should publish artifact manifest when saving an artifact', async () => {
    const artifact = createTestArtifact();
    const filesystem = createMockFilesystem();
    const publisher = createMockArtifactPublisher();
    const pathService = createTestPathService();
    const layout = createMockArtifactLayout();
    const fingerprinter = createMockArtifactOutputFingerprinter();
    const comparator = new ArtifactOutputComparator();
    const layoutFactory = createMockArtifactLayoutFactory(layout);

    const cache = new FilesystemArtifactCache(
      layoutFactory,
      publisher,
      filesystem,
      pathService,
      fingerprinter,
      comparator,
    );

    const outputs = ['dist/index.js'];

    await cache.save(artifact, '/workspace', outputs);

    expect(vi.mocked(publisher.publish)).toHaveBeenCalledWith(
      '/workspace',
      expect.objectContaining({
        artifact,
        outputs,
      }),
      layout,
    );
  });
});
