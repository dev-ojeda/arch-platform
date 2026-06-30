// packages/application/src/generation/hooks/logging-generation-hooks.ts

import {
  type GenerationContext,
  type GenerationDiagnostic,
  type GenerationHooks,
  type GenerationPipelineStep,
  type TemplateVariables,
} from '@arch/contracts';

import { errorMessage } from '../../errors/error-message.js';

export class LoggingGenerationHooks<
  TVariables extends TemplateVariables = TemplateVariables,
> implements GenerationHooks<TVariables> {
  beforePipeline(context: GenerationContext<TVariables>): Promise<void> {
    context.logger.info('[arch] generation started');

    return Promise.resolve();
  }

  beforeStep(
    step: GenerationPipelineStep<TVariables>,
    context: GenerationContext<TVariables>,
  ): Promise<void> {
    this.reportDiagnostic(context, {
      level: 'info',
      message: `Running ${step.name}`,
      step: step.name,
      timestamp: 0,
    });

    context.logger.debug(`[arch] running ${step.name}`);

    return Promise.resolve();
  }

  afterPipeline(context: GenerationContext<TVariables>): Promise<void> {
    context.logger.info('[arch] generation completed');

    return Promise.resolve();
  }

  onError(error: unknown, context: GenerationContext<TVariables>): Promise<void> {
    this.reportDiagnostic(context, {
      level: 'error',
      message: error instanceof Error ? error.message : errorMessage(error),
      timestamp: 0,
    });

    context.logger.error('[arch] generation failed', {
      error: error instanceof Error ? error.message : errorMessage(error),
    });

    return Promise.resolve();
  }

  private reportDiagnostic(
    context: Pick<GenerationContext, 'diagnostics'>,
    diagnostic: GenerationDiagnostic,
  ): void {
    context.diagnostics.push(diagnostic);
  }
}
