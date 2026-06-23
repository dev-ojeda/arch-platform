// packages\testing\src\fixtures\generators\test-generator.ts
import type { GeneratorDefinition, TemplateVariables } from '@arch/contracts';

export const testGenerator: GeneratorDefinition<TemplateVariables> = {
  descriptor: {
    id: 'test-generator',

    displayName: 'Test Generator',

    version: '1.0.0',

    languages: ['typescript'],

    frameworks: ['vitest'],
  },

  schema: {
    id: 'test-schema',

    title: 'Test Schema',

    fields: [],
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
};
