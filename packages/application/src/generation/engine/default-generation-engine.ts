// packages/application/src/application/engine/default-generation-engine.ts

import type { GenerationRequest, GenerationResult } from "@arch/contracts";

import type { GenerationEngine } from "./generation-engine.js";

import type { GenerationContextFactory } from "../runtime/generation-context-factory.js";
import type { GenerationPipeline } from "./pipeline/generation-pipeline.js";

export class DefaultGenerationEngine implements GenerationEngine {
  constructor(
    private readonly pipeline: GenerationPipeline,

    private readonly contextFactory: GenerationContextFactory
  ) {}

  async generate(request: GenerationRequest): Promise<GenerationResult> {
    const context = this.contextFactory.create(request);

    const startedAt = Date.now();

    try {
      await this.pipeline.execute(context);

      return {
        success: true,

        generatedFiles: context.files.map((file) => file.path),

        duration: Date.now() - startedAt,

        warnings: [],
      };
    } catch (error) {
      context.logger.error("Generation failed", {
        name: error instanceof Error ? error.name : "UnknownError",

        message: error instanceof Error ? error.message : String(error),
      });

      return {
        success: false,

        generatedFiles: [],

        duration: Date.now() - startedAt,

        warnings: [
          error instanceof Error ? error.message : "Unknown generation error",
        ],
      };
    }
  }
}
