import { createWorkspaceDescriptor } from '../workspace/create-workspace-descriptor.js';

import type { GovernanceExecutionContext } from '../../../src/context/governance-context.js';

export function createGovernanceExecutionContext(
  overrides: Partial<GovernanceExecutionContext> = {},
): GovernanceExecutionContext {
  return {
    workspace: createWorkspaceDescriptor({
      packages: [],
    }),
    scope: {
      kind: 'workspace',
      root: '/workspace',
    },
    analysis: {
      packageGraph: {} as never,
      symbolGraph: {
        nodes: [],
        edges: [],
      },
    },
    ...overrides,
  };
}
