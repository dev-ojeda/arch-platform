import type { GovernanceContext } from '../../../src/types/governance-context.js';
import { createWorkspaceDescriptor } from '../workspace/create-workspace-descriptor.js';

export function createGovernanceContext(
  overrides: Partial<GovernanceContext> = {},
): GovernanceContext {
  return {
    workspace: createWorkspaceDescriptor(),
    ...overrides,
  };
}
