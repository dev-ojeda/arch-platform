// packages\application\test\unit\runtime\runtime-execution-store.test.ts

import { describe, expect, it, vi } from 'vitest';

import { RuntimeEventTypes } from '../../../src/runtime/execution/events/runtime-event-types.js';
import { RuntimeExecutionStore } from '../../../src/runtime/execution/runtime-execution-store.js';
import {
  createPipelineCompletedEvent,
  createPipelineFailedEvent,
  createPipelineStartedEvent,
  createStepCompletedEvent,
  createStepFailedEvent,
  createStepStartedEvent,
} from '../../fixtures/runtime/create-test-runtime-events.js';

import type { ExecutionState } from '../../../src/runtime/execution/runtime-execution-status.js';

describe('CreateTestRuntimeExecutionSotore', () => {
  it('creates execution when pipeline starts', () => {
    const store = new RuntimeExecutionStore();

    store.onEvent({
      executionId: 'exec-1',
      pipelineId: 'pipeline',
      timestamp: 100,
      type: RuntimeEventTypes.PipelineStarted,
    });

    const execution = store.getExecution('exec-1');

    expect(execution).toBeDefined();
    expect(execution?.status).toBe('running');
    expect(execution?.startedAt).toBe(100);
  });
  it('marks execution as completed', () => {
    const store = new RuntimeExecutionStore();

    store.onEvent(
      createPipelineStartedEvent({
        executionId: 'exec-1',
        timestamp: 100,
      }),
    );

    store.onEvent(
      createStepStartedEvent({
        executionId: 'exec-1',
        stepId: 'render-files',
        stepName: 'render-files',
        timestamp: 120,
      }),
    );

    store.onEvent(
      createStepCompletedEvent({
        executionId: 'exec-1',
        stepId: 'render-files',
        stepName: 'render-files',
        timestamp: 150,
        durationMs: 30,
      }),
    );

    store.onEvent(
      createPipelineCompletedEvent({
        executionId: 'exec-1',
        timestamp: 200,
      }),
    );

    const execution = store.getExecution('exec-1');

    expect(execution?.status).toBe('completed');
    expect(execution?.finishedAt).toBe(200);
    expect(execution?.durationMs).toBe(100);
  });
  it('marks execution as failed', () => {
    const store = new RuntimeExecutionStore();

    const error = new Error('boom');

    store.onEvent(
      createPipelineStartedEvent({
        executionId: 'exec-1',
        timestamp: 100,
      }),
    );

    store.onEvent(
      createPipelineFailedEvent({
        executionId: 'exec-1',
        timestamp: 150,
        error,
      }),
    );

    const execution = store.getExecution('exec-1');

    expect(execution).toBeDefined();

    expect(execution?.status).toBe('failed');
    expect(execution?.error).toBeInstanceOf(Error);
    expect((execution?.error as Error).message).toBe('boom');

    expect(execution?.startedAt).toBe(100);
    expect(execution?.finishedAt).toBe(150);
    expect(execution?.durationMs).toBe(50);

    expect(execution?.stepOrder).toEqual([]);
  });
  it('ignores pipeline completion for unknown execution', () => {
    const store = new RuntimeExecutionStore();

    store.onEvent(
      createPipelineCompletedEvent({
        executionId: 'missing',
      }),
    );

    expect(store.getAllExecutions()).toHaveLength(0);
  });
  it('ignores pipeline failure for unknown execution', () => {
    const store = new RuntimeExecutionStore();

    store.onEvent(
      createPipelineFailedEvent({
        executionId: 'missing',
        error: new Error('boom'),
      }),
    );

    expect(store.getAllExecutions()).toHaveLength(0);
  });
  it('registers started step', () => {
    const store = new RuntimeExecutionStore();

    store.onEvent(
      createPipelineStartedEvent({
        executionId: 'exec-1',
      }),
    );

    store.onEvent(
      createStepStartedEvent({
        executionId: 'exec-1',
        stepId: 'resolve-variables',
        stepName: 'resolve-variables',
        timestamp: 120,
      }),
    );

    const execution = store.getExecution('exec-1');

    expect(execution?.steps['resolve-variables']).toEqual({
      stepId: 'resolve-variables',
      stepName: 'resolve-variables',
      status: 'running',
      startedAt: 120,
    });

    expect(execution?.stepOrder).toEqual(['resolve-variables']);
  });
  it('marks step as completed', () => {
    const store = new RuntimeExecutionStore();

    store.onEvent(
      createPipelineStartedEvent({
        executionId: 'exec-1',
      }),
    );

    store.onEvent(
      createStepStartedEvent({
        executionId: 'exec-1',
        stepId: 'render-files',
        stepName: 'render-files',
        timestamp: 100,
      }),
    );

    store.onEvent(
      createStepCompletedEvent({
        executionId: 'exec-1',
        stepId: 'render-files',
        stepName: 'render-files',
        timestamp: 142,
        durationMs: 42,
      }),
    );

    const execution = store.getExecution('exec-1');

    expect(execution?.steps['render-files']?.status).toBe('completed');

    expect(execution?.steps['render-files']?.finishedAt).toBe(142);

    expect(execution?.steps['render-files']?.durationMs).toBe(42);
  });
  it('marks step as failed without failing execution', () => {
    const store = new RuntimeExecutionStore();

    store.onEvent(
      createPipelineStartedEvent({
        executionId: 'exec-1',
        timestamp: 100,
      }),
    );

    store.onEvent(
      createStepStartedEvent({
        executionId: 'exec-1',
        stepId: 'render-files',
        stepName: 'render-files',
        timestamp: 110,
      }),
    );

    store.onEvent(
      createStepFailedEvent({
        executionId: 'exec-1',
        stepId: 'render-files',
        stepName: 'render-files',
        timestamp: 150,
        durationMs: 40,
        error: new Error('step failure'),
      }),
    );

    expect(store.getAllExecutions()).toHaveLength(1);
    const execution = store.getExecution('exec-1');

    expect(execution).toBeDefined();

    expect(execution?.steps['render-files']?.status).toBe('failed');

    expect(execution?.steps['render-files']?.finishedAt).toBe(150);

    expect(execution?.steps['render-files']?.durationMs).toBe(40);

    expect(execution?.steps['render-files']?.error).toBeInstanceOf(Error);

    expect((execution?.steps['render-files']?.error as Error).message).toBe('step failure');

    expect(execution?.status).toBe('running');
    expect(execution?.error).toBeUndefined();
    expect(execution?.finishedAt).toBeUndefined();
    expect(execution?.durationMs).toBeUndefined();

    expect(execution?.stepOrder).toEqual(['render-files']);
  });
  it('ignores completed step for unknown execution', () => {
    const store = new RuntimeExecutionStore();

    store.onEvent(
      createStepCompletedEvent({
        executionId: 'missing',
        stepId: 'render-files',
      }),
    );

    expect(store.getAllExecutions()).toHaveLength(0);
  });
  it('ignores failed step for unknown execution', () => {
    const store = new RuntimeExecutionStore();

    store.onEvent(
      createStepFailedEvent({
        executionId: 'missing',
        stepId: 'render-files',
        error: new Error('boom'),
      }),
    );

    expect(store.getAllExecutions()).toHaveLength(0);
  });
  it('ignores completion of unknown step', () => {
    const store = new RuntimeExecutionStore();

    store.onEvent(
      createPipelineStartedEvent({
        executionId: 'exec-1',
      }),
    );

    store.onEvent(
      createStepCompletedEvent({
        executionId: 'exec-1',
        stepId: 'missing-step',
        durationMs: 10,
      }),
    );

    const execution = store.getExecution('exec-1');

    expect(execution?.steps).toEqual({});
  });
  it('ignores failure of unknown step', () => {
    const store = new RuntimeExecutionStore();

    store.onEvent(
      createPipelineStartedEvent({
        executionId: 'exec-1',
      }),
    );

    store.onEvent(
      createStepFailedEvent({
        executionId: 'exec-1',
        stepId: 'missing-step',
        error: new Error('boom'),
      }),
    );

    const execution = store.getExecution('exec-1');

    expect(execution?.steps).toEqual({});
  });
  it('tracks step execution order', () => {
    const store = new RuntimeExecutionStore();

    store.onEvent(
      createPipelineStartedEvent({
        executionId: 'exec-1',
      }),
    );

    store.onEvent(
      createStepStartedEvent({
        executionId: 'exec-1',
        stepId: 'resolve-variables',
      }),
    );

    store.onEvent(
      createStepStartedEvent({
        executionId: 'exec-1',
        stepId: 'validate-generator',
      }),
    );

    store.onEvent(
      createStepStartedEvent({
        executionId: 'exec-1',
        stepId: 'render-files',
      }),
    );

    const execution = store.getExecution('exec-1');

    expect(execution?.stepOrder).toEqual([
      'resolve-variables',
      'validate-generator',
      'render-files',
    ]);
  });
  it('notifies subscribers on state changes', () => {
    const store = new RuntimeExecutionStore();

    let received: ExecutionState | undefined;

    store.subscribe((state) => {
      received = state;
    });

    store.onEvent(
      createPipelineStartedEvent({
        executionId: 'exec-1',
      }),
    );

    expect(received).toBeDefined();
    expect(received?.executionId).toBe('exec-1');
    expect(received?.status).toBe('running');
  });
  it('stops notifying after unsubscribe', () => {
    const store = new RuntimeExecutionStore();

    const listener = vi.fn();

    const unsubscribe = store.subscribe(listener);

    unsubscribe();

    store.onEvent(
      createPipelineStartedEvent({
        executionId: 'exec-1',
      }),
    );

    expect(listener).not.toHaveBeenCalled();
  });
  it('returns immutable snapshots', () => {
    const store = new RuntimeExecutionStore();

    store.onEvent(
      createPipelineStartedEvent({
        executionId: 'exec-1',
      }),
    );

    const execution = store.getExecution('exec-1');

    expect(execution).toBeDefined();

    execution!.status = 'failed';

    const freshSnapshot = store.getExecution('exec-1');

    expect(freshSnapshot?.status).toBe('running');
  });
  it('emits immutable snapshots to listeners', () => {
    const store = new RuntimeExecutionStore();

    let received: ExecutionState | undefined;

    store.subscribe((state) => {
      received = state;
    });

    store.onEvent(
      createPipelineStartedEvent({
        executionId: 'exec-1',
      }),
    );

    expect(received).toBeDefined();

    received!.status = 'failed';

    const execution = store.getExecution('exec-1');

    expect(execution?.status).toBe('running');
  });
  it('ignores events for unknown executions', () => {
    const store = new RuntimeExecutionStore();

    store.onEvent(
      createStepStartedEvent({
        executionId: 'missing',
        stepId: 'render-files',
      }),
    );

    expect(store.getAllExecutions()).toHaveLength(0);
  });
  it('does not duplicate step order entries', () => {
    const store = new RuntimeExecutionStore();

    store.onEvent(
      createPipelineStartedEvent({
        executionId: 'exec-1',
      }),
    );

    store.onEvent(
      createStepStartedEvent({
        executionId: 'exec-1',
        stepId: 'render-files',
        stepName: 'render-files',
      }),
    );

    store.onEvent(
      createStepStartedEvent({
        executionId: 'exec-1',
        stepId: 'render-files',
        stepName: 'render-files',
      }),
    );

    const execution = store.getExecution('exec-1');

    expect(execution?.stepOrder).toEqual(['render-files']);
  });
});
