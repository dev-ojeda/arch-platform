// packages/application/src/runtime/execution/events/runtime-event-types.ts

export const RuntimeEventTypes = {
  StepStarted: 'step_started',
  StepCompleted: 'step_completed',
  StepFailed: 'step_failed',
  StepRetry: 'step_retry',
  StepCancelled: 'step_cancelled',

  PipelineStarted: 'pipeline_started',
  PipelineCompleted: 'pipeline_completed',
  PipelineFailed: 'pipeline_failed',
  PipelineRetry: 'pipeline_retry',
  PipelineCancelled: 'pipeline_cancelled',
} as const;

export type RuntimeEventType = (typeof RuntimeEventTypes)[keyof typeof RuntimeEventTypes];
