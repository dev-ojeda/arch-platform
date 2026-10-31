import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type {
  RegistryPublishedVersions,
  RegistryPublishedVersionsPreparedState,
} from '@arch-platform/platform-model';

import { FilesystemRegistryPublishedVersionsReader } from '../../../src/registry/filesystem-registry-published-versions-reader.js';

const path = '/.arch-platform/registry/registry-state.json';

const contracts: RegistryPublishedVersions = {
  schemaVersion: 1,
  registry: 'https://registry.npmjs.org',
  synchronizedAt: '2026-10-13T00:00:00.000Z',
  package: {
    packageName: '@arch-platform/contracts',
    'dist-tags': { latest: '1.0.0' },
    versions: {
      '1.0.0': {
        name: '@arch-platform/contracts',
        version: '1.0.0',
      },
    },
  },
};

const generator: RegistryPublishedVersions = {
  schemaVersion: 1,
  registry: 'https://registry.npmjs.org',
  synchronizedAt: '2026-10-13T00:00:00.000Z',
  package: {
    packageName: '@arch-platform/generator-mvc',
    'dist-tags': { latest: '2.0.0' },
    versions: {
      '2.0.0': {
        name: '@arch-platform/generator-mvc',
        version: '2.0.0',
      },
    },
  },
};

describe('FilesystemRegistryPublishedVersionsReader', () => {
  let filesystem: {
    exists: ReturnType<typeof vi.fn>;
    readJson: ReturnType<typeof vi.fn>;
  };

  let reader: FilesystemRegistryPublishedVersionsReader;

  beforeEach(() => {
    filesystem = {
      exists: vi.fn(),
      readJson: vi.fn(),
    };

    reader = new FilesystemRegistryPublishedVersionsReader(
      filesystem as unknown as FileSystemAsyncPort,
    );
  });

  it('should read the catalog for the requested artifact', async () => {
    const state: RegistryPublishedVersionsPreparedState = {
      schemaVersion: 1,
      artifacts: {
        '@arch-platform/contracts': contracts,
        '@arch-platform/generator-mvc': generator,
      },
    };

    filesystem.exists.mockResolvedValue(true);
    filesystem.readJson.mockResolvedValue(state);

    await expect(reader.read('@arch-platform/contracts')).resolves.toEqual(contracts);

    expect(filesystem.readJson).toHaveBeenCalledWith(path);
  });

  it('should return undefined when the artifact does not exist', async () => {
    filesystem.exists.mockResolvedValue(true);
    filesystem.readJson.mockResolvedValue({
      schemaVersion: 1,
      artifacts: {
        '@arch-platform/contracts': contracts,
      },
    });

    await expect(reader.read('@arch-platform/unknown')).resolves.toBeUndefined();
  });

  it('should return undefined when the state file does not exist', async () => {
    filesystem.exists.mockResolvedValue(false);

    await expect(reader.read('@arch-platform/contracts')).resolves.toBeUndefined();

    expect(filesystem.readJson).not.toHaveBeenCalled();
  });
});
