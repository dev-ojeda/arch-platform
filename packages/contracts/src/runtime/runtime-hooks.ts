// packages/contracts/src/runtime/runtime-hooks.ts


import type { RuntimeContext } from './runtime-context.js';
import type { RuntimePhase } from './runtime-phase.js';
import type { NamedVariables } from '../variables/named-variables.js';

export interface RuntimeHooks<TValues extends NamedVariables = NamedVariables> {
  beforePhase?(phase: RuntimePhase, context: RuntimeContext<TValues>): Promise<void>;

  afterPhase?(phase: RuntimePhase, context: RuntimeContext<TValues>): Promise<void>;

  onError?(error: unknown, context: RuntimeContext<TValues>): Promise<void>;
}
