// packages/application/src/application/engine/default-generation-engine.ts

import type {
  GenerationReportExporter,
  GenerationRequest,
  GenerationResult,
} from '@arch/contracts';

import { runGenerationReportExporters } from '../../generation/exporters/run-generation-report-exporters.js';
import type { GenerationPipeline } from '../pipeline/generation-pipeline.js';
import { createGenerationReport } from '../reports/create-generation-report.js';
import type { GenerationContextFactory } from '../runtime/generation-context-factory.js';

import type { GenerationEngine } from './generation-engine.js';

export class DefaultGenerationEngine implements GenerationEngine {
  constructor(
    private readonly pipeline: GenerationPipeline,

    private readonly contextFactory: GenerationContextFactory,

    private readonly exporters: readonly GenerationReportExporter[] = [],
  ) {}

  async generate(request: GenerationRequest): Promise<GenerationResult> {
    const context = this.contextFactory.create(request);

    const startedAt = Date.now();

    try {
      await this.pipeline.execute(context);

      return await this.createResult(
        context,

        true,

        startedAt,
      );
    } catch (error) {
      context.logger.error('Generation failed', {
        name: error instanceof Error ? error.name : 'UnknownError',

        message: error instanceof Error ? error.message : String(error),
      });

      return await this.createResult(
        context,

        false,

        startedAt,
      );
    }
  }

  private async createResult(
    context: ReturnType<GenerationContextFactory['create']>,

    success: boolean,

    startedAt: number,
  ): Promise<GenerationResult> {
    const duration = Date.now() - startedAt;

    const report = createGenerationReport(
      context,

      {
        success,

        duration,
      },
    );

    await runGenerationReportExporters(
      this.exporters,

      report,
    );

    return {
      success,

      generatedFiles: report.generatedFiles,

      duration: report.duration,

      warnings: report.diagnostics

        .filter((diagnostic) => diagnostic.level === 'warning')

        .map((diagnostic) => diagnostic.message),

      report,
    };
  }
}
