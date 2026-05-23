// packages\contracts\src\templates\file-definition.ts
import type { OverwritePolicy } from '../filesystem/overwrite-policy.js';
import type { FileHookContext } from '../generation/generation-file-hook-context.js';
import type { NamedVariables } from '../variables/named-variables.js';

export interface FileDefinition<TVariables extends NamedVariables = NamedVariables> {
  template: string;

  output: string;

  condition?: (variables: TVariables) => boolean | Promise<boolean>;

  overwrite?: OverwritePolicy;

  transform?: (content: string, variables: TVariables) => string | Promise<string>;

  beforeWrite?: (ctx: FileHookContext<TVariables>) => Promise<void>;

  afterWrite?: (ctx: FileHookContext<TVariables>) => Promise<void>;
}
