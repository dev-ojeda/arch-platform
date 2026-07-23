import type { GovernanceExecutionContext } from '../../../src/types/governance-context.js';
import { createWorkspaceDescriptor } from '../workspace/create-workspace-descriptor.js';

export function createGovernanceExecutionContext(
  overrides: Partial<GovernanceExecutionContext> = {},
): GovernanceExecutionContext {
  return {
    workspace: createWorkspaceDescriptor({
      packages: [],
    }),

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
