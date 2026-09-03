// packages/governance/src/compliance/compliance-dependencies-context.ts

import type {
  ArtifactComplianceStatus,
  ArtifactState,
  HashResult,
  Layer,
} from '@arch/platform-model';

export interface ComplianceDependencyContext {
  readonly artifact: string;
  readonly artifactKind: Layer | undefined;
  readonly artifactType: ArtifactState['artifactType'] | undefined;
  readonly artifactStatus: ArtifactState['status'] | undefined;
  readonly artifactHash: HashResult | undefined;

  readonly complianceStatus: ArtifactComplianceStatus | undefined;
  readonly complianceEvaluatedHash: HashResult | undefined;
  readonly complianceApprovedHash: HashResult | undefined;
}
