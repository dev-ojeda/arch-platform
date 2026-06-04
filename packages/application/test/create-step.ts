import type { GenerationPipelineStep } from '@arch/contracts/generation';

export function createStep(
  name: string,

  execute: GenerationPipelineStep['execute'],
): GenerationPipelineStep {
  return {
    name,

    execute,
  };
}
