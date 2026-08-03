// packages/tooling/src/runtime/task/task-process-result.ts

import type { ExecuteProcessResult } from '../execution/execute-process-result.js';

import type { TaskResult } from './task-result.js';

export interface TaskProcessResult extends TaskResult {
  readonly execution: ExecuteProcessResult;
}
