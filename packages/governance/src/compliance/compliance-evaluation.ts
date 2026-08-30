// packages/governance/src/compliance/compliance-evaluation.ts

export interface ComplianceEvaluation {
  readonly diagnostics: readonly import('@arch/platform-model').Diagnostic[];
  readonly changes: readonly import('@arch/platform-model').ComplianceStateChange[];
  readonly executions: number;
}
