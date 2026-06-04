// packages/tooling/src/commands/clean/clean-command-options.ts

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
