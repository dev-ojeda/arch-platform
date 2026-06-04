// packages/contracts/src/generators/generator-hooks.ts

import type { GenerationContext } from '../generation/generation-context.js';
import type { TemplateVariables } from '../variables/template-variables.js';

export interface GeneratorHooks<TValues extends TemplateVariables = TemplateVariables> {
  beforeInitialize?(context: GenerationContext<TValues>): Promise<void>;

  beforeRender?(context: GenerationContext<TValues>): Promise<void>;

  afterRender?(context: GenerationContext<TValues>): Promise<void>;

  beforeWrite?(context: GenerationContext<TValues>): Promise<void>;

  afterWrite?(context: GenerationContext<TValues>): Promise<void>;

  onSuccess?(context: GenerationContext<TValues>): Promise<void>;

  onError?(error: unknown, context: GenerationContext<TValues>): Promise<void>;
}
