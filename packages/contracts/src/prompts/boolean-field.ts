// packages\contracts\src\prompts\boolean-field.ts
import type { PromptFieldBase } from './prompt-field-base.js';
import type { NamedVariables } from '../variables/named-variables.js';


export type BooleanField<TValues extends NamedVariables = NamedVariables> = PromptFieldBase<
  TValues,
  'boolean',
  boolean
>;
