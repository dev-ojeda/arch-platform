// packages\application\test\unit\timeline\timeline-aggregator.test.ts

import { describe, expect, it } from 'vitest';

import type { GenerationPipelineStep } from '@arch/contracts';
import { createTestContext, createTestIdGenerator, createTestStep } from '@arch/testing';

import { GenerationPipeline } from '../../../src/generation/pipeline/generation-pipeline.js';
import { createRuntime } from '../../../src/runtime/runtime-bootstrap.js';

describe('TimelineAggregator', () => {
  it('builds execution timeline from runtime events', async () => {
    const context = createTestContext();

    const runtime = createRuntime({
      idGenerator: createTestIdGenerator(),
    });

    const steps: GenerationPipelineStep[] = [createTestStep('step-1'), createTestStep('step-2')];

    const pipeline = new GenerationPipeline({
      steps,

      idGenerator: createTestIdGenerator(),

      runtimeEvents: runtime.runtimeEvents,
    });

    await pipeline.execute(context);

    const timelines = runtime.timelineAggregator.getAllTimelines();

    expect(timelines).toHaveLength(1);

    const timeline = timelines[0];

    expect(timeline).toBeDefined();

    if (!timeline) {
      throw new Error('Expected timeline');
    }

    expect(timeline).toEqual(
      expect.objectContaining({
        pipelineId: 'generation-pipeline',

        steps: [
          expect.objectContaining({
            stepName: 'step-1',
            status: 'success',
          }),

          expect.objectContaining({
            stepName: 'step-2',
            status: 'success',
          }),
        ],
      }),
    );
  });
});
