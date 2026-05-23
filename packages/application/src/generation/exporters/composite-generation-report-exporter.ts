// packages/application/src/generation/exporters/composite-generation-report-exporter.ts

import type { GenerationReport, GenerationReportExporter } from '@arch/contracts';

export class CompositeGenerationReportExporter implements GenerationReportExporter {
  constructor(private readonly exporters: readonly GenerationReportExporter[]) {}

  async export(report: GenerationReport): Promise<void> {
    for (const exporter of this.exporters) {
      await exporter.export(report);
    }
  }
}
