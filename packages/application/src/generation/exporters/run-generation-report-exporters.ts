// packages/application/src/generation/exporters/run-generation-report-exporters.ts

import type { GenerationReport, GenerationReportExporter } from '@arch/contracts';

export async function runGenerationReportExporters(
  exporters: readonly GenerationReportExporter[],

  report: GenerationReport,
): Promise<void> {
  for (const exporter of exporters) {
    await exporter.export(report);
  }
}
