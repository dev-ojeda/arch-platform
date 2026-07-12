// packages/tooling/src/runtime/task/run-task-options.ts

import type { ToolingTaskEvents } from '../events/tooling-task-events.js';

export interface TaskResult {
  readonly exitCode: number;
}

export interface RunTaskOptions<TResult extends TaskResult> {
  readonly events: ToolingTaskEvents;
  readonly action: () => Promise<TResult>;

  readonly emitCompletedEvent?: boolean;
}
