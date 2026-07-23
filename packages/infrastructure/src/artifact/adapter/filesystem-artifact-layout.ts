// packages/infrastructure/src/artifact/adapter/filesystem-artifact-layout.ts

import type { PathService } from '@arch/contracts';
import type { ArtifactLayout } from '@arch/platform-model';

export class FilesystemArtifactLayout implements ArtifactLayout {
  constructor(
    public readonly root: string,
    private readonly pathService: PathService,
  ) {}

  manifest(): string {
    return this.pathService.join(this.root, 'manifest.json');
  }

  output(output: string): string {
    return this.pathService.join(this.root, output);
  }

  temporary(suffix: string): ArtifactLayout {
    return new FilesystemArtifactLayout(`${this.root}.${suffix}`, this.pathService);
  }
}
