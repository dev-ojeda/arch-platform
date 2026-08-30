// packages/governance/src/context/resolve-governance-packages.ts

import type { WorkspaceDescriptor } from '@arch/platform-model';

import type { GovernanceScope } from '../public/governance-scope.js';

export function resolveGovernancePackages(
  workspace: WorkspaceDescriptor,
  scope: GovernanceScope,
): readonly WorkspaceDescriptor['packages'][number][] {
  switch (scope.kind) {
    case 'package':
      return workspace.packages.filter((pkg) => pkg.name === scope.packageName);

    case 'workspace':
      return workspace.packages;

    case 'changed':
      return workspace.packages;
  }
}
