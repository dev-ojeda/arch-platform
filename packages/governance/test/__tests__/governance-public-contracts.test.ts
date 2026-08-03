// packages\governance\test\__tests__\governance-public-contracts.test.ts

import { describe, expect, it } from 'vitest';

import type { GovernanceOptions, GovernanceResult, GovernanceScope } from '@arch/governance';

describe('@arch/governance public contracts', () => {
  it('should expose public governance contracts', () => {
    const options = {
      workspaceRoot: process.cwd(),
      scope: 'workspace',
    } satisfies GovernanceOptions;

    const scope = {
      kind: 'workspace',
      root: options.workspaceRoot,
    } satisfies GovernanceScope;

    const result = {
      success: true,
      diagnostics: [],
      durationMs: 0,
      evaluatedRules: 0,
      executions: [],
      scope,
    } satisfies GovernanceResult;

    expect(result.success).toBe(true);
  });
});
