// packages/governance/src/compliance/compliance-evaluation.ts

import type { ComplianceStateChange, Diagnostic } from '@arch/platform-model';

export interface ComplianceEvaluation {
  readonly diagnostics: readonly Diagnostic[];
  readonly changes: readonly ComplianceStateChange[];
  readonly executions: number;
}
