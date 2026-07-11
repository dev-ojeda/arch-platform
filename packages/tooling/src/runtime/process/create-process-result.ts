// packages/tooling/src/runtime/process/create-process-result.ts

import type { ExecuteCommandResultOptions } from '../execution/execute-command-option.js';
import type { ExecuteCommandResult } from '../execution/execute-command-result.js';

export function createProcessResult(options: ExecuteCommandResultOptions): ExecuteCommandResult {
  const {
    command,
    commandLine,
    args,
    cwd,
    exitCode = 1,
    stdout,
    stderr,
    durationMs,
    signal,
  } = options;

  const failed = exitCode !== 0;

  return {
    command,
    commandLine,
    args,
    cwd,
    exitCode,
    stdout,
    stderr,
    durationMs,
    signal,
    failed,
  };
}
