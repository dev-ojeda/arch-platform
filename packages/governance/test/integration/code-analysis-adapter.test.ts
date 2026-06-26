// packages/governance/test/integration/code-analysis-adapter.test.ts

import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { buildGovernanceExecutionContext } from '../../src/context/build-governance-execution-context.js';

describe('CodeAnalysisAdapter', () => {
  it('builds symbol and package analysis context', async () => {
    const workspaceRoot = path.resolve(process.cwd(), 'test/fixtures/code-analysis-workspace');

    const result = await buildGovernanceExecutionContext(workspaceRoot);

    expect(result.analysis).toBeDefined();

    expect(result.analysis.symbolGraph.nodes.length).toBeGreaterThan(0);

    expect(result.analysis.packageGraph).toBeDefined();
  });
});
