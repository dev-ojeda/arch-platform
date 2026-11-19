// packages/application/test/__tests__/default-generation-engine.test.ts

import { describe, expect, it, vi } from 'vitest';

import type {
  GenerationContext,
  GenerationReportExporter,
  GenerationRequest,
} from '@arch-platform/contracts';

import { DefaultGenerationEngine } from '../../src/generation/engine/default-generation-engine.js';
import { createTestGenerator } from '../fixtures/generators/create-test-generator.js';
import { TestLogger } from '../fixtures/logging/test-logger.js';
import { createTestContext } from '../fixtures/runtime/create-test-context.js';

describe('DefaultGenerationEngine', () => {
  function createRequest(): GenerationRequest {
    return {
      generator: createTestGenerator(),
      languageId: 'typescript',
      targetDir: '/tmp',
    };
  }

  function createContext(logger: TestLogger = new TestLogger()): GenerationContext {
    const context = createTestContext({
      logger,
      languageId: 'typescript',
      targetDir: '/tmp',
    });

    context.generator = createTestGenerator();

    context.files.push({
      path: 'user.ts',
      content: 'export class User {}',
    });

    return context;
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
      options: {
        source: {
          component: 'DefaultGenerationEngine',
          operation: 'async generate',
        },
        metadata: {
          name: 'Error',
          message: 'boom',
        },
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
      options: {
        source: {
          component: 'DefaultGenerationEngine',
          operation: 'async generate',
        },
        metadata: {
          name: 'UnknownError',
          message: 'boom',
        },
      },
    });
  });

  it('does not execute report exporters twice when an exporter fails', async () => {
    const context = createContext();

    const pipeline = {
      execute: vi.fn().mockResolvedValue(undefined),
    };

    const contextFactory = {
      create: vi.fn().mockReturnValue(context),
    };

    const exportSpy = vi.fn().mockRejectedValue(new Error('export failed'));

    const exporter: GenerationReportExporter = {
      export: exportSpy,
    };

    const engine = new DefaultGenerationEngine(pipeline as never, contextFactory as never, [
      exporter,
    ]);

    await expect(engine.generate(createRequest())).rejects.toThrow('export failed');

    expect(pipeline.execute).toHaveBeenCalledTimes(1);
    expect(exportSpy).toHaveBeenCalledTimes(1);
  });

  it('does not classify report exporter failures as pipeline failures', async () => {
    const logger = new TestLogger();
    const context = createContext(logger);

    const pipeline = {
      execute: vi.fn().mockResolvedValue(undefined),
    };

    const contextFactory = {
      create: vi.fn().mockReturnValue(context),
    };

    const exporter: GenerationReportExporter = {
      export: vi.fn().mockRejectedValue(new Error('export failed')),
    };

    const engine = new DefaultGenerationEngine(pipeline as never, contextFactory as never, [
      exporter,
    ]);

    await expect(engine.generate(createRequest())).rejects.toThrow('export failed');

    expect(logger.logs).not.toContainEqual(
      expect.objectContaining({
        message: 'Generation failed',
      }),
    );
  });
});
