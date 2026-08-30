// packages/governance/src/rules/governance-analysis-rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceExecutionContext } from '../context/governance-execution-context.js';

export interface GovernanceAnalysisRule {
  name: string;

  run(context: GovernanceExecutionContext): Promise<Diagnostic[]>;
}
