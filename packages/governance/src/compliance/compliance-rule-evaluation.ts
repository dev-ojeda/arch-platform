// packages/governance/src/compliance/compliance-rule-evaluation.ts

import type { ComplianceStateChange, Diagnostic } from '@arch/platform-model';

export interface ComplianceRuleEvaluation {
  readonly diagnostics: readonly Diagnostic[];
  readonly changes: readonly ComplianceStateChange[];
}
