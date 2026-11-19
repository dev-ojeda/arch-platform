import type { GenerationPipelineStep } from '@arch-platform/contracts';

function noop(): Promise<void> {
  return Promise.resolve();
}

export function createTestStep(
  name: string,
  execute: GenerationPipelineStep['execute'] = noop,
): GenerationPipelineStep {
  return {
    name,
    execute,
  };
}
