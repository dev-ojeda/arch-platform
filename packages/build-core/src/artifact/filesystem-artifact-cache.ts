// packages/build-core/src/artifact/filesystem-artifact-cache.ts

import { copyPath } from '../fs/fs-async.js';
import { joinPath } from '../fs/path-utils.js';

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

    if (!manifest) return false;

    try {
      for (const output of manifest.outputs) {
        await copyPath(layout.output(output), joinPath(root, output), {
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
