// packages/governance/src/context/compliance-artifact-context.ts

import type {
  ArtifactComplianceStatus,
  ArtifactState,
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
  readonly complianceHash: HashResult | undefined;

  readonly dependencies: readonly ComplianceDependencyContext[];
}
