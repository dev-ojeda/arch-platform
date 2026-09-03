import type { GovernanceExecutionContext } from '../../../src/context/governance-execution-context.js';
import { createAnalysisContext } from '../code-analysis/create-analysis-context.js';
import { createExportedSymbolIndex } from '../code-analysis/create-exported-symbol-index.js';
import { createGovernanceContext } from '../governance/create-governance-context.js';
import { createSymbolGraph } from '../graph/create-empty-symbol-graph.js';
import { createPackageDescriptor } from '../workspace/create-package-descriptor.js';
import { createWorkspaceDescriptor } from '../workspace/create-workspace-descriptor.js';
import { createWorkspaceLayout } from '../workspace/create-workspace-layout.js';

export function createInternalExportContext(): GovernanceExecutionContext {
  const sourcePackage = '@arch/application';
  const targetPackage = '@arch/domain';

  const sourceAnalysis = createAnalysisContext({
    symbolGraph: createSymbolGraph({
      nodes: [
        {
          name: 'SourceSymbol',
          id: 'source.ts#SourceSymbol',
          package: sourcePackage,
          kind: 'function',
          sourceFile: 'source.ts',
        },
      ],
      edges: [
        {
          from: 'source.ts',
          to: 'target.ts#TargetSymbol',
          type: 'import',
          metadata: {
            kind: 'function',
            moduleSpecifier: `${targetPackage}/internal`,
          },
        },
      ],
    }),
  });

  const targetAnalysis = createAnalysisContext({
    symbolGraph: createSymbolGraph({
      nodes: [
        {
          name: 'TargetSymbol',
          id: 'target.ts#TargetSymbol',
          package: targetPackage,
          kind: 'function',
          sourceFile: 'target.ts',
        },
      ],
    }),
    exportedSymbols: createExportedSymbolIndex({
      isPublicExport: () => false,
    }),
  });

  return {
    ...createGovernanceContext({
      workspace: createWorkspaceDescriptor({
        layout: createWorkspaceLayout(),

        packages: [
          createPackageDescriptor({
            name: sourcePackage,
            manifest: {
              name: sourcePackage,
              arch: undefined,
            },
          }),

          createPackageDescriptor({
            name: targetPackage,
            manifest: {
              name: targetPackage,
              exports: {
                '.': './dist/public/index.js',
                './internal': './dist/internal/index.js',
              },
              arch: undefined,
            },
          }),
        ],
      }),
    }),

    analyses: [
      {
        packageName: sourcePackage,
        analysis: sourceAnalysis,
      },
      {
        packageName: targetPackage,
        analysis: targetAnalysis,
      },
    ],
  };
}
