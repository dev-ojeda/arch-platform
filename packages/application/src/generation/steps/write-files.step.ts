// packages/application/src/generation/steps/write-files.step.ts

import type { GenerationContext, GenerationPipelineStep } from '@arch/contracts/generation';
import type { TemplateVariables } from '@arch/contracts/variables';

export class WriteFilesStep<
  TVariables extends TemplateVariables,
> implements GenerationPipelineStep<TVariables> {
  readonly name = 'write-files';

  async execute(context: GenerationContext<TVariables>): Promise<void> {
    for (const file of context.files) {
      await context.fs.write(
        file.path,

        file.content,
      );

      context.logger.info(`[arch] created ${file.path}`);
    }
  }
}
