// packages/testing/src/generation/test-generation-runtime.ts

import type {
  GenerationContext,
  GenerationPipelineStep,
  GeneratorDefinition,
  TemplateVariables,
} from '@arch/contracts';

import { createTestContext } from '../runtime/create-test-context.js';

export interface TestGenerationExecution<TResultRuntime> {
  context: GenerationContext;

  runtime: TResultRuntime;
}

export interface TestGenerationRuntime<TResultRuntime> {
  withGenerator(generator: GeneratorDefinition): this;

  withVariables(variables: TemplateVariables): this;

  withStep(step: GenerationPipelineStep): this;

  execute(): Promise<TestGenerationExecution<TResultRuntime>>;
}

export abstract class BaseTestGenerationRuntime<
  TResultRuntime,
> implements TestGenerationRuntime<TResultRuntime> {
  protected readonly steps: GenerationPipelineStep[] = [];

  protected context: GenerationContext = createTestContext();

  withGenerator(generator: GeneratorDefinition): this {
    this.context.generator = generator;

    return this;
  }

  withVariables(variables: TemplateVariables): this {
    this.context.variables = variables;

    return this;
  }

  withStep(step: GenerationPipelineStep): this {
    this.steps.push(step);

    return this;
  }

  protected getContext(): GenerationContext {
    return this.context;
  }

  protected getSteps(): GenerationPipelineStep[] {
    return this.steps;
  }

  abstract execute(): Promise<TestGenerationExecution<TResultRuntime>>;
}
