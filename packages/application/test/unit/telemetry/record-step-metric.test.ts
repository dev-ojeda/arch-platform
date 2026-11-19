import { describe, expect, it, vi } from 'vitest';

import type { GenerationContext, StepExecutionMetric } from '@arch-platform/contracts';

import { recordStepMetric } from '../../../src/generation/telemetry/record-step-metric.js';

describe('recordStepMetric', () => {
  function createContext() {
    const publish = vi.fn().mockResolvedValue(undefined);

    const context = {
      metrics: [],
      eventBus: { publish },
    } as unknown as GenerationContext;

    return { context, publish };
  }

  const metric: StepExecutionMetric = {
    step: 'render-files',
    startedAt: 100,
    finishedAt: 150,
    duration: 50,
  };

  it('records the metric and publishes the event', async () => {
    const { context, publish } = createContext();

    await recordStepMetric(context, metric);

    expect(context.metrics).toEqual([metric]);
    expect(publish).toHaveBeenCalledOnce();
    expect(publish).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'STEP_METRIC_RECORDED',
        payload: {
          duration: 50,
          startedAt: 100,
          completedAt: 150,
        },
      }),
    );
  });

  it('preserves the metric when event publication fails', async () => {
    const { context, publish } = createContext();

    publish.mockRejectedValueOnce(new Error('Event bus unavailable'));

    await expect(recordStepMetric(context, metric)).resolves.toBeUndefined();

    expect(context.metrics).toEqual([metric]);
    expect(publish).toHaveBeenCalledOnce();
  });

  it('does not publish an event before recording the metric', async () => {
    const { context, publish } = createContext();

    publish.mockImplementationOnce(async () => {
      expect(context.metrics).toContain(metric);
    });

    await recordStepMetric(context, metric);

    expect(context.metrics).toEqual([metric]);
  });
});
