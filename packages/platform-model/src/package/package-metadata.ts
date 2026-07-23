// packages/platform-model/src/package/package-metadata.ts

export interface PackageMetadata {
  readonly layer?: string;
  readonly kind?: 'domain' | 'infra' | 'app' | 'sdk' | 'tooling';
  readonly runtime?: 'node' | 'browser' | 'universal';
  readonly tags?: readonly string[];
}
