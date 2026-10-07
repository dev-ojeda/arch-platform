// packages\infrastructure\test\__tests__\distribution\filesystem-artifact-distribution-prepared-reader.test.ts
import { describe, expect, it } from 'vitest';

import { ArtifactDistributionPreparedProvider } from '@arch-platform/infrastructure';

import { FIXTURE_PATHS } from '../../fixture/fixture-paths.js';

describe('FilesystemArtifactDistributionReader', () => {
  it('reads the distribution context for an artifact', async () => {
    const provider = new ArtifactDistributionPreparedProvider();

    const reader = provider.createReaderForWorkspace(FIXTURE_PATHS.archWorkspace);

    const result = await reader.read('@arch-platform/contracts');

    expect(result).toEqual({
      artifactRegistryStatus: 'registered',
      artifact: 'arch-platform-contracts-0.1.0.tgz',
      file: 'artifacts/arch-platform-contracts-0.1.0.tgz',
      packageName: '@arch-platform/contracts',
      version: '0.1.0',
      integrityCalculated: true,
      integrityMatches: true,
      integrityResolved: true,
    });
  });

  it('returns undefined when the artifact is not prepared', async () => {
    const provider = new ArtifactDistributionPreparedProvider();

    const reader = provider.createReaderForWorkspace(FIXTURE_PATHS.archWorkspace);

    const result = await reader.read('unknown-artifact-0.1.0.tgz');

    expect(result).toBeUndefined();
  });
});
