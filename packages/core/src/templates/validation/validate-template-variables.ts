// packages/core/src/templates/validate-template-variables.ts

import type { NamedVariables } from '@arch/contracts/variables';

import { isReservedTemplateVariable } from '../reserved/is-reserved-template-variable.js';

export function validateTemplateVariables(variables: NamedVariables): void {
  for (const key of Object.keys(variables)) {
    if (isReservedTemplateVariable(key)) {
      throw new Error(`Reserved template variable: ${key}`);
    }
  }
}
