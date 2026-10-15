// packages/platform-model/src/distribution/artifact-registry-publisher.ts

import type { ArtifactRegistryPublishing } from './artifact-registry-publishing.js';

export interface ArtifactRegistryPublisher {
  publish(
    tarball: string,
    packageName: string,
    version: string,
  ): Promise<ArtifactRegistryPublishing>;
}
