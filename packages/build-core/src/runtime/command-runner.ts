// packages/build-core/src/runtime/command-runner.ts

import type { CommandOptions } from './command-options.js';
import type { CommandResult } from './command-result.js';

export type CommandRunner = (
  command: string,
  args: string[],
  options: CommandOptions,
) => Promise<CommandResult>;
