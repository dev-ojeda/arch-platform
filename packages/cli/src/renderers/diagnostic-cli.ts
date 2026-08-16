// packages/cli/src/renderers/diagnostic-cli.ts

export interface DiagnosticCli {
  readonly code: string;

  readonly severity: 'error' | 'warning' | 'info';

  readonly message: string;

  readonly source?: string;

  readonly location?: {
    readonly file?: string;
    readonly line?: number;
    readonly column?: number;
  };

  readonly hint?: string;

  readonly metadata?: Readonly<Record<string, unknown>>;
}
