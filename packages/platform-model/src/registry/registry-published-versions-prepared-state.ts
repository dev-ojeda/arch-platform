// packages/platform-model/src/registry/registry-published-versions-prepared-state.ts

import type { RegistryPublishedVersions } from './registry-published-versions.js';

export interface RegistryPublishedVersionsPreparedState {
  readonly schemaVersion: number;
  readonly artifacts: Readonly<Record<string, RegistryPublishedVersions>>;
}
