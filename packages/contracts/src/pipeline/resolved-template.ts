// packages\contracts\src\pipeline\resolved-template.ts
import type { ResolvedFileDefinition } from './resolved-file-definition.js';
import type { NamedVariables } from '../variables/named-variables.js';


export interface ResolvedTemplate<TVariables extends NamedVariables = NamedVariables> {
  template: ResolvedFileDefinition<TVariables>;

  outputPath: string;
}
