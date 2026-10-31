// 📦 Paquetes Core (Packages)/distribution/src/contracts/build-command-options.ts

import type { CommandOptions } from './command-options.js';

export interface BuildCommandOptions extends CommandOptions {
  readonly packageName?: string;
  readonly concurrency?: number;
  readonly force?: boolean;
}
