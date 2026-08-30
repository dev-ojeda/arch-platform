// packages/governance/src/compliance/compliance-dependencies-context.ts

import type { ArtifactComplianceStatus, ArtifactState } from '@arch/platform-model';

export interface ComplianceDependencyContext {
  readonly artifact: string;
  readonly artifactType: ArtifactState['artifactType'] | undefined;
  readonly artifactStatus: ArtifactState['status'] | undefined;
  readonly complianceStatus: ArtifactComplianceStatus | undefined;
}
