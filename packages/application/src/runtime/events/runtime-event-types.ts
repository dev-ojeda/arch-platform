// packages/application/src/runtime/events/runtime-event-types.ts
export const RuntimeEventTypes = {
  StepStarted: "step_started",
  StepCompleted: "step_completed",
  StepFailed: "step_failed",
  StepRetry: "step_retry",
  PipelineStarted: "pipeline_started",
  PipelineCompleted: "pipeline_completed",
  PipelineFailed: "pipeline_failed",
} as const;

export type RuntimeEventType =
  (typeof RuntimeEventTypes)[keyof typeof RuntimeEventTypes];
