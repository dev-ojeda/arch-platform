// packages/governance/src/context/compliance-artifact-context.ts

import type {
  ArtifactComplianceStatus,
  ArtifactState,
  ComplianceEnvironment,
  HashResult,
  Layer,
  WorkspaceDescriptor,
} from '@arch/platform-model';

import type { ComplianceDependencyContext } from '../compliance/compliance-dependencies-context.js';

export interface ComplianceArtifactContext {
  readonly artifact: WorkspaceDescriptor['packages'][number];
  readonly artifactKind: Layer | undefined;
  readonly artifactType: ArtifactState['artifactType'] | undefined;
  readonly artifactStatus: ArtifactState['status'] | undefined;
  readonly artifactHash: HashResult | undefined;

  readonly complianceStatus: ArtifactComplianceStatus | undefined;
  readonly complianceEvaluatedHash: HashResult | undefined;
  readonly complianceApprovedHash: HashResult | undefined;

  readonly environment: ComplianceEnvironment;
  readonly dependencies: readonly ComplianceDependencyContext[];
}
