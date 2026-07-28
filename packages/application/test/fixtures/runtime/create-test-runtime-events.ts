// packages/application/test/fixtures/runtime/create-test-runtime-events.ts

import type {
  PipelineCompletedEvent,
  PipelineFailedEvent,
  PipelineStartedEvent,
} from '../../../src/runtime/execution/events/pipeline-events.js';
import { RuntimeEventTypes } from '../../../src/runtime/execution/events/runtime-event-types.js';
import type {
  StepCompletedEvent,
  StepFailedEvent,
  StepStartedEvent,
} from '../../../src/runtime/execution/events/step-events.js';

export function createPipelineStartedEvent(
  overrides: Partial<PipelineStartedEvent> = {},
): PipelineStartedEvent {
  return {
    executionId: 'execution-1',
    pipelineId: 'generation-pipeline',
    timestamp: 100,
    type: RuntimeEventTypes.PipelineStarted,
    ...overrides,
  };
}

export function createPipelineCompletedEvent(
  overrides: Partial<PipelineCompletedEvent> = {},
): PipelineCompletedEvent {
  return {
    executionId: 'execution-1',
    pipelineId: 'generation-pipeline',
    timestamp: 200,
    type: RuntimeEventTypes.PipelineCompleted,
    ...overrides,
  };
}

export function createPipelineFailedEvent(
  overrides: Partial<PipelineFailedEvent> = {},
): PipelineFailedEvent {
  return {
    executionId: 'execution-1',
    pipelineId: 'generation-pipeline',
    timestamp: 200,
    error: new Error('pipeline failure'),
    type: RuntimeEventTypes.PipelineFailed,
    ...overrides,
  };
}

export function createStepStartedEvent(
  overrides: Partial<StepStartedEvent> = {},
): StepStartedEvent {
  return {
    executionId: 'execution-1',
    pipelineId: 'generation-pipeline',
    stepId: 'resolve-variables',
    stepName: 'resolve-variables',
    timestamp: 110,
    type: RuntimeEventTypes.StepStarted,
    ...overrides,
  };
}

export function createStepCompletedEvent(
  overrides: Partial<StepCompletedEvent> = {},
): StepCompletedEvent {
  return {
    executionId: 'execution-1',
    pipelineId: 'generation-pipeline',
    stepId: 'resolve-variables',
    stepName: 'resolve-variables',
    timestamp: 130,
    durationMs: 20,
    type: RuntimeEventTypes.StepCompleted,
    ...overrides,
  };
}

export function createStepFailedEvent(overrides: Partial<StepFailedEvent> = {}): StepFailedEvent {
  return {
    executionId: 'execution-1',
    pipelineId: 'generation-pipeline',
    stepId: 'resolve-variables',
    stepName: 'resolve-variables',
    timestamp: 130,
    durationMs: 20,
    error: new Error('step failure'),
    type: RuntimeEventTypes.StepFailed,
    ...overrides,
  };
}
