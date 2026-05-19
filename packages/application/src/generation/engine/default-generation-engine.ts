// packages/application/src/application/engine/default-generation-engine.ts

import type { GenerationRequest, GenerationResult } from "@arch/contracts";

import type { GenerationEngine } from "./generation-engine.js";

import type { GenerationPipeline } from "../pipeline/generation-pipeline.js";

import type { GenerationContextFactory } from "../runtime/generation-context-factory.js";

import { createGenerationReport } from "../reports/create-generation-report.js";

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

      const duration = Date.now() - startedAt;

      const report = createGenerationReport(
        context,

        {
          success: true,

          duration,
        }
      );

      return {
        success: true,

        generatedFiles: report.generatedFiles,

        duration: report.duration,

        warnings: report.diagnostics

          .filter((diagnostic) => diagnostic.level === "warning")

          .map((diagnostic) => diagnostic.message),

        report,
      };
    } catch (error) {
      context.logger.error("Generation failed", {
        name: error instanceof Error ? error.name : "UnknownError",

        message: error instanceof Error ? error.message : String(error),
      });

      const duration = Date.now() - startedAt;

      const report = createGenerationReport(
        context,

        {
          success: false,

          duration,
        }
      );

      return {
        success: false,

        generatedFiles: report.generatedFiles,

        duration: report.duration,

        warnings: report.diagnostics

          .filter((diagnostic) => diagnostic.level === "warning")

          .map((diagnostic) => diagnostic.message),

        report,
      };
    }
  }
}
