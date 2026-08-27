// packages/governance/src/rules/compliance/governance-compliance-context.ts

import type {
  ArtifactComplianceStatus,
  ArtifactStateStatus,
  PackageDescriptor,
} from '@arch/platform-model';

export interface GovernanceComplianceContext {
  readonly artifact: PackageDescriptor;
  readonly artifactStatus?: ArtifactStateStatus;
  readonly complianceStatus?: ArtifactComplianceStatus;
}
