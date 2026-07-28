// packages/infrastructure/src/artifact/adapter/filesystem-artifact-cache.ts

import type { FileSystemAsyncPort, PathService } from '@arch/contracts';
import { ARTIFACT_SCHEMA_VERSION } from '@arch/platform-model';
import type {
  Artifact,
  ArtifactCache,
  ArtifactLayoutFactory,
  ArtifactManifest,
  ArtifactPublisher,
} from '@arch/platform-model';

import { loggerFactory } from '../../logging/logger.js';

export class FilesystemArtifactCache implements ArtifactCache {
  logger = loggerFactory.createLogger({
    component: 'FilesystemArtifactCache',
  });
  constructor(
    private readonly layoutFactory: ArtifactLayoutFactory,
    private readonly publisher: ArtifactPublisher,
    private readonly filesystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
  ) {}

  async save(artifact: Artifact, root: string, outputs: string[]): Promise<void> {
    const layout = this.layoutFactory.create(artifact);

    const manifest: ArtifactManifest = {
      artifact,
      outputs,
      createdAt: Date.now(),
      schemaVersion: ARTIFACT_SCHEMA_VERSION,
    };

    await this.publisher.publish(root, manifest, layout);
  }
  async restore(artifact: Artifact, root: string): Promise<boolean> {
    const layout = this.layoutFactory.create(artifact);
    const manifest = await this.loadArtifactManifest(layout.manifest());

    if (!manifest) {
      return false;
    }

    try {
      for (const output of manifest.outputs) {
        const source = layout.output(output);
        const destination = this.pathService.join(root, output);

        await this.filesystem.remove(destination);

        await this.filesystem.copy(source, destination);
      }

      return true;
    } catch (error) {
      this.logger.error('artifact.restore.failed', {
        metadata: {
          method: 'async restore',
          artifact: artifact.id,
          error: error instanceof Error ? error.message : String(error),
        },
      });

      return false;
    }
  }

  private async loadArtifactManifest(filePath: string): Promise<ArtifactManifest | undefined> {
    if (!(await this.filesystem.exists(filePath))) {
      return undefined;
    }

    const value = await this.filesystem.readJson<unknown>(filePath);

    return this.isArtifactManifest(value) ? value : undefined;
  }

  private isArtifact(value: unknown): value is Artifact {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const record = value as Record<string, unknown>;

    return typeof record.packageName === 'string' && typeof record.id === 'string';
  }

  private isArtifactManifest(value: unknown): value is ArtifactManifest {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const record = value as Record<string, unknown>;

    return (
      this.isArtifact(record.artifact) &&
      Array.isArray(record.outputs) &&
      record.outputs.every((output) => typeof output === 'string') &&
      typeof record.createdAt === 'number' &&
      record.schemaVersion === ARTIFACT_SCHEMA_VERSION
    );
  }
}
