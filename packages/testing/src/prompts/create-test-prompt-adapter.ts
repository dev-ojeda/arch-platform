// packages/testing/src/prompts/create-test-prompt-adapter.ts

import type {
  BooleanField,
  NamedVariables,
  PromptAdapter,
  SelectField,
  SelectOption,
  StringField,
  VariableValue,
} from '@arch/contracts';

function getStringValue(value: VariableValue): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function getBooleanValue(value: VariableValue): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

export function createTestPromptAdapter<TValues extends NamedVariables>(
  variables: TValues = {} as TValues,
): PromptAdapter {
  return {
    input<TValues extends NamedVariables>(
      field: StringField<TValues>,
    ): Promise<string | undefined> {
      return Promise.resolve(getStringValue(variables[field.name]));
    },

    select: function <TValues extends NamedVariables>(
      field: SelectField<TValues>,
      options: SelectOption[],
    ): Promise<string | undefined> {
      const value = getStringValue(variables[field.name]);

      if (value && options.some((option) => option.value === value)) {
        return Promise.resolve(value);
      }

      return Promise.resolve(undefined);
    },

    boolean<TValues extends NamedVariables>(
      field: BooleanField<TValues>,
    ): Promise<boolean | undefined> {
      return Promise.resolve(getBooleanValue(variables[field.name]));
    },
  };
}
