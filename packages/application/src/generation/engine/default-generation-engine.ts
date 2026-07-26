// packages/application/src/application/engine/default-generation-engine.ts

import type {
  GenerationContext,
  GenerationReportExporter,
  GenerationRequest,
  GenerationResult,
  TemplateVariables,
} from '@arch/contracts';

import { runGenerationReportExporters } from '../../generation/exporters/run-generation-report-exporters.js';
import { createGenerationReport } from '../reports/create-generation-report.js';

import type { GenerationEngine } from './generation-engine.js';
import type { GenerationPipeline } from '../pipeline/generation-pipeline.js';
import type { GenerationContextFactory } from '../runtime/generation-context-factory.js';

export class DefaultGenerationEngine<
  TVariables extends TemplateVariables = TemplateVariables,
> implements GenerationEngine<TVariables> {
  constructor(
    private readonly pipeline: GenerationPipeline<TVariables>,
    private readonly contextFactory: GenerationContextFactory,
    private readonly exporters: readonly GenerationReportExporter[] = [],
  ) {}

  async generate(request: GenerationRequest<TVariables>): Promise<GenerationResult> {
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
        source: {
          component: 'DefaultGenerationEngine',
          operation: 'async generate',
        },
        metadata: {
          name: error instanceof Error ? error.name : 'UnknownError',

          message: error instanceof Error ? error.message : String(error),
        },
      });

      return await this.createResult(
        context,

        false,

        startedAt,
      );
    }
  }

  private async createResult(
    context: GenerationContext<TVariables>,

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
