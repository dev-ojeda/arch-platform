// packages/contracts/src/generation/generation-file-hook-context.ts

import type { GeneratedFile } from './generated-file.js';
import type { NamedVariables } from '../variables/named-variables.js';


export interface FileHookContext<TVariables extends NamedVariables = NamedVariables> {
  readonly file: GeneratedFile;

  readonly variables: TVariables;

  readonly targetDir: string;
}
