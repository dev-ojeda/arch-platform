// packages/contracts/src/variables/named-variables.ts

import type { VariableValue } from './variable-value.js';

export interface NamedVariables {
  readonly [key: string]: VariableValue;
}
