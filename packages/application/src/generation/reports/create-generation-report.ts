// packages/application/src/generation/reports/create-generation-report.ts

import type { GenerationContext } from '@arch/contracts/generation';
import type { GenerationReport } from '@arch/contracts/reports';
import type { TemplateVariables } from '@arch/contracts/variables';
import { RecordingGenerationEventBus } from '@arch/core/events';

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
