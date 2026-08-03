// packages/tooling/src/runtime/events/tooling-task-events.ts

import type { TaskEvents } from '../task/task-event-types.js';
import { createTaskEvents } from '../task/task-events.js';

export interface ToolingTaskEvents extends TaskEvents {
  readonly started: string;
  readonly completed: string;
  readonly failed: string;
  readonly skipped: string;
}
export interface ToolingTaskDescriptor {
  readonly id: string;
  readonly label: string;
  readonly events: ToolingTaskEvents;
}
export const ToolingTasks = {
  build: createToolingTask('tooling.build', 'Building'),
  lint: createToolingTask('tooling.lint', 'Linting'),
  test: createToolingTask('tooling.test', 'Running tests'),
  typecheck: createToolingTask('tooling.typecheck', 'Typechecking'),
  clean: createToolingTask('tooling.clean', 'Cleaning'),
} as const satisfies Record<string, ToolingTaskDescriptor>;

function createToolingTask(id: string, label: string): ToolingTaskDescriptor {
  return {
    id,
    label,
    events: createTaskEvents(id),
  };
}
