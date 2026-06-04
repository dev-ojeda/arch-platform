// packages/application/src/generation/hooks/logging-generation-hooks.ts

import { reportDiagnostic } from '@arch/contracts/diagnostics';
import type { GenerationContext, GenerationPipelineStep } from '@arch/contracts/generation';
import type { GenerationHooks } from '@arch/contracts/hooks';
import type { TemplateVariables } from '@arch/contracts/variables';

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
    reportDiagnostic(context, {
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
    reportDiagnostic(context, {
      level: 'error',
      message: error instanceof Error ? error.message : String(error),
      timestamp: 0,
    });

    context.logger.error('[arch] generation failed', {
      error: error instanceof Error ? error.message : String(error),
    });

    return Promise.resolve();
  }
}
