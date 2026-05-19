// packages/contracts/src/exporters/generation-console-report-exporter.ts

import type { LoggerPort } from "../logging/logger.port.js";

export interface ConsoleGenerationReportExporterOptions {
  logger: LoggerPort;

  verbose?: boolean;
}
