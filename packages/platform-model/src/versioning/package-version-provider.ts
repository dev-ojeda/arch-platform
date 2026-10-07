// packages/platform-model/src/versioning/package-version-provider.ts

export interface PackageVersionProvider {
  get(packageName: string): Promise<string>;
}
