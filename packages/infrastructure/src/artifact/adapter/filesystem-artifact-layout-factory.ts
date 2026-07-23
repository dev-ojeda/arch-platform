// packages/infrastructure/src/artifact/adapter/filesystem-artifact-layout-factory.ts

import type { PathService } from '@arch/contracts';
import type { Artifact, ArtifactLayout, ArtifactLayoutFactory } from '@arch/platform-model';

import { FilesystemArtifactLayout } from './filesystem-artifact-layout.js';

export class FilesystemArtifactLayoutFactory implements ArtifactLayoutFactory {
  constructor(
    private readonly cacheRoot: string,
    private readonly pathService: PathService,
  ) {}

  create(artifact: Artifact): ArtifactLayout {
    return new FilesystemArtifactLayout(
      this.pathService.join(this.cacheRoot, artifact.packageName, artifact.id),
      this.pathService,
    );
  }
}
