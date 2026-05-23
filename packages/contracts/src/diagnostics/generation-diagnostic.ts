// packages/contracts/src/diagnostics/generation-diagnostic.ts

import type { GenerationDiagnosticLevel } from './generation-diagnostic-level.js';

export interface GenerationDiagnostic {
  readonly level: GenerationDiagnosticLevel;

  readonly message: string;

  readonly step?: string;

  readonly timestamp: number;

  readonly metadata?: Record<string, unknown>;
}
