// packages/platform-model/src/distribution/artifact-registry-published-reader.ts

import type { ArtifactRegistryPublishing } from './artifact-registry-publishing.js';

export interface ArtifactRegistryPublishingReader {
  find(packageName: string, version: string): Promise<ArtifactRegistryPublishing | undefined>;
}
