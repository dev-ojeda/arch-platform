// packages/platform-model/src/architecture/architecture-manifest.ts

import type { ArchitecturePackage } from './architecture-package.js';

export interface ArchitectureManifest {
  readonly schemaVersion: number;
  readonly workspace: {
    readonly name: string;
  };
  readonly packages: readonly ArchitecturePackage[];
}
