// packages/tooling/src/runtime/execution/execute-command-option.ts

import type { StdioMode } from '../../utils/stdio-mode.js';

export interface ExecuteCommandOptions {
  readonly cwd?: string;

  readonly env?: Readonly<Record<string, string>>;

  readonly shell?: boolean;

  readonly stdin?: StdioMode;

  readonly stdout?: StdioMode;

  readonly stderr?: StdioMode;
}

type DefaultExecutionOptions = Pick<ExecuteCommandOptions, 'shell' | 'stdin' | 'stdout' | 'stderr'>;

export const DEFAULT_EXECUTION_OPTIONS = {
  shell: false,
  stdin: 'inherit',
  stdout: 'inherit',
  stderr: 'inherit',
} as const satisfies DefaultExecutionOptions;

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
