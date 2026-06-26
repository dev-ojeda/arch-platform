// packages/governance/test/report/governance-report-builder.test.ts

import { describe, expect, it } from 'vitest';

import { GovernanceReportBuilder } from '../../src/report/governance-report-builder.js';

describe('GovernanceReportBuilder', () => {
  it('creates a passed report when there are no diagnostics', () => {
    const report = new GovernanceReportBuilder().build([]);
    expect(report).toMatchObject({
      status: 'passed',

      summary: {
        errors: 0,

        warnings: 0,

        info: 0,

        total: 0,
      },
    });

    expect(report.diagnostics).toHaveLength(0);
  });

  it('creates a failed report when errors exist', () => {
    const report = new GovernanceReportBuilder().build([
      {
        code: 'ARCH_PRIVATE_API_ACCESS',

        severity: 'error',

        source: 'governance',

        message: 'private import detected',
      },
    ]);
    expect(report.status).toBe('failed');

    expect(report.summary).toMatchObject({
      errors: 1,

      warnings: 0,

      info: 0,

      total: 1,
    });

    expect(report.diagnostics[0]).toMatchObject({
      code: 'ARCH_PRIVATE_API_ACCESS',
    });
  });

  it('counts warnings and info diagnostics', () => {
    const report = new GovernanceReportBuilder().build([
      {
        code: 'A',
        severity: 'warning',
        message: 'warn',
      },

      {
        code: 'B',
        severity: 'info',
        message: 'info',
      },
    ]);
    expect(report.summary).toMatchObject({
      errors: 0,

      warnings: 1,

      info: 1,

      total: 2,
    });

    expect(report.status).toBe('passed');
  });
});
