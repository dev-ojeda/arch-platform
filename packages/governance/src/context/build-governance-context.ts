// packages/governance/src/context/build-governance-context.ts

import type { WorkspaceDescriptor } from '@arch/platform-model';

import type { GovernanceContext } from './governance-context.js';
import type { GovernanceScope } from './governance-scope.js';

export function buildGovernanceContext(
  scope: GovernanceScope,
  workspace: WorkspaceDescriptor,
): GovernanceContext {
  return {
    workspace,
    scope,
  };
}
