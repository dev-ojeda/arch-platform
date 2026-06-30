// packages\core\src\templates\reserved\is-reserved-template-variable.ts

import {
  RESERVED_TEMPLATE_VARIABLES,
  type ReservedTemplateVariable,
} from './reserved-template-variables.js';

const RESERVED_TEMPLATE_VARIABLE_SET = new Set<string>(RESERVED_TEMPLATE_VARIABLES);

export function isReservedTemplateVariable(value: string): value is ReservedTemplateVariable {
  return RESERVED_TEMPLATE_VARIABLE_SET.has(value);
}
