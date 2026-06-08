// packages\application\test\__tests__\composite-generation-report-exporter.test.ts

import type { GenerationReport } from '@arch/contracts/reports';
import { describe, expect, it, vi } from 'vitest';

import { CompositeGenerationReportExporter } from '../../src/generation/exporters/composite-generation-report-exporter.js';

describe('CreateTestCompositeGenerationExport', () => {
  it('exports report through all exporters', async () => {
    const exporterA = {
      export: vi.fn(),
    };

    const exporterB = {
      export: vi.fn(),
    };

    const composite = new CompositeGenerationReportExporter([exporterA, exporterB]);

    const report = {} as GenerationReport;

    await composite.export(report);

    expect(exporterA.export).toHaveBeenCalledWith(report);
    expect(exporterB.export).toHaveBeenCalledWith(report);
  });
  it('exports in registration order', async () => {
    const calls: string[] = [];
    const exporterA = {
      export: () => {
        calls.push('a');
        return Promise.resolve();
      },
    };

    const exporterB = {
      export: () => {
        calls.push('b');
        return Promise.resolve();
      },
    };
    const composite = new CompositeGenerationReportExporter([exporterA, exporterB]);

    await composite.export({} as GenerationReport);

    expect(calls).toEqual(['a', 'b']);
  });
  it('propagates exporter failures', async () => {
    const error = new Error('boom');

    const composite = new CompositeGenerationReportExporter([
      {
        export: vi.fn().mockRejectedValue(error),
      },
    ]);

    await expect(composite.export({} as GenerationReport)).rejects.toThrow('boom');
  });
});
