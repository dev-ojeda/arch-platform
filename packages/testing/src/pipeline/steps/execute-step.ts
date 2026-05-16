// packages\testing\src\pipeline\steps\execute-step.ts
import type {
  GenerationPipelineStep,
  PipelineContext
} from '@arch/contracts'

export async function executeStep(

  step:
  GenerationPipelineStep,

  context:
  PipelineContext
): Promise<PipelineContext> {

  await step.execute(
    context
  )

  return context
}