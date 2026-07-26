// packages/governance/test/integration/code-analysis-adapter.test.ts

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import type { WorkspaceDescriptor } from '@arch/platform-model';

import { buildGovernanceContext } from '../../src/context/build-governance-context.js';
import { buildGovernanceExecutionContext } from '../../src/context/build-governance-execution-context.js';

describe('CodeAnalysisAdapter', () => {
  const fixturePath = fileURLToPath(
    new URL('../fixtures/code-analysis-workspace', import.meta.url),
  );

  it('builds symbol and package analysis context', () => {
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

    const context = buildGovernanceContext(scope, workspace);

    const result = buildGovernanceExecutionContext(context);

    expect(result.workspace.root).toBe(workspaceRoot);
    expect(result.scope.kind).toBe('workspace');

    expect(result.analysis).toBeDefined();
    expect(result.analysis.symbolGraph.nodes.length).toBeGreaterThan(0);
    expect(result.analysis.packageGraph).toBeDefined();
  });
});
