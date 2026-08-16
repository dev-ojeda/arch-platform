// packages/governance/src/analysis/code-analysis/create-governance-analysis-context.ts

import type {
  GovernanceContext,
  GovernanceExecutionContext,
} from '../../context/governance-context.js';

import type { AnalysisAdapter } from './analysis-adapter.js';

export async function createGovernanceAnalysisContext(
  context: GovernanceContext,
  adapter: AnalysisAdapter,
): Promise<GovernanceExecutionContext> {
  const packages = resolveAnalysisPackages(context);

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

function resolveAnalysisPackages(
  context: GovernanceContext,
): readonly GovernanceContext['workspace']['packages'][number][] {
  switch (context.scope.kind) {
    case 'package': {
      const packageName = context.scope.packageName;

      return context.workspace.packages.filter((pkg) => pkg.name === packageName);
    }

    case 'workspace':
      return context.workspace.packages;

    case 'changed':
      // Mantener comportamiento actual hasta implementar changed-only.
      return context.workspace.packages;
  }
}
