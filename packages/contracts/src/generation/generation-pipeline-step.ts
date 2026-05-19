// packages/contracts/src/generation/generation-pipeline-step.ts

import type { GenerationContext } from "./generation-context.js";

export interface GenerationPipelineStep {
  readonly name: string;

  execute(context: GenerationContext): Promise<void>;
}
