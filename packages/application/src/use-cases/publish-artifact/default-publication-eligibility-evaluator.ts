// packages/application/src/use-cases/publish-artifact/default-publication-eligibility-evaluator.ts

import type {
  PublicationArtifactContext,
  PublicationBlockReason,
  PublicationEligibility,
  PublicationEligibilityEvaluator,
} from '@arch-platform/platform-model';

export class DefaultPublicationEligibilityEvaluator implements PublicationEligibilityEvaluator {
  public evaluate(context: PublicationArtifactContext): PublicationEligibility {
    const reasons: PublicationBlockReason[] = [];

    // 1. Compliance
    if (context.complianceStatus !== 'approved') {
      reasons.push('compliance-not-approved');
    }

    if (context.complianceApprovedHash && context.complianceApprovedHash !== context.artifactHash) {
      reasons.push('compliance-hash-mismatch');
    }

    // 2. Security
    if (context.securityEvaluationStatus !== 'secure') {
      reasons.push('security-not-secure');
    }

    if (context.securityDecisionStatus !== 'allowed') {
      reasons.push('security-not-allowed');
    }

    if (context.securityArtifactHash !== context.artifactHash) {
      reasons.push('security-hash-mismatch');
    }

    // 3. Artifact state
    if (context.artifactStatus !== 'cached' && context.artifactStatus !== 'built') {
      reasons.push('artifact-state-unavailable');
    }

    return {
      status: reasons.length === 0 ? 'eligible' : 'blocked',
      reasons,
    };
  }
}
