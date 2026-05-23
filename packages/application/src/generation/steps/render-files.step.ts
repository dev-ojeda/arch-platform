// packages/application/src/generation/steps/render-files.step.ts

import type { GeneratedFile, GenerationContext, GenerationPipelineStep } from '@arch/contracts';

export class RenderFilesStep implements GenerationPipelineStep {
  readonly name = 'render-files';

  async execute(context: GenerationContext): Promise<void> {
    const generator = context.generator;

    if (!generator) {
      throw new Error('Generator not available');
    }

    const generatedFiles: GeneratedFile[] = [];

    for (const _template of generator.templates) {
      /*
       * render template
       * resolve output path
       * create GeneratedFile
       */

      generatedFiles.push({
        path: 'example.ts',

        content: 'rendered content',
      });
    }

    context.files.push(...generatedFiles);
  }
}
