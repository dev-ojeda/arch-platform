import type { GovernanceContext } from '../../../src/context/governance-context.js';
import { GovernancePackageQuery } from '../../../src/context/governance-package-query.js';
import { createWorkspaceDescriptor } from '../workspace/create-workspace-descriptor.js';

export function createGovernanceContext(
  overrides: Partial<GovernanceContext> = {},
): GovernanceContext {
  const workspace = overrides.workspace ?? createWorkspaceDescriptor();

  return {
    workspace,
    scope: {
      kind: 'workspace',
      root: '/workspace',
    },
    packages: new GovernancePackageQuery(workspace),
    ...overrides,
  };
}
