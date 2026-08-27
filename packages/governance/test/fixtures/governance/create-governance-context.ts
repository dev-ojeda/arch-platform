import { DefaultGovernancePackageQuery } from '../../../src/context/default-governance-package-query.js';
import type { GovernanceContext } from '../../../src/context/governance-context.js';
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
    packages: new DefaultGovernancePackageQuery(workspace),

    artifactStates: undefined,
    complianceStates: undefined,
    ...overrides,
  };
}
