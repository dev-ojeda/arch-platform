// packages/build-core/test/__tests__/artifact/filesystem-artifact-publisher.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ArtifactLayout } from '../../../src/artifact/artifact-layout.js';
import type { ArtifactManifest } from '../../../src/artifact/artifact-manifest.js';
import { FilesystemArtifactPublisher } from '../../../src/artifact/publisher/filesystem-artifact-publisher.js';
import {
  copyPath,
  ensureDir,
  removePath,
  renamePath,
  writeJsonFile,
} from '../../../src/fs/fs-async.js';
import { joinPath } from '../../../src/fs/path-utils.js';

vi.mock('../../../src/fs/fs-async.js');

describe('FilesystemArtifactPublisher', () => {
  const manifest: ArtifactManifest = {
    artifact: {
      packageName: '@arch/build-core',
      id: 'artifact-id',
    },
    outputs: ['dist/index.js', 'dist/index.d.ts'],
    createdAt: 1,
    schemaVersion: 1,
  };

  const temporaryLayout: ArtifactLayout = {
    root: '/cache/tmp',
    manifest: () => '/cache/tmp/manifest.json',
    output: (output: string) => `/cache/tmp/${output}`,
    temporary: vi.fn(),
  };

  const layout: ArtifactLayout = {
    root: '/cache/artifact',
    manifest: () => '/cache/artifact/manifest.json',
    output: (output: string) => `/cache/artifact/${output}`,
    temporary: () => temporaryLayout,
  };

  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(temporaryLayout.temporary).mockReturnValue(temporaryLayout);
  });

  it('should publish artifact using temporary layout and replace destination', async () => {
    const publisher = new FilesystemArtifactPublisher();

    await publisher.publish('/workspace', manifest, layout);

    expect(removePath).toHaveBeenCalledWith('/cache/tmp');

    expect(ensureDir).toHaveBeenCalledWith('/cache/tmp');

    expect(copyPath).toHaveBeenCalledTimes(2);

    expect(copyPath).toHaveBeenCalledWith(
      joinPath('/workspace', 'dist/index.js'),
      '/cache/tmp/dist/index.js',
      {
        force: true,
        recursive: true,
      },
    );

    expect(writeJsonFile).toHaveBeenCalledWith('/cache/tmp/manifest.json', manifest);

    expect(removePath).toHaveBeenCalledWith('/cache/artifact');

    expect(renamePath).toHaveBeenCalledWith('/cache/tmp', '/cache/artifact');
  });

  it('should cleanup temporary layout when publishing fails', async () => {
    vi.mocked(copyPath).mockRejectedValue(new Error('copy failed'));

    const publisher = new FilesystemArtifactPublisher();

    await expect(publisher.publish('/workspace', manifest, layout)).rejects.toThrow('copy failed');

    expect(removePath).toHaveBeenLastCalledWith('/cache/tmp');
  });
});
