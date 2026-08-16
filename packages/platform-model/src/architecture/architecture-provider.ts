// packages/platform-model/src/architecture/architecture-provider.ts

import type { ArchitectureManifest } from './architecture-manifest.js';

export interface ArchitectureProvider {
  load(path: string): Promise<ArchitectureManifest>;
}
