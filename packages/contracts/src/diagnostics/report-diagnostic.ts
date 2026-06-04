// packages\contracts\src\diagnostics\report-diagnostic.ts

import type { GenerationContext } from '../generation/generation-context.js';

import type { GenerationDiagnosticLevel } from './generation-diagnostic-level.js';
import type { GenerationDiagnostic } from './generation-diagnostic.js';

export interface ReportDiagnosticOptions {
  level: GenerationDiagnosticLevel;

  message: string;

  step?: string;

  metadata?: Record<string, unknown>;
}

export function reportDiagnostic(
  context: Pick<GenerationContext, 'diagnostics'>,
  diagnostic: GenerationDiagnostic,
): void {
  context.diagnostics.push(diagnostic);
}
