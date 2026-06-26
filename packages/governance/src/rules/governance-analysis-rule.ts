// packages/governance/src/rules/governance-analysis-rule.ts

import type { Diagnostic } from '../diagnostics/diagnostic.js';
import type { GovernanceExecutionContext } from '../types/governance-context.js';

export interface GovernanceAnalysisRule {
  name: string;

  run(context: GovernanceExecutionContext): Promise<Diagnostic[]>;
}
