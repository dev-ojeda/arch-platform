import type { FileSystemAsyncPort, PathService } from '@arch-platform/contracts';
import type {
  ArtifactLayout,
  ArtifactManifest,
  ArtifactPublisher,
} from '@arch-platform/platform-model';

import { loggerFactory } from '../../logging/logger.js';

export class ArtifactPublisherAdapter implements ArtifactPublisher {
  logger = loggerFactory.createLogger({
    component: 'ArtifactPublisherAdapter',
  });

  constructor(
    private readonly filesystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
  ) {}

  async publish(root: string, manifest: ArtifactManifest, layout: ArtifactLayout): Promise<void> {
    const temp = layout.temporary('tmp');
    const backup = layout.temporary('backup');

    await this.recover(layout, temp, backup);

    try {
      await this.filesystem.createDirectory(temp.root);

      for (const output of manifest.outputs) {
        const source = this.pathService.join(root, output);
        const destination = temp.output(output);

        await this.filesystem.copy(source, destination);
      }

      await this.filesystem.writeJson<ArtifactManifest>(temp.manifest(), manifest);
    } catch (error) {
      await this.cleanup(temp.root, error);
      throw error;
    }

    const hasPreviousPublication = await this.filesystem.exists(layout.root);
    let previousMoved = false;

    try {
      if (hasPreviousPublication) {
        await this.filesystem.rename(layout.root, backup.root);
        previousMoved = true;
      }

      await this.filesystem.rename(temp.root, layout.root);
    } catch (publishError) {
      if (previousMoved) {
        try {
          await this.filesystem.rename(backup.root, layout.root);
        } catch (rollbackError) {
          throw new AggregateError(
            [publishError, rollbackError],
            'Artifact publication and rollback failed.',
            { cause: rollbackError },
          );
        }
      }

      await this.cleanup(temp.root, publishError);
      throw publishError;
    }

    if (previousMoved) {
      try {
        await this.filesystem.remove(backup.root);
      } catch (error) {
        this.logger.warn('artifact.publish.backup-cleanup.failed', {
          metadata: {
            artifact: manifest.artifact,
            backup: backup.root,
            error: error instanceof Error ? error.message : String(error),
          },
        });
      }
    }
  }

  private async recover(
    layout: ArtifactLayout,
    temp: ArtifactLayout,
    backup: ArtifactLayout,
  ): Promise<void> {
    const [hasPublication, hasBackup] = await Promise.all([
      this.filesystem.exists(layout.root),
      this.filesystem.exists(backup.root),
    ]);

    if (hasPublication && hasBackup) {
      await this.filesystem.remove(backup.root);
    } else if (!hasPublication && hasBackup) {
      await this.filesystem.rename(backup.root, layout.root);
    }

    await this.filesystem.remove(temp.root);
  }

  private async cleanup(path: string, originalError: unknown): Promise<void> {
    try {
      await this.filesystem.remove(path);
    } catch (cleanupError) {
      throw new AggregateError(
        [originalError, cleanupError],
        'Artifact publication failed and temporary cleanup failed.',
        { cause: cleanupError },
      );
    }
  }
}
