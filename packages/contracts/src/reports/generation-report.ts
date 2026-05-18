import type { GenerationDiagnostic } from "../diagnostics/generation-diagnostic.js";
import type { GenerationEvent } from "../events/generation-event.js";
import type { StepExecutionMetric } from "../telemetry/step-execution-metric.js";

// packages/contracts/src/reports/generation-report.ts
export interface GenerationReport {
  readonly success: boolean;

  readonly duration: number;

  readonly generatedFiles: readonly string[];

  readonly diagnostics: readonly GenerationDiagnostic[];

  readonly metrics: readonly StepExecutionMetric[];

  readonly events: readonly GenerationEvent[];
}
