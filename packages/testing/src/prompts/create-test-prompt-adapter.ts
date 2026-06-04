// packages/testing/src/prompts/create-test-prompt-adapter.ts

import type {
  BooleanField,
  PromptAdapter,
  SelectField,
  StringField,
} from '@arch/contracts/prompts';
import type { NamedVariables, VariableValue } from '@arch/contracts/variables';

function getStringValue(value: VariableValue): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function getBooleanValue(value: VariableValue): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

export function createTestPromptAdapter(variables: NamedVariables = {}): PromptAdapter {
  return {
    input<TValues extends NamedVariables>(
      field: StringField<TValues>,
    ): Promise<string | undefined> {
      return Promise.resolve(getStringValue(variables[field.name]));
    },

    select<TValues extends NamedVariables>(
      field: SelectField<TValues>,
    ): Promise<string | undefined> {
      return Promise.resolve(getStringValue(variables[field.name]));
    },

    boolean<TValues extends NamedVariables>(
      field: BooleanField<TValues>,
    ): Promise<boolean | undefined> {
      return Promise.resolve(getBooleanValue(variables[field.name]));
    },
  };
}
