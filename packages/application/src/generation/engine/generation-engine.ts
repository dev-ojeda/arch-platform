// packages/application/src/generation/engine/generation-engine.ts

import type { GenerationRequest, GenerationResult } from '@arch/contracts/generation';
import type { NamedVariables } from '@arch/contracts/variables';

export interface GenerationEngine<TVariables extends NamedVariables = NamedVariables> {
  generate(request: GenerationRequest<TVariables>): Promise<GenerationResult>;
}
