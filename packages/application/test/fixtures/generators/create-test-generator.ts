import type {
  FileDefinition,
  GeneratorCapabilities,
  GeneratorDefinition,
  GeneratorDescriptor,
  GeneratorMetadata,
  NamedVariables,
  PromptSchema,
  ResolvedTemplateVariables,
} from '@arch-platform/contracts';

export interface CreateTestGeneratorOptions<TValues extends NamedVariables = NamedVariables> {
  descriptor?: Partial<GeneratorDescriptor>;
  schema?: Partial<PromptSchema<TValues>>;
  templates?: readonly FileDefinition<ResolvedTemplateVariables<TValues>>[];
  capabilities?: GeneratorCapabilities;
  metadata?: GeneratorMetadata;
}

export function createTestGenerator<TValues extends NamedVariables = NamedVariables>(
  overrides: CreateTestGeneratorOptions<TValues> = {},
): GeneratorDefinition<TValues> {
  return {
    descriptor: {
      id: 'test-generator',
      displayName: 'Test Generator',
      version: '1.0.0',
      languages: ['typescript'],
      frameworks: ['express'],
      ...overrides.descriptor,
    },

    schema: {
      id: 'test-schema',
      title: 'Test Schema',
      fields: [],
      ...overrides.schema,
    },

    templates: overrides.templates ?? [
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
