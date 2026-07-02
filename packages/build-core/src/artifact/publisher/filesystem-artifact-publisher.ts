// artifact/publisher/filesystem-artifact-publisher.ts

import { copyPath, ensureDir, removePath, renamePath, writeJsonFile } from '../../fs/fs-async.js';
import { joinPath } from '../../fs/path-utils.js';
import type { ArtifactManifest } from '../artifact-manifest.js';

import type { ArtifactPublisher } from './artifact-publisher.js';

export class FilesystemArtifactPublisher implements ArtifactPublisher {
  async publish(root: string, manifest: ArtifactManifest, destination: string): Promise<void> {
    const temp = `${destination}.${process.pid}.tmp`;

    try {
      await removePath(temp);

      await ensureDir(temp);

      for (const output of manifest.outputs) {
        await copyPath(joinPath(root, output), joinPath(temp, output), {
          force: true,
          recursive: true,
        });
      }

      await writeJsonFile(joinPath(temp, 'manifest.json'), manifest);

      await removePath(destination);

      await renamePath(temp, destination);
    } finally {
      await removePath(temp);
    }
  }
}
