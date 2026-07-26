// packages\application\test\unit\telemetry\telemetry-generation-hooks.test.ts

import { describe, expect, it, vi } from 'vitest';

import type { GenerationContext, GenerationPipelineStep } from '@arch/contracts';

import { TelemetryGenerationHooks } from '../../../src/index.js';

describe('CreateTestTelemetryGenerationHook', () => {
  it('does nothing when step was not started', async () => {
    const hooks = new TelemetryGenerationHooks();

    const context = {} as GenerationContext;

    const step = {
      name: 'render-files',
    } as GenerationPipelineStep;

    await expect(hooks.afterStep(step, context)).resolves.toBeUndefined();
  });
  it('records metric when step completes', async () => {
    const publish = vi.fn().mockResolvedValue(undefined);

    const context = {
      metrics: [],
      eventBus: { publish },
    } as unknown as GenerationContext;

    const hooks = new TelemetryGenerationHooks();

    const step = {
      name: 'render-files',
    } as GenerationPipelineStep;

    await hooks.beforeStep(step, context);
    await hooks.afterStep(step, context);

    expect(publish).toHaveBeenCalledTimes(1);
  });
});
