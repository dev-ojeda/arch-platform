// packages/application/src/runtime/timeline/__tests__/timeline-aggregator-failure.test.ts

import type { GenerationPipelineStep } from '@arch/contracts/generation';
import { createTestContext, createTestIdGenerator, createTestStep } from '@arch/testing/runtime';
import { describe, expect, it } from 'vitest';

import { GenerationPipeline, createRuntime } from '../../src/testing/index.js';

describe('TimelineAggregator Failure', () => {
  it('marks failed steps in execution timeline', async () => {
    const context = createTestContext();

    const runtime = createRuntime({
      idGenerator: createTestIdGenerator(),
    });

    const steps: GenerationPipelineStep[] = [
      createTestStep(
        'successful-step',

        async () => {},
      ),

      createTestStep(
        'failing-step',

        () => Promise.reject(new Error('step failure')),
      ),
    ];

    const pipeline = new GenerationPipeline({
      pipelineId: 'test-pipeline',
      steps,
      idGenerator: createTestIdGenerator(),
      runtimeEvents: runtime.runtimeEvents,
    });

    await expect(pipeline.execute(context)).rejects.toThrow('step failure');

    const timelines = runtime.timelineAggregator.getAllTimelines();

    expect(timelines).toHaveLength(1);

    const timeline = timelines[0];

    expect(timeline?.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          stepName: 'successful-step',

          status: 'success',
        }),

        expect.objectContaining({
          stepName: 'failing-step',

          status: 'failed',
        }),
      ]),
    );
    expect(timeline?.status).toBe('failed');

    expect(timeline?.finishedAt).toBeDefined();

    expect(timeline?.durationMs).toBeGreaterThanOrEqual(0);
  });
});
