// packages/governance/src/report/governance-report-builder.ts

import type { Diagnostic } from '../diagnostics/diagnostic.js';

import type { GovernanceReport } from './governance-report.js';

export class GovernanceReportBuilder {
  build(diagnostics: readonly Diagnostic[]): GovernanceReport {
    const errors = diagnostics.filter((item) => item.severity === 'error').length;

    const warnings = diagnostics.filter((item) => item.severity === 'warning').length;

    const info = diagnostics.filter((item) => item.severity === 'info').length;

    return {
      status: errors > 0 ? 'failed' : 'passed',

      summary: {
        errors,

        warnings,

        info,

        total: diagnostics.length,
      },

      diagnostics,

      generatedAt: new Date().toISOString(),
    };
  }
}
