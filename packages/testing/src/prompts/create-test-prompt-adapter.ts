// packages/testing/src/prompts/create-test-prompt-adapter.ts
import type {
  BooleanField,
  NamedVariables,
  PromptAdapter,
  SelectField,
  StringField,
} from "@arch/contracts";

export function createTestPromptAdapter(
  variables: NamedVariables = {}
): PromptAdapter {
  return {
    async input<TValues extends NamedVariables>(
      field: StringField<TValues>
    ): Promise<string | undefined> {
      return variables[field.name] as string | undefined;
    },

    async select<TValues extends NamedVariables>(
      field: SelectField<TValues>
    ): Promise<string | undefined> {
      return variables[field.name] as string | undefined;
    },

    async boolean<TValues extends NamedVariables>(
      field: BooleanField<TValues>
    ): Promise<boolean | undefined> {
      return variables[field.name] as boolean | undefined;
    },
  };
}
