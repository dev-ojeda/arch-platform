// packages/infrastructure/test/__tests__/inspect/filesystem-pack-reader.test.ts

import { describe, expect, it } from 'vitest';

import type {
  RegistryPublishedVersions,
  RegistryPublishedVersionsReader,
} from '@arch-platform/platform-model';

import { NodeAsyncFileSystemAdapter } from '../../../src/filesystem/adapters/node-async-filesystem-adapter.js';
import { FilesystemPackReader } from '../../../src/inspect/filesystem-pack-reader.js';
import { NodePackInspectAdapter } from '../../../src/inspect/node-pack-inspect-adapter.js';
import { FIXTURE_PATHS } from '../../fixture/fixture-paths.js';

describe('FilesystemPackReader', () => {
  it('inspecciona los artefactos tgz del workspace', async () => {
    const filesystem = new NodeAsyncFileSystemAdapter({
      root: FIXTURE_PATHS.archWorkspace,
    });

    const catalog: RegistryPublishedVersions = {
      schemaVersion: 1,
      registry: 'https://registry.npmjs.org',
      synchronizedAt: '2026-10-14T00:00:00.000Z',
      packages: [
        {
          packageName: '@arch-platform/contracts',
          'dist-tags': {
            latest: '0.2.1',
          },
          versions: {
            '0.2.1': {
              name: '@arch-platform/contracts',
              version: '0.2.1',
              dist: {
                integrity: 'sha512-test-integrity',
              },
            },
          },
        },
      ],
    };

    const registryReader: RegistryPublishedVersionsReader = {
      read: async (artifact) => (artifact === '@arch-platform/contracts' ? catalog : undefined),
    };

    const reader = new FilesystemPackReader(
      filesystem,
      new NodePackInspectAdapter(),
      registryReader,
    );

    const result = await reader.read(
      'artifacts/@arch-platform/contracts/0.2.1/arch-platform-contracts-0.2.1.tgz',
    );

    expect(result.artifact).toBe('arch-platform-contracts-0.2.1.tgz');
    expect(result.size).toBeGreaterThan(0);
    expect(result.package.name).toBe('@arch-platform/contracts');
    expect(result.package.version).toBe('0.2.1');
    expect(result.integrity.calculated).toMatch(/^sha512-/);
    expect(result.integrity.expected).toBe('sha512-test-integrity');
    expect(result.integrity.matches).toBe(false);
    expect(result.artifactRegistryStatus).toBe('registered');
  });
});
