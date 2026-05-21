// packages/application/src/generation/diagnostics/report-diagnostic.ts

import type { GenerationContext } from "../generation/generation-context.js";
import type { GenerationDiagnosticLevel } from "./generation-diagnostic-level.js";

export interface ReportDiagnosticOptions {
  level: GenerationDiagnosticLevel;

  message: string;

  step?: string;

  metadata?: Record<string, unknown>;
}

export function reportDiagnostic(
  context: GenerationContext,

  options: ReportDiagnosticOptions
): void {
  context.diagnostics.push({
    level: options.level,

    message: options.message,

    step: options.step,

    metadata: options.metadata,

    timestamp: Date.now(),
  });
}
