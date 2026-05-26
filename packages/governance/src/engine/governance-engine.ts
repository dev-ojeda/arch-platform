import type { GovernanceContext } from '../context/governance-context.js';
import type { Diagnostic } from '../diagnostics/diagnostic.js';
import type { GovernanceRule } from '../rules/governance-rule.js';

import type { GovernanceEngineResult } from './governance-engine-result.js';

export class GovernanceEngine {
  constructor(private readonly rules: GovernanceRule[]) {}

  async run(context: GovernanceContext): Promise<GovernanceEngineResult> {
    const start = performance.now();

    const diagnostics: Diagnostic[] = [];

    const results = await Promise.allSettled(this.rules.map((rule) => rule.run(context)));

    for (const [index, result] of results.entries()) {
      const rule = this.rules[index];

      if (!rule) {
        continue;
      }

      if (result.status === 'fulfilled') {
        diagnostics.push(...result.value);

        continue;
      }

      diagnostics.push({
        code: 'RULE_EXECUTION_FAILURE',

        severity: 'error',

        source: rule.name,

        message:
          result.reason instanceof Error ? result.reason.message : 'Unknown governance rule error',
      });
    }

    const hasErrors = diagnostics.some((diagnostic) => diagnostic.severity === 'error');

    const durationMs = performance.now() - start;

    return {
      success: !hasErrors,

      diagnostics,

      durationMs,

      evaluatedRules: this.rules.length,
    };
  }
}
