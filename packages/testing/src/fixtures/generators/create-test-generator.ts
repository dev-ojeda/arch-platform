// packages/testing/src/fixtures/generators/create-test-generator.ts

import type { GeneratorDefinition } from '@arch/contracts/generators';
import type { NamedVariables } from '@arch/contracts/variables';

export function createTestGenerator<TValues extends NamedVariables = NamedVariables>(
  overrides: Partial<GeneratorDefinition<TValues>> = {},
): GeneratorDefinition<TValues> {
  return {
    descriptor: {
      id: 'test-generator',
      displayName: 'Test Generator',
      version: '1.0.0',
      languages: ['typescript'],
      frameworks: ['vitest'],
      ...overrides.descriptor,
    },

    schema: {
      id: 'test-schema',
      title: 'Test Schema',
      fields: [],
      ...overrides.schema,
    },

    templates: overrides.templates ?? [],

    capabilities: overrides.capabilities,

    metadata: overrides.metadata,
  };
}
