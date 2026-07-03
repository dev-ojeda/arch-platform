// artifact/publisher/artifact-publisher.ts

import type { ArtifactLayout } from '../artifact-layout.js';
import type { ArtifactManifest } from '../artifact-manifest.js';

export interface ArtifactPublisher {
  publish(root: string, manifest: ArtifactManifest, layout: ArtifactLayout): Promise<void>;
}
