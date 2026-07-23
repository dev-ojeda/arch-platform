// packages/governance/src/context/build-governance-context.ts

import type { WorkspaceDescriptor } from '@arch/platform-model';

import type { GovernanceContext } from './governance-context.js';

export function buildGovernanceContext(workspace: WorkspaceDescriptor): GovernanceContext {
  return {
    workspace,
  };
}
