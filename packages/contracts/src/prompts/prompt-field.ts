// packages\contracts\src\prompts\prompt-field.ts

import type { NamedVariables } from '../variables/named-variables.js';

import type { BooleanField } from './boolean-field.js';
import type { SelectField } from './select-field.js';
import type { StringField } from './string-field.js';

export type PromptField<TValues extends NamedVariables = NamedVariables> =
  | StringField<TValues>
  | SelectField<TValues>
  | BooleanField<TValues>;
