// packages\contracts\src\diagnostics\report-diagnostic.ts

import type { GenerationDiagnosticLevel } from './generation-diagnostic-level.js';

export interface ReportDiagnosticOptions {
  level: GenerationDiagnosticLevel;

  message: string;

  step?: string;

  metadata?: Record<string, unknown>;
}
