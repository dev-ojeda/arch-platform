// packages/testing/src/pipeline/create-test-pipeline-context.ts

import type { GenerationContext } from '@arch/contracts/generation';
import type { GeneratorDefinition } from '@arch/contracts/generators';
import type { ResolvedTemplateVariables } from '@arch/contracts/templates';
import type { TemplateVariables } from '@arch/contracts/variables';

import { testGenerator } from '../fixtures/generators/test-generator.js';
import { createTestContext } from '../runtime/create-test-context.js';

export interface CreateTestPipelineContextOptions<TVariables extends TemplateVariables> {
  generator?: GeneratorDefinition<TVariables> | null;

  variables?: TVariables;

  resolvedVariables?: ResolvedTemplateVariables<TVariables>;
}

export function createTestPipelineContext<TVariables extends TemplateVariables>(
  options: CreateTestPipelineContextOptions<TVariables> = {},
): GenerationContext<TVariables> {
  const context = createTestContext({
    variables: options.variables,
  });
  if (options.generator === null) {
    context.generator = undefined;
  } else {
    context.generator = options.generator ?? testGenerator;
  }

  context.resolvedVariables = options.resolvedVariables;

  return context;
}
