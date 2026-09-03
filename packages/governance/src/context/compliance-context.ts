// packages/governance/src/context/compliance-context.ts

import type {
  ArtifactState,
  ComplianceEnvironment,
  ComplianceState,
  WorkspaceDescriptor,
} from '@arch/platform-model';

import type { ComplianceScope } from '../public/compliance-scope.js';

export interface ComplianceContext {
  readonly workspace: WorkspaceDescriptor;
  readonly scope: ComplianceScope;
  readonly artifactStates: ReadonlyMap<string, ArtifactState>;
  readonly complianceStates: ComplianceState;
  readonly environment: ComplianceEnvironment;
}
