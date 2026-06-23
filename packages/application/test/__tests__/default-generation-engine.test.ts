// packages/application/test/__tests__/default-generation-engine.test.ts

import type {
  GenerationContext,
  GenerationReportExporter,
  GenerationRequest,
} from '@arch/contracts';
import { createTestGenerator, TestLogger } from '@arch/testing';
import { describe, expect, it, vi } from 'vitest';

import { DefaultGenerationEngine } from '../../src/generation/engine/default-generation-engine.js';

describe('DefaultGenerationEngine', () => {
  function createRequest(): GenerationRequest {
    return {
      generator: createTestGenerator(),
      targetDir: '/tmp',
    };
  }

  function createContext(logger: TestLogger = new TestLogger()): GenerationContext {
    return {
      generator: createTestGenerator(),

      targetDir: '/tmp',

      files: [
        {
          path: 'user.ts',
          content: 'export class User {}',
        },
      ],

      diagnostics: [],

      prompts: {},

      resolvedVariables: {},

      resolvedTemplates: [],

      logger,

      fs: {} as never,

      executionId: 'test-execution',

      startedAt: new Date(),
    } as unknown as GenerationContext;
  }

  it('executes pipeline and returns successful result', async () => {
    const context = createContext();

    const execute = vi.fn().mockResolvedValue(undefined);

    const pipeline = {
      execute,
    };

    const contextFactory = {
      create: vi.fn().mockReturnValue(context),
    };

    const engine = new DefaultGenerationEngine(pipeline as never, contextFactory as never);

    const result = await engine.generate(createRequest());

    expect(contextFactory.create).toHaveBeenCalledTimes(1);

    expect(execute).toHaveBeenCalledWith(context);

    expect(result.success).toBe(true);

    expect(result.generatedFiles).toEqual(expect.arrayContaining(['user.ts']));
  });

  it('returns failed result when pipeline throws', async () => {
    const logger = new TestLogger();

    const context = createContext(logger);

    const execute = vi.fn().mockRejectedValue(new Error('boom'));

    const pipeline = {
      execute,
    };

    const contextFactory = {
      create: vi.fn().mockReturnValue(context),
    };

    const engine = new DefaultGenerationEngine(pipeline as never, contextFactory as never);

    const result = await engine.generate(createRequest());

    expect(execute).toHaveBeenCalledWith(context);

    expect(logger.logs).toContainEqual({
      level: 'error',
      message: 'Generation failed',
      meta: {
        name: 'Error',
        message: 'boom',
      },
    });

    expect(result.success).toBe(false);
  });

  it('runs configured report exporters', async () => {
    const context = createContext();

    const pipeline = {
      execute: vi.fn().mockResolvedValue(undefined),
    };

    const contextFactory = {
      create: vi.fn().mockReturnValue(context),
    };

    const exportSpy = vi.fn().mockResolvedValue(undefined);

    const exporter: GenerationReportExporter = {
      export: exportSpy,
    };

    const engine = new DefaultGenerationEngine(pipeline as never, contextFactory as never, [
      exporter,
    ]);

    await engine.generate(createRequest());

    expect(exportSpy).toHaveBeenCalledTimes(1);
  });

  it('handles non Error throwables', async () => {
    const logger = new TestLogger();

    const context = createContext(logger);

    const execute = vi.fn().mockRejectedValue('boom');

    const pipeline = {
      execute,
    };

    const contextFactory = {
      create: vi.fn().mockReturnValue(context),
    };

    const engine = new DefaultGenerationEngine(pipeline as never, contextFactory as never);

    const result = await engine.generate(createRequest());

    expect(result.success).toBe(false);

    expect(logger.logs).toContainEqual({
      level: 'error',
      message: 'Generation failed',
      meta: {
        name: 'UnknownError',
        message: 'boom',
      },
    });
  });
});
