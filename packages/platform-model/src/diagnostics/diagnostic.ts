// packages/platform-model/src/diagnostics/diagnostic.ts

import type { DiagnosticLocation } from './diagnostic-location.js';
import type { DiagnosticSeverity } from './diagnostic-severity.js';

export interface Diagnostic {
  readonly code: string;

  readonly severity: DiagnosticSeverity;

  readonly message: string;

  readonly source?: string;

  readonly location?: DiagnosticLocation;

  readonly hint?: string;

  readonly metadata?: Readonly<Record<string, unknown>>;
}
