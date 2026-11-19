// packages\application\test\__tests__\create-generation-engine.test.ts

import { describe, expect, it } from 'vitest';

import {
  PosixPathService,
  MemoryFileSystem,
  MemoryAsyncFileSystemAdapter,
} from '@arch-platform/infrastructure';

import { createGenerationEngine } from '../../src/generation/composition/create-default-engine.js';
import { createMockPromptAdapter } from '../fixtures/prompt/create-mock-prompt-adapter.js';

describe('createGenerationEngine', () => {
  it('creates a generation engine', () => {
    const pathService = new PosixPathService();
    const memoryFilesystem = new MemoryFileSystem(pathService);
    const filesystem = new MemoryAsyncFileSystemAdapter(memoryFilesystem);
    const engine = createGenerationEngine({
      promptAdapter: createMockPromptAdapter(),
      filesystem: filesystem,

      idGenerator: {
        generate: () => 'id',
      },

      logger: {
        trace: () => {},
        debug: () => {},
        info: () => {},
        success: () => {},
        warn: () => {},
        error: () => {},
      },

      templateRenderer: {
        render: () => Promise.resolve([]),
      },

      languageConventionRegistry: {
        get: () => {
          throw new Error('Language convention not expected in this test');
        },
        list: () => [],
      },
    });

    expect(engine).toBeDefined();
  });
});
