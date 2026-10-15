import { describe, expect, it } from 'vitest';

import { RegistryPublishedVersionsProvider } from '@arch-platform/infrastructure';
import type {
  RegistryPublishedVersions,
  RegistryPublishedVersionsPreparedState,
} from '@arch-platform/platform-model';
import { createTestFilesystemRoot } from '@arch-platform/testing';

import { NodeAsyncFileSystemAdapter } from '../../../src/filesystem/adapters/node-async-filesystem-adapter.js';
import { FIXTURE_PATHS } from '../../fixture/fixture-paths.js';

describe('RegistryPublishedVersionsProvider', () => {
  it('reads the published versions catalog for an artifact', async () => {
    const provider = new RegistryPublishedVersionsProvider();

    const reader = provider.createReaderForWorkspace(FIXTURE_PATHS.archWorkspace);

    const result = await reader.read('@arch-platform/contracts');

    expect(result?.packages[0]).toMatchObject({
      packageName: '@arch-platform/contracts',
      'dist-tags': {
        latest: '0.2.1',
      },
      versions: {
        '0.1.0': {
          name: '@arch-platform/contracts',
          version: '0.1.0',
        },
        '0.2.1': {
          name: '@arch-platform/contracts',
          version: '0.2.1',
        },
      },
    });
  });

  it('returns undefined when the artifact is not in the registry state', async () => {
    const provider = new RegistryPublishedVersionsProvider();

    const reader = provider.createReaderForWorkspace(FIXTURE_PATHS.archWorkspace);

    const result = await reader.read('@arch-platform/unknown');

    expect(result).toBeUndefined();
  });
  it('creates a writer that preserves existing catalogs when updating one artifact', async () => {
    const root = createTestFilesystemRoot('registry-published-versions-provider');
    const filesystem = new NodeAsyncFileSystemAdapter({ root });

    const contracts: RegistryPublishedVersions = {
      schemaVersion: 1,
      registry: 'https://registry.npmjs.org',
      synchronizedAt: '2026-10-13T00:00:00.000Z',
      packages: [
        {
          packageName: '@arch-platform/contracts',
          'dist-tags': { latest: '0.2.1' },
          versions: {
            '0.2.1': {
              name: '@arch-platform/contracts',
              version: '0.2.1',
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
          'dist-tags': { latest: '0.1.0' },
          versions: {
            '0.1.0': {
              name: '@arch-platform/generator-mvc',
              version: '0.1.0',
            },
          },
        },
      ],
    };

    await filesystem.writeJson('/.arch-platform/registry/registry-state.json', {
      schemaVersion: 1,
      artifacts: {
        '@arch-platform/contracts': contracts,
        '@arch-platform/generator-mvc': generator,
      },
    });

    const provider = new RegistryPublishedVersionsProvider();
    const writer = await provider.createWriterForWorkspace(root);

    const updatedContracts: RegistryPublishedVersions = {
      ...contracts,
      synchronizedAt: '2026-10-13T12:00:00.000Z',
      packages: [
        {
          ...contracts.packages[0],
          'dist-tags': { latest: '0.2.2' },
          versions: {
            ...contracts.packages[0].versions,
            '0.2.2': {
              name: '@arch-platform/contracts',
              version: '0.2.2',
            },
          },
        },
      ],
    };

    writer.apply('@arch-platform/contracts', updatedContracts);
    await writer.write();

    const state = await filesystem.readJson<RegistryPublishedVersionsPreparedState>(
      '/.arch-platform/registry/registry-state.json',
    );

    expect(state.artifacts['@arch-platform/contracts']).toEqual(updatedContracts);
    expect(state.artifacts['@arch-platform/generator-mvc']).toEqual(generator);
  });
});
