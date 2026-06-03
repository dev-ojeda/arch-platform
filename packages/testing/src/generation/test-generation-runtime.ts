// packages/testing/src/generation/test-generation-runtime.ts

import type { GenerationContext, GenerationPipelineStep } from '@arch/contracts/generation';
import type { GeneratorDefinition } from '@arch/contracts/generators';
import type { TemplateVariables } from '@arch/contracts/variables';

import { createTestContext } from '../runtime/create-test-context.js';

export interface TestGenerationExecution<TVariables extends TemplateVariables, TRuntime = unknown> {
  context: GenerationContext<TVariables>;
  runtime: TRuntime;
}
export interface TestGenerationRuntime<TVariables extends TemplateVariables> {
  withGenerator(generator: GeneratorDefinition<TVariables>): this;

  withVariables(variables: TVariables): this;

  withStep(step: GenerationPipelineStep<TVariables>): this;

  execute(): Promise<TestGenerationExecution<TVariables>>;
}

export abstract class BaseTestGenerationRuntime<
  TResultRuntime extends TemplateVariables,
> implements TestGenerationRuntime<TResultRuntime> {
  protected readonly steps: GenerationPipelineStep<TResultRuntime>[] = [];

  protected context: GenerationContext<TResultRuntime> = createTestContext<TResultRuntime>();

  withGenerator(generator: GeneratorDefinition<TResultRuntime>): this {
    this.context.generator = generator;
    return this;
  }

  withVariables(variables: TResultRuntime): this {
    this.context.variables = variables;
    return this;
  }

  withStep(step: GenerationPipelineStep<TResultRuntime>): this {
    this.steps.push(step);
    return this;
  }

  protected getContext(): GenerationContext<TResultRuntime> {
    return this.context;
  }

  protected getSteps(): GenerationPipelineStep<TResultRuntime>[] {
    return this.steps;
  }

  abstract execute(): Promise<TestGenerationExecution<TResultRuntime>>;
}
