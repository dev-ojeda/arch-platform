// packages/platform-model/src/package/package-metadata.ts

import type { PackageBuildConfig } from './package-config.js';
import type { Layer } from '../architecture/layer.js';
import type { ArtifactType } from '../artifact/artifact-type.js';


export interface PackageMetadata {
  readonly kind?: Layer;
  readonly artifactType: ArtifactType;
  readonly runtime?: 'node' | 'browser' | 'universal';

  readonly tags?: readonly string[];

  readonly build?: PackageBuildConfig;
}
