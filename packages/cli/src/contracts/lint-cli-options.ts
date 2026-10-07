// packages/cli/src/contracts/lint-cli-options.ts

export interface LintCliOptions {
  readonly workspaceRoot: string;
  readonly package?: string;
  readonly fix?: boolean;
  readonly debug?: boolean;
}
