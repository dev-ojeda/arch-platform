// packages/governance/test/integration/code-analysis-adapter.test.ts

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { buildGovernanceExecutionContext } from '../../src/context/build-governance-execution-context.js';

describe('CodeAnalysisAdapter', () => {
  const fixturePath = fileURLToPath(
    new URL('../fixtures/code-analysis-workspace', import.meta.url),
  );
  it('builds symbol and package analysis context', async () => {
    const workspaceRoot = resolve(fixturePath);

    const result = await buildGovernanceExecutionContext(workspaceRoot);

    expect(result.analysis).toBeDefined();

    expect(result.analysis.symbolGraph.nodes.length).toBeGreaterThan(0);

    expect(result.analysis.packageGraph).toBeDefined();
  });
});
