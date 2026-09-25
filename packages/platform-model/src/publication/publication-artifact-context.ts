// packages/platform-model/src/publication/publication-artifact-context.ts

import type { ArtifactStateStatus } from '../artifact/artifact-state.js';
import type { ArtifactComplianceStatus } from '../compliance/compliance-status.js';
import type { SecurityDecisionStatus } from '../security/security-decision-status.js';
import type { SecurityEvaluationStatus } from '../security/security-evaluation.js';

export interface PublicationArtifactContext {
  readonly artifact: string;

  readonly artifactHash: string;
  readonly artifactStatus: ArtifactStateStatus;

  readonly complianceStatus: ArtifactComplianceStatus;
  readonly complianceApprovedHash: string | undefined;

  readonly securityEvaluationStatus: SecurityEvaluationStatus;
  readonly securityDecisionStatus: SecurityDecisionStatus;
  readonly securityArtifactHash: string;
}
