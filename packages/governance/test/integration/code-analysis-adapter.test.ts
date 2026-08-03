// packages/governance/test/integration/code-analysis-adapter.test.ts

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import type { WorkspaceDescriptor } from '@arch/platform-model';

import { CodeAnalysisAdapter } from '../../src/analysis/code-analysis/code-analysis-adapter.js';
import { createGovernanceAnalysisContext } from '../../src/analysis/code-analysis/create-governance-analysis-context.js';
import { buildGovernanceContext } from '../../src/context/build-governance-context.js';
import type { GovernanceScope } from '../../src/public/governance-scope.js';

describe('CodeAnalysisAdapter', () => {
  const fixturePath = fileURLToPath(
    new URL('../fixtures/workspaces/code-analysis', import.meta.url),
  );

  it('builds symbol and package analysis context', async () => {
    const workspaceRoot = resolve(fixturePath);

    const workspace: WorkspaceDescriptor = {
      root: workspaceRoot,

      layout: {
        packageJsonPath: `${workspaceRoot}/package.json`,
        tsconfigPath: `${workspaceRoot}/tsconfig.json`,
        hasPackageManifest: false,
        hasTsconfig: true,
      },

      packages: [],
    };

    const scope: GovernanceScope = {
      kind: 'workspace',
      root: workspaceRoot,
    };

    const context = buildGovernanceContext(
      {
        workspaceRoot: scope.root,
      },
      workspace,
    );

    const executionContext = await createGovernanceAnalysisContext(
      context,
      new CodeAnalysisAdapter(),
    );

    expect(executionContext.workspace.root).toBe(workspaceRoot);
    expect(executionContext.scope.kind).toBe('workspace');

    expect(executionContext.analysis).toBeDefined();
    expect(executionContext.analysis.symbolGraph.nodes.length).toBeGreaterThan(0);
    expect(executionContext.analysis.packageGraph).toBeDefined();
  });
});
