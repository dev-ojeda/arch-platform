// packages/governance/src/context/build-governance-context.ts

import type { ArchitectureManifest, WorkspaceDescriptor } from '@arch-platform/platform-model';


import { DefaultPackageQuery } from './default-package-query.js';
import type { GovernanceContext } from './governance-context.js';
import { resolveGovernanceScope } from './resolve-governance-scope.js';
import type { GovernanceOptions } from '../public/governance-options.js';

export function buildGovernanceContext(
  options: GovernanceOptions,
  archManifest: ArchitectureManifest,
  workspace: WorkspaceDescriptor,
): GovernanceContext {
  return {
    archManifest,
    workspace,
    scope: resolveGovernanceScope(options),
    packages: new DefaultPackageQuery(workspace),
  };
}
