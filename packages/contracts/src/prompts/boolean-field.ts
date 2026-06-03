// packages\contracts\src\prompts\boolean-field.ts
import type { NamedVariables } from '../variables/named-variables.js';

import type { PromptFieldBase } from './prompt-field-base.js';

export type BooleanField<TValues extends NamedVariables = NamedVariables> = PromptFieldBase<
  TValues,
  'boolean',
  boolean
>;
