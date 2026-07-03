// packages/build-core/src/artifact/filesystem-artifact-layout.ts

import { joinPath } from '../fs/path-utils.js';

import type { ArtifactLayout } from './artifact-layout.js';

export class FilesystemArtifactLayout implements ArtifactLayout {
  constructor(public readonly root: string) {}

  manifest() {
    return joinPath(this.root, 'manifest.json');
  }

  output(output: string) {
    return joinPath(this.root, output);
  }

  temporary() {
    return new FilesystemArtifactLayout(`${this.root}.${process.pid}.tmp`);
  }
}
