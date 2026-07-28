// packages/contracts/src/prompts/prompt-resolver.ts
import type { NamedVariables } from '../variables/named-variables.js';

import type { PromptSchema } from './prompt-schema.js';

export interface PromptResolver {
  collect<TVariables extends NamedVariables = NamedVariables>(
    schema: PromptSchema<TVariables>,
  ): Promise<TVariables>;
}
