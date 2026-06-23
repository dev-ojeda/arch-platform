// packages/application/src/generation/pipeline/generation-pipeline-options.ts

import type {
  GenerationHooks,
  GenerationPipelineStep,
  IdGenerator,
  TemplateVariables,
} from '@arch/contracts';

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
