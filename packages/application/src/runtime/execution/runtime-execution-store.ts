// packages/application/src/runtime/execution/runtime-execution-store.ts

import { RuntimeEventTypes } from '../../runtime/execution/events/runtime-event-types.js';


import type {
  PipelineCompletedEvent,
  PipelineFailedEvent,
  PipelineStartedEvent,
} from './events/pipeline-events.js';
import type {
  StepCompletedEvent,
  StepFailedEvent,
  StepStartedEvent,
} from './events/step-events.js';
import type { ExecutionListener, ExecutionState } from './runtime-execution-status.js';
import type { RuntimeEvent } from '../../runtime/execution/events/runtime-event.js';

export class RuntimeExecutionStore {
  private executions = new Map<string, ExecutionState>();
  private listeners = new Set<ExecutionListener>();

  // -------------------------
  // PUBLIC API
  // -------------------------

  subscribe(listener: ExecutionListener): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  getExecution(executionId: string): ExecutionState | undefined {
    const state = this.executions.get(executionId);

    return state ? structuredClone(state) : undefined;
  }

  getAllExecutions(): ExecutionState[] {
    return [...this.executions.values()].map((state) => structuredClone(state));
  }

  // -------------------------
  // EVENT ENTRYPOINT
  // -------------------------

  onEvent = (event: RuntimeEvent): void => {
    switch (event.type) {
      case RuntimeEventTypes.PipelineStarted:
        this.onPipelineStarted(event);
        break;

      case RuntimeEventTypes.PipelineCompleted:
        this.onPipelineCompleted(event);
        break;

      case RuntimeEventTypes.PipelineFailed:
        this.onPipelineFailed(event);
        break;

      case RuntimeEventTypes.StepStarted:
        this.onStepStarted(event);
        break;

      case RuntimeEventTypes.StepCompleted:
        this.onStepCompleted(event);
        break;

      case RuntimeEventTypes.StepFailed:
        this.onStepFailed(event);
        break;
    }
  };

  // -------------------------
  // REDUCERS
  // -------------------------

  private onPipelineStarted(event: PipelineStartedEvent): void {
    const state: ExecutionState = {
      executionId: event.executionId,
      pipelineId: event.pipelineId,
      status: 'running',
      startedAt: event.timestamp,
      steps: {},
      stepOrder: [],
    };

    this.executions.set(event.executionId, state);
    this.emit(state);
  }

  private onPipelineCompleted(event: PipelineCompletedEvent): void {
    const state = this.getExecution(event.executionId);
    if (!state) return;

    state.status = 'completed';
    state.finishedAt = event.timestamp;
    state.durationMs = event.timestamp - state.startedAt;
    this.executions.set(event.executionId, state);
    this.emit(state);
  }

  private onPipelineFailed(event: PipelineFailedEvent): void {
    const state = this.getExecution(event.executionId);
    if (!state) return;

    state.status = 'failed';
    state.finishedAt = event.timestamp;
    state.durationMs = event.timestamp - state.startedAt;
    state.error = event.error;
    this.executions.set(event.executionId, state);
    this.emit(state);
  }

  private onStepStarted(event: StepStartedEvent): void {
    const state = this.executions.get(event.executionId);

    if (!state) {
      return;
    }

    if (!state.steps[event.stepId]) {
      state.stepOrder.push(event.stepId);
    }

    state.steps[event.stepId] = {
      status: 'running',
      startedAt: event.timestamp,
      stepId: event.stepId,
      stepName: event.stepName,
    };

    this.emit(state);
  }

  private onStepCompleted(event: StepCompletedEvent): void {
    const state = this.getExecution(event.executionId);
    if (!state) return;

    const step = state.steps[event.stepId];
    if (!step) return;

    step.status = 'completed';
    step.finishedAt = event.timestamp;
    step.durationMs = event.durationMs;

    this.executions.set(event.executionId, state);
    this.emit(state);
  }

  private onStepFailed(event: StepFailedEvent): void {
    const state = this.getExecution(event.executionId);
    if (!state) return;

    const step = state.steps[event.stepId];
    if (!step) return;

    step.status = 'failed';
    step.finishedAt = event.timestamp;
    step.durationMs = event.durationMs;
    step.error = event.error;
    this.executions.set(event.executionId, state);
    this.emit(state);
  }

  // -------------------------
  // INTERNAL
  // -------------------------

  private emit(state: ExecutionState): void {
    for (const listener of this.listeners) {
      listener(structuredClone(state));
    }
  }
}
