// packages\application\test\__tests__\composite-generation-hooks.test.ts

import type { GenerationContext, GenerationPipelineStep } from '@arch/contracts';
import { describe, expect, it, vi } from 'vitest';

import { CompositeGenerationHooks } from '../../src/generation/hooks/composite-generation-hooks.js';

describe('CreateTestCompositeGenerationReportExport', () => {
  it('calls beforePipeline on all hooks', async () => {
    const hookA = {
      beforePipeline: vi.fn().mockResolvedValue(undefined),
    };

    const hookB = {
      beforePipeline: vi.fn().mockResolvedValue(undefined),
    };

    const hooks = new CompositeGenerationHooks([hookA, hookB]);

    const context = {} as GenerationContext;

    await hooks.beforePipeline(context);

    expect(hookA.beforePipeline).toHaveBeenCalledWith(context);
    expect(hookB.beforePipeline).toHaveBeenCalledWith(context);
  });
  it('calls afterPipeline on all hooks', async () => {
    const hookA = {
      afterPipeline: vi.fn().mockResolvedValue(undefined),
    };

    const hookB = {
      afterPipeline: vi.fn().mockResolvedValue(undefined),
    };

    const hooks = new CompositeGenerationHooks([hookA, hookB]);

    const context = {} as GenerationContext;

    await hooks.afterPipeline(context);

    expect(hookA.afterPipeline).toHaveBeenCalledWith(context);
    expect(hookB.afterPipeline).toHaveBeenCalledWith(context);
  });
  it('ignores missing hook methods', async () => {
    const beforePipeline = vi.fn().mockResolvedValue(undefined);

    const hooks = new CompositeGenerationHooks([{}, { beforePipeline }]);

    const context = {} as GenerationContext;

    await hooks.beforePipeline(context);

    expect(beforePipeline).toHaveBeenCalledOnce();
    expect(beforePipeline).toHaveBeenCalledWith(context);
  });
  it('executes hooks sequentially in registration order', async () => {
    const calls: string[] = [];

    const hookA = {
      beforePipeline: vi.fn(async () => {
        calls.push('A-start');
        await Promise.resolve();
        calls.push('A-end');
      }),
    };

    const hookB = {
      beforePipeline: vi.fn(async () => {
        calls.push('B-start');
        await Promise.resolve();
        calls.push('B-end');
      }),
    };

    const hooks = new CompositeGenerationHooks([hookA, hookB]);

    await hooks.beforePipeline({} as GenerationContext);

    expect(calls).toEqual(['A-start', 'A-end', 'B-start', 'B-end']);
  });
  it('calls beforeStep on all hooks', async () => {
    const hookA = {
      beforeStep: vi.fn().mockResolvedValue(undefined),
    };

    const hookB = {
      beforeStep: vi.fn().mockResolvedValue(undefined),
    };

    const hooks = new CompositeGenerationHooks([hookA, hookB]);

    const context = {} as GenerationContext;

    const pipelineStep = { name: 'beforeStep' } as GenerationPipelineStep;

    await hooks.beforeStep(pipelineStep, context);

    expect(hookA.beforeStep).toHaveBeenCalledWith(pipelineStep, context);

    expect(hookB.beforeStep).toHaveBeenCalledWith(pipelineStep, context);
  });
  it('calls afterStep on all hooks', async () => {
    const hookA = {
      afterStep: vi.fn().mockResolvedValue(undefined),
    };

    const hookB = {
      afterStep: vi.fn().mockResolvedValue(undefined),
    };

    const hooks = new CompositeGenerationHooks([hookA, hookB]);

    const context = {} as GenerationContext;
    const pipelineStep = { name: 'afterStep' } as GenerationPipelineStep;
    await hooks.afterStep(pipelineStep, context);

    expect(hookA.afterStep).toHaveBeenCalledWith(pipelineStep, context);

    expect(hookB.afterStep).toHaveBeenCalledWith(pipelineStep, context);
  });
  it('calls onError on all hooks', async () => {
    const hookA = {
      onError: vi.fn().mockResolvedValue(undefined),
    };

    const hookB = {
      onError: vi.fn().mockResolvedValue(undefined),
    };

    const hooks = new CompositeGenerationHooks([hookA, hookB]);

    const context = {} as GenerationContext;

    const error = new Error('boom');

    await hooks.onError(error, context);

    expect(hookA.onError).toHaveBeenCalledWith(error, context);
    expect(hookB.onError).toHaveBeenCalledWith(error, context);
  });
});
