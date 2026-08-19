// packages/tooling/src/runtime/process/create-process-result.ts

import type {
  ExecuteProcessResult,
  ExecuteProcessResultInput,
} from '../execution/execute-process-result.js';

export function createProcessResult(options: ExecuteProcessResultInput): ExecuteProcessResult {
  const {
    command,
    commandLine,
    args,
    exitCode = 1,
    stdout,
    stderr,
    cwd,
    durationMs,
    signal,
  } = options;

  return {
    command,
    commandLine,
    args,
    exitCode,
    stdout,
    stderr,
    cwd,
    durationMs,
    signal,
  };
}
