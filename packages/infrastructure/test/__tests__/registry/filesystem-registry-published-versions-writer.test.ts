import { describe, expect, it, vi } from 'vitest';

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type {
  RegistryPublishedVersions,
  RegistryPublishedVersionsPreparedState,
} from '@arch-platform/platform-model';

import { FilesystemRegistryPublishedVersionsWriter } from '../../../src/registry/filesystem-registry-published-versions-writer.js';

const directory = '/.arch-platform/registry';
const path = `${directory}/registry-state.json`;

const contracts: RegistryPublishedVersions = {
  schemaVersion: 1,
  registry: 'https://registry.npmjs.org',
  synchronizedAt: '2026-10-13T00:00:00.000Z',
  packages: [
    {
      packageName: '@arch-platform/contracts',
      'dist-tags': { latest: '1.0.0' },
      versions: {
        '1.0.0': {
          name: '@arch-platform/contracts',
          version: '1.0.0',
        },
      },
    },
  ],
};

const generator: RegistryPublishedVersions = {
  schemaVersion: 1,
  registry: 'https://registry.npmjs.org',
  synchronizedAt: '2026-10-13T00:00:00.000Z',
  packages: [
    {
      packageName: '@arch-platform/generator-mvc',
      'dist-tags': { latest: '2.0.0' },
      versions: {
        '2.0.0': {
          name: '@arch-platform/generator-mvc',
          version: '2.0.0',
        },
      },
    },
  ],
};

describe('FilesystemRegistryPublishedVersionsWriter', () => {
  function createWriter(initialState: RegistryPublishedVersionsPreparedState) {
    const filesystem = {
      createDirectory: vi.fn().mockResolvedValue(undefined),
      writeJson: vi.fn().mockResolvedValue(undefined),
    };

    const writer = new FilesystemRegistryPublishedVersionsWriter(
      initialState,
      filesystem as unknown as FileSystemAsyncPort,
    );

    return { filesystem, writer };
  }

  it('should expose the initial state', () => {
    const initialState: RegistryPublishedVersionsPreparedState = {
      schemaVersion: 1,
      artifacts: {
        '@arch-platform/contracts': contracts,
      },
    };

    const { writer } = createWriter(initialState);

    expect(writer.getState()).toEqual(initialState);
  });

  it('should add a catalog without removing existing catalogs', () => {
    const initialState: RegistryPublishedVersionsPreparedState = {
      schemaVersion: 1,
      artifacts: {
        '@arch-platform/contracts': contracts,
      },
    };

    const { writer } = createWriter(initialState);

    writer.apply('@arch-platform/generator-mvc', generator);

    expect(writer.getState()).toEqual({
      schemaVersion: 1,
      artifacts: {
        '@arch-platform/contracts': contracts,
        '@arch-platform/generator-mvc': generator,
      },
    });
  });

  it('should replace the catalog for an existing artifact', () => {
    const { writer } = createWriter({
      schemaVersion: 1,
      artifacts: {
        '@arch-platform/contracts': contracts,
      },
    });

    writer.apply('@arch-platform/contracts', generator);

    expect(writer.getState().artifacts['@arch-platform/contracts']).toEqual(generator);
  });

  it('should create the directory and persist the state', async () => {
    const { filesystem, writer } = createWriter({
      schemaVersion: 1,
      artifacts: {},
    });

    writer.apply('@arch-platform/contracts', contracts);
    writer.apply('@arch-platform/generator-mvc', generator);

    await writer.write();

    expect(filesystem.createDirectory).toHaveBeenCalledWith(directory);
    expect(filesystem.writeJson).toHaveBeenCalledWith(path, {
      schemaVersion: 1,
      artifacts: {
        '@arch-platform/contracts': contracts,
        '@arch-platform/generator-mvc': generator,
      },
    });
  });
});
