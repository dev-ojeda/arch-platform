// packages/governance/src/report/governance-report.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceRuleExecution } from '../engine/governance-rule-execution.js';

export type GovernanceStatus = 'passed' | 'failed';

export interface GovernanceReportSummary {
  readonly errors: number;

  readonly warnings: number;

  readonly info: number;

  readonly total: number;
}

export interface GovernanceReport {
  readonly status: GovernanceStatus;

  readonly summary: GovernanceReportSummary;

  readonly diagnostics: readonly Diagnostic[];

  readonly executions: readonly GovernanceRuleExecution[];

  readonly durationMs: number;

  readonly generatedAt: string;
}
