// packages/application/test/test-pipeline-builder.ts

import type { TemplateVariables } from '@arch/contracts/variables';
import { BaseTestGenerationRuntime, type TestGenerationExecution } from '@arch/testing/generation';
import { createTestPromptResolver } from '@arch/testing/prompts';
import { createTestIdGenerator } from '@arch/testing/runtime';

import { GenerationPipeline } from '../src/generation/pipeline/generation-pipeline.js';
import { RenderFilesStep } from '../src/generation/steps/render-files.step.js';
import { ResolvePromptsStep } from '../src/generation/steps/resolve-prompts.step.js';
import { ResolveTemplatesStep } from '../src/generation/steps/resolve-templates.step.js';
import { ResolveVariablesStep } from '../src/generation/steps/resolve-variables.step.js';
import { ValidateGeneratorStep } from '../src/generation/steps/validate-generator.step.js';
import { WriteFilesStep } from '../src/generation/steps/write-files.step.js';
import { createRuntime } from '../src/runtime/runtime-bootstrap.js';

export class TestPipelineBuilder extends BaseTestGenerationRuntime<TemplateVariables> {
  readonly #promptResolver = createTestPromptResolver();

  readonly #runtime = createRuntime({
    idGenerator: createTestIdGenerator(),
  });

  createDefaultSteps() {
    return [
      new ValidateGeneratorStep(),
      new ResolvePromptsStep(this.#promptResolver),
      new ResolveVariablesStep(),
      new ResolveTemplatesStep(),
      new RenderFilesStep(),
      new WriteFilesStep(),
    ];
  }

  async execute(): Promise<TestGenerationExecution<TemplateVariables>> {
    const pipeline = new GenerationPipeline({
      steps: [...this.createDefaultSteps(), ...this.getSteps()],

      idGenerator: this.#runtime.idGenerator,

      runtimeEvents: this.#runtime.runtimeEvents,
    });

    const context = this.getContext();

    await pipeline.execute(context);

    return {
      context,
      runtime: this.#runtime,
    };
  }
}
