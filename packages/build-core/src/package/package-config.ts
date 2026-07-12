// packages/build-core/src/package/package-config.ts

export interface PackageBuildConfig {
  builder?: 'tsc' | 'tsc-declaration' | 'tsup' | 'script' | 'custom';

  command?: string;

  args?: string[];
}
