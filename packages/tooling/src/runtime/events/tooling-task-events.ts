// packages/tooling/src/runtime/events/tooling-task-events.ts

export type ArgumentEvents = {
  readonly invalid: string;
  readonly missing: string;
};
export interface ToolingTaskEvents {
  readonly started: string;
  readonly completed: string;
  readonly failed: string;
  readonly skipped: string;
  readonly argument: ArgumentEvents;
}
