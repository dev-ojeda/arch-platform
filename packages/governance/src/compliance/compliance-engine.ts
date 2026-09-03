// packages/governance/src/compliance/compliance-engine.ts

import type { ComplianceEventBus, ComplianceStateChange, Diagnostic } from '@arch/platform-model';

import type { ComplianceExecutionContext } from '../context/compliance-execution-context.js';

import type { ComplianceEvaluation } from './compliance-evaluation.js';
import type { ComplianceRule } from './compliance-rule.js';

export class ComplianceEngine {
  constructor(
    private readonly rules: readonly ComplianceRule[],
    private readonly eventBus: ComplianceEventBus,
  ) {}

  async run(context: ComplianceExecutionContext): Promise<ComplianceEvaluation> {
    const diagnostics: Diagnostic[] = [];
    const changes: ComplianceStateChange[] = [];
    let executions = 0;

    for (const rule of this.rules) {
      if (!rule.supports(context.scope)) {
        continue;
      }
      await this.eventBus.publish({
        name: 'COMPLIANCE_RULE_STARTED',
        timestamp: Date.now(),
        payload: {
          rule: rule.name,
        },
      });
      const result = await rule.run(context);
      diagnostics.push(...result.diagnostics);
      changes.push(...result.changes);
      executions++;
      await this.eventBus.publish({
        name: 'COMPLIANCE_RULE_COMPLETED',
        timestamp: Date.now(),
        payload: {
          rule: rule.name,
          diagnostics: result.diagnostics.length,
          changes: result.changes.length,
        },
      });
    }

    return {
      diagnostics,
      changes,
      executions,
    };
  }
}
