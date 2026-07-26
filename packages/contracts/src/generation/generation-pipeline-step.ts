// packages/contracts/src/generation/generation-pipeline-step.ts

import type { GenerationContext } from './generation-context.js';
import type { TemplateVariables } from '../variables/template-variables.js';


export interface GenerationPipelineStep<TVariables extends TemplateVariables = TemplateVariables> {
  readonly name: string;

  execute(context: GenerationContext<TVariables>): Promise<void>;
}
