// packages/contracts/src/generators/generator-hooks.ts

import type { GenerationContext } from "../generation/generation-context.js";
import type { NamedVariables } from "../variables/named-variables.js";

export interface GeneratorHooks<
  TValues extends NamedVariables = NamedVariables
> {
  beforeInitialize?(context: GenerationContext<TValues>): Promise<void>;

  beforeRender?(context: GenerationContext<TValues>): Promise<void>;

  afterRender?(context: GenerationContext<TValues>): Promise<void>;

  beforeWrite?(context: GenerationContext<TValues>): Promise<void>;

  afterWrite?(context: GenerationContext<TValues>): Promise<void>;

  onSuccess?(context: GenerationContext<TValues>): Promise<void>;

  onError?(error: unknown, context: GenerationContext<TValues>): Promise<void>;
}
