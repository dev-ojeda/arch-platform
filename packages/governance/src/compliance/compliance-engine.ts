// packages/governance/src/compliance/compliance-engine.ts

import type { ComplianceStateChange, Diagnostic } from '@arch/platform-model';

import type { ComplianceExecutionContext } from '../context/compliance-execution-context.js';

import type { ComplianceEvaluation } from './compliance-evaluation.js';
import type { ComplianceRule } from './compliance-rule.js';

export class ComplianceEngine {
  constructor(private readonly rules: readonly ComplianceRule[]) {}

  async run(context: ComplianceExecutionContext): Promise<ComplianceEvaluation> {
    const diagnostics: Diagnostic[] = [];
    const changes: ComplianceStateChange[] = [];
    let executions = 0;

    for (const rule of this.rules) {
      if (!rule.supports(context.scope)) {
        continue;
      }

      const result = await rule.run(context);

      diagnostics.push(...result.diagnostics);
      changes.push(...result.changes);
      executions++;
    }

    return {
      diagnostics,
      changes,
      executions,
    };
  }
}
