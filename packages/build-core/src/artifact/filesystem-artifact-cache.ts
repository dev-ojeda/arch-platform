// packages/build-core/src/artifact/filesystem-artifact-cache.ts

import { copyPath, ensureDir, removePath } from '../fs/fs-async.js';
import { writeJsonFileSync } from '../fs/fs-sync.js';
import { joinPath } from '../fs/path-utils.js';

import type { ArtifactCache } from './artifact-cache.js';
import { readArtifactManifest } from './artifact-manifest-reader.js';
import { ARTIFACT_SCHEMA_VERSION, type ArtifactManifest } from './artifact-manifest.js';

export class FilesystemArtifactCache implements ArtifactCache {
  constructor(private cacheRoot: string) {}

  async exists(key: string): Promise<boolean> {
    const manifest = await readArtifactManifest(joinPath(this.cacheRoot, key, 'manifest.json'));

    return manifest !== undefined;
  }

  async save(key: string, root: string, outputs: string[]): Promise<void> {
    const target = joinPath(this.cacheRoot, key);

    await removePath(target);
    await ensureDir(target);

    for (const output of outputs) {
      await copyPath(joinPath(root, output), joinPath(target, output), {
        force: true,
        recursive: true,
      });
    }

    const manifest: ArtifactManifest = {
      key,
      outputs,
      createdAt: Date.now(),
      schemaVersion: ARTIFACT_SCHEMA_VERSION,
    };

    writeJsonFileSync(joinPath(target, 'manifest.json'), manifest);
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
    } catch {
      return false;
    }
  }
}
