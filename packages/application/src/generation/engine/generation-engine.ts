// packages/application/src/generation/engine/generation-engine.ts

import type { GenerationRequest, GenerationResult } from '@arch/contracts/generation';
import type { TemplateVariables } from '@arch/contracts/variables';

export interface GenerationEngine<TVariables extends TemplateVariables = TemplateVariables> {
  generate(request: GenerationRequest<TVariables>): Promise<GenerationResult>;
}
