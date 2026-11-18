import { describe, expect, it, vi } from 'vitest';

import type { GenerationContext } from '@arch-platform/contracts';

import { GenerationPipeline } from '../../../src/generation/pipeline/generation-pipeline.js';
import { RuntimeEventTypes } from '../../../src/runtime/execution/events/runtime-event-types.js';
import type { RuntimeEvent } from '../../../src/runtime/execution/events/runtime-event.js';

function createContext(): GenerationContext {
  return {
    metrics: [],
    eventBus: {
      publish: vi.fn().mockResolvedValue(undefined),
    },
  } as unknown as GenerationContext;
}

function createRuntimeEvents(events: RuntimeEvent[] = []) {
  return {
    emit: vi.fn(async (event: RuntimeEvent) => {
      events.push(event);
    }),
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
  };
}

function createPipeline(
  options: {
    steps?: Array<{ name: string; execute: (context: GenerationContext) => Promise<void> }>;
    hooks?: Record<string, ReturnType<typeof vi.fn>>;
    runtimeEvents?: ReturnType<typeof createRuntimeEvents>;
  } = {},
) {
  return new GenerationPipeline({
    idGenerator: {
      generate: () => 'execution-1',
    },
    pipelineId: 'test-pipeline',
    steps: options.steps ?? [],
    hooks: options.hooks,
    runtimeEvents: options.runtimeEvents,
  });
}

describe('GenerationPipeline lifecycle', () => {
  it('executes all lifecycle phases in the correct order', async () => {
    const calls: string[] = [];
    const events: RuntimeEvent[] = [];
    const context = createContext();

    const hooks = {
      beforePipeline: vi.fn(async () => {
        calls.push('beforePipeline');
      }),
      beforeStep: vi.fn(async () => {
        calls.push('beforeStep');
      }),
      afterStep: vi.fn(async () => {
        calls.push('afterStep');
      }),
      onSuccess: vi.fn(async () => {
        calls.push('onSuccess');
      }),
      afterPipeline: vi.fn(async () => {
        calls.push('afterPipeline');
      }),
    };

    const runtimeEvents = createRuntimeEvents(events);

    const pipeline = createPipeline({
      hooks,
      runtimeEvents,
      steps: [
        {
          name: 'step-1',
          execute: async () => {
            calls.push('execute');
          },
        },
      ],
    });

    await pipeline.execute(context);

    expect(calls).toEqual([
      'beforePipeline',
      'beforeStep',
      'execute',
      'afterStep',
      'afterPipeline',
      'onSuccess',
    ]);

    expect(events.map((event) => event.type)).toEqual([
      RuntimeEventTypes.PipelineStarted,
      RuntimeEventTypes.StepStarted,
      RuntimeEventTypes.StepCompleted,
      RuntimeEventTypes.PipelineCompleted,
    ]);
  });

  it('runs afterPipeline when beforePipeline fails', async () => {
    const error = new Error('before pipeline failed');

    const hooks = {
      beforePipeline: vi.fn().mockRejectedValue(error),
      onError: vi.fn().mockResolvedValue(undefined),
      afterPipeline: vi.fn().mockResolvedValue(undefined),
      onSuccess: vi.fn().mockResolvedValue(undefined),
    };

    const events: RuntimeEvent[] = [];
    const pipeline = createPipeline({
      hooks,
      runtimeEvents: createRuntimeEvents(events),
    });

    await expect(pipeline.execute(createContext())).rejects.toBe(error);

    expect(hooks.afterPipeline).toHaveBeenCalledOnce();
    expect(hooks.onSuccess).not.toHaveBeenCalled();

    expect(events.map((event) => event.type)).toEqual([
      RuntimeEventTypes.PipelineStarted,
      RuntimeEventTypes.PipelineFailed,
    ]);
  });

  it('preserves the original step execution error', async () => {
    const error = new Error('step execution failed');

    const hooks = {
      onError: vi.fn().mockResolvedValue(undefined),
      afterPipeline: vi.fn().mockResolvedValue(undefined),
    };

    const events: RuntimeEvent[] = [];
    const pipeline = createPipeline({
      hooks,
      runtimeEvents: createRuntimeEvents(events),
      steps: [
        {
          name: 'failing-step',
          execute: async () => {
            throw error;
          },
        },
      ],
    });

    await expect(pipeline.execute(createContext())).rejects.toBe(error);

    expect(hooks.onError).toHaveBeenCalledWith(error, expect.anything());
    expect(hooks.afterPipeline).toHaveBeenCalledOnce();

    expect(events.map((event) => event.type)).toEqual([
      RuntimeEventTypes.PipelineStarted,
      RuntimeEventTypes.StepStarted,
      RuntimeEventTypes.StepFailed,
      RuntimeEventTypes.PipelineFailed,
    ]);
  });

  it('does not emit PipelineCompleted when onSuccess fails', async () => {
    const error = new Error('success hook failed');
    const events: RuntimeEvent[] = [];

    const hooks = {
      onSuccess: vi.fn().mockRejectedValue(error),
      onError: vi.fn().mockResolvedValue(undefined),
      afterPipeline: vi.fn().mockResolvedValue(undefined),
    };

    const pipeline = createPipeline({
      hooks,
      runtimeEvents: createRuntimeEvents(events),
    });
    await expect(pipeline.execute(createContext())).rejects.toBe(error);

    expect(hooks.onError).toHaveBeenCalledWith(error, expect.anything());

    expect(events.map((event) => event.type)).toEqual([
      RuntimeEventTypes.PipelineStarted,
      RuntimeEventTypes.PipelineFailed,
    ]);
  });

  it('treats afterPipeline failure as a pipeline failure', async () => {
    const error = new Error('finalization failed');
    const events: RuntimeEvent[] = [];

    const hooks = {
      onSuccess: vi.fn().mockResolvedValue(undefined),
      afterPipeline: vi.fn().mockRejectedValue(error),
      onError: vi.fn().mockResolvedValue(undefined),
    };

    const pipeline = createPipeline({
      hooks,
      runtimeEvents: createRuntimeEvents(events),
    });

    await expect(pipeline.execute(createContext())).rejects.toBe(error);

    expect(hooks.afterPipeline).toHaveBeenCalledOnce();
    expect(hooks.onSuccess).not.toHaveBeenCalled();
    expect(hooks.onError).toHaveBeenCalledWith(error, expect.anything());

    expect(events.map((event) => event.type)).toEqual([
      RuntimeEventTypes.PipelineStarted,
      RuntimeEventTypes.PipelineFailed,
    ]);
  });

  it('preserves the original error when onError also fails', async () => {
    const originalError = new Error('original failure');
    const secondaryError = new Error('error hook failure');

    const hooks = {
      onError: vi.fn().mockRejectedValue(secondaryError),
      afterPipeline: vi.fn().mockResolvedValue(undefined),
    };

    const pipeline = createPipeline({
      hooks,
      steps: [
        {
          name: 'failing-step',
          execute: async () => {
            throw originalError;
          },
        },
      ],
    });

    await expect(pipeline.execute(createContext())).rejects.toBe(originalError);

    expect(hooks.afterPipeline).toHaveBeenCalledOnce();
  });

  it('runs afterPipeline exactly once when finalization fails', async () => {
    const error = new Error('finalization failed');

    const hooks = {
      afterPipeline: vi.fn().mockRejectedValue(error),
      onError: vi.fn().mockResolvedValue(undefined),
    };

    const pipeline = createPipeline({ hooks });

    await expect(pipeline.execute(createContext())).rejects.toBe(error);

    expect(hooks.afterPipeline).toHaveBeenCalledOnce();
    expect(hooks.onError).toHaveBeenCalledOnce();
  });

  it('does not fail generation when runtime event publication fails', async () => {
    const runtimeEvents = createRuntimeEvents();

    runtimeEvents.emit.mockRejectedValue(new Error('runtime event publication failed'));

    const pipeline = createPipeline({ runtimeEvents });

    await expect(pipeline.execute(createContext())).resolves.toBeUndefined();
  });
});
