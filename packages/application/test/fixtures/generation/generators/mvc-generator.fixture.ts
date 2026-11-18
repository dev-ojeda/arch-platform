import type { GeneratorDefinition, TemplateVariables } from '@arch-platform/contracts';

export const mvcGenerator: GeneratorDefinition<TemplateVariables> = {
  descriptor: {
    id: 'mvc',
    displayName: 'MVC Generator',
    version: '1.0.0',
    languages: ['typescript'],
    frameworks: [],
  },
  schema: {
    id: 'mvc',
    title: 'MVC Generator',
    fields: [],
  },
  templates: [
    {
      template: 'README.hbs',
      output: 'README.md',
    },
  ],
};
