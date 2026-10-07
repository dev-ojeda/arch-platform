// packages/platform-model/src/versioning/package-version-writer.ts

export interface PackageVersionWriter {
  write(manifestPath: string, version: string): Promise<void>;
}
