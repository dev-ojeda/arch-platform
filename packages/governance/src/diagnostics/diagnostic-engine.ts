// packages/governance/src/diagnostics/diagnostic-engine.ts
import type { GovernanceContext } from '../context/governance-context.js';
import type { GovernanceRule } from '../rules/governance-rule.js';

import type { Diagnostic } from './diagnostic.js';

export class DiagnosticEngine {
  constructor(private readonly rules: GovernanceRule[]) {}

  async run(context: GovernanceContext): Promise<Diagnostic[]> {
    const diagnostics: Diagnostic[] = [];

    for (const rule of this.rules) {
      const result = await rule.run(context);

      diagnostics.push(...result);
    }

    return diagnostics;
  }
}
