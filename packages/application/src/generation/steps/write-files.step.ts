// packages/application/src/generation/steps/write-files.step.ts

import type {
  GenerationContext,
  GenerationPipelineStep,
} from "@arch/contracts";

export class WriteFilesStep implements GenerationPipelineStep {
  readonly name = "write-files";

  async execute(context: GenerationContext): Promise<void> {
    for (const file of context.files) {
      await context.fs.write(
        file.path,

        file.content
      );

      context.logger.info(`[arch] created ${file.path}`);
    }
  }
}
