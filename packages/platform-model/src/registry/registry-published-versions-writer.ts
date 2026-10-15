// packages/platform-model/src/registry/registry-published-versions-writer.ts

import type { RegistryPublishedVersionsPreparedState } from './registry-published-versions-prepared-state.js';
import type { RegistryPublishedVersions } from './registry-published-versions.js';

export interface RegistryPublishedVersionsWriter {
  apply(artifact: string, prepared: RegistryPublishedVersions): void;

  getState(): RegistryPublishedVersionsPreparedState;

  write(): Promise<void>;
}
