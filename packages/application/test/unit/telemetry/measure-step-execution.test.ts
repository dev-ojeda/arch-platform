import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { GenerationContext, GenerationPipelineStep } from '@arch-platform/contracts';

import { measureStepExecution } from '../../../src/generation/telemetry/measure-step-execution.js';
import { recordStepMetric } from '../../../src/generation/telemetry/record-step-metric.js';

vi.mock('../../../src/generation/telemetry/record-step-metric.js', () => ({
  recordStepMetric: vi.fn().mockResolvedValue(undefined),
}));

describe('measureStepExecution', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const step = {
    name: 'render-files',
  } as GenerationPipelineStep;

  const context = {} as GenerationContext;

  it('records metric when execution succeeds', async () => {
    const execution = vi.fn().mockResolvedValue(undefined);

    await measureStepExecution(context, step, execution);

    expect(execution).toHaveBeenCalledOnce();
    expect(recordStepMetric).toHaveBeenCalledOnce();

    expect(recordStepMetric).toHaveBeenCalledWith(
      context,
      expect.objectContaining({
        step: 'render-files',
        startedAt: expect.any(Number),
        finishedAt: expect.any(Number),
        duration: expect.any(Number),
      }),
    );
  });

  it('records metric when execution fails', async () => {
    const error = new Error('execution failed');
    const execution = vi.fn().mockRejectedValue(error);

    await expect(measureStepExecution(context, step, execution)).rejects.toBe(error);

    expect(recordStepMetric).toHaveBeenCalledOnce();
  });

  it('preserves execution error when metric recording fails', async () => {
    const executionError = new Error('execution failed');
    const metricError = new Error('metric recording failed');

    vi.mocked(recordStepMetric).mockRejectedValueOnce(metricError);

    const execution = vi.fn().mockRejectedValue(executionError);

    await expect(measureStepExecution(context, step, execution)).rejects.toBe(executionError);

    expect(recordStepMetric).toHaveBeenCalledOnce();
  });

  it('propagates metric error when execution succeeds', async () => {
    const metricError = new Error('metric recording failed');

    vi.mocked(recordStepMetric).mockRejectedValueOnce(metricError);

    const execution = vi.fn().mockResolvedValue(undefined);

    await expect(measureStepExecution(context, step, execution)).rejects.toBe(metricError);
  });
});
