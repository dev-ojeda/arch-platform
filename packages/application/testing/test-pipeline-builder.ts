// packages\application\testing\test-pipeline-builder.ts

import type {
  GenerationContext,
  GenerationPipelineStep,
  GeneratorDefinition,
  NamedVariables,
} from "@arch/contracts";

import { ValidateGeneratorStep } from "../src/generation/steps/validate-generator.step.js";

import { createTestContext, createTestPromptResolver } from "@arch/testing";
import { GenerationPipeline } from "../src/generation/pipeline/generation-pipeline.js";
import { ResolvePromptsStep } from "../src/generation/steps/resolve-prompts.step.js";
import { ResolveTemplatesStep } from "../src/generation/steps/resolve-templates.step.js";
import { ResolveVariablesStep } from "../src/generation/steps/resolve-variables.step.js";
import {
  createRuntime,
  RenderFilesStep,
  WriteFilesStep,
} from "../src/index.js";
import type { TestPipelineExecution } from "./test-pipeline-execution.js";

export class TestPipelineBuilder {
  private readonly steps: GenerationPipelineStep[] = [];

  private readonly promptResolver = createTestPromptResolver();

  private context = this.createContext();
  private readonly runtime = createRuntime();
  private createContext(): GenerationContext {
    return createTestContext();
  }

  withGenerator(generator: GeneratorDefinition): this {
    this.context.generator = generator;

    return this;
  }

  withVariables(variables: NamedVariables): this {
    this.context.variables = variables;

    return this;
  }

  withStep(step: GenerationPipelineStep): this {
    this.steps.push(step);

    return this;
  }

  private createDefaultSteps(): GenerationPipelineStep[] {
    return [
      new ValidateGeneratorStep(),

      new ResolvePromptsStep(this.promptResolver),

      new ResolveVariablesStep(),

      new ResolveTemplatesStep(),

      new RenderFilesStep(),

      new WriteFilesStep(),
    ];
  }

  async execute(): Promise<TestPipelineExecution> {
    const pipeline = new GenerationPipeline(
      [...this.createDefaultSteps(), ...this.steps],

      undefined,

      this.runtime.runtimeEvents
    );

    await pipeline.execute(this.context);

    return {
      context: this.context,

      runtime: this.runtime,
    };
  }
}
