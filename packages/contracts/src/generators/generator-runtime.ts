// packages/contracts/src/generators/generator-runtime.ts

import type { GeneratorDefinition } from './generator-definition.js';
import type { RuntimeHooks } from '../runtime/runtime-hooks.js';
import type { NamedVariables } from '../variables/named-variables.js';


export interface GeneratorRuntime<TValues extends NamedVariables = NamedVariables> {
  readonly definition: GeneratorDefinition<TValues>;

  readonly hooks?: RuntimeHooks<TValues>;
}
