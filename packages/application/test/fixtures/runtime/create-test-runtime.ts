// packages/application/test/fixtures/runtime/create-test-runtime.ts

import type { GenerationContext, GenerationPipelineStep } from '@arch/contracts/generation';
import type { GeneratorDefinition } from '@arch/contracts/generators';
import type { NamedVariables, TemplateVariables } from '@arch/contracts/variables';
import { createTestEventBus } from '@arch/testing/events';
import { createMemoryFilesystem } from '@arch/testing/filesystem';
import { createTestGenerator } from '@arch/testing/fixtures';
import { createTestGenerationContext, createTestIdGenerator } from '@arch/testing/runtime';

import { GenerationPipeline } from '../../../src/testing/index.js';

export interface TestRuntime<TVariables extends TemplateVariables = TemplateVariables> {
  readonly filesystem: ReturnType<typeof createMemoryFilesystem>;

  readonly eventBus: ReturnType<typeof createTestEventBus>;

  readonly generator: GeneratorDefinition<TVariables>;

  readonly context: GenerationContext<TVariables>;

  readonly pipeline: GenerationPipeline;
}

export interface CreateTestRuntimeOptions<TVariables extends NamedVariables = NamedVariables> {
  readonly generator?: GeneratorDefinition<TVariables>;

  readonly steps?: readonly GenerationPipelineStep[];

  readonly variables?: TVariables;
}

export function createTestRuntime<TVariables extends TemplateVariables = TemplateVariables>(
  options: CreateTestRuntimeOptions<TVariables> = {},
): TestRuntime<TVariables> {
  const filesystem = createMemoryFilesystem();

  const eventBus = createTestEventBus();

  const generator = options.generator ?? createTestGenerator<TVariables>();

  const context = createTestGenerationContext<TVariables>({
    fs: filesystem,

    eventBus,

    generator,

    variables: options.variables ?? ({} as TVariables),
  });

  const pipeline = new GenerationPipeline({
    idGenerator: createTestIdGenerator(),

    pipelineId: 'test-pipeline',

    steps: [...(options.steps ?? [])],
  });

  return {
    filesystem,

    eventBus,

    generator,

    context,

    pipeline,
  };
}
