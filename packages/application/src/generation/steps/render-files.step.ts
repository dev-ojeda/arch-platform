// packages/application/src/generation/steps/render-files.step.ts

import type {
  GeneratedFile,
  GenerationContext,
  GenerationPipelineStep,
} from '@arch/contracts/generation';
import type { TemplateVariables } from '@arch/contracts/variables';

export class RenderFilesStep<
  TVariables extends TemplateVariables = TemplateVariables,
> implements GenerationPipelineStep<TVariables> {
  readonly name = 'render-files';

  execute(context: GenerationContext<TVariables>): Promise<void> {
    const generator = context.generator;

    if (!generator) {
      throw new Error('Generator not available');
    }

    const generatedFiles: GeneratedFile[] = [];

    for (const _template of generator.templates) {
      generatedFiles.push({
        path: 'example.ts',

        content: 'rendered content',
      });
    }

    context.files.push(...generatedFiles);

    return Promise.resolve();
  }
}
