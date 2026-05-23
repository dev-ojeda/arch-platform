// packages/testing/src/pipeline/create-test-pipeline-context.ts

import type { GenerationContext, NamedVariables } from '@arch/contracts';

import { createTestContext } from '../runtime/create-test-context.js';

export interface CreateTestPipelineContextOptions {
  variables?: NamedVariables;
}

export function createTestPipelineContext(
  options: CreateTestPipelineContextOptions = {},
): GenerationContext {
  return {
    ...createTestContext({
      variables: options.variables,
    }),

    generator: {
      descriptor: {
        id: 'test-generator',

        displayName: 'Test Generator',
        version: '',
        languages: [],
        frameworks: [],
      },

      templates: [],

      schema: {
        id: '',
        title: '',
        fields: [],
      },
    },
  };
}
