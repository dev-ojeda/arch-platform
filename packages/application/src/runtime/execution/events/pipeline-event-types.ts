// packages/application/src/runtime/execution/events/pipeline-event-types.ts

export const PipelineEventTypes = {
  PipelineStarted: 'pipeline_started',
  PipelineCompleted: 'pipeline_completed',
  PipelineFailed: 'pipeline_failed',
  PipelineRetry: 'pipeline_retry',
  PipelineCancelled: 'pipeline_cancelled',
} as const;

export type PipelineEventTypes = (typeof PipelineEventTypes)[keyof typeof PipelineEventTypes];
