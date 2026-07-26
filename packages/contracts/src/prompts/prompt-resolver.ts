// packages/contracts/src/prompts/prompt-resolver.ts
import type { PromptSchema } from './prompt-schema.js';
import type { NamedVariables } from '../variables/named-variables.js';


export interface PromptResolver {
  collect<TVariables extends NamedVariables = NamedVariables>(
    schema: PromptSchema<TVariables>,
  ): Promise<TVariables>;
}
