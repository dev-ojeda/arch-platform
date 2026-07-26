// packages/code-analysis/src/package/resolvers/package-resolver.ts

export interface PackageResolver {
  resolveFromFile(filePath: string): string | undefined;

  resolveFromModuleSpecifier(moduleSpecifier: string): string | undefined;
}
