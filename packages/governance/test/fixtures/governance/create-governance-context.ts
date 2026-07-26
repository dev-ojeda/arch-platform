import { createWorkspaceDescriptor } from '../workspace/create-workspace-descriptor.js';

import type { GovernanceContext } from '../../../src/context/governance-context.js';

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
