// packages/platform-model/src/package/package-boundaries.ts

export interface PackageBoundaries {
  public?: string[];
  private?: string[];
  forbiddenDependencies?: string[];
}
