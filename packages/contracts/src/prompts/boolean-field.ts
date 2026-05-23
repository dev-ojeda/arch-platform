// packages\contracts\src\prompts\boolean-field.ts
import type { NamedVariables } from '../variables/named-variables.js';

import type { PromptFieldBase } from './prompt-field-base.js';

export interface BooleanField<
  TValues extends NamedVariables = NamedVariables,
> extends PromptFieldBase<TValues, 'boolean', boolean> {}
