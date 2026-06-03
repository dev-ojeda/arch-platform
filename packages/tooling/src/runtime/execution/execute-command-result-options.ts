// packages/tooling/src/runtime/execution/execute-command-result-options.ts

export interface ExecuteCommandResultOptions {
  readonly command: string;

  readonly commandLine: string;

  readonly args: readonly string[];

  readonly cwd?: string;

  readonly exitCode: number;

  readonly stdout: string;

  readonly stderr: string;

  readonly durationMs: number;

  readonly signal?: NodeJS.Signals;

  readonly failed?: boolean;
}
