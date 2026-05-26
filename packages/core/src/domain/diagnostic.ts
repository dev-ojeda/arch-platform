// packages/core/src/domain/diagnostic.ts

export type DiagnosticSeverity = 'info' | 'warning' | 'error';

export interface Diagnostic {
  code: string;

  message: string;

  severity: DiagnosticSeverity;

  source?: string;

  location?: string;

  suggestion?: string;

  metadata?: Record<string, unknown>;
}
