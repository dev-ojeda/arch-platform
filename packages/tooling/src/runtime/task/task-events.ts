// packages/tooling/src/runtime/task/task-events.ts

import type { TaskEvents } from './task-event-types.js';

export function createBaseTaskEvents(task: string) {
  return {
    started: `${task}.started`,
    completed: `${task}.completed`,
    failed: `${task}.failed`,
  } as const;
}
export function createTaskEvents(task: string): TaskEvents {
  return {
    ...createBaseTaskEvents(task),
    skipped: `${task}.skipped`,
    argument: {
      invalid: `${task}.arguments.invalid`,
      missing: `${task}.arguments.missing`,
    },
  };
}
