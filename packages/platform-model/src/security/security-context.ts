// packages/platform-model/src/security/security-context.ts

import type { DependencyLockfile } from '../dependency/dependency-lock-file.js';
import type { PackageDescriptor } from '../package/package-descriptor.js';
import type { WorkspaceDescriptor } from '../workspace/workspace-descriptor.js';

import type { SecurityAdvisory } from './security-advisory.js';
import type { SecurityComplianceArtifact } from './security-compliance-artifact.js';
import type { SecurityScope } from './security-scope.js';
import type { SecurityState } from './security-state.js';

export interface SecurityContext {
  readonly workspace: WorkspaceDescriptor;
  readonly scope: SecurityScope;
  readonly packages: readonly PackageDescriptor[];
  readonly securityStates: SecurityState;
  readonly securityComplianceArtifact: SecurityComplianceArtifact;
  readonly environment: string;
  readonly dependencyLockfile: DependencyLockfile;
  readonly securityAdvisories: readonly SecurityAdvisory[];
}
