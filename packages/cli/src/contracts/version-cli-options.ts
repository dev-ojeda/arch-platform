// packages/cli/src/contracts/version-cli-options.ts

export interface VersionCliOptions {
  readonly package: string;
  readonly type: 'major' | 'minor' | 'patch';
}
