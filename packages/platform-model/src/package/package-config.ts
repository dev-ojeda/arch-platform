// packages/platform-model/src/package/package-config.ts

export interface PackageBuildConfig {
  builder?: 'tsc' | 'tsc-declaration' | 'tsup' | 'script' | 'custom';

  mode?: 'internal' | 'external' | 'dual';

  command?: string;

  args?: readonly string[];

  /**
   * TypeScript configuration used by tsup declaration generation.
   * Relative to the package root.
   */
  tsconfig?: string;

  /**
   * Build artifacts produced by the builder.
   * Paths are relative to the package root.
   */
  outputs?: readonly string[];
}
