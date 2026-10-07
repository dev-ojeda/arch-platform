// packages\application\test\__tests__\publish-artifact.use-case.test.ts

import { describe, expect, it, vi } from 'vitest';

import type {
  PublicationArtifactContext,
  PublicationArtifactReader,
  PublicationEligibilityEvaluator,
} from '@arch-platform/platform-model';

import { PublishArtifactUseCase } from '../../src/use-cases/publish-artifact/publish-artifact.use-case.js';

const artifactHash = 'sha512-test-generator-mvc';
const artifactDistribution = {
  artifactRegistryStatus: 'not-registered' as const,
  artifact: 'arch-platform-generator-mvc-0.1.0.tgz',
  file: 'artifact/arch-platform-generator-mvc-0.1.0.tgz',
  packageName: '@arch-platform/generator-mvc',
  version: '0.1.0',
  integrityCalculated: true,
  integrityMatches: true,
  integrityResolved: true,
};
const publishableFixtureGenerator: PublicationArtifactContext = {
  artifact: '@arch-platform/generator-mvc',
  artifactHash,
  artifactStatus: 'cached',
  outputs: ['dist'],
  complianceStatus: 'approved',
  complianceApprovedHash: artifactHash,
  securityPreviousStatus: 'allowed',
  securityEvaluationStatus: 'secure',
  securityDecisionStatus: 'allowed',
  securityArtifactHash: artifactHash,
  artifactDistributionPrepared: artifactDistribution,
};
describe('PublishArtifactUseCase', () => {
  it('returns a successful result when publication state is eligible', async () => {
    const reader: PublicationArtifactReader = {
      read: vi.fn().mockResolvedValue(publishableFixtureGenerator),
    };
    const evaluator: PublicationEligibilityEvaluator = {
      evaluate: vi.fn().mockReturnValue({ status: 'eligible', reasons: [] }),
    };
    const useCase = new PublishArtifactUseCase(reader, evaluator);
    const result = await useCase.execute({
      artifact: '@arch-platform/generator-mvc',
      environment: 'dev',
    });
    expect(result).toEqual({
      success: true,
      durationMs: expect.any(Number),
      artifact: '@arch-platform/generator-mvc',
      version: '0.1.0',
      eligibility: { status: 'eligible', reasons: [] },
    });
    expect(reader.read).toHaveBeenCalledWith('dev', '@arch-platform/generator-mvc');
    expect(evaluator.evaluate).toHaveBeenCalledWith(publishableFixtureGenerator);
  });
  it('returns a blocked result when eligibility is blocked', async () => {
    const reader: PublicationArtifactReader = {
      read: vi.fn().mockResolvedValue(publishableFixtureGenerator),
    };
    const evaluator: PublicationEligibilityEvaluator = {
      evaluate: vi
        .fn()
        .mockReturnValue({ status: 'blocked', reasons: ['compliance-hash-mismatch'] }),
    };
    const useCase = new PublishArtifactUseCase(reader, evaluator);
    const result = await useCase.execute({
      environment: 'dev',
      artifact: '@arch-platform/generator-mvc',
    });
    expect(result).toEqual({
      success: false,
      durationMs: expect.any(Number),
      artifact: '@arch-platform/generator-mvc',
      version: '0.1.0',
      eligibility: { status: 'blocked', reasons: ['compliance-hash-mismatch'] },
    });
    expect(evaluator.evaluate).toHaveBeenCalledWith(publishableFixtureGenerator);
  });
  it('fails when publication state is unavailable', async () => {
    const reader: PublicationArtifactReader = { read: vi.fn().mockResolvedValue(undefined) };
    const evaluator: PublicationEligibilityEvaluator = { evaluate: vi.fn() };
    const useCase = new PublishArtifactUseCase(reader, evaluator);
    await expect(
      useCase.execute({ environment: 'dev', artifact: '@arch-platform/code-analysis' }),
    ).rejects.toThrow('Artifact "@arch-platform/code-analysis" publication state is unavailable');
    expect(evaluator.evaluate).not.toHaveBeenCalled();
  });
});
