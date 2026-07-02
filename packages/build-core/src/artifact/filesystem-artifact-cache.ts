// packages/build-core/src/artifact/filesystem-artifact-cache.ts

import { copyPath } from '../fs/fs-async.js';
import { joinPath } from '../fs/path-utils.js';
import { LOG_EVENTS } from '../logging/log-events.js';
import { logger } from '../logging/logger.js';

import type { ArtifactCache } from './artifact-cache.js';
import { readArtifactManifest } from './artifact-manifest-reader.js';
import { ARTIFACT_SCHEMA_VERSION, type ArtifactManifest } from './artifact-manifest.js';
import type { ArtifactPublisher } from './publisher/artifact-publisher.js';

export class FilesystemArtifactCache implements ArtifactCache {
  constructor(
    private readonly cacheRoot: string,
    private readonly publisher: ArtifactPublisher,
  ) {}

  async exists(key: string): Promise<boolean> {
    const manifest = await readArtifactManifest(joinPath(this.cacheRoot, key, 'manifest.json'));

    return manifest !== undefined;
  }

  async save(key: string, root: string, outputs: string[]): Promise<void> {
    const target = joinPath(this.cacheRoot, key);

    const manifest: ArtifactManifest = {
      key,
      outputs,
      createdAt: Date.now(),
      schemaVersion: ARTIFACT_SCHEMA_VERSION,
    };

    try {
      await this.publisher.publish(root, manifest, target);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(LOG_EVENTS.ARTIFACT_FAIL, {
          metadata: {
            key,
            error: error.message,
          },
        });
      }

      throw error;
    }
  }
  async restore(key: string, root: string): Promise<boolean> {
    const source = joinPath(this.cacheRoot, key);

    const manifest = await readArtifactManifest(joinPath(source, 'manifest.json'));

    if (!manifest) {
      return false;
    }

    try {
      for (const output of manifest.outputs) {
        await copyPath(joinPath(source, output), joinPath(root, output), {
          force: true,
          recursive: true,
        });
      }

      return true;
    } catch (error) {
      logger.error(LOG_EVENTS.ARTIFACT_FAIL, {
        metadata: {
          key,
          error: error instanceof Error ? error.message : String(error),
        },
      });

      return false;
    }
  }
}
