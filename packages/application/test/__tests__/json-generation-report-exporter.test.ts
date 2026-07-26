// packages\application\test\__tests__\json-generation-report-exporter.test.ts

import { describe, expect, it, vi } from 'vitest';

import type { GenerationReport } from '@arch/contracts';

import { JsonGenerationReportExporter } from '../../src/generation/exporters/json-generation-report-exporter.js';

describe('CreateTestJsonCompositeGenerationReportExport', () => {
  it('writes compact json report', async () => {
    const write = vi.fn().mockResolvedValue(undefined);

    const exporter = new JsonGenerationReportExporter({
      fs: { write } as never,
      outputPath: 'report.json',
    });

    const report = {
      generatorId: 'mvc',
    } as unknown as GenerationReport;

    await exporter.export(report);

    expect(write).toHaveBeenCalledWith('report.json', JSON.stringify(report));
  });
  it('writes pretty printed json report', async () => {
    const write = vi.fn().mockResolvedValue(undefined);

    const exporter = new JsonGenerationReportExporter({
      fs: { write } as never,
      outputPath: 'report.json',
      prettyPrint: true,
    });

    const report = {
      generatorId: 'mvc',
    } as unknown as GenerationReport;

    await exporter.export(report);

    expect(write).toHaveBeenCalledWith('report.json', JSON.stringify(report, null, 2));
  });
});
