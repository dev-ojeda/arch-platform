// packages/governance/src/compliance/compliance-rule-result.ts

import type { ComplianceStateChange, Diagnostic } from '@arch/platform-model';

export interface ComplianceRuleResult {
  readonly diagnostics: readonly Diagnostic[];
  readonly changes: readonly ComplianceStateChange[];
}
