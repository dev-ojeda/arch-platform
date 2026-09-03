// packages\governance\test\__tests__\compliance-engine.test.ts

import { describe, expect, it } from 'vitest';

import type {
  ComplianceEvent,
  ComplianceEventBus,
  ComplianceEventHandler,
  ComplianceStateChange,
  Diagnostic,
} from '@arch/platform-model';

import { ComplianceEngine } from '../../src/compliance/compliance-engine.js';
import type { ComplianceRule } from '../../src/compliance/compliance-rule.js';
import { createComplianceExecutionContext } from '../fixtures/compliance/create-compliance-execution-context.js';
import { createComplianceRuleResult } from '../fixtures/compliance/create-compliance-rule-result.js';
import { createHashResult } from '../fixtures/compliance/create-hash-result.js';

class RecordingComplianceEventBus implements ComplianceEventBus {
  readonly events: ComplianceEvent[] = [];

  subscribe(_handler: ComplianceEventHandler): void {}

  async publish(event: ComplianceEvent): Promise<void> {
    this.events.push(event);
  }
}

describe('ComplianceEngine', () => {
  it('returns an empty evaluation when no rules are registered', async () => {
    const eventBus = new RecordingComplianceEventBus();

    const result = await new ComplianceEngine([], eventBus).run(createComplianceExecutionContext());

    expect(result).toEqual({
      diagnostics: [],
      changes: [],
      executions: 0,
    });

    expect(eventBus.events).toEqual([]);
  });

  it('collects diagnostics and changes from executed rules', async () => {
    const eventBus = new RecordingComplianceEventBus();

    const diagnostic: Diagnostic = {
      code: 'TEST_WARNING',
      severity: 'warning',
      message: 'test warning',
    };

    const change: ComplianceStateChange = {
      environment: 'dev',
      artifact: '@arch/testing',
      previousStatus: 'transition',
      nextStatus: 'approved',
      evaluatedHash: createHashResult(),
    };

    const rule = createComplianceRuleResult([diagnostic], [change]);

    const result = await new ComplianceEngine([rule], eventBus).run(
      createComplianceExecutionContext(),
    );

    expect(result).toEqual({
      diagnostics: [diagnostic],
      changes: [change],
      executions: 1,
    });
  });

  it('emits rule lifecycle events when a rule is executed', async () => {
    const eventBus = new RecordingComplianceEventBus();
    const rule = createComplianceRuleResult();

    const result = await new ComplianceEngine([rule], eventBus).run(
      createComplianceExecutionContext(),
    );

    expect(result.executions).toBe(1);

    expect(eventBus.events).toHaveLength(2);

    expect(eventBus.events[0]).toMatchObject({
      name: 'COMPLIANCE_RULE_STARTED',
      payload: {
        rule: 'artifact-compliance',
      },
    });

    expect(eventBus.events[1]).toMatchObject({
      name: 'COMPLIANCE_RULE_COMPLETED',
      payload: {
        rule: 'artifact-compliance',
        diagnostics: 0,
        changes: 0,
      },
    });
  });

  it('completes the rule lifecycle when the rule produces diagnostics', async () => {
    const eventBus = new RecordingComplianceEventBus();

    const diagnostic: Diagnostic = {
      code: 'TEST_WARNING',
      severity: 'warning',
      message: 'test warning',
    };

    const rule = createComplianceRuleResult([diagnostic]);

    const result = await new ComplianceEngine([rule], eventBus).run(
      createComplianceExecutionContext(),
    );

    expect(result.diagnostics).toEqual([diagnostic]);
    expect(result.executions).toBe(1);

    expect(eventBus.events.map((event) => event.name)).toEqual([
      'COMPLIANCE_RULE_STARTED',
      'COMPLIANCE_RULE_COMPLETED',
    ]);

    expect(eventBus.events[1]).toMatchObject({
      name: 'COMPLIANCE_RULE_COMPLETED',
      payload: {
        rule: 'artifact-compliance',
        diagnostics: 1,
        changes: 0,
      },
    });
  });

  it('does not emit rule events when the rule does not support the scope', async () => {
    const eventBus = new RecordingComplianceEventBus();

    const rule: ComplianceRule = {
      id: 'artifact-compliance',
      name: 'artifact-compliance',

      supports: () => false,

      async run() {
        throw new Error('Rule should not execute');
      },
    };

    const result = await new ComplianceEngine([rule], eventBus).run(
      createComplianceExecutionContext(),
    );

    expect(result).toEqual({
      diagnostics: [],
      changes: [],
      executions: 0,
    });

    expect(eventBus.events).toEqual([]);
  });
});
