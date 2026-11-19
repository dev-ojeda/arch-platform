// packages\contracts\src\pipeline\resolved-template.ts

import type { FileDefinition } from '../templates/file-definition.js';
import type { NamedVariables } from '../variables/named-variables.js';

export interface ResolvedTemplate<TVariables extends NamedVariables = NamedVariables> {
  template: FileDefinition<TVariables>;
}
