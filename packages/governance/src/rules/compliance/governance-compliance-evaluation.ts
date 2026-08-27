// packages/governance/src/rules/compliance/governance-compliance-evaluation.ts

import type { ComplianceStateChange, Diagnostic } from '@arch/platform-model';

export interface GovernanceComplianceEvaluation {
  readonly diagnostics: readonly Diagnostic[];
  readonly changes: readonly ComplianceStateChange[];
}
