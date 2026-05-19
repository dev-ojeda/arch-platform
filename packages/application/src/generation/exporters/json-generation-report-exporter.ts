// packages/application/src/generation/exporters/json-generation-report-exporter.ts

import type {
  FileSystemPort,
  GenerationReport,
  GenerationReportExporter,
} from "@arch/contracts";

export interface JsonGenerationReportExporterOptions {
  fs: FileSystemPort;

  outputPath: string;

  prettyPrint?: boolean;
}

export class JsonGenerationReportExporter implements GenerationReportExporter {
  constructor(private readonly options: JsonGenerationReportExporterOptions) {}

  async export(report: GenerationReport): Promise<void> {
    const content = JSON.stringify(
      report,

      null,

      this.options.prettyPrint ? 2 : undefined
    );

    await this.options.fs.write(
      this.options.outputPath,

      content
    );
  }
}
