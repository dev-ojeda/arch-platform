// packages/application/src/generation/reports/create-generation-report.ts

import type { GenerationContext, GenerationReport, TemplateVariables } from '@arch/contracts';
import { RecordingGenerationEventBus } from '@arch/core';

export interface CreateGenerationReportOptions {
  success: boolean;

  duration: number;
}

export function createGenerationReport<TVariables extends TemplateVariables = TemplateVariables>(
  context: GenerationContext<TVariables>,
  options: CreateGenerationReportOptions,
): GenerationReport {
  const eventBus = context.eventBus;

  return {
    success: options.success,

    duration: options.duration,

    generatedFiles: context.files.map((file) => file.path),

    diagnostics: context.diagnostics,

    metrics: context.metrics,

    events: eventBus instanceof RecordingGenerationEventBus ? eventBus.events : [],
  };
}
