// packages/cli/src/contracts/security-cli-options.ts

export interface SecurityCliOptions {
  readonly package?: string;
  readonly env: string;
  readonly lockfile?: string;
}
