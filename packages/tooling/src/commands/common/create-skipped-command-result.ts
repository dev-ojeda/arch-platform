// packages/tooling/src/commands/common/create-skipped-command-result.ts

import type { TaskProcessResult } from '../../runtime/task/task-process-result.js';

export function createSkippedCommandResult(): TaskProcessResult {
  return {
    status: 'skipped',
    execution: {
      command: '',
      commandLine: '',
      args: [],
      exitCode: 0,
      durationMs: 0,
      stdout: '',
      stderr: '',
    },
  };
}
