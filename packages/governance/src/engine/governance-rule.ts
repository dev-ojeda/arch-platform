// packages/governance/src/engine/governance-rule.ts

import type { Diagnostic } from '../diagnostics/diagnostic.js';
import type { GovernanceExecutionContext } from '../types/index.js';

export interface GovernanceRule {
  name: string;

  run(context: GovernanceExecutionContext): Promise<Diagnostic[]>;
}
