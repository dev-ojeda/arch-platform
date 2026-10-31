// packages\infrastructure\test\__tests__\artifact\filesystem-artifact-publisher.test.ts

import { describe, expect, it, vi } from 'vitest';

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type { ArtifactManifest } from '@arch-platform/platform-model';

import { ArtifactPublisherAdapter } from '../../../src/artifact/adapter/artifact-publisher-adapter.js';
import { createArtifactLoyout } from '../../helpers/create-artifact-layout.js';
import { createTestPathService } from '../../helpers/create-path-service.js';

describe('ArtifactPublisherAdapter', () => {
  it('publishes the manifest and outputs using a temporary directory', async () => {
    const filesystem: FileSystemAsyncPort = {
      copy: vi.fn().mockResolvedValue(undefined),
      createDirectory: vi.fn().mockResolvedValue(undefined),
      exists: vi.fn().mockResolvedValue(false),
      read: vi.fn(),
      readJson: vi.fn(),
      readBuffer: vi.fn(),
      remove: vi.fn().mockResolvedValue(undefined),
      readDirectory: vi.fn().mockResolvedValue([]),
      rename: vi.fn().mockResolvedValue(undefined),
      write: vi.fn().mockResolvedValue(undefined),
      writeJson: vi.fn().mockResolvedValue(undefined),
    };

    const pathService = createTestPathService();

    const root = '/workspace';
    const artifactRoot = '/cache/artifact';
    const temporaryRoot = `${artifactRoot}.tmp`;

    const layout = createArtifactLoyout(artifactRoot);

    const manifest = {
      artifact: {
        packageName: '@arch-platform/example',
        id: 'test-artifact',
      },
      outputs: ['dist/index.js'],
      createdAt: 1,
      schemaVersion: 1,
    } as ArtifactManifest;

    const publisher = new ArtifactPublisherAdapter(filesystem, pathService);

    await publisher.publish(root, manifest, layout);

    expect(filesystem.remove).toHaveBeenNthCalledWith(1, temporaryRoot);
    expect(filesystem.createDirectory).toHaveBeenCalledWith(temporaryRoot);

    expect(filesystem.copy).toHaveBeenCalledWith(
      '/workspace/dist/index.js',
      '/cache/artifact.tmp/dist/index.js',
    );

    expect(filesystem.writeJson).toHaveBeenCalledWith(
      '/cache/artifact.tmp/manifest.json',
      manifest,
    );

    expect(filesystem.remove).toHaveBeenNthCalledWith(2, artifactRoot);
    expect(filesystem.rename).toHaveBeenCalledWith(temporaryRoot, artifactRoot);
  });
});
