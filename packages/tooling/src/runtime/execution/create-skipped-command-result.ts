// packages/tooling/src/runtime/execution/create-skipped-command-result.ts

import { createCommandResult } from '../helpers/create-command-result.js';

import type { ExecuteCommandResult } from './execute-command-result.js';

export function createSkippedCommandResult(command: string): ExecuteCommandResult {
  return {
    ...createCommandResult({
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
