// packages/tooling/src/commands/typecheck/typecheck-command-options.ts

import type { CommandOptions } from '../command-options.js';
import type { FileConfigName } from '../config/config-file-name.js';

export interface TypecheckCommandOptions extends CommandOptions {
  readonly configPath?: FileConfigName;

  readonly noEmit?: boolean;
}

export const DEFAULT_TYPECHECK_OPTIONS = {
  noEmit: true,
} satisfies Pick<Required<TypecheckCommandOptions>, 'noEmit'>;
