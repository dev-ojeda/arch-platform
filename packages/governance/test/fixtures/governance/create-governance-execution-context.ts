import type { GovernanceExecutionContext } from '../../../src/context/governance-context.js';
import { GovernancePackageQuery } from '../../../src/context/governance-package-query.js';
import { createAnalysisContext } from '../code-analysis/create-analysis-context.js';
import { createWorkspaceDescriptor } from '../workspace/create-workspace-descriptor.js';

export function createGovernanceExecutionContext(
  overrides: Partial<GovernanceExecutionContext> = {},
): GovernanceExecutionContext {
  const workspace = overrides.workspace ?? createWorkspaceDescriptor();

  return {
    workspace,
    scope: {
      kind: 'workspace',
      root: workspace.root,
    },
    packages: new GovernancePackageQuery(workspace),
    analyses: [
      {
        packageName: '',
        analysis: createAnalysisContext(),
      },
    ],
    ...overrides,
  };
}
