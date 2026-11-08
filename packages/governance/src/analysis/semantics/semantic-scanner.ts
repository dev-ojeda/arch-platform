// packages/governance/src/analysis/semantics/semantic-scanner.ts

import type { SemanticIssue } from './semantic-issue.js';
import type { GovernanceExecutionContext } from '../../context/governance-execution-context.js';


export interface SemanticScanner {
  scan(context: GovernanceExecutionContext): readonly SemanticIssue[];
}
