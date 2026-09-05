import type { GenerationPipelineStep } from '@arch-platform/contracts';

export function createStep(
  name: string,

  execute: GenerationPipelineStep['execute'],
): GenerationPipelineStep {
  return {
    name,

    execute,
  };
}
