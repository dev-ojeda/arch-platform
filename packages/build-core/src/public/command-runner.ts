// packages/build-core/src/public/command-runner.ts

import type { CommandOptions } from '../runtime/command-options.js';
import type { CommandResult } from '../runtime/command-result.js';

export type CommandRunner = (
  command: string,
  args: readonly string[],
  options: CommandOptions,
) => Promise<CommandResult>;
