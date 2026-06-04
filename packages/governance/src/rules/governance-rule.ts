// packages/governance/src/rules/governance-rule.ts

import type { GovernanceContext } from '../context/governance-context.js';
import type { Diagnostic } from '../diagnostics/diagnostic.js';

export interface GovernanceRule {
  name: string;

  run(context: GovernanceContext): Promise<Diagnostic[]>;
}
