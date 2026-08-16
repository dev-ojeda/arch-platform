// packages/platform-model/src/artifact/artifact-manifest.ts

import type { Artifact } from './artifact.js';

export interface ArtifactManifest {
  readonly artifact: Artifact;

  /**
   * Relative paths produced by the build.
   * Each path may refer to either a file or a directory.
   */
  readonly outputs: readonly string[];

  readonly createdAt: number;

  readonly schemaVersion: number;
}
