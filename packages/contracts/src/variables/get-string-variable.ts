// packages/contracts/src/variables/get-string-variable.ts

import type { VariableValue } from './variable-value.js';

export function getStringVariable(value: VariableValue, variableName: string): string {
  if (typeof value !== 'string') {
    throw new Error(`Variable "${variableName}" must be a string`);
  }

  return value;
}
