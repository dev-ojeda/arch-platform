// packages/tooling/src/runtime/task/task-event-types.ts

export interface ArgumentEvents {
  readonly invalid: string;
  readonly missing: string;
}

export interface TaskEvents {
  readonly started: string;
  readonly completed: string;
  readonly failed: string;
  readonly skipped: string;
  readonly argument: ArgumentEvents;
}
