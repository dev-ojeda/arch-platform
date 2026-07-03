// artifact/publisher/filesystem-artifact-publisher.ts

import { copyPath, ensureDir, removePath, renamePath, writeJsonFile } from '../../fs/fs-async.js';
import { joinPath } from '../../fs/path-utils.js';
import type { ArtifactLayout } from '../artifact-layout.js';
import type { ArtifactManifest } from '../artifact-manifest.js';

import type { ArtifactPublisher } from './artifact-publisher.js';

export class FilesystemArtifactPublisher implements ArtifactPublisher {
  async publish(root: string, manifest: ArtifactManifest, layout: ArtifactLayout): Promise<void> {
    const temp = layout.temporary();

    try {
      await removePath(temp.root);

      await ensureDir(temp.root);

      for (const output of manifest.outputs) {
        await copyPath(joinPath(root, output), temp.output(output), {
          force: true,
          recursive: true,
        });
      }

      await writeJsonFile(temp.manifest(), manifest);

      await removePath(layout.root);

      await renamePath(temp.root, layout.root);
    } finally {
      await removePath(temp.root);
    }
  }
}
