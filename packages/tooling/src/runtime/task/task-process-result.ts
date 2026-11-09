// packages/tooling/src/runtime/task/task-process-result.ts

import type { TaskResult } from './task-result.js';
import type { ExecuteProcessResult } from '../execution/execute-process-result.js';


export interface TaskProcessResult extends TaskResult {
  readonly execution: ExecuteProcessResult;
}
