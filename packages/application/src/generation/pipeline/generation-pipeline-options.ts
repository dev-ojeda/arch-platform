// packages/application/src/generation/pipeline/generation-pipeline-options.ts

import type { GenerationPipelineStep } from '@arch/contracts/generation';
import type { GenerationHooks } from '@arch/contracts/hooks';
import type { IdGenerator } from '@arch/contracts/runtime';
import type { TemplateVariables } from '@arch/contracts/variables';

import type { RuntimeEventBus } from '../../runtime/execution/events/runtime-event-bus.js';

export interface GenerationPipelineOptions<
  TVariables extends TemplateVariables = TemplateVariables,
> {
  readonly steps: readonly GenerationPipelineStep<TVariables>[];

  readonly hooks?: GenerationHooks<TVariables>;

  readonly idGenerator: IdGenerator;

  readonly runtimeEvents?: RuntimeEventBus;

  readonly pipelineId?: string;
}
