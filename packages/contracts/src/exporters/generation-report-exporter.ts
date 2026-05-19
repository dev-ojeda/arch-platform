// packages/contracts/src/exporters/generation-report-exporter.ts

import type { GenerationReport } from "../reports/generation-report.js";

export interface GenerationReportExporter {
  export(report: GenerationReport): Promise<void>;
}
