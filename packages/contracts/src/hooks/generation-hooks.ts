// packages/contracts/src/hooks/generation-hooks.ts

import type { GenerationContext } from '../generation/generation-context.js';
import type { GenerationPipelineStep } from '../generation/generation-pipeline-step.js';
import type { TemplateVariables } from '../variables/template-variables.js';

export interface GenerationHooks<TVariables extends TemplateVariables = TemplateVariables> {
  beforePipeline?(context: GenerationContext<TVariables>): Promise<void>;

  onSuccess?(context: GenerationContext<TVariables>): Promise<void>;

  onError?(error: unknown, context: GenerationContext<TVariables>): Promise<void>;

  afterPipeline?(context: GenerationContext<TVariables>): Promise<void>;

  beforeStep?(
    step: GenerationPipelineStep<TVariables>,
    context: GenerationContext<TVariables>,
  ): Promise<void>;

  afterStep?(
    step: GenerationPipelineStep<TVariables>,
    context: GenerationContext<TVariables>,
  ): Promise<void>;
}
