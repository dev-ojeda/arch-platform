// packages/application/src/runtime/execution/events/pipeline-events.ts

import type { BaseRuntimeEvent } from './base-runtime-event.js';
import type { RuntimeEventTypes } from './runtime-event-types.js';

export type PipelineEvent = PipelineStartedEvent | PipelineCompletedEvent | PipelineFailedEvent;

interface BasePipelineEvent extends BaseRuntimeEvent {
  readonly executionId: string;

  readonly pipelineId: string;

  readonly timestamp: number;

  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface PipelineStartedEvent extends BasePipelineEvent {
  readonly type: typeof RuntimeEventTypes.PipelineStarted;
}

export interface PipelineCompletedEvent extends BasePipelineEvent {
  readonly type: typeof RuntimeEventTypes.PipelineCompleted;

  readonly durationMs?: number;
}

export interface PipelineFailedEvent extends BasePipelineEvent {
  readonly type: typeof RuntimeEventTypes.PipelineFailed;

  readonly error: unknown;

  readonly durationMs?: number;
}
