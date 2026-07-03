// packages/build-core/src/artifact/artifact-layout-factory.ts

import type { ArtifactLayout } from './artifact-layout.js';
import type { Artifact } from './artifact.js';

export interface ArtifactLayoutFactory {
  create(artifact: Artifact): ArtifactLayout;
}
