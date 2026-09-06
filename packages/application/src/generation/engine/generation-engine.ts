// packages/application/src/generation/engine/generation-engine.ts

import type {
  GenerationRequest,
  GenerationResult,
  TemplateVariables,
} from '@arch-platform/contracts';

export interface GenerationEngine<TVariables extends TemplateVariables = TemplateVariables> {
  generate(request: GenerationRequest<TVariables>): Promise<GenerationResult>;
}
