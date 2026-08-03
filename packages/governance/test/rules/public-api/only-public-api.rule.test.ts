// packages\governance\test\rules\public-api\only-public-api.rule.test.ts
import { describe, expect, it } from 'vitest';

import type { GovernanceExecutionContext } from '../../../src/context/governance-context.js';
import { ExportMapReader } from '../../../src/rules/public-api/export-map-reader.js';
import { OnlyPublicApiRule } from '../../../src/rules/public-api/only-public-api.rule.js';
import { PrivatePathDetector } from '../../../src/rules/public-api/private-path-detector.js';
import { PublicApiScanner } from '../../../src/rules/public-api/public-api-scanner.js';
import { createAnalysisContext } from '../../fixtures/code-analysis/create-analysis-context.js';
import { createExportedSymbolIndex } from '../../fixtures/code-analysis/create-exported-symbol-index.js';
import { createGovernanceContext } from '../../fixtures/governance/create-governance-context.js';
import { createWorkspaceDescriptor } from '../../fixtures/workspace/create-workspace-descriptor.js';
import { createWorkspaceLayout } from '../../fixtures/workspace/create-workspace-layout.js';
import { debug } from '../../utils/debug.js';

function createContext(
  sourcePackage: string,
  targetPackage: string,
  exported: boolean,
): GovernanceExecutionContext {
  return {
    ...createGovernanceContext({
      workspace: createWorkspaceDescriptor({
        layout: createWorkspaceLayout(),
        packages: [],
      }),
    }),

    analysis: createAnalysisContext({
      symbolGraph: {
        nodes: [
          {
            name: 'SourceSymbol',
            id: 'SourceSymbol',
            package: sourcePackage,
            kind: 'function',
            sourceFile: 'source.ts',
          },
          {
            name: 'TargetSymbol',
            id: 'TargetSymbol',
            package: targetPackage,
            kind: 'function',
            sourceFile: 'target.ts',
          },
        ],
        edges: [
          {
            from: 'SourceSymbol',
            to: 'TargetSymbol',
            type: 'import',
          },
        ],
      },

      exportedSymbols: createExportedSymbolIndex({
        has: (id) => id === 'TargetSymbol' && exported,
      }),
    }),
  };
}

describe('OnlyPublicApiRule', () => {
  const rule = new OnlyPublicApiRule(
    new PublicApiScanner(new PrivatePathDetector(), new ExportMapReader()),
  );
  it('allows importing exported symbols', async () => {
    const diagnostics = await rule.run(createContext('@arch/application', '@arch/domain', true));

    expect(diagnostics).toHaveLength(0);
  });

  it('rejects importing non exported symbols', async () => {
    const diagnostics = await rule.run(createContext('@arch/application', '@arch/domain', false));

    if (process.env.DEBUG_GOVERNANCE) {
      debug(diagnostics);
    }

    expect(diagnostics).toHaveLength(1);

    expect(diagnostics[0]).toMatchObject({
      code: 'ARCH_ONLY_PUBLIC_API',

      severity: 'error',
    });
  });

  it('allows internal imports inside same package', async () => {
    const diagnostics = await rule.run(createContext('@arch/domain', '@arch/domain', false));

    expect(diagnostics).toHaveLength(0);
  });
});
