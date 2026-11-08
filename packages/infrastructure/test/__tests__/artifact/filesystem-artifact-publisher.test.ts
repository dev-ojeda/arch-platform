// packages\infrastructure\test\__tests__\artifact\filesystem-artifact-publisher.test.ts

import { describe, expect, it, vi } from 'vitest';

import type { ArtifactManifest } from '@arch-platform/platform-model';

import { ArtifactPublisherAdapter } from '../../../src/artifact/adapter/artifact-publisher-adapter.js';
import { createArtifactLoyout } from '../../helpers/create-artifact-layout.js';
import { createFilesystem } from '../../helpers/create-filesystem-fixture.js';
import { createTestPathService } from '../../helpers/create-path-service.js';

describe('ArtifactPublisherAdapter', () => {
  it('publishes the manifest and outputs using a temporary directory', async () => {
    const filesystem = createFilesystem();
    const pathService = createTestPathService();

    const root = '/workspace';
    const artifactRoot = '/cache/artifact';
    const temporaryRoot = `${artifactRoot}.tmp`;
    const backupRoot = `${artifactRoot}.backup`;

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

    // Recovery.
    expect(filesystem.exists).toHaveBeenNthCalledWith(1, artifactRoot);
    expect(filesystem.exists).toHaveBeenNthCalledWith(2, backupRoot);

    // Prepare temporary publication.
    expect(filesystem.remove).toHaveBeenCalledTimes(1);
    expect(filesystem.remove).toHaveBeenCalledWith(temporaryRoot);
    expect(filesystem.createDirectory).toHaveBeenCalledWith(temporaryRoot);

    // Copy outputs and write manifest.
    expect(filesystem.copy).toHaveBeenCalledWith(
      '/workspace/dist/index.js',
      '/cache/artifact.tmp/dist/index.js',
    );

    expect(filesystem.writeJson).toHaveBeenCalledWith(
      '/cache/artifact.tmp/manifest.json',
      manifest,
    );

    // First publication: no previous artifact exists.
    expect(filesystem.exists).toHaveBeenNthCalledWith(3, artifactRoot);
    expect(filesystem.rename).toHaveBeenCalledTimes(1);
    expect(filesystem.rename).toHaveBeenCalledWith(temporaryRoot, artifactRoot);
  });

  it('replaces an existing publication using a backup', async () => {
    const filesystem = createFilesystem();
    const pathService = createTestPathService();

    const root = '/workspace';
    const artifactRoot = '/cache/artifact';
    const temporaryRoot = `${artifactRoot}.tmp`;
    const backupRoot = `${artifactRoot}.backup`;

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

    vi.mocked(filesystem.exists)
      .mockResolvedValueOnce(true) // recover: publication exists
      .mockResolvedValueOnce(false) // recover: backup does not exist
      .mockResolvedValueOnce(true); // publication check before replacement

    const publisher = new ArtifactPublisherAdapter(filesystem, pathService);

    await publisher.publish(root, manifest, layout);

    // Recovery.
    expect(filesystem.exists).toHaveBeenNthCalledWith(1, artifactRoot);
    expect(filesystem.exists).toHaveBeenNthCalledWith(2, backupRoot);

    // Existing publication is moved to backup.
    expect(filesystem.rename).toHaveBeenNthCalledWith(1, artifactRoot, backupRoot);

    // Temporary publication becomes the new artifact.
    expect(filesystem.rename).toHaveBeenNthCalledWith(2, temporaryRoot, artifactRoot);

    // Previous publication is removed after successful replacement.
    expect(filesystem.remove).toHaveBeenCalledWith(backupRoot);
  });

  it('restores the previous publication when the new publication fails', async () => {
    const filesystem = createFilesystem();
    const pathService = createTestPathService();

    const root = '/workspace';
    const artifactRoot = '/cache/artifact';
    const temporaryRoot = `${artifactRoot}.tmp`;
    const backupRoot = `${artifactRoot}.backup`;

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

    const publishError = new Error('Failed to publish temporary artifact');

    vi.mocked(filesystem.exists)
      .mockResolvedValueOnce(true) // recover: publication exists
      .mockResolvedValueOnce(false) // recover: backup does not exist
      .mockResolvedValueOnce(true); // publication check

    vi.mocked(filesystem.rename)
      .mockResolvedValueOnce(undefined) // artifact -> backup
      .mockRejectedValueOnce(publishError) // temp -> artifact
      .mockResolvedValueOnce(undefined); // backup -> artifact (rollback)

    const publisher = new ArtifactPublisherAdapter(filesystem, pathService);

    await expect(publisher.publish(root, manifest, layout)).rejects.toBe(publishError);

    expect(filesystem.rename).toHaveBeenNthCalledWith(1, artifactRoot, backupRoot);

    expect(filesystem.rename).toHaveBeenNthCalledWith(2, temporaryRoot, artifactRoot);

    expect(filesystem.rename).toHaveBeenNthCalledWith(3, backupRoot, artifactRoot);

    expect(filesystem.remove).toHaveBeenCalledWith(temporaryRoot);
    expect(filesystem.remove).not.toHaveBeenCalledWith(backupRoot);
  });
  it('throws an AggregateError when publication and rollback fail', async () => {
    const filesystem = createFilesystem();
    const pathService = createTestPathService();

    const root = '/workspace';
    const artifactRoot = '/cache/artifact';
    const temporaryRoot = `${artifactRoot}.tmp`;
    const backupRoot = `${artifactRoot}.backup`;

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

    const publishError = new Error('Publication failed');
    const rollbackError = new Error('Rollback failed');

    vi.mocked(filesystem.exists)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    vi.mocked(filesystem.rename)
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(publishError)
      .mockRejectedValueOnce(rollbackError);

    const publisher = new ArtifactPublisherAdapter(filesystem, pathService);

    let actualError: unknown;

    try {
      await publisher.publish(root, manifest, layout);
    } catch (error) {
      actualError = error;
    }

    expect(actualError).toBeInstanceOf(AggregateError);

    expect((actualError as AggregateError).errors).toEqual([publishError, rollbackError]);

    expect(filesystem.rename).toHaveBeenNthCalledWith(1, artifactRoot, backupRoot);

    expect(filesystem.rename).toHaveBeenNthCalledWith(2, temporaryRoot, artifactRoot);

    expect(filesystem.rename).toHaveBeenNthCalledWith(3, backupRoot, artifactRoot);

    // Do not delete the backup or temporary directory after rollback failure.

    expect(filesystem.remove).toHaveBeenCalledTimes(1);
    expect(filesystem.remove).toHaveBeenCalledWith(temporaryRoot);
    expect(filesystem.remove).not.toHaveBeenCalledWith(backupRoot);
  });

  it('recovers the previous publication after an interrupted replacement', async () => {
    const filesystem = createFilesystem();
    const pathService = createTestPathService();

    const root = '/workspace';
    const artifactRoot = '/cache/artifact';
    const temporaryRoot = `${artifactRoot}.tmp`;
    const backupRoot = `${artifactRoot}.backup`;

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

    // Simulate an interrupted publication:
    // artifact does not exist, but backup and temporary directories do.
    vi.mocked(filesystem.exists)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true);

    await publisher.publish(root, manifest, layout);

    // Recover the previous publication.
    expect(filesystem.rename).toHaveBeenNthCalledWith(1, backupRoot, artifactRoot);

    // Remove the temporary directory left by the interrupted publication.
    expect(filesystem.remove).toHaveBeenCalledWith(temporaryRoot);

    // Prepare and publish the new artifact.
    expect(filesystem.createDirectory).toHaveBeenCalledWith(temporaryRoot);

    expect(filesystem.writeJson).toHaveBeenCalledWith(`${temporaryRoot}/manifest.json`, manifest);

    expect(filesystem.rename).toHaveBeenNthCalledWith(2, artifactRoot, backupRoot);

    expect(filesystem.rename).toHaveBeenNthCalledWith(3, temporaryRoot, artifactRoot);

    // The previous backup is removed after successful publication.
    expect(filesystem.remove).toHaveBeenCalledWith(backupRoot);
  });
});
