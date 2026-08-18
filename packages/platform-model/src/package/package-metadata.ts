// packages/platform-model/src/package/package-metadata.ts

import type { Layer } from '../architecture/layer.js';

export interface PackageMetadata {
  readonly kind?: Layer;

  readonly runtime?: 'node' | 'browser' | 'universal';

  readonly tags?: readonly string[];
}
