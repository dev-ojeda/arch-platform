// packages/application/src/generation/exporters/console-generation-report-exporter.ts

import type {
  GenerationReport,
  GenerationReportExporter,
  LoggerPort,
} from "@arch/contracts";

export interface ConsoleGenerationReportExporterOptions {
  logger: LoggerPort;
}

export class ConsoleGenerationReportExporter
  implements GenerationReportExporter
{
  constructor(
    private readonly options: ConsoleGenerationReportExporterOptions
  ) {}

  async export(report: GenerationReport): Promise<void> {
    const warnings = report.diagnostics.filter(
      (diagnostic) => diagnostic.level === "warning"
    );

    const errors = report.diagnostics.filter(
      (diagnostic) => diagnostic.level === "error"
    );

    const lines = [
      report.success ? "✔ Generation completed" : "✖ Generation failed",

      "",

      `Files: ${report.generatedFiles.length}`,

      `Duration: ${report.duration}ms`,

      `Warnings: ${warnings.length}`,

      `Errors: ${errors.length}`,
    ];

    this.options.logger.info(lines.join("\n"));
  }
}
