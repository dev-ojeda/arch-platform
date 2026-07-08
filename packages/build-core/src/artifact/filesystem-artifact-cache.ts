// packages/build-core/src/artifact/filesystem-artifact-cache.ts

import { copyPath, removePathWithRetry } from '../fs/fs-async.js';
import { joinPath } from '../fs/path-utils.js';
import { logger } from '../logging/logger.js';

import type { ArtifactCache } from './artifact-cache.js';
import type { ArtifactLayoutFactory } from './artifact-layout-factory.js';
import { ARTIFACT_SCHEMA_VERSION, type ArtifactManifest } from './artifact-manifest.js';
import { readArtifactManifest } from './artifact-reader.js';
import type { Artifact } from './artifact.js';
import type { ArtifactPublisher } from './publisher/artifact-publisher.js';

export class FilesystemArtifactCache implements ArtifactCache {
  constructor(
    private readonly layoutFactory: ArtifactLayoutFactory,
    private readonly publisher: ArtifactPublisher,
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
    const manifest = await readArtifactManifest(layout.manifest());

    if (!manifest) {
      return false;
    }

    try {
      for (const output of manifest.outputs) {
        const source = layout.output(output);
        const destination = joinPath(root, output);

        await removePathWithRetry(destination);

        await copyPath(source, destination, {
          force: true,
          recursive: true,
        });
      }

      return true;
    } catch (error) {
      logger.warn('artifact.restore.failed', {
        metadata: {
          artifact: artifact.id,
          error: error instanceof Error ? error.message : String(error),
        },
      });

      return false;
    }
  }
}
