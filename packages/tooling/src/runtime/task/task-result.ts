// packages/tooling/src/runtime/task/task-result.ts

import type { TaskStatus } from './task-status.js';

export interface TaskResult {
  readonly status: TaskStatus;

  readonly durationMs?: number;
}
