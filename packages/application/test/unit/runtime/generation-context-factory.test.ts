// packages\application\test\unit\runtime\generation-context-factory.test.ts

import { describe, expect, it } from 'vitest';

import { createMockFilesystem, createTestGenerator, createTestLogger } from '@arch/testing';

import { GenerationContextFactory } from '../../../src/generation/runtime/generation-context-factory.js';

describe('GenerationContextFactory', () => {
  it('uses request logger when provided', () => {
    const fs = createMockFilesystem();
    const defaultLogger = createTestLogger();

    const factory = new GenerationContextFactory(fs, defaultLogger);

    const customLogger = createTestLogger();

    const context = factory.create({
      targetDir: 'output',
      generator: createTestGenerator(),
      logger: customLogger,
    });

    expect(context.logger).toBe(customLogger);
  });

  it('uses factory logger when request logger is not provided', () => {
    const fs = createMockFilesystem();
    const defaultLogger = createTestLogger();

    const factory = new GenerationContextFactory(fs, defaultLogger);

    const context = factory.create({
      targetDir: 'output',
      generator: createTestGenerator(),
    });

    expect(context.logger).toBe(defaultLogger);
  });

  it('initializes context collections', () => {
    const fs = createMockFilesystem();
    const logger = createTestLogger();

    const factory = new GenerationContextFactory(fs, logger);

    const context = factory.create({
      targetDir: 'output',
      generator: createTestGenerator(),
    });

    expect(context.files).toEqual([]);
    expect(context.diagnostics).toEqual([]);
    expect(context.metrics).toEqual([]);
    expect(context.metadata.size).toBe(0);
  });

  it('initializes variables with an empty object when not provided', () => {
    const fs = createMockFilesystem();
    const logger = createTestLogger();

    const factory = new GenerationContextFactory(fs, logger);

    const context = factory.create({
      targetDir: 'output',
      generator: createTestGenerator(),
    });

    expect(context.variables).toEqual({});
  });
});
