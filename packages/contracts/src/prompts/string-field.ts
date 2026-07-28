// packages\contracts\src\prompts\string-field.ts

import type { NamedVariables } from '../variables/named-variables.js';

import type { PromptFieldBase } from './prompt-field-base.js';

export interface StringField<
  TValues extends NamedVariables = NamedVariables,
> extends PromptFieldBase<TValues, 'string', string> {
  minLength?: number;

  maxLength?: number;

  pattern?: RegExp;
}
