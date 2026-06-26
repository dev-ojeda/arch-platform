// test/report/governance-report-builder.test.ts

import { describe, expect, it } from 'vitest';

import { GovernanceReportBuilder } from '../../src/report/governance-report-builder.js';

describe('GovernanceReportBuilder', () => {
  const builder = new GovernanceReportBuilder();

  it('creates a passed report when there are no diagnostics', () => {
    const report = builder.build({
      success: true,
      diagnostics: [],
      durationMs: 10,
      evaluatedRules: 0,
      executions: [],
    });

    expect(report.status).toBe('passed');

    expect(report.summary).toEqual({
      errors: 0,
      warnings: 0,
      info: 0,
      total: 0,
    });
  });

  it('creates a failed report when errors exist', () => {
    const report = builder.build({
      success: false,

      diagnostics: [
        {
          code: 'ERR',
          severity: 'error',
          message: 'failed',
        },
      ],

      durationMs: 20,
      evaluatedRules: 1,
      executions: [],
    });

    expect(report.status).toBe('failed');

    expect(report.summary.errors).toBe(1);
  });

  it('counts warnings and info diagnostics', () => {
    const report = builder.build({
      success: true,

      diagnostics: [
        {
          code: 'W',
          severity: 'warning',
          message: 'warn',
        },
        {
          code: 'I',
          severity: 'info',
          message: 'info',
        },
      ],

      durationMs: 5,
      evaluatedRules: 2,
      executions: [],
    });

    expect(report.summary).toEqual({
      errors: 0,
      warnings: 1,
      info: 1,
      total: 2,
    });
  });
});
