// packages\application\test\__tests__\create-generation-engine.test.ts

import { createMockFilesystem, createMockPromptAdapter } from '@arch/testing';
import { describe, expect, it } from 'vitest';

import { createGenerationEngine } from '../../src/generation/composition/create-default-engine.js';

describe('createGenerationEngine', () => {
  it('creates a generation engine', () => {
    const engine = createGenerationEngine({
      promptAdapter: createMockPromptAdapter(),

      filesystem: createMockFilesystem(),

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
        render() {
          return Promise.resolve([]);
        },
      },
    });

    expect(engine).toBeDefined();
  });
});
