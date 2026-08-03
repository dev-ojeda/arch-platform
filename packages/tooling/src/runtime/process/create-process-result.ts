// packages/tooling/src/runtime/process/create-process-result.ts

import type {
  ExecuteProcessResult,
  ExecuteProcessResultInput,
} from '../execution/execute-process-result.js';

export function createProcessResult(options: ExecuteProcessResultInput): ExecuteProcessResult {
  const { command, commandLine, args, cwd, exitCode = 1, durationMs, signal } = options;

  return {
    command,
    commandLine,
    args,
    cwd,
    exitCode,
    durationMs,
    signal,
  };
}
