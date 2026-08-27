// packages/governance/src/context/build-governance-context.ts

import type {
  ArchitectureManifest,
  ArtifactState,
  ComplianceState,
  WorkspaceDescriptor,
} from '@arch/platform-model';

import type { GovernanceOptions } from '../public/governance-options.js';

import { DefaultGovernancePackageQuery } from './default-governance-package-query.js';
import type { GovernanceContext } from './governance-context.js';
import { resolveGovernanceScope } from './resolve-governance-scope.js';

export function buildGovernanceContext(
  options: GovernanceOptions,
  archManifest: ArchitectureManifest,
  workspace: WorkspaceDescriptor,
  artifactStates: ReadonlyMap<string, ArtifactState>,
  complianceStates: ComplianceState,
): GovernanceContext {
  return {
    archManifest,
    workspace,
    scope: resolveGovernanceScope(options),
    packages: new DefaultGovernancePackageQuery(workspace),
    artifactStates,
    complianceStates,
  };
}
