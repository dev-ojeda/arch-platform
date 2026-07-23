// packages\application\test\__tests__\logging-generation-hooks.test.ts

import type { GenerationContext, GenerationPipelineStep } from '@arch/contracts';
import { describe, expect, it, vi } from 'vitest';

import { LoggingGenerationHooks } from '../../src/generation/hooks/logging-generation-hooks.js';

describe('CreateTestLoggingGenerationHook', () => {
  function createLoggerMock() {
    return {
      trace: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      success: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
  }
  it('logs generation beforePipeline info', async () => {
    const hooks = new LoggingGenerationHooks();
    const logger = createLoggerMock();
    const context = {
      logger: logger,
    } as unknown as GenerationContext;

    await hooks.beforePipeline(context);

    expect(logger.info).toHaveBeenCalledWith('[arch] generation started');
  });
  it('logs generation afterPipeline info', async () => {
    const hooks = new LoggingGenerationHooks();
    const logger = createLoggerMock();
    const context = {
      logger: logger,
    } as unknown as GenerationContext;

    await hooks.afterPipeline(context);

    expect(logger.info).toHaveBeenCalledWith('[arch] generation completed');
  });
  it('logs generation debug', async () => {
    const logger = createLoggerMock();
    const context = {
      logger: logger,
      diagnostics: [],
    } as unknown as GenerationContext;
    const hooks = new LoggingGenerationHooks();
    await hooks.beforeStep({ name: 'render-files' } as GenerationPipelineStep, context);

    expect(logger.debug).toHaveBeenCalledWith('[arch] running render-files');

    expect(context.diagnostics).toHaveLength(1);

    expect(context.diagnostics[0]).toMatchObject({
      level: 'info',
      message: 'Running render-files',
      step: 'render-files',
    });
  });
  it('logs generation string error', async () => {
    const logger = createLoggerMock();
    const context = {
      logger: logger,
      diagnostics: [],
    } as unknown as GenerationContext;
    const hooks = new LoggingGenerationHooks();
    await hooks.onError('boom', context);
    expect(context.diagnostics).toHaveLength(1);
    expect(context.diagnostics[0]).toMatchObject({
      level: 'error',
      message: 'boom',
    });
    expect(logger.error).toHaveBeenCalledWith('[arch] generation failed', {
      metadata: {
        error: 'boom',
      },
    });
  });
  it('logs generation error', async () => {
    const logger = createLoggerMock();
    const context = {
      logger: logger,
      diagnostics: [],
    } as unknown as GenerationContext;
    const hooks = new LoggingGenerationHooks();
    await hooks.onError(new Error('boom'), context);
    expect(context.diagnostics).toHaveLength(1);
    expect(context.diagnostics[0]).toMatchObject({
      level: 'error',
      message: 'boom',
    });
    expect(logger.error).toHaveBeenCalledWith('[arch] generation failed', {
      metadata: {
        error: 'boom',
      },
    });
  });
});
