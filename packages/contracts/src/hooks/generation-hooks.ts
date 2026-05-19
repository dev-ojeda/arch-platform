// packages/contracts/src/hooks/generation-hooks.ts

import type { GenerationContext } from "../generation/generation-context.js";
import type { GenerationPipelineStep } from "../generation/generation-pipeline-step.js";

export interface GenerationHooks {
  beforePipeline?(context: GenerationContext): Promise<void>;

  onSuccess?(context: GenerationContext): Promise<void>;

  onError?(error: unknown, context: GenerationContext): Promise<void>;

  afterPipeline?(context: GenerationContext): Promise<void>;

  beforeStep?(
    step: GenerationPipelineStep,
    context: GenerationContext
  ): Promise<void>;

  afterStep?(
    step: GenerationPipelineStep,
    context: GenerationContext
  ): Promise<void>;
}
