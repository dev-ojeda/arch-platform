// packages/code-analysis/src/symbol-dependencies/package-dependency.ts
export interface PackageDependency {
  readonly fromPackage: string;

  readonly toPackage: string;

  readonly symbols: readonly string[];
}
