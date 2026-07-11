// packages/cli/src/contracts/lint-cli-options.ts

export interface LintCliOptions {
  readonly command: string;

  readonly commandLine: string;

  readonly args: readonly string[];

  readonly cwd?: string;

  readonly exitCode: number;

  readonly stdout: string;

  readonly stderr: string;

  readonly durationMs: number;

  readonly signal?: NodeJS.Signals;

  readonly failed: boolean;

  readonly skipped?: boolean;
}
