// packages\governance\test\__tests__\governance-engine.test.ts
import { describe, expect, it } from 'vitest';

import { GovernanceEngine } from '../../src/engine/governance-engine.js';
import type { GovernanceRule } from '../../src/engine/governance-rule.js';
import type { GovernanceContext } from '../../src/types/governance-context.js';

describe('CreateTestGovernanceEngine', () => {
  const context: GovernanceContext = {
    workspaceRoot: '/workspace',

    packages: [],
  };
  it('returns successful result when no rules are registered', async () => {
    const result = await new GovernanceEngine([]).run(context);

    expect(result.success).toBe(true);

    expect(result.diagnostics).toEqual([]);

    expect(result.evaluatedRules).toBe(0);

    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });
  it('collects diagnostics from successful rules', async () => {
    const rule: GovernanceRule = {
      name: 'test-rule',

      run: () => {
        return Promise.resolve([
          {
            code: 'TEST_WARNING',

            severity: 'warning',

            message: 'test warning',
          },
        ]);
      },
    };

    const result = await new GovernanceEngine([rule]).run(context);

    expect(result.success).toBe(true);

    expect(result.evaluatedRules).toBe(1);

    expect(result.diagnostics).toHaveLength(1);

    expect(result.diagnostics[0]?.code).toBe('TEST_WARNING');
  });
  it('converts rule failures into diagnostics', async () => {
    const rule: GovernanceRule = {
      name: 'failing-rule',

      run: async () => Promise.reject(new Error('boom')),
    };

    const result = await new GovernanceEngine([rule]).run(context);

    expect(result.success).toBe(false);

    expect(result.evaluatedRules).toBe(1);

    expect(result.diagnostics).toHaveLength(1);

    expect(result.diagnostics[0]).toMatchObject({
      code: 'RULE_EXECUTION_FAILURE',

      severity: 'error',

      source: 'failing-rule',

      message: 'boom',
    });
  });
  it('aggregates diagnostics from successful and failed rules', async () => {
    const successfulRule: GovernanceRule = {
      name: 'success-rule',

      run: () => {
        return Promise.resolve([
          {
            code: 'TEST_WARNING',

            severity: 'warning',

            message: 'warning',
          },
        ]);
      },
    };

    const failingRule: GovernanceRule = {
      name: 'failure-rule',
      run: async () => Promise.reject(new Error('failure')),
    };

    const result = await new GovernanceEngine([successfulRule, failingRule]).run(context);

    expect(result.success).toBe(false);

    expect(result.evaluatedRules).toBe(2);

    expect(result.diagnostics).toHaveLength(2);

    expect(result.diagnostics.some((diagnostic) => diagnostic.code === 'TEST_WARNING')).toBe(true);

    expect(
      result.diagnostics.some((diagnostic) => diagnostic.code === 'RULE_EXECUTION_FAILURE'),
    ).toBe(true);
  });
});
