// packages/tooling/src/runtime/helpers/create-command-result.ts

import type { ExecuteCommandResultOptions } from '../execution/execute-command-result-options.js';
import type { ExecuteCommandResult } from '../execution/execute-command-result.js';

export function createCommandResult(options: ExecuteCommandResultOptions): ExecuteCommandResult {
  const {
    command,
    commandLine,
    args,
    cwd,
    exitCode,
    stdout,
    stderr,
    durationMs,
    signal,
    failed = exitCode !== 0,
  } = options;

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
