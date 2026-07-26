// packages/infrastructure/src/artifact/adapter/artifact-publisher-adapter.ts

import type { FileSystemAsyncPort, PathService } from '@arch/contracts';
import {
  type ArtifactLayout,
  type ArtifactManifest,
  type ArtifactPublisher,
} from '@arch/platform-model';

import { loggerFactory } from '../../logging/logger.js';
import { safeStringify } from '../../serialization/safe-stringify.js';

export class ArtifactPublisherAdapter implements ArtifactPublisher {
  logger = loggerFactory.createLogger({
    component: 'ArtifactPublisherAdapter',
  });
  constructor(
    private readonly filesystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
  ) {}
  async publish(root: string, manifest: ArtifactManifest, layout: ArtifactLayout): Promise<void> {
    let published = false;
    const temp = layout.temporary('tmp');
    this.logger.trace('artifact.publish.start', {
      metadata: {
        method: 'async publish',
        package: manifest.artifact.packageName,
        artifact: manifest.artifact.id,
        destination: layout.root,
        temp: temp.root,
      },
    });
    try {
      await this.filesystem.remove(temp.root);

      await this.filesystem.createDirectory(temp.root);

      for (const output of manifest.outputs) {
        this.logger.trace('artifact.publish.output', {
          metadata: {
            source: this.pathService.join(root, output),
            output,
            destination: temp.output(output),
          },
        });

        await this.filesystem.copy(this.pathService.join(root, output), temp.output(output));
      }

      await this.filesystem.writeJson(temp.manifest(), this.serializeArtifactManifest(manifest));

      await this.filesystem.remove(layout.root);

      await this.filesystem.rename(temp.root, layout.root);
      this.logger.trace('artifact.publish.completed', {
        metadata: {
          package: manifest.artifact.packageName,
        },
      });
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
