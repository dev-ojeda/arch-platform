// packages\contracts\src\prompts\select-field.ts

import type { PromptFieldBase } from './prompt-field-base.js';
import type { NamedVariables } from '../variables/named-variables.js';


export interface SelectOption {
  label: string;

  value: string;
}

export interface SelectField<
  TValues extends NamedVariables = NamedVariables,
> extends PromptFieldBase<TValues, 'select', string> {
  options: SelectOption[] | ((values: TValues) => Promise<SelectOption[]> | SelectOption[]);
}
