// packages/tooling/src/commands/command-options.ts

import type { ToolingTaskEvents } from '../runtime/events/tooling-task-events.js';

import type { FileConfigName } from './config/config-file-name.js';

export interface CommandOptions {
  readonly packageName: string;
  readonly concurrency?: number;
  readonly force?: boolean;
  readonly args?: readonly string[];
  readonly events?: ToolingTaskEvents;
}

export interface LintCommandOptions {
  readonly targets?: readonly string[];
  readonly extensions?: readonly string[];
  readonly maxWarnings?: number;
  readonly configPath?: FileConfigName;
  readonly args?: readonly string[];
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

export type BuildCommandOptions = CommandOptions;
