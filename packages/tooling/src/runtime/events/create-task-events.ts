// runtime/events/create-task-events.ts

import type { ToolingTaskEvents } from './tooling-task-events.js';

export function createTaskEvents(task: string): ToolingTaskEvents {
  return {
    started: `${task}.started`,
    completed: `${task}.completed`,
    failed: `${task}.failed`,
    skipped: `${task}.skipped`,
    argument: {
      invalid: `${task}.arguments.invalid`,
      missing: `${task}.arguments.missing`,
    },
  };
}
