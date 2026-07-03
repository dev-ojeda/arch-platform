// packages/build-core/src/artifact/filesystem-artifact-layout-factory.ts

import { joinPath } from '../fs/path-utils.js';

import type { ArtifactLayoutFactory } from './artifact-layout-factory.js';
import type { ArtifactLayout } from './artifact-layout.js';
import type { Artifact } from './artifact.js';
import { FilesystemArtifactLayout } from './filesystem-artifact-layout.js';

export class FilesystemArtifactLayoutFactory implements ArtifactLayoutFactory {
  constructor(private readonly cacheRoot: string) {}

  create(artifact: Artifact): ArtifactLayout {
    return new FilesystemArtifactLayout(
      joinPath(this.cacheRoot, artifact.packageName, artifact.id),
    );
  }
}
