import { DefaultGovernancePackageQuery } from '../../../src/context/default-governance-package-query.js';
import type { GovernanceExecutionContext } from '../../../src/context/governance-context.js';
import { createAnalysisContext } from '../code-analysis/create-analysis-context.js';
import { createWorkspaceDescriptor } from '../workspace/create-workspace-descriptor.js';

export function createGovernanceExecutionContext(
  overrides: Partial<GovernanceExecutionContext> = {},
): GovernanceExecutionContext {
  const workspace = overrides.workspace ?? createWorkspaceDescriptor();

  return {
    analyses: [
      {
        packageName: '',
        analysis: createAnalysisContext(),
      },
    ],
    workspace,
    scope: {
      kind: 'workspace',
      root: workspace.root,
    },
    packages: new DefaultGovernancePackageQuery(workspace),

    artifactStates: undefined,
    complianceStates: undefined,
    ...overrides,
  };
}
