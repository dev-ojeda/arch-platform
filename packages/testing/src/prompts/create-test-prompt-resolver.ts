// packages/testing/src/prompts/create-test-prompt-resolver.ts

import type { PromptResolver, PromptSchema } from '@arch/contracts/prompts';
import type { NamedVariables } from '@arch/contracts/variables';

function restoreVariables<TVariables extends NamedVariables>(
  variables: NamedVariables,
): TVariables {
  return variables as TVariables;
}

export function createTestPromptResolver(variables: NamedVariables = {}): PromptResolver {
  return {
    collect<TVariables extends NamedVariables>(
      _schema: PromptSchema<TVariables>,
    ): Promise<TVariables> {
      return Promise.resolve(restoreVariables<TVariables>(variables));
    },
  };
}
