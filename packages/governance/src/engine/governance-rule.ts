// packages/governance/src/engine/governance-rule.ts

import type { Diagnostic } from '../diagnostics/diagnostic.js';
import type { GovernanceContext } from '../types/governance-context.js';

export interface GovernanceRule {
  readonly name: string;
  run(context: GovernanceContext): Promise<Diagnostic[]>;
}
