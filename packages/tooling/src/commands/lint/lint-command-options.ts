// packages/tooling/src/commands/lint/lint-command-options.ts

import type { CommandOptions } from '../command-options.js';

export interface LintCommandOptions extends CommandOptions {
  targets?: string[];
  extensions?: string[];
  maxWarnings?: number;
}
