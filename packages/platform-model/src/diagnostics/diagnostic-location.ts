// packages/platform-model/src/diagnostics/diagnostic-location.ts

export interface DiagnosticLocation {
  readonly file?: string;
  readonly line?: number;
  readonly column?: number;
}
