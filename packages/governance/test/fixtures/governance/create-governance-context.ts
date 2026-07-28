import type { GovernanceContext } from '../../../src/context/governance-context.js';
import { createWorkspaceDescriptor } from '../workspace/create-workspace-descriptor.js';

export function createGovernanceContext(
  overrides: Partial<GovernanceContext> = {},
): GovernanceContext {
  return {
    workspace: createWorkspaceDescriptor(),

    scope: {
      kind: 'workspace',
      root: '/workspace',
    },

    ...overrides,
  };
}
