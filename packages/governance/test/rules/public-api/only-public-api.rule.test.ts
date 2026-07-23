// packages\governance\test\rules\public-api\only-public-api.rule.test.ts
import { describe, expect, it } from 'vitest';

import { OnlyPublicApiRule } from '../../../src/rules/public-api/only-public-api.rule.js';
import type { GovernanceExecutionContext } from '../../../src/types/governance-context.js';
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

    analysis: {
      packageGraph: {} as never,

      symbolGraph: {
        nodes: [
          {
            name: 'SourceSymbol',
            id: 'SourceSymbol',
            package: sourcePackage,
            exported: true,
            kind: 'function',
            sourceFile: 'source.ts',
          },
          {
            name: 'TargetSymbol',
            id: 'TargetSymbol',
            package: targetPackage,
            exported,
            kind: 'function',
            sourceFile: 'target.ts',
          },
        ],

        edges: [
          {
            from: 'SourceSymbol',
            to: 'TargetSymbol',
            type: 'import',
            kind: 'import',
          },
        ],
      },
    },
  };
}

describe('OnlyPublicApiRule', () => {
  it('allows importing exported symbols', async () => {
    const diagnostics = await new OnlyPublicApiRule().run(
      createContext('@arch/application', '@arch/domain', true),
    );

    expect(diagnostics).toHaveLength(0);
  });

  it('rejects importing non exported symbols', async () => {
    const diagnostics = await new OnlyPublicApiRule().run(
      createContext('@arch/application', '@arch/domain', false),
    );

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
    const diagnostics = await new OnlyPublicApiRule().run(
      createContext('@arch/domain', '@arch/domain', false),
    );

    expect(diagnostics).toHaveLength(0);
  });
});
