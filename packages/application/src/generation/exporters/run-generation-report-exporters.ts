// packages/application/src/generation/exporters/run-generation-report-exporters.ts

import type { GenerationReportExporter } from '@arch/contracts/exporters';
import type { GenerationReport } from '@arch/contracts/reports';

export async function runGenerationReportExporters(
  exporters: readonly GenerationReportExporter[],

  report: GenerationReport,
): Promise<void> {
  for (const exporter of exporters) {
    await exporter.export(report);
  }
}
