// packages/contracts/src/generation/generation-pipeline-step.ts

import type { TemplateVariables } from '../variables/template-variables.js';

import type { GenerationContext } from './generation-context.js';

export interface GenerationPipelineStep<TVariables extends TemplateVariables = TemplateVariables> {
  readonly name: string;

  execute(context: GenerationContext<TVariables>): Promise<void>;
}
