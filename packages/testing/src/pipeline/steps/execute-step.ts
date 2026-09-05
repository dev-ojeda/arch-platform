// packages\testing\src\pipeline\steps\execute-step.ts
import type { GenerationContext, GenerationPipelineStep } from '@arch-platform/contracts';

export async function executeStep(
  step: GenerationPipelineStep,

  context: GenerationContext,
): Promise<GenerationContext> {
  await step.execute(context);

  return context;
}
