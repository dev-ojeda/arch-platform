// packages\contracts\src\prompts\string-field.ts

import type { PromptFieldBase } from './prompt-field-base.js';
import type { NamedVariables } from '../variables/named-variables.js';


export interface StringField<
  TValues extends NamedVariables = NamedVariables,
> extends PromptFieldBase<TValues, 'string', string> {
  minLength?: number;

  maxLength?: number;

  pattern?: RegExp;
}
