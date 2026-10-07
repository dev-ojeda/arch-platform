// packages\infrastructure\test\__tests__\inspect\filesystem-pack-reader.test.ts

import { describe, expect, it } from 'vitest';

import type { ArtifactRegistryPublishingReader } from '@arch-platform/platform-model';

import { NodeAsyncFileSystemAdapter } from '../../../src/filesystem/adapters/node-async-filesystem-adapter.js';
import { FilesystemPackReader } from '../../../src/inspect/filesystem-pack-reader.js';
import { NodePackInspectAdapter } from '../../../src/inspect/node-pack-inspect-adapter.js';
import { FIXTURE_PATHS } from '../../fixture/fixture-paths.js';

describe('FilesystemPackReader', () => {
  it('inspecciona los artefactos tgz del workspace', async () => {
    const filesystem = new NodeAsyncFileSystemAdapter({
      root: FIXTURE_PATHS.archWorkspace,
    });

    const registryReader: ArtifactRegistryPublishingReader = {
      find: async (packageName, version) => {
        if (packageName === '@arch-platform/contracts' && version === '0.1.0') {
          return {
            packageName,
            version,
            integrity: 'sha512-test-integrity',
          };
        }

        return undefined;
      },
    };

    const reader = new FilesystemPackReader(
      filesystem,
      new NodePackInspectAdapter(),
      registryReader,
    );

    const result = await reader.read('artifacts');

    expect(result).toHaveLength(2);

    const inspection = result.find((item) => item.package.name === '@arch-platform/contracts');

    if (!inspection) {
      throw new Error('Expected contracts artifact inspection');
    }

    expect(inspection.artifact).toBe('arch-platform-contracts-0.1.0.tgz');
    expect(inspection.size).toBeGreaterThan(0);
    expect(inspection.package.version).toBe('0.1.0');
    expect(inspection.package.filesInside).toContain('package/package.json');

    expect(inspection.integrity.calculated).toMatch(/^sha512-/);
    expect(inspection.integrity.expected).toBe('sha512-test-integrity');
    expect(inspection.integrity.matches).toBe(false);
    expect(inspection.artifactRegistryStatus).toBe('registered');
  });
});
