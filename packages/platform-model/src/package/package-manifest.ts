// packages/platform-model/src/package/package-manifest.ts

import type { PackageMetadata } from './package-metadata.js';

export interface PackageManifest {
  name: string;

  version?: string;

  private?: boolean;

  type?: string;

  sideEffects?: boolean;

  exports?: Record<string, unknown>;

  dependencies?: Record<string, string>;

  devDependencies?: Record<string, string>;

  peerDependencies?: Record<string, string>;

  arch?: PackageMetadata;
}
