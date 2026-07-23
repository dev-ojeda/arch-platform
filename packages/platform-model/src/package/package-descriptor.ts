// packages/platform-model/src/package/package-descriptor.ts

import type { PackageBoundaries } from './package-boundaries.js';
import type { PackageLayout } from './package-layout.js';
import type { PackageManifest } from './package-manifest.js';

export interface PackageDescriptor {
  readonly name: string;
  readonly rootPath: string;
  readonly manifestPath: string;
  readonly manifest: PackageManifest;
  readonly boundaries?: PackageBoundaries;
  readonly internalDependencies: readonly string[];
  readonly layout: PackageLayout;
}
