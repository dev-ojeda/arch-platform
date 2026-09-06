// packages/governance/src/analysis/semantics/semantic-issue.ts

import type { Diagnostic } from '@arch-platform/platform-model';

export interface SemanticIssue extends Diagnostic {
  readonly symbolId: string;
}
