// packages/governance/src/diagnostics/diagnostic.ts
export type DiagnosticSeverity = 'info' | 'warning' | 'error';

export interface DiagnosticLocation {
  file?: string;

  line?: number;

  column?: number;
}

export interface Diagnostic {
  code: string;

  severity: DiagnosticSeverity;

  message: string;

  source?: string;

  location?: DiagnosticLocation;

  hint?: string;

  metadata?: Record<string, unknown>;
}
