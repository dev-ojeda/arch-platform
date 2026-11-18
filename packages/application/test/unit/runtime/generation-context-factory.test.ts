// packages\application\test\unit\runtime\generation-context-factory.test.ts

import { describe, expect, it } from 'vitest';

import {
  MemoryAsyncFileSystemAdapter,
  MemoryFileSystem,
  PosixPathService,
} from '@arch-platform/infrastructure';

import { GenerationContextFactory } from '../../../src/generation/runtime/generation-context-factory.js';
import { createTestGenerator } from '../../fixtures/generators/create-test-generator.js';
import { TestLogger } from '../../fixtures/logging/test-logger.js';

describe('GenerationContextFactory', () => {
  function createFilesystem() {
    const pathService = new PosixPathService();

    return new MemoryAsyncFileSystemAdapter(new MemoryFileSystem(pathService));
  }
  it('uses request filesystem when provided', () => {
    const defaultFs = createFilesystem();
    const requestFs = createFilesystem();
    const logger = new TestLogger();

    const factory = new GenerationContextFactory(defaultFs, logger);

    const context = factory.create({
      generator: createTestGenerator(),
      targetDir: 'output',
      languageId: 'typescript',
      fs: requestFs,
    });

    expect(context.fs).toBe(requestFs);
  });

  it('uses factory filesystem when request filesystem is not provided', () => {
    const defaultFs = createFilesystem();
    const logger = new TestLogger();

    const factory = new GenerationContextFactory(defaultFs, logger);

    const context = factory.create({
      generator: createTestGenerator(),
      languageId: 'typescript',
      targetDir: 'output',
    });

    expect(context.fs).toBe(defaultFs);
  });

  it('initializes context collections', () => {
    const fs = createFilesystem();
    const logger = new TestLogger();

    const factory = new GenerationContextFactory(fs, logger);

    const context = factory.create({
      generator: createTestGenerator(),
      languageId: 'typescript',
      targetDir: 'output',
    });

    expect(context.files).toEqual([]);
    expect(context.diagnostics).toEqual([]);
    expect(context.metrics).toEqual([]);
    expect(context.metadata.size).toBe(0);
  });

  it('initializes variables with an empty object when not provided', () => {
    const fs = createFilesystem();
    const logger = new TestLogger();

    const factory = new GenerationContextFactory(fs, logger);

    const context = factory.create({
      generator: createTestGenerator(),
      languageId: 'typescript',
      targetDir: 'output',
    });

    expect(context.variables).toEqual({});
  });
});
