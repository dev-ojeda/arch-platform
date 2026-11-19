export interface PackagePackConfig {
  /**
   * Workspace dependencies already included in the generated bundle.
   * These dependencies must be excluded from the published manifest.
   */
  readonly bundledDependencies?: readonly string[];
}
