// packages/platform-model/src/package/package-manifest.ts

import type { PackageMetadata } from './package-metadata.js';

export interface PackageManifest {
  name: string;
  main?: string;
  version?: string;

  private?: boolean;

  type?: string;
  types?: string;

  sideEffects?: boolean;

  exports?: Record<string, unknown>;

  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;

  arch?: PackageMetadata;
}
