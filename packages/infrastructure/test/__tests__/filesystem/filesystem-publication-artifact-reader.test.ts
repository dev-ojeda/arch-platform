import { describe, expect, it } from 'vitest';

import { PublicationArtifactProvider } from '@arch-platform/infrastructure';
import type { ComplianceEnvironment } from '@arch-platform/platform-model';

import { FIXTURE_PATHS } from '../../fixture/fixture-paths.js';

describe('FilesystemPublicationArtifactReader', () => {
  const reader = new PublicationArtifactProvider().createReader(FIXTURE_PATHS.archWorkspace);
  const environment: ComplianceEnvironment = 'dev';
  it('reads the publication context for an artifact', async () => {
    const context = await reader.read(environment, '@arch-platform/code-analysis');
    expect(context).toMatchObject({
      artifact: '@arch-platform/code-analysis',
      artifactHash: 'artifact-hash-001',
      artifactStatus: 'built',
      outputs: ['dist'],
      complianceStatus: 'approved',
      complianceApprovedHash: 'artifact-hash-001',
      securityPreviousStatus: 'blocked',
      securityEvaluationStatus: 'blocked',
      securityDecisionStatus: 'blocked',
      securityArtifactHash: 'artifact-hash-001',
      artifactDistributionPrepared: {
        artifactRegistryStatus: 'not-registered',
        artifact: 'arch-platform-code-analysis-0.1.0.tgz',
        file: 'artifacts/arch-platform-code-analysis-0.1.0.tgz',
        packageName: '@arch-platform/code-analysis',
        version: '0.1.0',
        integrityCalculated: true,
        integrityResolved: false,
      },
    });

    expect(context?.artifactDistributionPrepared.integrityMatches).toBeUndefined();
  });

  it('returns undefined when the artifact does not exist', async () => {
    const context = await reader.read(environment, '@arch-platform/does-not-exist');

    expect(context).toBeUndefined();
  });
});
