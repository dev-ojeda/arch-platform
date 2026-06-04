// packages/tooling/src/runtime/events/tooling-task-events.ts

export interface ToolingTaskEvents {
  readonly started: string;
  readonly completed: string;
  readonly failed: string;
  readonly skipped: string;
}
