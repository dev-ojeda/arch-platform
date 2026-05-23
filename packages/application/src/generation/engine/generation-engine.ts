// packages/application/src/generation/engine/generation-engine.ts

import type { GenerationRequest, GenerationResult } from '@arch/contracts';

export interface GenerationEngine {
  generate(request: GenerationRequest): Promise<GenerationResult>;
}
