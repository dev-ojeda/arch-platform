// artifact/publisher/artifact-publisher.ts

import type { ArtifactManifest } from '../artifact-manifest.js';

export interface ArtifactPublisher {
  publish(root: string, manifest: ArtifactManifest, destination: string): Promise<void>;
}
