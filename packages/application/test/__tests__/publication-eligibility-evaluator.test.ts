import { describe, expect, it } from 'vitest';

import { DefaultPublicationEligibilityEvaluator } from '@arch-platform/application';
import type { PublicationArtifactContext } from '@arch-platform/platform-model';

const artifactHash = 'sha512-test-generator-mvc';
const staleHash = 'sha512-test-stale-generator-mvc';

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
