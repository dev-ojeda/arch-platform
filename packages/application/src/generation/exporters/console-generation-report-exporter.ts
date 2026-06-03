// packages/application/src/generation/exporters/console-generation-report-exporter.ts

import type { GenerationReportExporter } from '@arch/contracts/exporters';
import type { LoggerPort } from '@arch/contracts/logging';
import type { GenerationReport } from '@arch/contracts/reports';

export interface ConsoleGenerationReportExporterOptions {
  logger: LoggerPort;
}

export class ConsoleGenerationReportExporter implements GenerationReportExporter {
  constructor(private readonly options: ConsoleGenerationReportExporterOptions) {}

  export(report: GenerationReport): Promise<void> {
    const warnings = report.diagnostics.filter((diagnostic) => diagnostic.level === 'warning');

    const errors = report.diagnostics.filter((diagnostic) => diagnostic.level === 'error');

    const lines = [
      report.success ? '✔ Generation completed' : '✖ Generation failed',

      '',

      `Files: ${report.generatedFiles.length}`,

      `Duration: ${report.duration}ms`,

      `Warnings: ${warnings.length}`,

      `Errors: ${errors.length}`,
    ];

    this.options.logger.info(lines.join('\n'));

    return Promise.resolve();
  }
}
