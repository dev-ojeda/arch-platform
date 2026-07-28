// packages/governance/src/report/governance-report-builder.ts

import type { GovernanceEngineResult } from '../engine/governance-engine-result.js';

import type { GovernanceReport } from './governance-report.js';

export class GovernanceReportBuilder {
  build(result: GovernanceEngineResult): GovernanceReport {
    return {
      status: result.success ? 'passed' : 'failed',

      summary: this.createSummary(result.diagnostics),

      diagnostics: result.diagnostics,

      executions: result.executions,

      durationMs: result.durationMs,

      generatedAt: new Date().toISOString(),
    };
  }

  private createSummary(diagnostics: readonly { severity: string }[]) {
    return {
      errors: diagnostics.filter((item) => item.severity === 'error').length,

      warnings: diagnostics.filter((item) => item.severity === 'warning').length,

      info: diagnostics.filter((item) => item.severity === 'info').length,

      total: diagnostics.length,
    };
  }
}
