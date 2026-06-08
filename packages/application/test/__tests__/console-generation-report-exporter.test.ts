// packages\application\test\__tests__\console-generation-report-exporter.test.ts
import { describe, expect, it, vi } from 'vitest';

import { ConsoleGenerationReportExporter } from '../../src/generation/exporters/console-generation-report-exporter.js';

describe('CreateTestConsoleGenerationReportExporter', () => {
  function createLoggerMock() {
    return {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
  }
  it('logs successful report summary', async () => {
    const logger = createLoggerMock();
    const exporter = new ConsoleGenerationReportExporter({
      logger,
    });

    await exporter.export({
      success: true,
      duration: 150,
      generatedFiles: ['a.ts', 'b.ts'],
      diagnostics: [{ level: 'warning' }, { level: 'error' }],
    } as never);

    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('✔ Generation completed'));

    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Files: 2'));
  });
  it('logs failed report summary', async () => {
    const logger = createLoggerMock();
    const exporter = new ConsoleGenerationReportExporter({
      logger,
    });

    await exporter.export({
      success: false,
      duration: 50,
      generatedFiles: [],
      diagnostics: [],
    } as never);

    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('✖ Generation failed'));
  });
});
