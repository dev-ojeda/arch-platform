// packages/build-core/test/__tests__/artifact/filesystem-artifact-cache.test.ts

import { describe, expect, it, vi } from 'vitest';

import type { ArtifactLayoutFactory } from '../../../src/artifact/artifact-layout-factory.js';
import type { ArtifactLayout } from '../../../src/artifact/artifact-layout.js';
import { readArtifactManifest } from '../../../src/artifact/artifact-reader.js';
import { FilesystemArtifactCache } from '../../../src/artifact/filesystem-artifact-cache.js';
import type { ArtifactPublisher } from '../../../src/artifact/publisher/artifact-publisher.js';
import { copyPath } from '../../../src/fs/fs-async.js';
import { joinPath } from '../../../src/fs/path-utils.js';
import { createArtifactManifest } from '../../helpers/artifact-manifest.js';

vi.mock('../../../src/artifact/artifact-reader.js');
vi.mock('../../../src/fs/fs-async.js');

describe('FilesystemArtifactCache', () => {
  const artifact = {
    packageName: '@arch/build-core',
    id: 'artifact-id',
  };

  const layout: ArtifactLayout = {
    root: '/cache/artifact',
    manifest: () => '/cache/artifact/manifest.json',
    output: (path: string) => `/cache/artifact/${path}`,
    temporary: vi.fn(),
  };

  function createCache() {
    const layoutFactory: ArtifactLayoutFactory = {
      create: vi.fn().mockReturnValue(layout),
    };

    const publisher: ArtifactPublisher = {
      publish: vi.fn(),
    };

    return {
      cache: new FilesystemArtifactCache(layoutFactory, publisher),
      layoutFactory,
      publisher,
    };
  }

  it('should publish artifact manifest when saving', async () => {
    const { cache, publisher } = createCache();

    await cache.save(artifact, '/workspace', ['dist/index.js']);

    expect(publisher.publish).toHaveBeenCalledWith(
      '/workspace',
      expect.objectContaining({
        artifact,
        outputs: ['dist/index.js'],
        schemaVersion: 1,
      }),
      layout,
    );
  });

  it('should return false when manifest does not exist during restore', async () => {
    vi.mocked(readArtifactManifest).mockResolvedValue(undefined);

    const { cache } = createCache();

    const result = await cache.restore(artifact, '/workspace');

    expect(result).toBe(false);

    expect(copyPath).not.toHaveBeenCalled();
  });

  it('should restore artifact outputs when manifest exists', async () => {
    vi.mocked(readArtifactManifest).mockResolvedValue(
      createArtifactManifest({
        outputs: ['dist/index.js'],
      }),
    );

    const { cache } = createCache();

    const result = await cache.restore(artifact, '/workspace');

    expect(result).toBe(true);

    expect(copyPath).toHaveBeenCalledWith(
      '/cache/artifact/dist/index.js',
      joinPath('/workspace', 'dist/index.js'),
      {
        force: true,
        recursive: true,
      },
    );
  });

  it('should return false when restoring output fails', async () => {
    vi.mocked(readArtifactManifest).mockResolvedValue(
      createArtifactManifest({
        outputs: ['dist/index.js'],
      }),
    );

    vi.mocked(copyPath).mockRejectedValue(new Error('copy failed'));

    const { cache } = createCache();

    const result = await cache.restore(artifact, '/workspace');

    expect(result).toBe(false);
  });
});
