// packages/application/src/runtime/execution/status/execution-status-pipeline.ts

export const PipelineEventTypes = {
  PipelineStarted: 'pipeline_started',
  PipelineCompleted: 'pipeline_completed',
  PipelineFailed: 'pipeline_failed',
  PipelineRetry: 'pipeline_retry',
  PipelineCancelled: 'pipeline_cancelled',
} as const;

export type PipelineEventTypes = (typeof PipelineEventTypes)[keyof typeof PipelineEventTypes];
