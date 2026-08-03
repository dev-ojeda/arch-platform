// packages/governance/src/report/governance-report.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceRuleResult } from '../engine/governance-rule-result.js';

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

  readonly executions: readonly GovernanceRuleResult[];

  readonly durationMs: number;

  readonly generatedAt: string;
}
