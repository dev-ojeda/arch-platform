// packages/tooling/src/runtime/execution/execution-metadata.ts

export interface ExecutionMetadata extends Record<string, unknown> {
  readonly command: string;

  readonly args: readonly string[];

  readonly commandLine: string;

  readonly cwd?: string;

  readonly exitCode: number;

  readonly durationMs: number;

  readonly duration: string;

  readonly signal?: NodeJS.Signals;

  readonly terminated: boolean;

  readonly stdoutSize: string;

  readonly stderrSize: string;
}
