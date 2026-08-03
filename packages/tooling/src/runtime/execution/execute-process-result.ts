// packages/tooling/src/runtime/execution/execute-process-result.ts

export interface ExecuteProcessResult {
  readonly command: string;

  readonly commandLine: string;

  readonly args: readonly string[];

  readonly cwd?: string;

  readonly exitCode: number;

  readonly stdout?: string;

  readonly stderr?: string;

  readonly durationMs: number;

  readonly signal?: NodeJS.Signals;
}
export type ExecuteProcessResultInput = ExecuteProcessResult;
