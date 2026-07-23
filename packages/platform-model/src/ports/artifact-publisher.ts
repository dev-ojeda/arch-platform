// packages/platform-model/src/ports/artifact-publisher.ts

import type { ArtifactLayout } from '../artifact/artifact-layout.js';
import type { ArtifactManifest } from '../artifact/artifact-manifest.js';

export interface ArtifactPublisher {
  publish(root: string, manifest: ArtifactManifest, layout: ArtifactLayout): Promise<void>;
}
