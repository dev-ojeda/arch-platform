// packages/governance/test/__tests__/governance-engine.test.ts

import { describe, expect, it } from 'vitest';

import type { Diagnostic } from '@arch/platform-model';

import { GovernanceEngine } from '../../src/engine/governance-engine.js';
import type { GovernanceRule } from '../../src/engine/governance-rule.js';
import { createGovernanceExecutionContext } from '../fixtures/governance/create-governance-execution-context.js';
import { TestRuleId } from '../helpers/test-rule-id.js';

describe('GovernanceEngine', () => {
  const warningDiagnostic: Diagnostic = {
    code: 'TEST_WARNING',
    severity: 'warning',
    message: 'test warning',
  };

  const createSuccessfulRule = (
    id: TestRuleId,
    diagnostics: Diagnostic[] = [],
  ): GovernanceRule => ({
    id,
    name: id,
    run: async () => diagnostics,
  });

  const createFailingRule = (id: TestRuleId, message = 'boom'): GovernanceRule => ({
    id,
    name: id,
    run: async () => {
      throw new Error(message);
    },
  });
  const context = createGovernanceExecutionContext();
  it('returns successful result when no rules are registered', async () => {
    const result = await new GovernanceEngine([]).run(context);
    expect(result.success).toBe(true);

    expect(result.diagnostics).toEqual([]);

    expect(result.evaluatedRules).toBe(0);

    expect(result.executions).toEqual([]);

    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('collects diagnostics from successful rules', async () => {
    const rule = createSuccessfulRule(TestRuleId.TestSuccess, [warningDiagnostic]);

    const result = await new GovernanceEngine([rule]).run(context);
    expect(result.success).toBe(true);
    expect(result.evaluatedRules).toBe(1);
    expect(result.diagnostics).toHaveLength(1);
    expect(result.executions).toHaveLength(1);

    expect(result.executions[0]).toMatchObject({
      rule: TestRuleId.TestSuccess,
      success: true,
      diagnostics: 1,
    });
  });

  it('converts rule failures into execution failures', async () => {
    const rule = createFailingRule(TestRuleId.TestFailure, 'boom');

    const result = await new GovernanceEngine([rule]).run(context);
    expect(result.success).toBe(false);

    expect(result.diagnostics[0]).toMatchObject({
      code: 'RULE_EXECUTION_FAILURE',
      severity: 'error',
      source: TestRuleId.TestFailure,
      message: 'boom',
    });

    expect(result.executions[0]).toMatchObject({
      rule: TestRuleId.TestFailure,
      success: false,
    });
  });

  it('tracks independent execution state per rule', async () => {
    const successRule = createSuccessfulRule(TestRuleId.TestSuccess, [warningDiagnostic]);

    const failureRule = createFailingRule(TestRuleId.TestFailure, 'failure');

    const result = await new GovernanceEngine([successRule, failureRule]).run(context);
    expect(result.success).toBe(false);

    expect(result.executions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rule: TestRuleId.TestSuccess,
          success: true,
        }),
        expect.objectContaining({
          rule: TestRuleId.TestFailure,
          success: false,
        }),
      ]),
    );
  });
});
