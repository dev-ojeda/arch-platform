// packages/application/src/generation/exporters/composite-generation-report-exporter.ts

import type { GenerationReportExporter } from '@arch/contracts/exporters';
import type { GenerationReport } from '@arch/contracts/reports';

export class CompositeGenerationReportExporter implements GenerationReportExporter {
  constructor(private readonly exporters: readonly GenerationReportExporter[]) {}

  async export(report: GenerationReport): Promise<void> {
    for (const exporter of this.exporters) {
      await exporter.export(report);
    }
  }
}
