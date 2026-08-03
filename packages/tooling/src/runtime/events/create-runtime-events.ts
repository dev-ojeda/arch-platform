// packages/tooling/src/runtime/events/create-runtime-events.ts

import { createBaseTaskEvents } from '../task/task-events.js';

export interface RuntimeTaskEvents {
  readonly started: string;
  readonly completed: string;
  readonly failed: string;
  readonly crashed: string;
}

export function createRuntimeEvents(task: string): RuntimeTaskEvents {
  return {
    ...createBaseTaskEvents(task),
    crashed: `${task}.crashed`,
  };
}
