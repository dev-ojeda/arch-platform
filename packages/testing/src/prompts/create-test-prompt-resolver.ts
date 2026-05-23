// packages/testing/src/prompts/create-test-prompt-resolver.ts

import type { NamedVariables, PromptResolver, PromptSchema } from '@arch/contracts';

export function createTestPromptResolver(variables: NamedVariables = {}): PromptResolver {
  return {
    async collect<TVariables extends NamedVariables>(
      _schema: PromptSchema<TVariables>,
    ): Promise<TVariables> {
      return variables as TVariables;
    },
  };
}
