// packages/application/src/generation/hooks/logging-generation-hooks.ts

import type {
  GenerationContext,
  GenerationHooks,
  GenerationPipelineStep,
} from "@arch/contracts";

export class LoggingGenerationHooks implements GenerationHooks {
  async beforePipeline(context: GenerationContext): Promise<void> {
    context.logger.info("[arch] generation started");
  }

  async beforeStep(
    step: GenerationPipelineStep,

    context: GenerationContext
  ): Promise<void> {
    context.logger.debug(`[arch] running ${step.name}`);
  }

  async afterPipeline(context: GenerationContext): Promise<void> {
    context.logger.info("[arch] generation completed");
  }

  async onError(
    error: unknown,

    context: GenerationContext
  ): Promise<void> {
    context.logger.error("[arch] generation failed", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
