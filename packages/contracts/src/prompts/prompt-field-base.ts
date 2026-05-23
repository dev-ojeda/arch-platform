// packages\contracts\src\prompts\prompt-field-base.ts

import type { NamedVariables } from '../variables/named-variables.js';

export interface PromptFieldBase<TValues extends NamedVariables, TType, TValue> {
  type: TType;

  name: keyof TValues;

  message: string;

  description?: string;

  required?: boolean;

  defaultValue?: TValue;

  when?: (values: TValues) => boolean | Promise<boolean>;

  transform?: (value: TValue) => TValue | Promise<TValue>;

  validate?: (value: TValue, values: TValues) => string | undefined | Promise<string | undefined>;
}
