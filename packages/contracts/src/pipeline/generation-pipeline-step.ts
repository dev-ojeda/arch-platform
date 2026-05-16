import type { PipelineContext } from "./pipeline-context.js";

export interface GenerationPipelineStep {

  execute(
    context: PipelineContext
  ): Promise<void>
}