// packages/governance/src/analysis/semantics/semantic-scanner.ts

import type { GovernanceExecutionContext } from '../../context/governance-context.js';

import type { SemanticIssue } from './semantic-issue.js';

export interface SemanticScanner {
  scan(context: GovernanceExecutionContext): readonly SemanticIssue[];
}
