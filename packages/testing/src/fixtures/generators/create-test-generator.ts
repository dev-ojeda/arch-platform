// packages/testing/src/fixtures/generators/create-test-generator.ts

import type { GeneratorDefinition, NamedVariables } from '@arch/contracts';

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

    templates: [
      {
        template: 'frameworks/express/controller.hbs',
        output: '{{folderLayout.controller}}/{{controllerName}}{{fileExtension}}',
      },

      {
        template: 'frameworks/express/service.hbs',
        output: '{{folderLayout.service}}/{{serviceName}}{{fileExtension}}',
      },

      {
        template: 'frameworks/express/repository.hbs',
        output: '{{folderLayout.repository}}/{{repositoryName}}{{fileExtension}}',
      },

      {
        template: 'frameworks/express/model.hbs',
        output: '{{folderLayout.model}}/{{modelName}}{{fileExtension}}',
      },
    ],

    capabilities: overrides.capabilities,

    metadata: overrides.metadata,
  };
}
