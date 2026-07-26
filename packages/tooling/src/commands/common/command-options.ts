// packages/tooling/src/commands/common/command-options.ts

import type { FileConfigName } from '../config/config-file-name.js';

export interface CommandOptions {
  readonly args?: readonly string[];
}

export interface LintCommandOptions extends CommandOptions {
  readonly fix?: boolean;
  readonly cache?: boolean;
  readonly quiet?: boolean;
  readonly targets?: readonly string[];
  readonly extensions?: readonly string[];
  readonly maxWarnings?: number;
  readonly configPath?: FileConfigName;
}

export interface TypecheckCommandOptions extends CommandOptions {
  readonly configPath?: FileConfigName;
  readonly noEmit?: boolean;
}
export interface CleanCommandOptions {
  readonly cwd?: string;
  readonly removeDist?: boolean;
  readonly removeCoverage?: boolean;
  readonly removeTsBuildInfo?: boolean;
  readonly removeTurbo?: boolean;
}
export const DEFAULT_CLEAN_OPTIONS = {
  removeDist: true,
  removeCoverage: true,
  removeTsBuildInfo: true,
  removeTurbo: true,
} as const satisfies Required<Omit<CleanCommandOptions, 'cwd'>>;

export interface BuildCommandOptions extends CommandOptions {
  readonly packageName?: string;
  readonly concurrency?: number;
  readonly force?: boolean;
}
