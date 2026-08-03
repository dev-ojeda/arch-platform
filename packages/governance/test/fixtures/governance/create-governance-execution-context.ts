import type { GovernanceExecutionContext } from '../../../src/context/governance-context.js';
import { createAnalysisContext } from '../code-analysis/create-analysis-context.js';
import { createWorkspaceDescriptor } from '../workspace/create-workspace-descriptor.js';

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

    analysis: createAnalysisContext(),

    ...overrides,
  };
}
