// packages/tooling/src/runtime/task/run-task-options.ts

import type { ToolingTaskDescriptor } from '../events/tooling-task-events.js';

import type { TaskResult } from './task-result.js';

export interface RunTaskOptions<TResult extends TaskResult> {
  readonly task: ToolingTaskDescriptor;
  readonly action: () => Promise<TResult>;

  readonly emitCompletedEvent?: boolean;
}
