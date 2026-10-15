// packages/platform-model/src/registry/registry-published-versions-reader.ts

import type { RegistryPublishedVersions } from './registry-published-versions.js';

export interface RegistryPublishedVersionsReader {
  read(artifact: string): Promise<RegistryPublishedVersions | undefined>;
}
