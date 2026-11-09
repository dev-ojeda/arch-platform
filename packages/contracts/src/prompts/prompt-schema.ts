// packages\contracts\src\prompts\prompt-schema.ts

import type { PromptField } from './prompt-field.js';
import type { NamedVariables } from '../variables/named-variables.js';


export interface PromptSchema<TValues extends NamedVariables = NamedVariables> {
  id: string;

  title: string;

  description?: string;

  version?: string;

  fields: PromptField<TValues>[];
}
