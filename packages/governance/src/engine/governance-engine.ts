// packages\governance\src\engine\governance-engine.ts

import type { Diagnostic, DiagnosticSeverity } from '@arch/platform-model';

import type { GovernanceExecutionContext } from '../context/governance-context.js';
import { createStopwatch } from '../helpers/create-stopwatch.js';
import { getErrorMessage } from '../helpers/error-message.js';
import type { RuleExecutionResult } from '../rules/execution-result-rule.js';

import type { GovernanceEngineResult } from './governance-engine-result.js';
import type { GovernanceRuleExecution } from './governance-rule-execution.js';
import type { GovernanceRule } from './governance-rule.js';

export class GovernanceEngine {
  constructor(private readonly rules: readonly GovernanceRule[]) {}

  async run(context: GovernanceExecutionContext): Promise<GovernanceEngineResult> {
    const stopwatch = createStopwatch();

    const diagnostics: Diagnostic[] = [];
    const executions: GovernanceRuleExecution[] = [];

    const results = await Promise.all(this.rules.map((rule) => this.executeRule(rule, context)));

    for (const execution of results) {
      if (execution.error) {
        diagnostics.push(this.createFailureDiagnostic(execution));
      } else {
        diagnostics.push(...execution.diagnostics);
      }

      executions.push({
        rule: execution.rule.id,

        name: execution.rule.name,

        success: execution.error === undefined,

        durationMs: execution.durationMs,

        diagnostics: execution.diagnostics.length,

        severity: execution.error ? 'error' : this.getSeverity(execution.diagnostics),

        error: getErrorMessage(execution.error),
      });
    }

    return {
      success: !diagnostics.some((d) => d.severity === 'error'),

      diagnostics,

      durationMs: stopwatch.milliseconds(),

      evaluatedRules: this.rules.length,

      executions,
    };
  }

  private async executeRule(
    rule: GovernanceRule,
    context: GovernanceExecutionContext,
  ): Promise<RuleExecutionResult> {
    const stopwatch = createStopwatch();

    try {
      return {
        rule,
        diagnostics: await rule.run(context),
        durationMs: stopwatch.milliseconds(),
      };
    } catch (error) {
      return {
        rule,
        diagnostics: [],
        durationMs: stopwatch.milliseconds(),
        error,
      };
    }
  }

  private createFailureDiagnostic(execution: RuleExecutionResult): Diagnostic {
    return {
      code: 'RULE_EXECUTION_FAILURE',
      severity: 'error',
      source: execution.rule.name,
      message: getErrorMessage(execution.error),
      hint: `Review implementation of governance rule "${execution.rule.name}".`,
    };
  }

  private getSeverity(diagnostics: Diagnostic[]): DiagnosticSeverity {
    if (diagnostics.some((d) => d.severity === 'error')) {
      return 'error';
    }

    if (diagnostics.some((d) => d.severity === 'warning')) {
      return 'warning';
    }

    return 'info';
  }
}
