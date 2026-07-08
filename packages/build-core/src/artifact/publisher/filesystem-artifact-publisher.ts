// artifact/publisher/filesystem-artifact-publisher.ts

import {
  copyPath,
  ensureDir,
  removePathWithRetry,
  renamePath,
  writeJsonFile,
} from '../../fs/fs-async.js';
import { joinPath } from '../../fs/path-utils.js';
import { logger } from '../../logging/logger.js';
import type { ArtifactLayout } from '../artifact-layout.js';
import type { ArtifactManifest } from '../artifact-manifest.js';

import type { ArtifactPublisher } from './artifact-publisher.js';

export class FilesystemArtifactPublisher implements ArtifactPublisher {
  async publish(root: string, manifest: ArtifactManifest, layout: ArtifactLayout): Promise<void> {
    let published = false;
    const temp = layout.temporary();
    logger.trace('artifact.publish.start', {
      metadata: {
        package: manifest.artifact.packageName,
        artifact: manifest.artifact.id,
        destination: layout.root,
        temp: temp.root,
      },
    });
    try {
      await removePathWithRetry(temp.root);

      await ensureDir(temp.root);

      for (const output of manifest.outputs) {
        await copyPath(joinPath(root, output), temp.output(output), {
          force: true,
          recursive: true,
        });
      }

      await writeJsonFile(temp.manifest(), manifest);

      await removePathWithRetry(layout.root);

      await renamePath(temp.root, layout.root);
      logger.trace('artifact.publish.completed', {
        metadata: {
          package: manifest.artifact.packageName,
        },
      });
      published = true;
    } finally {
      if (!published) {
        await removePathWithRetry(temp.root);
      }
    }
  }
}
