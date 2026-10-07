import { describe, expect, it } from 'vitest';

import type { PublicationArtifactContext } from '@arch-platform/platform-model';

import { DefaultPublicationEligibilityEvaluator } from '../../src/use-cases/publish-artifact/default-publication-eligibility-evaluator.js';

const artifactHash = 'sha512-test-generator-mvc';
const staleHash = 'sha512-test-stale-generator-mvc';

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

const publishableContext: PublicationArtifactContext = {
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

describe('DefaultPublicationEligibilityEvaluator', () => {
  const evaluator = new DefaultPublicationEligibilityEvaluator();

  it('returns eligible when publication state is valid', () => {
    expect(evaluator.evaluate(publishableContext)).toEqual({
      status: 'eligible',
      reasons: [],
    });
  });

  it('blocks when compliance approval is stale', () => {
    expect(
      evaluator.evaluate({
        ...publishableContext,
        complianceApprovedHash: staleHash,
      }),
    ).toEqual({
      status: 'blocked',
      reasons: ['compliance-hash-mismatch'],
    });
  });

  it('blocks when security evaluation is stale', () => {
    expect(
      evaluator.evaluate({
        ...publishableContext,
        securityArtifactHash: staleHash,
      }),
    ).toEqual({
      status: 'blocked',
      reasons: ['security-hash-mismatch'],
    });
  });

  it('returns all applicable block reasons', () => {
    expect(
      evaluator.evaluate({
        ...publishableContext,
        complianceApprovedHash: staleHash,
        securityArtifactHash: staleHash,
      }),
    ).toEqual({
      status: 'blocked',
      reasons: ['compliance-hash-mismatch', 'security-hash-mismatch'],
    });
  });
});
