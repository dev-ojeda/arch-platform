// packages/application/src/use-cases/versioning/version-package-result.ts

export interface VersionResult {
  readonly success: boolean;
  readonly durationMs: number;
  readonly artifact: string;
  readonly releaseType: string;
  readonly currentVersion: string;
  readonly nextVersion: string;
}
