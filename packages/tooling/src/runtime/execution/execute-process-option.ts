// packages/tooling/src/runtime/execution/execute-process-option.ts

import type { StdioMode } from '../../utils/stdio-mode.js';

export interface ExecuteProcessOptions {
  readonly cwd?: string;

  readonly env?: Readonly<Record<string, string>>;

  readonly shell?: boolean;

  readonly stdin?: StdioMode;

  readonly stdout?: StdioMode;

  readonly stderr?: StdioMode;
}

type DefaultProcessOptions = Pick<ExecuteProcessOptions, 'shell' | 'stdin' | 'stdout' | 'stderr'>;

export const DEFAULT_PROCESS_OPTIONS = {
  shell: false,
  stdin: 'inherit',
  stdout: 'inherit',
  stderr: 'inherit',
} as const satisfies DefaultProcessOptions;
