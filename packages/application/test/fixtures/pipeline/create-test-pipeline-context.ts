import type {
  GenerationContext,
  GeneratorDefinition,
  ResolvedTemplateVariables,
  TemplateVariables,
} from '@arch-platform/contracts';

import { createTestGenerator } from '../generators/create-test-generator.js';
import { createTestContext } from '../runtime/create-test-context.js';

export interface CreateTestPipelineContextOptions<TVariables extends TemplateVariables> {
  generator?: GeneratorDefinition<TVariables> | null;
  variables?: TVariables;
  resolvedVariables?: ResolvedTemplateVariables<TVariables>;
  languageId?: string;
}

export function createTestPipelineContext<TVariables extends TemplateVariables>(
  options: CreateTestPipelineContextOptions<TVariables> = {},
): GenerationContext<TVariables> {
  return {
    ...createTestContext({
      variables: options.variables,
      languageId: options.languageId,
    }),
    generator:
      options.generator === null
        ? undefined
        : (options.generator ?? createTestGenerator<TVariables>()),
    resolvedVariables: options.resolvedVariables,
  };
}
