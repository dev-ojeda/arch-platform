// packages/testing/src/prompts/create-mock-prompt-adapter.ts

import { vi } from 'vitest';

import type {
  BooleanField,
  NamedVariables,
  PromptAdapter,
  SelectField,
  SelectOption,
  StringField,
} from '@arch/contracts';

import { createTestPromptAdapter } from './create-test-prompt-adapter.js';

export function createMockPromptAdapter(): PromptAdapter {
  const promptAdapter = createTestPromptAdapter();
  return {
    ...promptAdapter,
    input: vi.fn(<TValues extends NamedVariables>(field: StringField<TValues>) =>
      promptAdapter.input(field),
    ),
    select: vi.fn(
      <TValues extends NamedVariables>(field: SelectField<TValues>, options: SelectOption[]) =>
        promptAdapter.select(field, options),
    ),
    boolean: vi.fn((field: BooleanField<NamedVariables>) => promptAdapter.boolean(field)),
  };
}
