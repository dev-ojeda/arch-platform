// packages/code-analysis/src/package/dependency/package-dependency.ts

export interface PackageDependency {
  readonly fromPackage: string;

  readonly toPackage: string;

  readonly symbols: readonly string[];
}
