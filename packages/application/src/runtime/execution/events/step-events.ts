// packages/application/src/runtime/execution/events/step-events.ts

import type { BaseRuntimeEvent } from './base-runtime-event.js';
import type { RuntimeEventTypes } from './runtime-event-types.js';

export type StepEvent =
  | StepStartedEvent
  | StepCompletedEvent
  | StepFailedEvent
  | StepRetryEvent
  | StepCancelledEvent;

interface BaseStepEvent extends BaseRuntimeEvent {
  readonly stepId: string;

  readonly stepName: string;
}

export interface StepStartedEvent extends BaseStepEvent {
  readonly type: typeof RuntimeEventTypes.StepStarted;
}

export interface StepCompletedEvent extends BaseStepEvent {
  readonly type: typeof RuntimeEventTypes.StepCompleted;

  readonly durationMs: number;
}

export interface StepFailedEvent extends BaseStepEvent {
  readonly type: typeof RuntimeEventTypes.StepFailed;

  readonly error: unknown;

  readonly durationMs: number;
}

export interface StepRetryEvent extends BaseStepEvent {
  readonly type: typeof RuntimeEventTypes.StepRetry;

  readonly retryCount: number;

  readonly error?: unknown;
}

export interface StepCancelledEvent extends BaseStepEvent {
  readonly type: typeof RuntimeEventTypes.StepCancelled;

  readonly reason?: string;
}
