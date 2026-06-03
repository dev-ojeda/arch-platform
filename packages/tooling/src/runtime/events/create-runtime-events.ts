// packages/tooling/src/runtime/events/create-runtime-events.ts

// runtime/events/create-runtime-events.ts

export interface RuntimeTaskEvents {
  readonly started: string;
  readonly completed: string;
  readonly failed: string;
  readonly crashed: string;
}

export function createRuntimeEvents(task: string): RuntimeTaskEvents {
  return {
    started: `${task}.started`,
    completed: `${task}.completed`,
    failed: `${task}.failed`,
    crashed: `${task}.crashed`,
  };
}
