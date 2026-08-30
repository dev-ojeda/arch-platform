// packages/governance/src/analysis/code-analysis/create-governance-analysis-context.ts

import type { GovernanceContext } from '../../context/governance-context.js';
import type { GovernanceExecutionContext } from '../../context/governance-execution-context.js';
import { resolveGovernancePackages } from '../../context/resolve-governance-packages.js';

import type { AnalysisAdapter } from './analysis-adapter.js';

export async function createGovernanceAnalysisContext(
  context: GovernanceContext,
  adapter: AnalysisAdapter,
): Promise<GovernanceExecutionContext> {
  const packages = resolveGovernancePackages(context.workspace, context.scope);

  const analyses = await Promise.all(
    packages.map(async (pkg) => {
      const packageContext: GovernanceContext = {
        ...context,
        scope: {
          kind: 'package',
          root: pkg.rootPath,
          packageName: pkg.name,
        },
      };

      return {
        packageName: pkg.name,
        analysis: await adapter.analyze(packageContext),
      };
    }),
  );

  return {
    ...context,
    analyses,
  };
}
