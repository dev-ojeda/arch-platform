// packages/tooling/src/runtime/task/create-process-task-result.ts

import type { ExecuteProcessResult } from '../execution/execute-process-result.js';

import type { TaskProcessResult } from './task-process-result.js';

export function createProcessTaskResult(execution: ExecuteProcessResult): TaskProcessResult {
  return {
    status: execution.exitCode === 0 ? 'completed' : 'failed',
    durationMs: execution.durationMs,
    execution,
  };
}
