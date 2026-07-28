// packages/platform-model/src/package/package-config.ts

// packages/platform-model/src/package/package-config.ts

export interface PackageBuildConfig {
  builder?: 'tsc' | 'tsc-declaration' | 'tsup' | 'script' | 'custom';

  command?: string;

  args?: readonly string[];

  /**
   * Build artifacts produced by the builder.
   * Paths are relative to the package root.
   */
  outputs?: readonly string[];
}
