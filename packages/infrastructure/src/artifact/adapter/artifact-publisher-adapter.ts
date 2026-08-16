// packages/infrastructure/src/artifact/adapter/artifact-publisher-adapter.ts

import type { FileSystemAsyncPort, PathService } from '@arch/contracts';
import type { ArtifactLayout, ArtifactManifest, ArtifactPublisher } from '@arch/platform-model';

import { safeStringify } from '../../serialization/safe-stringify.js';

export class ArtifactPublisherAdapter implements ArtifactPublisher {
  constructor(
    private readonly filesystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
  ) {}
  async publish(root: string, manifest: ArtifactManifest, layout: ArtifactLayout): Promise<void> {
    let published = false;
    const temp = layout.temporary('tmp');

    try {
      await this.filesystem.remove(temp.root);

      await this.filesystem.createDirectory(temp.root);

      for (const output of manifest.outputs) {
        await this.filesystem.copy(this.pathService.join(root, output), temp.output(output));
      }

      await this.filesystem.writeJson(temp.manifest(), this.serializeArtifactManifest(manifest));

      await this.filesystem.remove(layout.root);

      await this.filesystem.rename(temp.root, layout.root);

      published = true;
    } finally {
      if (!published) {
        await this.filesystem.remove(temp.root);
      }
    }
  }

  private serializeArtifactManifest(manifest: ArtifactManifest): string {
    return safeStringify(manifest);
  }
}
