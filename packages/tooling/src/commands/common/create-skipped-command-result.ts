// packages/tooling/src/commands/common/create-skipped-command-result.ts

import { createProcessResult } from '../../runtime/process/create-process-result.js';

import type { ExecuteCommandResult } from '../../runtime/execution/execute-command-result.js';

export function createSkippedCommandResult(command: string): ExecuteCommandResult {
  return {
    ...createProcessResult({
      command,
      commandLine: '',
      args: [],
      exitCode: 0,
      stdout: '',
      stderr: '',
      durationMs: 0,
    }),
    skipped: true,
  };
}
