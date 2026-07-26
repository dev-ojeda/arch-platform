// packages/application/test/__tests__/event-generation-hooks.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { GenerationContext, GenerationPipelineStep } from '@arch/contracts';

import { EventGenerationHooks } from '../../src/generation/hooks/event-generation-hooks.js';
import { publishGenerationEvent } from '../../src/runtime/execution/events/publish-generation-event.js';

vi.mock('../../src/runtime/execution/events/publish-generation-event.js', () => ({
  publishGenerationEvent: vi.fn().mockResolvedValue(undefined),
}));

describe('CreateTestEventGenerationHooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('publishes generation started event', async () => {
    const hooks = new EventGenerationHooks();
    const context = {} as GenerationContext;

    await hooks.beforePipeline(context);

    expect(publishGenerationEvent).toHaveBeenCalledWith(context, 'GENERATION_STARTED');
  });

  it('publishes generation completed event', async () => {
    const hooks = new EventGenerationHooks();
    const context = {} as GenerationContext;

    await hooks.afterPipeline(context);

    expect(publishGenerationEvent).toHaveBeenCalledWith(context, 'GENERATION_COMPLETED');
  });

  it('publishes step started event', async () => {
    const hooks = new EventGenerationHooks();

    const context = {} as GenerationContext;

    const step = {
      name: 'render-files',
    } as GenerationPipelineStep;

    await hooks.beforeStep(step, context);

    expect(publishGenerationEvent).toHaveBeenCalledWith(context, 'STEP_STARTED', {
      step: 'render-files',
    });
  });

  it('publishes step completed event', async () => {
    const hooks = new EventGenerationHooks();

    const context = {} as GenerationContext;

    const step = {
      name: 'render-files',
    } as GenerationPipelineStep;

    await hooks.afterStep(step, context);

    expect(publishGenerationEvent).toHaveBeenCalledWith(context, 'STEP_COMPLETED', {
      step: 'render-files',
    });
  });

  it('publishes failed event using Error message', async () => {
    const hooks = new EventGenerationHooks();

    const context = {} as GenerationContext;

    await hooks.onError(new Error('boom'), context);

    expect(publishGenerationEvent).toHaveBeenCalledWith(context, 'GENERATION_FAILED', {
      error: 'boom',
    });
  });

  it('publishes failed event using string value', async () => {
    const hooks = new EventGenerationHooks();

    const context = {} as GenerationContext;

    await hooks.onError('boom', context);

    expect(publishGenerationEvent).toHaveBeenCalledWith(context, 'GENERATION_FAILED', {
      error: 'boom',
    });
  });
});
