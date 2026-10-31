// packages/platform-model/src/registry/registry-published-versions-adapter-port.ts

import type {
  RegistryPublishedVersions,
  RegistryPublishedVersionsByScope,
} from './registry-published-versions.js';

export interface RegistryPublishedVersionsAdapterPort {
  fetchPublishedVersions(packageName: string): Promise<RegistryPublishedVersions | undefined>;

  fetchPublishedVersionsByScope(scopeName: string): Promise<RegistryPublishedVersionsByScope>;
}
