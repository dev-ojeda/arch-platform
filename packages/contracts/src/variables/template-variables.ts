// packages/contracts/src/variables/template-variables.ts

import type { NamedVariables } from './named-variables.js';

export interface TemplateVariables extends NamedVariables {
  readonly name: string;
}
